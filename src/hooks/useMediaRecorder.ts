import { useCallback, useRef, useState } from "react"
import { getSupportedMimeType, getErrorMessage } from "../utils"
import { MIME_TYPES } from "../constants"

interface UseMediaRecorderOptions {
	onRecordingComplete: (blob: Blob, mimeType: string) => void
	onError?: (error: string) => void
}

interface UseMediaRecorderReturn {
	startRecording: (stream: MediaStream) => void
	stopRecording: () => void
	isRecording: boolean
	recordingTime: number
}

export const useMediaRecorder = ({
	onRecordingComplete,
	onError,
}: UseMediaRecorderOptions): UseMediaRecorderReturn => {
	const [isRecording, setIsRecording] = useState(false)
	const [recordingTime, setRecordingTime] = useState(0)
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const chunksRef = useRef<Blob[]>([])
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	const startTimer = useCallback(() => {
		timerRef.current = setInterval(() => {
			setRecordingTime((prev) => prev + 1)
		}, 1000)
	}, [])

	const stopTimer = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current)
			timerRef.current = null
		}
	}, [])

	const startRecording = useCallback(
		(stream: MediaStream) => {
			try {
				chunksRef.current = []
				const mimeType = getSupportedMimeType(MIME_TYPES)

				if (!mimeType) {
					throw new Error("Nenhum formato de vídeo suportado encontrado")
				}

				const mediaRecorder = new MediaRecorder(stream, { mimeType })

				mediaRecorder.ondataavailable = (event) => {
					if (event.data.size > 0) {
						chunksRef.current.push(event.data)
					}
				}

				mediaRecorder.onstop = () => {
					const blob = new Blob(chunksRef.current, { type: mimeType })
					onRecordingComplete(blob, mimeType)
					chunksRef.current = []
				}

				mediaRecorder.onerror = (event) => {
					const error = getErrorMessage(event)
					console.error("[MediaRecorder] Error:", error)
					onError?.(error)
				}

				mediaRecorder.start()
				mediaRecorderRef.current = mediaRecorder
				setIsRecording(true)
				setRecordingTime(0)
				startTimer()
			} catch (error) {
				const message = getErrorMessage(error)
				console.error("[MediaRecorder] Failed to start:", message)
				onError?.(message)
			}
		},
		[onRecordingComplete, onError, startTimer]
	)

	const stopRecording = useCallback(() => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state !== "inactive"
		) {
			mediaRecorderRef.current.stop()
		}
		setIsRecording(false)
		stopTimer()
	}, [stopTimer])

	return {
		startRecording,
		stopRecording,
		isRecording,
		recordingTime,
	}
}

