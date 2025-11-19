import React from "react"
import { Mic } from "lucide-react"

interface AudioToggleProps {
	checked: boolean
	onChange: (checked: boolean) => void
}

const AudioToggle: React.FC<AudioToggleProps> = ({ checked, onChange }) => {
	return (
		<div className="mb-4 flex items-center gap-3 p-3 border border-border rounded-md bg-card">
			<label className="flex items-center gap-2 cursor-pointer w-full">
				<input
					type="checkbox"
					checked={checked}
					onChange={(e) => onChange(e.target.checked)}
					className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				/>
				<div className="flex items-center gap-2">
					<Mic className="h-4 w-4 text-muted-foreground" />
					<span className="text-sm font-medium text-foreground">
						Gravar áudio do microfone
					</span>
				</div>
			</label>
		</div>
	)
}

export default AudioToggle

