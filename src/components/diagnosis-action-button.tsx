import { Button } from "@/components/ui/button";
import { type Symptom, TREATMENT_GUIDANCE } from "@/types/symptom";
import React from "react";
import { AppointmentButton } from "./appointment-button";
import { HospitalFinderButton } from "./hospital-finder-button";

export const DiagnosisActionButton = React.memo(function DiagnosisAction({
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
});
