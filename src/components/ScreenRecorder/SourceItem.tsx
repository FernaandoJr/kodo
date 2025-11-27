import { Circle } from "lucide-react"
import React from "react"
import type { DesktopSource } from "../../types/electron"

interface SourceItemProps {
	source: DesktopSource
	isSelected: boolean
	isDisabled?: boolean
	onClick: () => void
}

const SourceItem: React.FC<SourceItemProps> = ({
	source,
	isSelected,
	isDisabled = false,
	onClick,
}) => {
	return (
		<button
			onClick={onClick}
			disabled={isDisabled}
			className={`w-full p-3 rounded-xl border-2 transition-all text-left group ${
				isSelected
					? "border-red-500 bg-red-500/10"
					: isDisabled
						? "border-transparent bg-secondary/50 opacity-40 cursor-not-allowed"
						: "border-transparent bg-secondary hover:bg-muted hover:border-border"
			}`}>
			<div className="flex items-center gap-3">
				<div className="relative">
					<img
						src={source.thumbnail}
						alt={source.name}
						className={`w-20 h-12 object-cover rounded-lg border transition-all ${
							isSelected
								? "border-red-500"
								: isDisabled
									? "border-border opacity-50"
									: "border-border group-hover:border-muted-foreground/30"
						}`}
					/>
					{isSelected && (
						<div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
							<Circle className="h-2 w-2 text-white fill-white animate-pulse" />
						</div>
					)}
				</div>
				<span
					className={`text-sm font-medium truncate flex-1 ${
						isSelected 
							? "text-foreground" 
							: isDisabled 
								? "text-muted-foreground/50" 
								: "text-muted-foreground group-hover:text-foreground"
					}`}>
					{source.name}
				</span>
				{isSelected && (
					<span className="text-[10px] text-red-400 font-medium px-2 py-0.5 bg-red-500/20 rounded">
						GRAVANDO
					</span>
				)}
			</div>
		</button>
	)
}

export default SourceItem

