import { SymptomRequestSchema, type Symptom } from "@/types/symptom";
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

// Determine if a score is within a given range
function isWithinRange(score: number, range: number[]) {
	return score >= range[0] && score <= range[range.length - 1];
}

// Calculate match score for a symptom based on name, intensity, and duration
function calculateMatchScore(
	dbSymptom: Symptom,
	query: { symptom: string; intensity?: number; duration?: number },
): number {
	let score = 0;

	// Name match gives highest score
	if (dbSymptom.name.toLowerCase().includes(query.symptom.toLowerCase())) {
		score += 100;
		if (dbSymptom.name.toLowerCase() === query.symptom.toLowerCase()) {
			score += 50; // Exact match bonus
		}
	}

	// Add intensity match score if provided
	if (query.intensity !== undefined) {
		// Check if intensity is within range
		if (isWithinRange(query.intensity, dbSymptom.intensity_range)) {
			// More points for intensity in the middle of the range
			const rangeMidpoint =
				(dbSymptom.intensity_range[0] + dbSymptom.intensity_range[1]) / 2;
			const distance = Math.abs(query.intensity - rangeMidpoint);
			const maxDistance =
				(dbSymptom.intensity_range[1] - dbSymptom.intensity_range[0]) / 2;
			score += 25 * (1 - distance / maxDistance);
		}
	}

	// Add duration match score if provided
	if (query.duration !== undefined) {
		// Check if duration is within range
		if (isWithinRange(query.duration, dbSymptom.duration_range)) {
			// More points for duration in the middle of the range
			const rangeMidpoint =
				(dbSymptom.duration_range[0] + dbSymptom.duration_range[1]) / 2;
			const distance = Math.abs(query.duration - rangeMidpoint);
			const maxDistance =
				(dbSymptom.duration_range[1] - dbSymptom.duration_range[0]) / 2;
			score += 25 * (1 - distance / maxDistance);
		}
	}

	return score;
}

export async function POST(request: Request) {
	const SYMPTOM_DATABASE: Symptom[] = JSON.parse(
		fs.readFileSync(path.join(process.cwd(), "src/lib/symptoms.json"), "utf-8"),
	);

	try {
		const body = SymptomRequestSchema.safeParse(await request.json());
		if (!body.success) {
			return NextResponse.json(
				{ error: "Invalid request data" },
				{ status: 400 },
			);
		}
		const { symptom, intensity, duration } = body.data;
		if (!symptom) {
			return NextResponse.json(
				{ error: "Symptom is required" },
				{ status: 400 },
			);
		}

		const scoredSymptoms = SYMPTOM_DATABASE.map((dbSymptom) => ({
			...dbSymptom,
			// Calculate a score based on name, intensity and duration match
			score: calculateMatchScore(dbSymptom, { symptom, intensity, duration }),
		}))
			.filter((item) => item.score > 0) // Only include matches with some relevance
			.sort((a, b) => b.score - a.score); // Sort by score descending

		if (scoredSymptoms.length === 0) {
			return NextResponse.json(
				{ error: "No matching symptoms found" },
				{ status: 404 },
			);
		}

		// Return the best match and its score
		const bestMatch = scoredSymptoms[0];
		// Remove the scoring fields before returning
		const { score, ...symptomData } = bestMatch;

		return NextResponse.json({
			...symptomData,
			match_score: score,
			// Include alternatives if available and have reasonable scores
			alternatives: scoredSymptoms
				.slice(1, 3)
				.filter((s) => s.score > 50)
				.map(({ score, ...symptomData }) => ({
					...symptomData,
					match_score: score,
				})),
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
