import { type Symptom, TREATMENT_GUIDANCE } from "@/types/symptom";
import React from "react";
import { AppointmentButton } from "./appointment-button";
import { HospitalFinderButton } from "./hospital-finder-button";
import { Button } from "./ui/button";

export const SymptomCardGuidance = React.memo(function SymptomGuidance({
	guidance,
}: { guidance: Symptom["treatment_guidance"] }) {
	let guidanceMessage: string;

	// Determine the guidance message based on the treatment guidance
	switch (guidance) {
		case TREATMENT_GUIDANCE.IMMEDIATE_CARE:
			guidanceMessage = "Seek immediate medical attention";
			break;
		case TREATMENT_GUIDANCE.NONIMMEDIATE_CARE:
			guidanceMessage = "Schedule an appointment with your healthcare provider";
			break;
		case TREATMENT_GUIDANCE.NO_CARE:
			guidanceMessage = "Monitor symptoms and practice self-care";
			break;
		default:
			guidanceMessage = "Consult with your healthcare provider";
	}

	return (
		<div className="border-t pt-4">
			<h4 className="font-semibold mb-2">Recommended Action:</h4>
			<p className="text-sm">{guidanceMessage}</p>
			<div className="my-4 flex justify-end">
				<DiagnosisAction guidance={guidance} />
			</div>
		</div>
	);
});

function DiagnosisAction({
	guidance,
}: {
	guidance: Symptom["treatment_guidance"];
}) {
	switch (guidance) {
		case TREATMENT_GUIDANCE.IMMEDIATE_CARE:
			return <HospitalFinderButton />;
		case TREATMENT_GUIDANCE.NONIMMEDIATE_CARE:
			return <AppointmentButton />;
		case TREATMENT_GUIDANCE.NO_CARE:
			return <Button variant="outline">Monitor Symptoms</Button>;
		default:
			return null;
	}
}
