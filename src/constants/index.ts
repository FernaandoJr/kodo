// Video recording constraints
export const VIDEO_CONSTRAINTS = {
	maxWidth: 1920,
	maxHeight: 1080,
} as const

// Supported MIME types for recording
export const MIME_TYPES = [
	"video/webm;codecs=vp9",
	"video/webm;codecs=vp8",
	"video/webm",
] as const

// Timer update interval (ms)
export const TIMER_UPDATE_INTERVAL = 1000

// Message display duration (ms)
export const MESSAGE_DISPLAY_DURATION = 3000

// Desktop source types
export const DESKTOP_SOURCE_TYPES = ["window", "screen"] as const

// App version
export const APP_VERSION = "1.0.0"

// Default shortcuts
export const DEFAULT_SHORTCUTS = [
	{
		action: "toggle-recording",
		accelerator: "CommandOrControl+Shift+R",
		description: "Iniciar/Parar Gravação",
	},
	{
		action: "toggle-window",
		accelerator: "CommandOrControl+Shift+K",
		description: "Mostrar/Esconder Janela",
	},
] as const

// Keyboard key mappings for shortcuts
export const KEY_MAP: Record<string, string> = {
	Control: "CommandOrControl",
	Meta: "CommandOrControl",
	Alt: "Alt",
	Shift: "Shift",
	ArrowUp: "Up",
	ArrowDown: "Down",
	ArrowLeft: "Left",
	ArrowRight: "Right",
	Escape: "Escape",
	Enter: "Enter",
	Backspace: "Backspace",
	Delete: "Delete",
	Tab: "Tab",
	Space: "Space",
	" ": "Space",
}

// Modifier keys
export const MODIFIER_KEYS = ["CommandOrControl", "Alt", "Shift"] as const
