/**
 * Format seconds into HH:MM:SS or MM:SS format
 */
export const formatTime = (seconds: number): string => {
	const hrs = Math.floor(seconds / 3600)
	const mins = Math.floor((seconds % 3600) / 60)
	const secs = seconds % 60

	if (hrs > 0) {
		return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
	}
	return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

/**
 * Format accelerator string for display (Electron format to readable)
 */
export const formatAccelerator = (accelerator: string): string => {
	return accelerator
		.replace(/CommandOrControl/g, "Ctrl")
		.replace(/\+/g, " + ")
}

/**
 * Check if a source is a screen (vs window)
 */
export const isScreenSource = (source: {
	id: string
	name: string
}): boolean => {
	return (
		source.id.startsWith("screen:") ||
		source.name.toLowerCase().includes("entire screen") ||
		source.name.toLowerCase().includes("tela") ||
		source.name.toLowerCase().includes("screen")
	)
}

/**
 * Get safe MIME type for video recording
 */
export const getSupportedMimeType = (
	types: readonly string[]
): string | undefined => {
	return types.find((mimeType) => MediaRecorder.isTypeSupported(mimeType))
}

/**
 * Extract file extension from MIME type
 */
export const getExtensionFromMimeType = (mimeType: string): string => {
	return mimeType.includes("webm") ? "webm" : "webm"
}

/**
 * Generate filename for recording
 */
export const generateRecordingFilename = (extension = "webm"): string => {
	return `recording-${Date.now()}.${extension}`
}

/**
 * Safe error message extraction
 */
export const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message
	}
	return String(error)
}

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number
): ((...args: Parameters<T>) => void) => {
	let timeout: NodeJS.Timeout | null = null

	return (...args: Parameters<T>) => {
		if (timeout) {
			clearTimeout(timeout)
		}
		timeout = setTimeout(() => {
			func(...args)
		}, wait)
	}
}
