import React from "react"
import { Circle } from "lucide-react"

interface RecordingTimerProps {
	seconds: number
}

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

const RecordingTimer: React.FC<RecordingTimerProps> = ({ seconds }) => {
	return (
		<div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-md flex items-center gap-2 shadow-lg border border-border">
			<Circle className="h-2 w-2 fill-current animate-pulse" />
			<span className="font-mono text-sm font-medium">
				{formatTime(seconds)}
			</span>
		</div>
	)
}

export default RecordingTimer

