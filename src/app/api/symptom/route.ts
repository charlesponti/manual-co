import { calculateMatchScore } from "@/lib/similarity";
import { SymptomRequestSchema, type Symptom } from "@/types/symptom";
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

/**
 * ## Potential improvements:
 * 1. Caching: Implement caching for the symptom database to avoid reading from the data source on every request.
 * 2. Pagination: Implement pagination for the response to handle large datasets.
 * 3. Rate limiting: Implement rate limiting to prevent abuse of the API.
 * 4. Logging: Add logging for better monitoring and debugging.
 * 5. Error handling: Improve error handling to provide more specific error messages.
 */

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
