"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MatchedSymptom, Symptom } from "@/types/symptom";
import { useState } from "react";
import { AppointmentScheduler } from "./appointment-scheduler";
import HospitalFinder from "./hospital-finder";

type SymptomCardProps = {
	className?: string;
	symptom: MatchedSymptom;
	isAlternative?: boolean;
};

function SymptomCard({
	className,
	symptom,
	isAlternative = false,
}: SymptomCardProps) {
	const [showHospitalFinder, setShowHospitalFinder] = useState(false);
	const [showAppointmentScheduler, setShowAppointmentScheduler] =
		useState(false);

	const getGuidanceAction = (guidance: Symptom["treatment_guidance"]) => {
		switch (guidance) {
			case "immediate-care":
				return (
					<Button
						variant="destructive"
						onClick={() => setShowHospitalFinder(true)}
					>
						Find Immediate Care
					</Button>
				);
			case "nonimmediate-care":
				return (
					<Button onClick={() => setShowAppointmentScheduler(true)}>
						Schedule Appointment
					</Button>
				);
			case "no-care":
				return <Button variant="outline">Monitor Symptoms</Button>;
			default:
				return null;
		}
	};

	return (
		<>
			<Card className={cn("min-w-sm max-w-sm flex flex-col", className)}>
				<CardHeader className="flex-1">
					<CardTitle className="capitalize flex items-center justify-between">
						<p>{symptom.name}</p>
					</CardTitle>
					<CardDescription>{symptom.description}</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="font-medium">Severity:</span>
						<span
							className={cn("px-3 py-1 text-sm rounded-full text-white", {
								"bg-destructive": symptom.severity_score >= 7,
								"bg-amber-500":
									symptom.severity_score >= 4 && symptom.severity_score < 7,
								"bg-green-500": symptom.severity_score < 4,
							})}
						>
							{symptom.severity_score}
						</span>
					</div>

					{/* Only show recommended action for non-alternative symptoms */}
					{!isAlternative && (
						<div className="border-t pt-4">
							<h4 className="font-semibold mb-2">Recommended Action:</h4>
							<p className="text-sm">
								{getGuidanceMessage(symptom.treatment_guidance)}
							</p>
							<div className="my-4 flex justify-end">
								{getGuidanceAction(symptom.treatment_guidance)}
							</div>
						</div>
					)}

					{/* Only show articles for non-alternative symptoms */}
					{!isAlternative && symptom.articles && (
						<div className="border-t pt-4">
							<h4 className="font-semibold mb-2">Further Reading:</h4>
							<ul className="list-inside text-sm space-y-3">
								{symptom.articles.map((article) => (
									<li key={crypto.getRandomValues(new Uint32Array(1))[0]}>
										<a
											href={article.url}
											className="text-blue-600 underline underline-offset-3"
											target="_blank"
											rel="noopener noreferrer"
										>
											{article.title}
										</a>
									</li>
								))}
							</ul>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Hospital finder component (will be shown when showHospitalFinder is true) */}
			<HospitalFinder
				isOpen={showHospitalFinder}
				onClose={() => setShowHospitalFinder(false)}
			/>

			{/* Appointment scheduler component */}
			<AppointmentScheduler
				isOpen={showAppointmentScheduler}
				onClose={() => setShowAppointmentScheduler(false)}
			/>
		</>
	);
}

function getGuidanceMessage(guidance: Symptom["treatment_guidance"]) {
	switch (guidance) {
		case "immediate-care":
			return "Seek immediate medical attention";
		case "nonimmediate-care":
			return "Schedule an appointment with your healthcare provider";
		case "no-care":
			return "Monitor symptoms and practice self-care";
		default:
			return "Consult with your healthcare provider";
	}
}

export default SymptomCard;
