import React, { useCallback, useEffect, useRef, useState } from "react"
import type { DesktopSource } from "../types/electron"
import AudioToggle from "./ScreenRecorder/AudioToggle"
import RecordingControls from "./ScreenRecorder/RecordingControls"
import SourceSelector from "./ScreenRecorder/SourceSelector"
import VideoPreview from "./ScreenRecorder/VideoPreview"

// Flexible video constraints that adapt to the source aspect ratio
const VIDEO_CONSTRAINTS = {
	maxWidth: 1920,
	maxHeight: 1080,
} as const

const MIME_TYPES = [
	"video/webm;codecs=vp9",
	"video/webm;codecs=vp8",
	"video/webm",
] as const

interface ScreenRecorderProps {
	onRecordingStateChange?: (isRecording: boolean) => void
}

const ScreenRecorder: React.FC<ScreenRecorderProps> = ({
	onRecordingStateChange,
}) => {
	const [sources, setSources] = useState<DesktopSource[]>([])
	const [selectedSource, setSelectedSource] = useState<DesktopSource | null>(
		null
	)
	const [isRecording, setIsRecording] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [recordingTime, setRecordingTime] = useState(0)
	const [recordAudio, setRecordAudio] = useState(false)
	const videoRef = useRef<HTMLVideoElement>(null)
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const streamRef = useRef<MediaStream | null>(null)
	const audioStreamRef = useRef<MediaStream | null>(null)
	const chunksRef = useRef<Blob[]>([])
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	const stopStream = useCallback((stream: MediaStream | null) => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop())
		}
	}, [])

	const stopAllStreams = useCallback(() => {
		stopStream(streamRef.current)
		stopStream(audioStreamRef.current)
		streamRef.current = null
		audioStreamRef.current = null
		if (videoRef.current) {
			videoRef.current.srcObject = null
		}
	}, [stopStream])

	const loadSources = useCallback(async () => {
		setIsLoading(true)
		try {
			if (!window.electronAPI) {
				alert(
					"Erro: API do Electron não está disponível. Verifique o preload script."
				)
				return
			}

			const desktopSources = await window.electronAPI.getDesktopSources()
			setSources(desktopSources)
			return desktopSources
		} catch (error) {
			const message =
				error instanceof Error ? error.message : String(error)
			alert(`Erro ao carregar fontes: ${message}`)
			return []
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		const initSources = async () => {
			const desktopSources = await loadSources()
			// Auto-select the first screen (Entire Screen) on initial load
			if (desktopSources && desktopSources.length > 0) {
				const screenSource = desktopSources.find(
					(source) =>
						source.id.startsWith("screen:") ||
						source.name.toLowerCase().includes("entire screen") ||
						source.name.toLowerCase().includes("tela") ||
						source.name.toLowerCase().includes("screen")
				)
				if (screenSource) {
					setSelectedSource(screenSource)
				}
			}
		}
		initSources()
		return stopAllStreams
	}, [loadSources, stopAllStreams])

	useEffect(() => {
		if (!isRecording) return

		timerRef.current = setInterval(() => {
			setRecordingTime((prev) => prev + 1)
		}, 1000)

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current)
				timerRef.current = null
			}
		}
	}, [isRecording])

	// Notify main process and parent component about recording state changes
	useEffect(() => {
		if (window.electronAPI) {
			window.electronAPI.updateRecordingState(isRecording)
		}
		onRecordingStateChange?.(isRecording)
	}, [isRecording, onRecordingStateChange])

	useEffect(() => {
		const video = videoRef.current
		if (!video || !streamRef.current) return

		const handleVisibilityChange = () => {
			if (document.hidden) {
				video.pause()
			} else if (video.paused && streamRef.current) {
				video.play().catch((error) => {
					if (error.name !== "AbortError") {
						console.error("Error resuming video:", error)
					}
				})
			}
		}

		const handleError = () => {
			console.warn("Video playback error")
		}

		document.addEventListener("visibilitychange", handleVisibilityChange)
		video.addEventListener("error", handleError)

		return () => {
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange
			)
			video.removeEventListener("error", handleError)
		}
	}, [selectedSource])

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

				stopAllStreams()

				const videoStream =
					await navigator.mediaDevices.getUserMedia(constraints)

				if (recordAudio) {
					try {
						const audioStream =
							await navigator.mediaDevices.getUserMedia({
								audio: true,
							})
						audioStreamRef.current = audioStream
						streamRef.current = combineStreams(
							videoStream,
							audioStream
						)
					} catch {
						alert(
							"Erro ao capturar áudio. Verifique as permissões do microfone."
						)
						streamRef.current = videoStream
					}
				} else {
					streamRef.current = videoStream
				}

				if (videoRef.current) {
					videoRef.current.srcObject = streamRef.current
					videoRef.current.play().catch((error) => {
						if (error.name !== "AbortError") {
							console.error("Error playing video:", error)
						}
					})
				}
			} catch (error) {
				console.error("Error starting capture:", error)
				alert("Erro ao iniciar captura. Verifique as permissões.")
			}
		},
		[recordAudio, stopAllStreams, combineStreams]
	)

	const getSupportedMimeType = useCallback((): string | undefined => {
		return MIME_TYPES.find((mimeType) =>
			MediaRecorder.isTypeSupported(mimeType)
		)
	}, [])

	const startRecording = useCallback(() => {
		if (!streamRef.current) return

		chunksRef.current = []
		const mimeType = getSupportedMimeType()
		const options = mimeType ? { mimeType } : undefined

		const mediaRecorder = new MediaRecorder(streamRef.current, options)

		mediaRecorder.ondataavailable = (event) => {
			if (event.data.size > 0) {
				chunksRef.current.push(event.data)
			}
		}

		mediaRecorder.onstop = async () => {
			const blob = new Blob(chunksRef.current, {
				type: mimeType || "video/webm",
			})

			// Convert blob to array buffer and send to main process
			if (window.electronAPI) {
				try {
					const arrayBuffer = await blob.arrayBuffer()
					const uint8Array = new Uint8Array(arrayBuffer)
					const result = await window.electronAPI.saveRecording(
						uint8Array,
						mimeType || "video/webm"
					)

					if (!result.success) {
						console.error(
							"Erro ao salvar gravação:",
							result.message
						)
						// Fallback to browser download
						const url = URL.createObjectURL(blob)
						const a = document.createElement("a")
						a.href = url
						a.download = `recording-${Date.now()}.webm`
						a.click()
						URL.revokeObjectURL(url)
					}
				} catch (error) {
					console.error("Erro ao processar gravação:", error)
					// Fallback to browser download
					const url = URL.createObjectURL(blob)
					const a = document.createElement("a")
					a.href = url
					a.download = `recording-${Date.now()}.webm`
					a.click()
					URL.revokeObjectURL(url)
				}
			} else {
				// Fallback if electronAPI is not available
				const url = URL.createObjectURL(blob)
				const a = document.createElement("a")
				a.href = url
				a.download = `recording-${Date.now()}.webm`
				a.click()
				URL.revokeObjectURL(url)
			}
		}

		mediaRecorder.start()
		mediaRecorderRef.current = mediaRecorder
		setIsRecording(true)
		setRecordingTime(0)
	}, [getSupportedMimeType])

	const stopRecording = useCallback(() => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state !== "inactive"
		) {
			mediaRecorderRef.current.stop()
		}
		setIsRecording(false)
	}, [])

	// Listen for global shortcut to toggle recording
	useEffect(() => {
		if (!window.electronAPI?.onShortcutTriggered) return

		const cleanup = window.electronAPI.onShortcutTriggered((action) => {
			if (action === "toggle-recording") {
				if (isRecording) {
					stopRecording()
				} else if (selectedSource && streamRef.current) {
					startRecording()
				}
			}
		})

		return cleanup
	}, [isRecording, selectedSource, startRecording, stopRecording])

	const stopCapture = useCallback(() => {
		stopAllStreams()
		if (isRecording) {
			stopRecording()
		}
		setSelectedSource(null)
	}, [isRecording, stopAllStreams, stopRecording])

	useEffect(() => {
		if (selectedSource) {
			startCapture(selectedSource.id)
		}
	}, [recordAudio, selectedSource, startCapture])

	const handleSourceSelect = useCallback(
		(source: DesktopSource) => {
			setSelectedSource(source)
			startCapture(source.id)
		},
		[startCapture]
	)

	return (
		<div className="flex flex-col h-full p-6">
			{/* Header */}
			<div className="mb-6">
				<h2 className="mb-1 text-2xl font-bold text-foreground tracking-tight">
					Gravador de Tela
				</h2>
				<p className="text-sm text-muted-foreground">
					Capture sua tela ou janela com facilidade
				</p>
			</div>

			{/* Content */}
			<div className="grid flex-1 grid-cols-2 gap-5">
				<SourceSelector
					sources={sources}
					selectedSource={selectedSource}
					isLoading={isLoading}
					onSourceSelect={handleSourceSelect}
					onRefresh={loadSources}
				/>

				<div className="flex flex-col p-5 border-2 rounded-2xl border-border bg-card">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-base font-semibold text-foreground">
							Preview & Controles
						</h3>
						{isRecording && (
							<span className="flex items-center gap-2 text-xs font-medium text-red-500">
								<span className="w-2 h-2 rounded-full bg-red-500 animate-recording" />
								Gravando
							</span>
						)}
					</div>

					<AudioToggle
						checked={recordAudio}
						onChange={setRecordAudio}
					/>

					<VideoPreview
						videoRef={videoRef}
						hasSource={!!selectedSource}
						isRecording={isRecording}
						recordingTime={recordingTime}
					/>

					<RecordingControls
						hasSource={!!selectedSource}
						isRecording={isRecording}
						onStartRecording={startRecording}
						onStopRecording={stopRecording}
						onStopCapture={stopCapture}
					/>
				</div>
			</div>
		</div>
	)
}

export default ScreenRecorder
