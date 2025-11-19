export interface DesktopSource {
  id: string;
  name: string;
  thumbnail: string;
}

export interface ElectronAPI {
  getDesktopSources: () => Promise<DesktopSource[]>;
  updateRecordingState: (isRecording: boolean) => void;
  saveRecording: (buffer: Uint8Array, mimeType: string) => Promise<{ success: boolean; filePath?: string; fileName?: string; message?: string }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

