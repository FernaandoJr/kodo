import { useCallback, useRef, useState } from "react"
import { VIDEO_CONSTRAINTS } from "../constants"
import { getErrorMessage } from "../utils"

interface UseStreamCaptureOptions {
	recordAudio: boolean
	onError?: (error: string) => void
}

interface UseStreamCaptureReturn {
	stream: MediaStream | null
	startCapture: (sourceId: string) => Promise<void>
	stopCapture: () => void
	isCapturing: boolean
}

export const useStreamCapture = ({
	recordAudio,
	onError,
}: UseStreamCaptureOptions): UseStreamCaptureReturn => {
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [isCapturing, setIsCapturing] = useState(false)
	const streamRef = useRef<MediaStream | null>(null)
	const audioStreamRef = useRef<MediaStream | null>(null)

	const stopStream = useCallback((stream: MediaStream | null) => {
		if (stream) {
			stream.getTracks().forEach((track) => {
				track.stop()
				console.log(`[Stream] Stopped track: ${track.kind}`)
			})
		}
	}, [])

	const combineStreams = useCallback(
		(videoStream: MediaStream, audioStream: MediaStream): MediaStream => {
			const combined = new MediaStream()
			videoStream
				.getVideoTracks()
				.forEach((track) => combined.addTrack(track))
			audioStream
				.getAudioTracks()
				.forEach((track) => combined.addTrack(track))
			return combined
		},
		[]
	)

	const startCapture = useCallback(
		async (sourceId: string) => {
			try {
				// Stop any existing streams
				stopStream(streamRef.current)
				stopStream(audioStreamRef.current)

				// Capture video
				const constraints = {
					audio: false,
					video: {
						mandatory: {
							chromeMediaSource: "desktop",
							chromeMediaSourceId: sourceId,
						},
						optional: [
							{ maxWidth: VIDEO_CONSTRAINTS.maxWidth },
							{ maxHeight: VIDEO_CONSTRAINTS.maxHeight },
						],
					},
				} as unknown as MediaStreamConstraints

				const videoStream =
					await navigator.mediaDevices.getUserMedia(constraints)

				console.log("[Stream] Video stream started")

				// Capture audio if enabled
				if (recordAudio) {
					try {
						const audioStream =
							await navigator.mediaDevices.getUserMedia({
								audio: true,
							})
						audioStreamRef.current = audioStream
						const combined = combineStreams(videoStream, audioStream)
						streamRef.current = combined
						setStream(combined)
						console.log("[Stream] Audio stream added")
					} catch (audioError) {
						console.warn("[Stream] Audio capture failed:", audioError)
						onError?.(
							"Não foi possível capturar áudio. Verifique as permissões do microfone."
						)
						streamRef.current = videoStream
						setStream(videoStream)
					}
				} else {
					streamRef.current = videoStream
					setStream(videoStream)
				}

				setIsCapturing(true)
			} catch (error) {
				const message = getErrorMessage(error)
				console.error("[Stream] Capture failed:", message)
				onError?.(
					"Erro ao iniciar captura. Verifique as permissões de tela."
				)
				setIsCapturing(false)
			}
		},
		[recordAudio, stopStream, combineStreams, onError]
	)

	const stopCapture = useCallback(() => {
		stopStream(streamRef.current)
		stopStream(audioStreamRef.current)
		streamRef.current = null
		audioStreamRef.current = null
		setStream(null)
		setIsCapturing(false)
		console.log("[Stream] All streams stopped")
	}, [stopStream])

	return {
		stream,
		startCapture,
		stopCapture,
		isCapturing,
	}
}

