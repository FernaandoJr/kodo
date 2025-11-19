import React from "react"
import type { DesktopSource } from "../../types/electron"

interface SourceItemProps {
	source: DesktopSource
	isSelected: boolean
	onClick: () => void
}

const SourceItem: React.FC<SourceItemProps> = ({
	source,
	isSelected,
	onClick,
}) => {
	return (
		<button
			onClick={onClick}
			className={`w-full p-3 rounded-md border transition-all text-left ${
				isSelected
					? "border-primary bg-accent"
					: "border-border bg-background hover:bg-accent hover:border-accent-foreground/20"
			}`}>
			<div className="flex items-center gap-3">
				<img
					src={source.thumbnail}
					alt={source.name}
					className="w-16 h-10 object-cover rounded border border-border"
				/>
				<span
					className={`text-sm font-medium truncate ${
						isSelected ? "text-foreground" : "text-muted-foreground"
					}`}>
					{source.name}
				</span>
			</div>
		</button>
	)
}

export default SourceItem

