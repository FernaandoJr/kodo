import React from "react"

const LoadingSpinner: React.FC = () => {
	return (
		<div className="flex items-center justify-center h-full">
			<div className="animate-pulse text-muted-foreground">
				Carregando atalhos...
			</div>
		</div>
	)
}

export default LoadingSpinner

