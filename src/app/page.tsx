"use client";

import SymptomCard from "@/components/symptom-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSymptom } from "@/hooks/use-symptom";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";

export default function Home() {
	const [symptom, setSymptom] = useState("");
	const { mutate, data, error, isPending } = useSymptom();
	const [showResults, setShowResults] = useState(false);

	// Reset the animation state when data changes
	useEffect(() => {
		setShowResults(false);

		// If data exists, trigger the fade-in animation after a short delay
		if (data) {
			const timer = setTimeout(() => {
				setShowResults(true);
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [data]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		mutate({ symptom });
	};

	return (
		<div className="container mx-auto min-h-screen flex flex-col justify-center">
			<div className="flex flex-col items-center px-4">
				<div className="flex flex-col items-center gap-2 my-8">
					<h1 className="text-2xl md:text-4xl font-bold tracking-tight text-center fade-in-40 duration-500 ease-in-out">
						symptom guidance
					</h1>
				</div>
				<form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
					<Label htmlFor="symptom-input" className="text-gray-500">
						What are you experiencing?
					</Label>
					<div className="flex w-full items-center space-x-2">
						<Input
							id="symptom-input"
							type="text"
							placeholder="Enter symptom"
							value={symptom}
							onChange={(e) => setSymptom(e.target.value)}
							disabled={isPending}
						/>
						<Button type="submit" disabled={isPending || !symptom}>
							{isPending ? "Checking..." : "Check"}
						</Button>
					</div>

					{error && (
						<div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
							{error.message}
						</div>
					)}
				</form>

				<div className="flex flex-col items-center mt-8 max-w-full">
					{data && (
						<div
							className={cn("transition-opacity duration-500 ease-in-out", {
								"opacity-100": showResults,
								"opacity-0": !showResults,
							})}
						>
							<SymptomCard symptom={data} />
						</div>
					)}

					{data?.alternatives?.length && data.alternatives.length > 0 ? (
						<div
							className={cn(
								"mt-8 w-full max-w-4xl transition-opacity duration-500 ease-in-out",
								{
									"opacity-100": showResults,
									"opacity-0": !showResults,
								},
							)}
						>
							<h2 className="text-md font-semibold mb-4 text-gray-400">
								Alternative Matches
							</h2>
							<div className="carousel flex gap-4 overflow-x-auto rounded-box">
								{data.alternatives.map((alt, index) => (
									<SymptomCard
										className="carousel-item"
										key={`${alt.name}-${index}`}
										symptom={alt}
										isAlternative={true}
									/>
								))}
							</div>
						</div>
					) : null}
				</div>
			</div>

			<footer className="mt-auto py-4 text-center">
				<p className="text-sm text-muted-foreground">manual.co demo</p>
			</footer>
		</div>
	);
}
