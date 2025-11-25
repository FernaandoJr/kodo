import { useEffect, useState } from "react"
import { Keyboard, RotateCcw, Check, X, Edit2 } from "lucide-react"
import type { ShortcutConfig } from "../../types/electron"
import ShortcutInput from "./ShortcutInput"

const ShortcutManager = () => {
	const [shortcuts, setShortcuts] = useState<ShortcutConfig[]>([])
	const [editingAction, setEditingAction] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [message, setMessage] = useState<{
		type: "success" | "error"
		text: string
	} | null>(null)

	useEffect(() => {
		loadShortcuts()
	}, [])

	const loadShortcuts = async () => {
		try {
			setLoading(true)
			const data = await window.electronAPI.getShortcuts()
			setShortcuts(data)
		} catch (error) {
			console.error("Error loading shortcuts:", error)
			showMessage("error", "Erro ao carregar atalhos")
		} finally {
			setLoading(false)
		}
	}

	const showMessage = (type: "success" | "error", text: string) => {
		setMessage({ type, text })
		setTimeout(() => setMessage(null), 3000)
	}

	const handleUpdateShortcut = async (
		action: string,
		accelerator: string
	) => {
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
			console.error("Error updating shortcut:", error)
			showMessage("error", "Erro ao atualizar atalho")
		} finally {
			setSaving(false)
			setEditingAction(null)
		}
	}

	const handleResetShortcuts = async () => {
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
			console.error("Error resetting shortcuts:", error)
			showMessage("error", "Erro ao restaurar atalhos")
		} finally {
			setSaving(false)
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="animate-pulse text-muted-foreground">
					Carregando atalhos...
				</div>
			</div>
		)
	}

	return (
		<div className="p-6 max-w-2xl mx-auto">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-2">
					<div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary)/0.15)] flex items-center justify-center">
						<Keyboard className="h-5 w-5 text-[hsl(var(--primary))]" />
					</div>
					<h1 className="text-2xl font-bold tracking-tight">Atalhos Globais</h1>
				</div>
				<p className="text-muted-foreground text-sm">
					Configure atalhos que funcionam mesmo com a janela minimizada
				</p>
			</div>

			{/* Message Toast */}
			{message && (
				<div
					className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${
						message.type === "success"
							? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
							: "bg-red-500/10 text-red-400 border border-red-500/20"
					}`}>
					<div className={`w-8 h-8 rounded-full flex items-center justify-center ${
						message.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"
					}`}>
						{message.type === "success" ? (
							<Check className="h-4 w-4" />
						) : (
							<X className="h-4 w-4" />
						)}
					</div>
					<span className="text-sm font-medium">{message.text}</span>
				</div>
			)}

			{/* Shortcuts List */}
			<div className="space-y-3">
				{shortcuts.map((shortcut) => (
					<div
						key={shortcut.action}
						className="flex items-center justify-between p-4 bg-card border-2 border-border rounded-xl hover:border-[hsl(var(--primary)/0.3)] transition-all">
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
								onChange={(accelerator) =>
									handleUpdateShortcut(
										shortcut.action,
										accelerator
									)
								}
								onCancel={() => setEditingAction(null)}
								isEditing={editingAction === shortcut.action}
							/>

							{editingAction !== shortcut.action && (
								<button
									onClick={() =>
										setEditingAction(shortcut.action)
									}
									disabled={saving}
									className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
									title="Editar atalho">
									<Edit2 className="h-4 w-4" />
								</button>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Reset Button */}
			<div className="mt-8 pt-6 border-t border-border">
				<button
					onClick={handleResetShortcuts}
					disabled={saving}
					className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all disabled:opacity-50">
					<RotateCcw className="h-4 w-4" />
					Restaurar atalhos padrão
				</button>
			</div>

			{/* Tip Box */}
			<div className="mt-6 p-4 bg-secondary rounded-xl border border-border">
				<h4 className="font-semibold text-sm mb-1.5 text-foreground">💡 Dica</h4>
				<p className="text-sm text-muted-foreground leading-relaxed">
					Clique no ícone de edição e pressione a combinação desejada.
					Use Ctrl, Alt ou Shift junto com outra tecla.
				</p>
			</div>
		</div>
	)
}

export default ShortcutManager

