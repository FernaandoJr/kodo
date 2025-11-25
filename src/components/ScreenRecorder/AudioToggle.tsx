import { Mic, MicOff } from "lucide-react"
import React from "react"

interface AudioToggleProps {
	checked: boolean
	onChange: (checked: boolean) => void
}

const AudioToggle: React.FC<AudioToggleProps> = ({ checked, onChange }) => {
	return (
		<button
			onClick={() => onChange(!checked)}
			className={`mb-4 flex items-center gap-3 p-3 rounded-xl transition-all w-full text-left ${
				checked
					? "bg-[hsl(var(--primary)/0.15)] border-2 border-[hsl(var(--primary))]"
					: "bg-secondary border-2 border-transparent hover:border-border"
			}`}>
			<div
				className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
					checked
						? "bg-[hsl(var(--primary))] text-white"
						: "bg-muted text-muted-foreground"
				}`}>
				{checked ? (
					<Mic className="h-4 w-4" />
				) : (
					<MicOff className="h-4 w-4" />
				)}
			</div>
			<div className="flex-1">
				<p className={`text-sm font-medium ${checked ? "text-foreground" : "text-muted-foreground"}`}>
					Microfone
				</p>
				<p className="text-xs text-muted-foreground">
					{checked ? "Ativado" : "Desativado"}
				</p>
			</div>
			<div
				className={`w-10 h-6 rounded-full p-1 transition-all ${
					checked ? "bg-[hsl(var(--primary))]" : "bg-muted"
				}`}>
				<div
					className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
						checked ? "translate-x-4" : "translate-x-0"
					}`}
				/>
			</div>
		</button>
	)
}

export default AudioToggle

