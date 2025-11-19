export interface DesktopSource {
  id: string;
  name: string;
  thumbnail: string;
}

export interface ElectronAPI {
  getDesktopSources: () => Promise<DesktopSource[]>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

