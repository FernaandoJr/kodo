import React from "react"
import { formatTime } from "../../utils"

interface RecordingTimerProps {
	seconds: number
}

const RecordingTimer: React.FC<RecordingTimerProps> = ({ seconds }) => {
	return (
		<div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-xl backdrop-blur-sm">
			<span className="relative flex h-3 w-3">
				<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
				<span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
			</span>
			<span className="font-mono text-sm font-bold tracking-wider">
				{formatTime(seconds)}
			</span>
			<span className="text-[10px] font-medium uppercase tracking-wider opacity-80">
				REC
			</span>
		</div>
	)
}

export default RecordingTimer

