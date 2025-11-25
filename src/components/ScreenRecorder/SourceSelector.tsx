import { Lock, Monitor, RefreshCw } from "lucide-react"
import React from "react"
import type { DesktopSource } from "../../types/electron"
import SourceItem from "./SourceItem"

interface SourceSelectorProps {
	sources: DesktopSource[]
	selectedSource: DesktopSource | null
	isLoading: boolean
	isRecording: boolean
	onSourceSelect: (source: DesktopSource) => void
	onRefresh: () => void
}

const SourceSelector: React.FC<SourceSelectorProps> = ({
	sources,
	selectedSource,
	isLoading,
	isRecording,
	onSourceSelect,
	onRefresh,
}) => {
	return (
		<div className={`border-2 rounded-2xl bg-card p-5 flex flex-col h-full transition-all ${
			isRecording ? "border-red-500/30 bg-red-500/5" : "border-border"
		}`}>
			<div className="flex justify-between items-center mb-4 flex-shrink-0">
				<div className="flex items-center gap-2">
					{isRecording ? (
						<Lock className="h-5 w-5 text-red-400" />
					) : (
						<Monitor className="h-5 w-5 text-muted-foreground" />
					)}
					<h3 className="text-base font-semibold text-foreground">
						{isRecording ? "Fonte Bloqueada" : "Fontes Disponíveis"}
					</h3>
				</div>
				<button
					onClick={onRefresh}
					disabled={isLoading || isRecording}
					className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed">
					<RefreshCw
						className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
					/>
					{isLoading ? "..." : "Atualizar"}
				</button>
			</div>

			<div className="space-y-2 flex-1 overflow-y-auto min-h-0 pr-1">
				{sources.length === 0 && !isLoading && (
					<div className="text-center py-12 text-muted-foreground">
						<Monitor className="h-10 w-10 mx-auto mb-3 opacity-30" />
						<p className="mb-1 text-sm font-medium">Nenhuma fonte encontrada</p>
						<p className="text-xs opacity-70">
							Clique em Atualizar para buscar
						</p>
					</div>
				)}
				{sources.map((source) => (
					<SourceItem
						key={source.id}
						source={source}
						isSelected={selectedSource?.id === source.id}
						isDisabled={isRecording && selectedSource?.id !== source.id}
						onClick={() => !isRecording && onSourceSelect(source)}
					/>
				))}
			</div>
		</div>
	)
}

export default SourceSelector
