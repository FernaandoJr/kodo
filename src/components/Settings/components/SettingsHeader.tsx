import { Keyboard } from "lucide-react"
import React from "react"

const SettingsHeader: React.FC = () => {
	return (
		<div className="mb-6">
			<div className="flex items-center gap-3 mb-2">
				<div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary)/0.15)] flex items-center justify-center">
					<Keyboard className="h-5 w-5 text-[hsl(var(--primary))]" />
				</div>
				<h1 className="text-2xl font-bold tracking-tight">
					Atalhos Globais
				</h1>
			</div>
			<p className="text-muted-foreground text-sm">
				Configure atalhos que funcionam mesmo com a janela minimizada
			</p>
		</div>
	)
}

export default SettingsHeader

