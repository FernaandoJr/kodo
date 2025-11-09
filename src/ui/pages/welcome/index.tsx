import { useState } from "react"

export default function Welcome({
	onNameSet,
}: {
	onNameSet: (name: string) => void
}) {
	const [name, setName] = useState("")

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (name.trim()) {
			onNameSet(name.trim())
		}
	}

	return (
		<div>
			<h1>Seja bem-vindo ao Kodo!</h1>
			<p>Para começar, por favor, nos diga o seu nome.</p>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Digite seu nome"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button type="submit">Salvar</button>
			</form>
		</div>
	)
}
