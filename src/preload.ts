import { contextBridge, ipcRenderer } from "electron"

// Expose protected methods that allow the renderer process to use
// the desktopCapturer API via IPC (required since Electron 17+)
contextBridge.exposeInMainWorld("electronAPI", {
	getDesktopSources: async () => {
		try {
			console.log("[Preload] Buscando fontes de desktop via IPC...")

			// Call the main process via IPC
			const sources = await ipcRenderer.invoke("get-desktop-sources", {
				types: ["window", "screen"],
			})

			console.log("[Preload] Fontes encontradas:", sources.length)

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
			console.error("[Preload] Erro ao buscar fontes:", error)
			throw error
		}
	},
})
