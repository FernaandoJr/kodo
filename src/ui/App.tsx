import { useEffect, useState } from "react"
import Welcome from "./pages/welcome"

function App() {
	const [userName, setUserName] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchUserName = async () => {
			const name = await window.electronAPI.getUserName()
			setUserName(name)
			setLoading(false)
		}

		fetchUserName()
	}, [])

	const handleNameSet = (name: string) => {
		window.electronAPI.setUserName(name)
		setUserName(name)
	}

	if (loading) {
		return <div>Loading...</div> // Ou um componente de splash screen
	}

	return (
		<>
			{!userName ? (
				<Welcome onNameSet={handleNameSet} />
			) : (
				<div>Olá, {userName}</div>
			)}
		</>
	)
}

export default App
