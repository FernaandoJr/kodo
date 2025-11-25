export interface DesktopSource {
	id: string
	name: string
	thumbnail: string
}

export interface ShortcutConfig {
	action: string
	accelerator: string
	description: string
}

export interface ShortcutUpdateResult {
	success: boolean
	message?: string
}

export interface ShortcutResetResult {
	success: boolean
	shortcuts?: ShortcutConfig[]
	message?: string
}

export interface ElectronAPI {
	getDesktopSources: () => Promise<DesktopSource[]>
	updateRecordingState: (isRecording: boolean) => void
	saveRecording: (
		buffer: Uint8Array,
		mimeType: string
	) => Promise<{
		success: boolean
		filePath?: string
		fileName?: string
		message?: string
	}>

	// Shortcuts API
	getShortcuts: () => Promise<ShortcutConfig[]>
	getDefaultShortcuts: () => Promise<ShortcutConfig[]>
	updateShortcut: (
		action: string,
		accelerator: string
	) => Promise<ShortcutUpdateResult>
	resetShortcuts: () => Promise<ShortcutResetResult>
	onShortcutTriggered: (callback: (action: string) => void) => () => void

	// Window control API
	windowMinimize: () => void
	windowMaximize: () => void
	windowClose: () => void
	windowIsMaximized: () => Promise<boolean>
	onWindowMaximized: (callback: (isMaximized: boolean) => void) => () => void
}

declare global {
	interface Window {
		electronAPI: ElectronAPI
	}
}
