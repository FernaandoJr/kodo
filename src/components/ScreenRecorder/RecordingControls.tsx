import React from "react"
import { Circle, Square, X } from "lucide-react"

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
					className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50">
					Selecione uma fonte primeiro
				</button>
			) : isRecording ? (
				<button
					onClick={onStopRecording}
					className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/25">
					<Square className="h-4 w-4 fill-current" />
					Parar Gravação
				</button>
			) : (
				<button
					onClick={onStartRecording}
					className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all shadow-lg glow-primary">
					<Circle className="h-4 w-4 fill-red-500 text-red-500" />
					Iniciar Gravação
				</button>
			)}

			{hasSource && (
				<button
					onClick={onStopCapture}
					className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-5 py-3 text-sm font-medium text-foreground hover:bg-muted transition-all">
					<X className="h-4 w-4" />
					Fechar
				</button>
			)}
		</div>
	)
}

export default RecordingControls

