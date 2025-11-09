console.log("Preload script has been loaded!")

import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("electronAPI", {
	getUserName: () => ipcRenderer.invoke("get-user-name"),
	setUserName: (name: string) => ipcRenderer.invoke("set-user-name", name),
})
