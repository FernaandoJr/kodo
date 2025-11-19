import { useState } from "react"
import { Video, FileText } from "lucide-react"
import MarkdownReader from "./components/MarkdownReader"
import ScreenRecorder from "./components/ScreenRecorder"

type View = "recorder" | "markdown"

function App() {
	const [currentView, setCurrentView] = useState<View>("recorder")

	return (
		<div className="flex h-screen bg-background text-foreground">
			<aside className="w-64 border-r border-border bg-card p-4">
				<h1 className="text-xl font-semibold mb-8 text-foreground">Kodo</h1>
				<nav className="space-y-1">
					<button
						onClick={() => setCurrentView("recorder")}
						className={`w-full inline-flex items-center gap-2 text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
							currentView === "recorder"
								? "bg-accent text-accent-foreground"
								: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
						}`}>
						<Video className="h-4 w-4" />
						Gravador de Tela
					</button>
					<button
						onClick={() => setCurrentView("markdown")}
						className={`w-full inline-flex items-center gap-2 text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
							currentView === "markdown"
								? "bg-accent text-accent-foreground"
								: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
						}`}>
						<FileText className="h-4 w-4" />
						Leitor Markdown
					</button>
				</nav>
			</aside>

			<main className="flex-1 overflow-auto">
				{currentView === "recorder" && <ScreenRecorder />}
				{currentView === "markdown" && <MarkdownReader />}
			</main>
		</div>
	)
}

export default App
