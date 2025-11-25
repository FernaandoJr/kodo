import { Copy, Minus, Square, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import Logo from "./Logo"

const TitleBar = () => {
	const [isMaximized, setIsMaximized] = useState(false)

	useEffect(() => {
		// Get initial maximized state
		window.electronAPI?.windowIsMaximized().then(setIsMaximized)

		// Listen for maximize/unmaximize events
		const cleanup = window.electronAPI?.onWindowMaximized((maximized) => {
			setIsMaximized(maximized)
		})

		return () => {
			cleanup?.()
		}
	}, [])

	const handleMinimize = useCallback(() => {
		window.electronAPI?.windowMinimize()
	}, [])

	const handleMaximize = useCallback(() => {
		window.electronAPI?.windowMaximize()
	}, [])

	const handleClose = useCallback(() => {
		window.electronAPI?.windowClose()
	}, [])

	return (
		<div className="title-bar h-10 bg-[hsl(var(--sidebar))] border-b border-[hsl(var(--sidebar-border))] flex items-center justify-between select-none">
			{/* App Info - Draggable */}
			<div className="flex items-center gap-2.5 px-3 flex-1 drag-region h-full">
				<div className="w-6 h-6 rounded-lg bg-linear-to-br from-[hsl(var(--primary))] to-purple-600 flex items-center justify-center shadow-sm">
					<Logo className="w-3.5 h-3.5 text-white" />
				</div>
				<span className="text-sm font-semibold text-foreground">
					Kodo
				</span>
				<span className="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-secondary rounded">
					v1.0.0
				</span>
			</div>

			{/* Window Controls */}
			<div className="flex items-center h-full">
				{/* Minimize */}
				<button
					onClick={handleMinimize}
					className="flex items-center justify-center h-full px-4 transition-all duration-150 cursor-pointer group text-muted-foreground hover:text-amber-400 hover:bg-amber-500/10 active:scale-90"
					title="Minimizar">
					<Minus className="w-4 h-4 transition-transform" />
				</button>

				{/* Maximize/Restore */}
				<button
					onClick={handleMaximize}
					className="flex items-center justify-center h-full px-4 transition-all duration-150 cursor-pointer group text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 active:scale-90"
					title={isMaximized ? "Restaurar" : "Maximizar"}>
					{isMaximized ? (
						<Copy className="w-3.5 h-3.5 transition-transform" />
					) : (
						<Square className="w-3.5 h-3.5 transition-transform" />
					)}
				</button>

				{/* Close */}
				<button
					onClick={handleClose}
					className="flex items-center justify-center h-full px-4 transition-all duration-150 cursor-pointer group text-muted-foreground hover:text-white hover:bg-red-600 active:scale-90"
					title="Fechar">
					<X className="w-4 h-4 transition-transform" />
				</button>
			</div>
		</div>
	)
}

export default TitleBar
