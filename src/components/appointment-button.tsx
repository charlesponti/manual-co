import { useState } from "react";
import { AppointmentScheduler } from "./appointment-scheduler";
import { Button } from "./ui/button";

export function AppointmentButton() {
	const [showScheduler, setShowScheduler] = useState(false);

	return (
		<>
			<Button onClick={() => setShowScheduler(true)}>
				Schedule Appointment
			</Button>
			<AppointmentScheduler
				isOpen={showScheduler}
				onClose={() => setShowScheduler(false)}
			/>
		</>
	);
}
