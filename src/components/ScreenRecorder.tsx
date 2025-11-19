import React, { useCallback, useEffect, useRef, useState } from "react"
import type { DesktopSource } from "../types/electron"
import AudioToggle from "./ScreenRecorder/AudioToggle"
import RecordingControls from "./ScreenRecorder/RecordingControls"
import SourceSelector from "./ScreenRecorder/SourceSelector"
import VideoPreview from "./ScreenRecorder/VideoPreview"

const VIDEO_CONSTRAINTS = {
	minWidth: 1280,
	maxWidth: 1920,
	minHeight: 720,
	maxHeight: 1080,
} as const

const MIME_TYPES = [
	"video/webm;codecs=vp9",
	"video/webm;codecs=vp8",
	"video/webm",
] as const

const ScreenRecorder: React.FC = () => {
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
		} catch (error) {
			const message =
				error instanceof Error ? error.message : String(error)
			alert(`Erro ao carregar fontes: ${message}`)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		loadSources()
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
							...VIDEO_CONSTRAINTS,
						},
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

		mediaRecorder.onstop = () => {
			const blob = new Blob(chunksRef.current, {
				type: mimeType || "video/webm",
			})
			const url = URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = `recording-${Date.now()}.webm`
			a.click()
			URL.revokeObjectURL(url)
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
		<div className="p-6 h-full flex flex-col">
			<div className="mb-6">
				<h2 className="text-2xl font-semibold mb-2 text-foreground">
					Gravador de Tela
				</h2>
				<p className="text-sm text-muted-foreground">
					Selecione uma tela ou janela para gravar
				</p>
			</div>

			<div className="flex-1 grid grid-cols-2 gap-6">
				<SourceSelector
					sources={sources}
					selectedSource={selectedSource}
					isLoading={isLoading}
					onSourceSelect={handleSourceSelect}
					onRefresh={loadSources}
				/>

				<div className="border border-border rounded-lg bg-card p-6 shadow-sm flex flex-col">
					<h3 className="text-lg font-semibold mb-4 text-foreground">
						Preview
					</h3>

					<AudioToggle checked={recordAudio} onChange={setRecordAudio} />

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
