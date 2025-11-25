import { Check } from "lucide-react"
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
			className={`w-full p-3 rounded-xl border-2 transition-all text-left group ${
				isSelected
					? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
					: "border-transparent bg-secondary hover:bg-muted hover:border-border"
			}`}>
			<div className="flex items-center gap-3">
				<div className="relative">
					<img
						src={source.thumbnail}
						alt={source.name}
						className={`w-20 h-12 object-cover rounded-lg border transition-all ${
							isSelected
								? "border-[hsl(var(--primary))]"
								: "border-border group-hover:border-muted-foreground/30"
						}`}
					/>
					{isSelected && (
						<div className="absolute -top-1 -right-1 w-5 h-5 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center shadow-lg">
							<Check className="h-3 w-3 text-white" />
						</div>
					)}
				</div>
				<span
					className={`text-sm font-medium truncate flex-1 ${
						isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
					}`}>
					{source.name}
				</span>
			</div>
		</button>
	)
}

export default SourceItem

