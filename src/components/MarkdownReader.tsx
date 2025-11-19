import React, { useState } from "react"

const MarkdownReader: React.FC = () => {
	const [markdown, setMarkdown] = useState(`# Leitor de Markdown

Este é um **mock** do leitor de Markdown (estilo Obsidian).

## Funcionalidades Futuras

- 📝 Editor de Markdown em tempo real
- 🔗 Links internos entre notas
- 📁 Sistema de pastas e arquivos
- 🔍 Busca avançada
- 🏷️ Tags e categorias
- 📊 Gráficos de relacionamento
- 🌓 Modo escuro/claro

## Exemplo de Markdown

Você pode usar *itálico*, **negrito**, e ~~riscado~~.

### Listas

- Item 1
- Item 2
- Item 3

### Código

\`\`\`typescript
const exemplo = "Código TypeScript";
console.log(exemplo);
\`\`\`

> Esta é uma citação de exemplo.

---

**Nota:** Esta é uma versão mock. A funcionalidade completa será implementada em breve!`)

	return (
		<div className="p-6 h-full flex flex-col">
			<div className="mb-6">
				<h2 className="text-3xl font-bold mb-2">Leitor de Markdown</h2>
				<p className="text-gray-400">
					Editor de notas estilo Obsidian (Mock)
				</p>
			</div>

			<div className="flex-1 grid grid-cols-2 gap-6">
				{/* Editor */}
				<div className="bg-gray-900 rounded-lg p-4 flex flex-col">
					<h3 className="text-xl font-semibold mb-4">Editor</h3>
					<textarea
						value={markdown}
						onChange={(e) => setMarkdown(e.target.value)}
						className="flex-1 bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Digite seu Markdown aqui..."
					/>
				</div>

				{/* Preview */}
				<div className="bg-gray-900 rounded-lg p-4 flex flex-col">
					<h3 className="text-xl font-semibold mb-4">Preview</h3>
					<div className="flex-1 bg-gray-800 text-gray-100 p-6 rounded-lg overflow-y-auto prose prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-code:text-blue-400 prose-pre:bg-gray-900 max-w-none">
						<div className="whitespace-pre-wrap">{markdown}</div>
					</div>
				</div>
			</div>

			<div className="mt-4 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
				<p className="text-blue-300 text-sm">
					⚠️ <strong>Mock:</strong> Esta é uma versão de demonstração.
					O renderizador de Markdown completo será implementado em
					breve.
				</p>
			</div>
		</div>
	)
}

export default MarkdownReader
