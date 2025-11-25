import { AlertTriangle, Settings, Video } from "lucide-react"
import { useCallback, useState } from "react"
import ScreenRecorder from "./components/ScreenRecorder"
import { ShortcutManager } from "./components/Settings"
import TitleBar from "./components/TitleBar"

type View = "recorder" | "settings"

function App() {
	const [currentView, setCurrentView] = useState<View>("recorder")
	const [isRecording, setIsRecording] = useState(false)
	const [showRecordingWarning, setShowRecordingWarning] = useState(false)
	const [pendingView, setPendingView] = useState<View | null>(null)

	const handleViewChange = useCallback(
		(view: View) => {
			if (isRecording && view !== "recorder") {
				setPendingView(view)
				setShowRecordingWarning(true)
			} else {
				setCurrentView(view)
			}
		},
		[isRecording]
	)

	const handleDismissWarning = useCallback(() => {
		setShowRecordingWarning(false)
		setPendingView(null)
	}, [])

	return (
		<div className="flex flex-col h-screen bg-background text-foreground">
			{/* Custom Title Bar */}
			<TitleBar />

			{/* Main Layout */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<aside className="w-64 border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] flex flex-col">
					{/* Navigation */}
					<nav className="flex-1 p-3 space-y-1">
						<button
							onClick={() => handleViewChange("recorder")}
							className={`w-full inline-flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
								currentView === "recorder"
									? "bg-[hsl(var(--primary))] text-white shadow-lg glow-primary"
									: "text-muted-foreground hover:bg-secondary hover:text-foreground"
							}`}>
							<Video className="w-5 h-5" />
							Gravador de Tela
							{isRecording && (
								<span className="ml-auto h-2.5 w-2.5 rounded-full bg-red-500 animate-recording shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
							)}
						</button>
						<button
							onClick={() => handleViewChange("settings")}
							className={`w-full inline-flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
								currentView === "settings"
									? "bg-[hsl(var(--primary))] text-white shadow-lg glow-primary"
									: "text-muted-foreground hover:bg-secondary hover:text-foreground"
							}`}>
							<Settings className="w-5 h-5" />
							Configurações
						</button>
					</nav>

					{/* Footer */}
					<div className="p-4 border-t border-[hsl(var(--sidebar-border))]">
						<p className="text-[10px] text-muted-foreground text-center">
							Ctrl+Shift+R para gravar
						</p>
					</div>
				</aside>

				{/* Main Content */}
				<main className="flex-1 overflow-auto bg-background">
					{currentView === "recorder" && (
						<ScreenRecorder
							onRecordingStateChange={setIsRecording}
						/>
					)}
					{currentView === "settings" && <ShortcutManager />}
				</main>
			</div>

			{/* Recording Warning Modal */}
			{showRecordingWarning && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
					<div className="max-w-md p-6 mx-4 border shadow-2xl bg-card border-border rounded-2xl">
						<div className="flex items-center gap-3 mb-4 text-amber-500">
							<div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10">
								<AlertTriangle className="w-5 h-5" />
							</div>
							<h2 className="text-lg font-semibold text-foreground">
								Gravação em Andamento
							</h2>
						</div>
						<p className="mb-6 leading-relaxed text-muted-foreground">
							Você está gravando a tela. Trocar de página irá
							interromper a gravação. Por favor, pare a gravação
							antes de continuar.
						</p>
						<div className="flex justify-end">
							<button
								onClick={handleDismissWarning}
								className="px-5 py-2.5 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg glow-primary">
								Entendi
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default App
