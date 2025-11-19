import React, { RefObject } from "react"
import RecordingTimer from "./RecordingTimer"

interface VideoPreviewProps {
	videoRef: RefObject<HTMLVideoElement>
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
		<div className="flex-1 bg-muted rounded-lg overflow-hidden mb-4 relative border border-border">
			{hasSource ? (
				<video
					ref={videoRef}
					className="w-full h-full object-contain"
					autoPlay
					muted
				/>
			) : (
				<div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
					<p className="text-sm">Selecione uma fonte para ver o preview</p>
				</div>
			)}

			{isRecording && <RecordingTimer seconds={recordingTime} />}
		</div>
	)
}

export default VideoPreview

