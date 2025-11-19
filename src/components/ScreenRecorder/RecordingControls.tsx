import React from "react"
import { Play, Square, X } from "lucide-react"

interface RecordingControlsProps {
	hasSource: boolean
	isRecording: boolean
	onStartRecording: () => void
	onStopRecording: () => void
	onStopCapture: () => void
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
	hasSource,
	isRecording,
	onStartRecording,
	onStopRecording,
	onStopCapture,
}) => {
	return (
		<div className="flex gap-3">
			{!hasSource ? (
				<button
					disabled
					className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2.5 text-sm font-medium text-muted-foreground cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none">
					Selecione uma fonte primeiro
				</button>
			) : isRecording ? (
				<button
					onClick={onStopRecording}
					className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors">
					<Square className="h-4 w-4" />
					Parar Gravação
				</button>
			) : (
				<button
					onClick={onStartRecording}
					className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
					<Play className="h-4 w-4" />
					Iniciar Gravação
				</button>
			)}

			{hasSource && (
				<button
					onClick={onStopCapture}
					className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
					<X className="h-4 w-4" />
					Parar Captura
				</button>
			)}
		</div>
	)
}

export default RecordingControls

