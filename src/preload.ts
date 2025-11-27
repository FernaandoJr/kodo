import { contextBridge, ipcRenderer } from "electron"

// Expose protected methods that allow the renderer process to use
// the desktopCapturer API via IPC (required since Electron 17+)
contextBridge.exposeInMainWorld("electronAPI", {
	getDesktopSources: async () => {
		try {
			console.log("[Preload] Fetching desktop sources via IPC...")

			// Call the main process via IPC
			const sources = await ipcRenderer.invoke("get-desktop-sources", {
				types: ["window", "screen"],
			})

			console.log(`[Preload] Found ${sources.length} sources`)

			// Map sources to the format expected by the renderer
			return sources.map(
				(source: {
					id: string
					name: string
					thumbnail: { toDataURL: () => string }
				}) => ({
					id: source.id,
					name: source.name,
					thumbnail: source.thumbnail.toDataURL(),
				})
			)
		} catch (error) {
			console.error("[Preload] Error fetching sources:", error)
			throw error
		}
	},
	updateRecordingState: (isRecording: boolean) => {
		console.log(`[Preload] Recording state: ${isRecording}`)
		ipcRenderer.send("recording-state-changed", isRecording)
	},
	saveRecording: async (buffer: Uint8Array, mimeType: string) => {
		console.log(`[Preload] Saving recording (${buffer.length} bytes, ${mimeType})`)
		return await ipcRenderer.invoke("save-recording", buffer, mimeType)
	},

	// Shortcuts API
	getShortcuts: async () => {
		return await ipcRenderer.invoke("get-shortcuts")
	},
	getDefaultShortcuts: async () => {
		return await ipcRenderer.invoke("get-default-shortcuts")
	},
	updateShortcut: async (action: string, accelerator: string) => {
		return await ipcRenderer.invoke("update-shortcut", action, accelerator)
	},
	resetShortcuts: async () => {
		return await ipcRenderer.invoke("reset-shortcuts")
	},
	onShortcutTriggered: (callback: (action: string) => void) => {
		const handler = (_event: Electron.IpcRendererEvent, action: string) => {
			callback(action)
		}
		ipcRenderer.on("shortcut-triggered", handler)
		// Return cleanup function
		return () => {
			ipcRenderer.removeListener("shortcut-triggered", handler)
		}
	},

	// Window control API
	windowMinimize: () => {
		ipcRenderer.send("window-minimize")
	},
	windowMaximize: () => {
		ipcRenderer.send("window-maximize")
	},
	windowClose: () => {
		ipcRenderer.send("window-close")
	},
	windowIsMaximized: async () => {
		return await ipcRenderer.invoke("window-is-maximized")
	},
	onWindowMaximized: (callback: (isMaximized: boolean) => void) => {
		const handler = (
			_event: Electron.IpcRendererEvent,
			isMaximized: boolean
		) => {
			callback(isMaximized)
		}
		ipcRenderer.on("window-maximized", handler)
		return () => {
			ipcRenderer.removeListener("window-maximized", handler)
		}
	},
})
