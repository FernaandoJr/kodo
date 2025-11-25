import { MonitorPlay } from "lucide-react"
import React, { RefObject } from "react"
import RecordingTimer from "./RecordingTimer"

interface VideoPreviewProps {
	videoRef: RefObject<HTMLVideoElement | null>
	hasSource: boolean
	isRecording: boolean
	recordingTime: number
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
	videoRef,
	hasSource,
	isRecording,
	recordingTime,
}) => {
	return (
		<div className={`flex-1 bg-black/40 rounded-xl overflow-hidden mb-4 relative border-2 transition-all ${
			isRecording 
				? "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]" 
				: "border-border"
		}`}>
			{hasSource ? (
				<video
					ref={videoRef}
					className="w-full h-full object-contain"
					autoPlay
					muted
				/>
			) : (
				<div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
					<MonitorPlay className="h-12 w-12 mb-3 opacity-30" />
					<p className="text-sm font-medium">Preview</p>
					<p className="text-xs opacity-70 mt-1">
						Selecione uma fonte para visualizar
					</p>
				</div>
			)}

			{isRecording && <RecordingTimer seconds={recordingTime} />}
		</div>
	)
}

export default VideoPreview
