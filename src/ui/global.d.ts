export interface IElectronAPI {
	getUserName: () => Promise<string>
	setUserName: (name: string) => Promise<void>
}

declare global {
	interface Window {
		electronAPI: IElectronAPI
	}
}
