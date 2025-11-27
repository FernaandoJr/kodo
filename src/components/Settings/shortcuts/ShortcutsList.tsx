import React from "react"
import type { ShortcutConfig } from "../../../types/electron"
import ShortcutItem from "./ShortcutItem"

interface ShortcutsListProps {
	shortcuts: ShortcutConfig[]
	editingAction: string | null
	isSaving: boolean
	onEditShortcut: (action: string) => void
	onUpdateShortcut: (action: string, accelerator: string) => void
	onCancelEdit: () => void
}

const ShortcutsList: React.FC<ShortcutsListProps> = ({
	shortcuts,
	editingAction,
	isSaving,
	onEditShortcut,
	onUpdateShortcut,
	onCancelEdit,
}) => {
	return (
		<div className="space-y-3">
			{shortcuts.map((shortcut) => (
				<ShortcutItem
					key={shortcut.action}
					shortcut={shortcut}
					isEditing={editingAction === shortcut.action}
					isSaving={isSaving}
					onEdit={() => onEditShortcut(shortcut.action)}
					onUpdate={(accelerator) =>
						onUpdateShortcut(shortcut.action, accelerator)
					}
					onCancel={onCancelEdit}
				/>
			))}
		</div>
	)
}

export default ShortcutsList

