import React from "react"

const SettingsTip: React.FC = () => {
	return (
		<div className="mt-6 p-4 bg-secondary rounded-xl border border-border">
			<h4 className="font-semibold text-sm mb-1.5 text-foreground">
				💡 Dica
			</h4>
			<p className="text-sm text-muted-foreground leading-relaxed">
				Clique no ícone de edição e pressione a combinação desejada. Use
				Ctrl, Alt ou Shift junto com outra tecla.
			</p>
		</div>
	)
}

export default SettingsTip

