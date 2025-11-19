import React from "react"
import { RefreshCw } from "lucide-react"
import type { DesktopSource } from "../../types/electron"
import SourceItem from "./SourceItem"

interface SourceSelectorProps {
	sources: DesktopSource[]
	selectedSource: DesktopSource | null
	isLoading: boolean
	onSourceSelect: (source: DesktopSource) => void
	onRefresh: () => void
}

const SourceSelector: React.FC<SourceSelectorProps> = ({
	sources,
	selectedSource,
	isLoading,
	onSourceSelect,
	onRefresh,
}) => {
	return (
		<div className="border border-border rounded-lg bg-card p-6 shadow-sm">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-semibold text-foreground">
					Selecionar Fonte
				</h3>
				<button
					onClick={onRefresh}
					disabled={isLoading}
					className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:pointer-events-none">
					<RefreshCw
						className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
					/>
					{isLoading ? "Carregando..." : "Atualizar"}
				</button>
			</div>

			<div className="space-y-2 max-h-96 overflow-y-auto">
				{sources.length === 0 && !isLoading && (
					<div className="text-center py-8 text-muted-foreground">
						<p className="mb-2 text-sm">Nenhuma fonte encontrada</p>
						<p className="text-xs">
							Clique em &quot;Atualizar&quot; para buscar novamente
						</p>
					</div>
				)}
				{sources.map((source) => (
					<SourceItem
						key={source.id}
						source={source}
						isSelected={selectedSource?.id === source.id}
						onClick={() => onSourceSelect(source)}
					/>
				))}
			</div>
		</div>
	)
}

export default SourceSelector

