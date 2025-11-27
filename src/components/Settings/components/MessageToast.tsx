import { Check, X } from "lucide-react"
import React from "react"

interface MessageToastProps {
	type: "success" | "error"
	text: string
}

const MessageToast: React.FC<MessageToastProps> = ({ type, text }) => {
	return (
		<div
			className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${
				type === "success"
					? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
					: "bg-red-500/10 text-red-400 border border-red-500/20"
			}`}>
			<div
				className={`w-8 h-8 rounded-full flex items-center justify-center ${
					type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"
				}`}>
				{type === "success" ? (
					<Check className="h-4 w-4" />
				) : (
					<X className="h-4 w-4" />
				)}
			</div>
			<span className="text-sm font-medium">{text}</span>
		</div>
	)
}

export default MessageToast

