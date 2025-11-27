import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useMediaRecorder } from "../hooks/useMediaRecorder"
import { useStreamCapture } from "../hooks/useStreamCapture"
import type { DesktopSource } from "../types/electron"
import {
	generateRecordingFilename,
	getErrorMessage,
	isScreenSource,
} from "../utils"
import AudioToggle from "./ScreenRecorder/AudioToggle"
import RecordingControls from "./ScreenRecorder/RecordingControls"
import SourceSelector from "./ScreenRecorder/SourceSelector"
import VideoPreview from "./ScreenRecorder/VideoPreview"

interface ScreenRecorderProps {
	onRecordingStateChange?: (isRecording: boolean) => void
}

const ScreenRecorder: React.FC<ScreenRecorderProps> = ({
	onRecordingStateChange,
}) => {
	// State
	const [sources, setSources] = useState<DesktopSource[]>([])
	const [selectedSource, setSelectedSource] = useState<DesktopSource | null>(
		null
	)
	const [isLoading, setIsLoading] = useState(false)
	const [recordAudio, setRecordAudio] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	// Refs
	const videoRef = useRef<HTMLVideoElement>(null)

	// Custom hooks
	const { stream, startCapture, stopCapture } = useStreamCapture({
		recordAudio,
		onError: setErrorMessage,
	})

	const {
		startRecording: handleStartRecording,
		stopRecording: handleStopRecording,
		isRecording,
		recordingTime,
	} = useMediaRecorder({
		onRecordingComplete: handleRecordingComplete,
		onError: setErrorMessage,
	})

	// Handle recording completion
	async function handleRecordingComplete(blob: Blob, mimeType: string) {
		if (!window.electronAPI) {
			// Fallback: browser download
			downloadRecording(blob)
			return
		}

		try {
			const arrayBuffer = await blob.arrayBuffer()
			const uint8Array = new Uint8Array(arrayBuffer)
			const result = await window.electronAPI.saveRecording(
				uint8Array,
				mimeType
			)

			if (!result.success) {
				console.error("Erro ao salvar gravação:", result.message)
				// Fallback to browser download
				downloadRecording(blob)
			}
		} catch (error) {
			console.error("Erro ao processar gravação:", error)
			downloadRecording(blob)
		}
	}

	// Download recording as fallback
	const downloadRecording = useCallback((blob: Blob) => {
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = generateRecordingFilename()
		a.click()
		URL.revokeObjectURL(url)
	}, [])

	// Load desktop sources
	const loadSources = useCallback(async () => {
		setIsLoading(true)
		setErrorMessage(null)
		try {
			if (!window.electronAPI) {
				throw new Error(
					"API do Electron não está disponível. Verifique o preload script."
				)
			}

			const desktopSources = await window.electronAPI.getDesktopSources()
			setSources(desktopSources)
			return desktopSources
		} catch (error) {
			const message = getErrorMessage(error)
			setErrorMessage(`Erro ao carregar fontes: ${message}`)
			return []
		} finally {
			setIsLoading(false)
		}
	}, [])

	// Initialize sources and auto-select screen
	useEffect(() => {
		const initSources = async () => {
			const desktopSources = await loadSources()
			// Auto-select the first screen on initial load
			if (desktopSources && desktopSources.length > 0) {
				const screenSource = desktopSources.find(isScreenSource)
				if (screenSource) {
					setSelectedSource(screenSource)
				}
			}
		}
		initSources()

		return () => {
			stopCapture()
		}
	}, [loadSources, stopCapture])

	// Notify parent and main process about recording state
	useEffect(() => {
		if (window.electronAPI) {
			window.electronAPI.updateRecordingState(isRecording)
		}
		onRecordingStateChange?.(isRecording)
	}, [isRecording, onRecordingStateChange])

	// Update video element when stream changes
	useEffect(() => {
		const video = videoRef.current
		if (!video || !stream) return

		video.srcObject = stream
		video.play().catch((error) => {
			if (error.name !== "AbortError") {
				console.error("Error playing video:", error)
			}
		})

		const handleVisibilityChange = () => {
			if (document.hidden) {
				video.pause()
			} else if (video.paused && stream) {
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
	}, [stream])

	// Start capture when source or audio changes
	useEffect(() => {
		if (selectedSource) {
			startCapture(selectedSource.id)
		}
	}, [recordAudio, selectedSource, startCapture])

	// Listen for global shortcut to toggle recording
	useEffect(() => {
		if (!window.electronAPI?.onShortcutTriggered) return

		const cleanup = window.electronAPI.onShortcutTriggered((action) => {
			if (action === "toggle-recording") {
				if (isRecording) {
					handleStopRecording()
				} else if (selectedSource && stream) {
					handleStartRecording(stream)
				}
			}
		})

		return cleanup
	}, [
		isRecording,
		selectedSource,
		stream,
		handleStartRecording,
		handleStopRecording,
	])

	// Handle source selection
	const handleSourceSelect = useCallback((source: DesktopSource) => {
		setSelectedSource(source)
	}, [])

	// Handle start recording button
	const onStartRecording = useCallback(() => {
		if (stream) {
			handleStartRecording(stream)
		}
	}, [stream, handleStartRecording])

	// Handle stop recording button
	const onStopRecording = useCallback(() => {
		handleStopRecording()
	}, [handleStopRecording])

	// Handle stop capture button
	const onStopCapture = useCallback(() => {
		stopCapture()
		if (isRecording) {
			handleStopRecording()
		}
		setSelectedSource(null)
	}, [isRecording, stopCapture, handleStopRecording])

	// Display error message if any
	const errorAlert = useMemo(() => {
		if (!errorMessage) return null
		return (
			<div className="mb-4 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl text-red-400">
				<p className="text-sm font-medium">{errorMessage}</p>
			</div>
		)
	}, [errorMessage])

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

			{/* Error Message */}
			{errorAlert}

			{/* Content */}
			<div className="grid flex-1 grid-cols-2 gap-5">
				<SourceSelector
					sources={sources}
					selectedSource={selectedSource}
					isLoading={isLoading}
					isRecording={isRecording}
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
						onStartRecording={onStartRecording}
						onStopRecording={onStopRecording}
						onStopCapture={onStopCapture}
					/>
				</div>
			</div>
		</div>
	)
}

export default ScreenRecorder
