import { app, BrowserWindow, ipcMain } from "electron"
import Store from "electron-store"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import { isDev } from "./util.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const store = new Store()

app.whenReady().then(() => {
	const preloadPath = path.join(__dirname, "preload.js")
	console.log(`Preload script path: ${preloadPath}`)

	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: preloadPath,
			contextIsolation: true,
		},
	})

	ipcMain.handle("get-user-name", () => {
		return store.get("userName")
	})

	ipcMain.handle("set-user-name", (event, name: string) => {
		store.set("userName", name)
	})

	if (isDev()) {
		mainWindow.loadURL("http://localhost:5123")
	} else {
		mainWindow.loadFile(
			path.join(app.getAppPath(), "dist-react/index.html")
		)
	}
})
