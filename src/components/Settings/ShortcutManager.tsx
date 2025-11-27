import { useCallback, useEffect, useState } from "react"
import { MESSAGE_DISPLAY_DURATION } from "../../constants"
import type { ShortcutConfig } from "../../types/electron"
import { getErrorMessage } from "../../utils"
import ResetButton from "./buttons/ResetButton"
import LoadingSpinner from "./components/LoadingSpinner"
import MessageToast from "./components/MessageToast"
import SettingsHeader from "./components/SettingsHeader"
import SettingsTip from "./components/SettingsTip"
import ShortcutsList from "./shortcuts/ShortcutsList"

const ShortcutManager = () => {
	const [shortcuts, setShortcuts] = useState<ShortcutConfig[]>([])
	const [editingAction, setEditingAction] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [message, setMessage] = useState<{
		type: "success" | "error"
		text: string
	} | null>(null)

	const showMessage = useCallback(
		(type: "success" | "error", text: string) => {
			setMessage({ type, text })
			setTimeout(() => setMessage(null), MESSAGE_DISPLAY_DURATION)
		},
		[]
	)

	const loadShortcuts = useCallback(async () => {
		try {
			setLoading(true)
			const data = await window.electronAPI.getShortcuts()
			setShortcuts(data)
		} catch (error) {
			console.error("Error loading shortcuts:", getErrorMessage(error))
			showMessage("error", "Erro ao carregar atalhos")
		} finally {
			setLoading(false)
		}
	}, [showMessage])

	useEffect(() => {
		loadShortcuts()
	}, [loadShortcuts])

	const handleUpdateShortcut = useCallback(
		async (action: string, accelerator: string) => {
			try {
				setSaving(true)
				const result = await window.electronAPI.updateShortcut(
					action,
					accelerator
				)

				if (result.success) {
					setShortcuts((prev) =>
						prev.map((s) =>
							s.action === action ? { ...s, accelerator } : s
						)
					)
					showMessage("success", "Atalho atualizado com sucesso!")
				} else {
					showMessage("error", result.message || "Erro ao atualizar")
				}
			} catch (error) {
				console.error(
					"Error updating shortcut:",
					getErrorMessage(error)
				)
				showMessage("error", "Erro ao atualizar atalho")
			} finally {
				setSaving(false)
				setEditingAction(null)
			}
		},
		[showMessage]
	)

	const handleResetShortcuts = useCallback(async () => {
		try {
			setSaving(true)
			const result = await window.electronAPI.resetShortcuts()

			if (result.success && result.shortcuts) {
				setShortcuts(result.shortcuts)
				showMessage("success", "Atalhos restaurados para o padrão!")
			} else {
				showMessage("error", result.message || "Erro ao restaurar")
			}
		} catch (error) {
			console.error("Error resetting shortcuts:", getErrorMessage(error))
			showMessage("error", "Erro ao restaurar atalhos")
		} finally {
			setSaving(false)
		}
	}, [showMessage])

	if (loading) {
		return <LoadingSpinner />
	}

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<SettingsHeader />

			{message && (
				<MessageToast type={message.type} text={message.text} />
			)}

			<ShortcutsList
				shortcuts={shortcuts}
				editingAction={editingAction}
				isSaving={saving}
				onEditShortcut={setEditingAction}
				onUpdateShortcut={handleUpdateShortcut}
				onCancelEdit={() => setEditingAction(null)}
			/>

			<ResetButton onReset={handleResetShortcuts} disabled={saving} />

			<SettingsTip />
		</div>
	)
}

export default ShortcutManager
