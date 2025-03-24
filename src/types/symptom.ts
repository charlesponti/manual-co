import { z } from "zod";

export type TreatmentGuidance =
	| "immediate-care"
	| "nonimmediate-care"
	| "no-care";

export interface Symptom {
	name: string;
	description: string;
	severity_score: number;
	treatment_guidance: TreatmentGuidance;
	articles?: string[];
	image_url?: string;
	intensity_range: [number, number];
	duration_range: [number, number];
}

export const SymptomRequestSchema = z.object({
	symptom: z.string(),
	intensity: z.number().optional(),
	duration: z.number().optional().describe("Duration in hours"),
});
export type SymptomRequest = z.infer<typeof SymptomRequestSchema>;

export type MatchedSymptom = Symptom & {
	match_score: number;
	alternatives?: MatchedSymptom[];
};
export type SymptomRequestResponse = MatchedSymptom;
