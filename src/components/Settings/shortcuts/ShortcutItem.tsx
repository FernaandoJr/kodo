import { Edit2 } from "lucide-react"
import React from "react"
import type { ShortcutConfig } from "../../../types/electron"
import ShortcutInput from "./ShortcutInput"

interface ShortcutItemProps {
	shortcut: ShortcutConfig
	isEditing: boolean
	isSaving: boolean
	onEdit: () => void
	onUpdate: (accelerator: string) => void
	onCancel: () => void
}

const ShortcutItem: React.FC<ShortcutItemProps> = ({
	shortcut,
	isEditing,
	isSaving,
	onEdit,
	onUpdate,
	onCancel,
}) => {
	return (
		<div className="flex items-center justify-between p-4 bg-card border-2 border-border rounded-xl hover:border-[hsl(var(--primary)/0.3)] transition-all">
			<div className="flex-1">
				<h3 className="font-semibold text-foreground">
					{shortcut.description}
				</h3>
				<p className="text-xs text-muted-foreground mt-0.5">
					{shortcut.action}
				</p>
			</div>

			<div className="flex items-center gap-2">
				<ShortcutInput
					value={shortcut.accelerator}
					onChange={onUpdate}
					onCancel={onCancel}
					isEditing={isEditing}
				/>

				{!isEditing && (
					<button
						onClick={onEdit}
						disabled={isSaving}
						className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						title="Editar atalho">
						<Edit2 className="h-4 w-4" />
					</button>
				)}
			</div>
		</div>
	)
}

export default ShortcutItem

