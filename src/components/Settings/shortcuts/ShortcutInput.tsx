import { KeyboardEvent, useEffect, useRef, useState } from "react"
import { KEY_MAP, MODIFIER_KEYS } from "../../../constants"
import { formatAccelerator } from "../../../utils"

interface ShortcutInputProps {
	value: string
	onChange: (accelerator: string) => void
	onCancel: () => void
	isEditing: boolean
}

const ShortcutInput = ({
	value,
	onChange,
	onCancel,
	isEditing,
}: ShortcutInputProps) => {
	const [keys, setKeys] = useState<Set<string>>(new Set())
	const [currentAccelerator, setCurrentAccelerator] = useState("")
	const inputRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isEditing])

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()

		const key = e.key

		// Handle escape to cancel
		if (key === "Escape") {
			onCancel()
			return
		}

		const newKeys = new Set(keys)

		// Add modifiers
		if (e.ctrlKey || e.metaKey) newKeys.add("CommandOrControl")
		if (e.altKey) newKeys.add("Alt")
		if (e.shiftKey) newKeys.add("Shift")

		// Add the main key (if not just a modifier)
		if (!["Control", "Meta", "Alt", "Shift"].includes(key)) {
			const mappedKey = KEY_MAP[key] || key.toUpperCase()
			newKeys.add(mappedKey)
		}

		setKeys(newKeys)

		// Build accelerator string
		const parts: string[] = []

		MODIFIER_KEYS.forEach((mod) => {
			if (newKeys.has(mod)) {
				parts.push(mod)
			}
		})

		// Add non-modifier keys
		newKeys.forEach((k) => {
			if (!MODIFIER_KEYS.includes(k as typeof MODIFIER_KEYS[number])) {
				parts.push(k)
			}
		})

		const accelerator = parts.join("+")
		setCurrentAccelerator(accelerator)
	}

	const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
		e.preventDefault()

		// When all keys are released and we have a valid accelerator, save it
		if (currentAccelerator && currentAccelerator.includes("+")) {
			onChange(currentAccelerator)
		}

		setKeys(new Set())
	}

	const handleBlur = () => {
		if (currentAccelerator && currentAccelerator.includes("+")) {
			onChange(currentAccelerator)
		} else {
			onCancel()
		}
		setKeys(new Set())
		setCurrentAccelerator("")
	}

	if (!isEditing) {
		return (
			<span className="font-mono text-xs bg-secondary px-3 py-1.5 rounded-lg border border-border text-foreground">
				{formatAccelerator(value)}
			</span>
		)
	}

	return (
		<div
			ref={inputRef}
			tabIndex={0}
			onKeyDown={handleKeyDown}
			onKeyUp={handleKeyUp}
			onBlur={handleBlur}
			className="font-mono text-xs bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-lg border-2 border-[hsl(var(--primary))] outline-none min-w-[160px] text-center cursor-text shadow-lg glow-primary">
			{currentAccelerator
				? formatAccelerator(currentAccelerator)
				: "Pressione..."}
		</div>
	)
}

export default ShortcutInput

