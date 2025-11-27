import { RotateCcw } from "lucide-react"
import React from "react"

interface ResetButtonProps {
	onReset: () => void
	disabled: boolean
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset, disabled }) => {
	return (
		<div className="mt-8 pt-6 border-t border-border">
			<button
				onClick={onReset}
				disabled={disabled}
				className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
				<RotateCcw className="h-4 w-4" />
				Restaurar atalhos padrão
			</button>
		</div>
	)
}

export default ResetButton

