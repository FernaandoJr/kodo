# 🎥 Kodo

<div align="center">
 
**Um gravador de tela moderno e elegante para Windows, macOS e Linux**

[![Electron](https://img.shields.io/badge/Electron-39.2.2-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Características

- 🎬 **Gravação de Tela e Janelas** - Capture sua tela inteira ou janelas específicas
- 🎤 **Suporte a Áudio** - Grave com ou sem áudio do microfone
- ⏱️ **Timer em Tempo Real** - Acompanhe o tempo de gravação em segundos
- 🎨 **Interface Moderna** - UI elegante construída com React e Tailwind CSS
- ⌨️ **Atalhos Globais Personalizáveis** - Controle total via teclado (padrão: `Ctrl+Shift+R`)
- 🔔 **Notificações do Sistema** - Receba alertas quando a gravação for salva
- 🎯 **System Tray** - Minimize para a bandeja do sistema e grave em segundo plano
- 📹 **Preview ao Vivo** - Visualize o que está sendo gravado em tempo real
- 💾 **Salvamento Inteligente** - Escolha onde salvar seus vídeos
- 🌙 **Design Moderno** - Interface clean com tema escuro e animações suaves

## 🚀 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- npm ou yarn

### Instalando dependências

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/kodo.git

# Entre na pasta do projeto
cd kodo

# Instale as dependências
npm install
```

## 🎮 Uso

### Modo de Desenvolvimento

```bash
npm start
```

Este comando iniciará a aplicação em modo de desenvolvimento com hot-reload.

### Compilar para Produção

```bash
# Criar pacote para o sistema operacional atual
npm run package

# Criar instalador para o sistema operacional atual
npm run make
```

Os arquivos compilados estarão disponíveis na pasta `out/`.

### Publicar

```bash
npm run publish
```

## ⌨️ Atalhos de Teclado

| Atalho                                     | Ação                    |
| ------------------------------------------ | ----------------------- |
| `Ctrl+Shift+R` (ou `Cmd+Shift+R` no macOS) | Iniciar/Parar gravação  |
| `Ctrl+Shift+K` (ou `Cmd+Shift+K` no macOS) | Mostrar/Esconder janela |

💡 **Nota:** Todos os atalhos podem ser personalizados nas configurações da aplicação!

## 🎯 Como Usar

1. **Selecione a Fonte** - Escolha entre gravar a tela inteira ou uma janela específica
2. **Ative o Áudio (Opcional)** - Toggle para gravar com áudio do microfone
3. **Inicie a Gravação** - Clique no botão de gravar ou use o atalho `Ctrl+Shift+R`
4. **Pare a Gravação** - Clique em parar ou use novamente o atalho
5. **Salve o Vídeo** - Escolha onde salvar o arquivo `.webm` gerado

## 🏗️ Tecnologias

Este projeto foi construído com as seguintes tecnologias:

### Core

- **[Electron](https://www.electronjs.org/)** - Framework para aplicações desktop
- **[React](https://reactjs.org/)** - Biblioteca JavaScript para interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript com tipagem estática

### UI/Styling

- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Lucide React](https://lucide.dev/)** - Ícones modernos e bonitos
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis

### Build Tools

- **[Webpack](https://webpack.js.org/)** - Module bundler
- **[Electron Forge](https://www.electronforge.io/)** - Ferramenta de build e deploy

## 📁 Estrutura do Projeto

```
kodo/
├── src/
│   ├── assets/           # Imagens e ícones
│   │   ├── icon.png
│   │   ├── tray.png
│   │   └── tray_recording.png
│   ├── components/       # Componentes React
│   │   ├── ScreenRecorder/
│   │   │   ├── AudioToggle.tsx
│   │   │   ├── RecordingControls.tsx
│   │   │   ├── RecordingTimer.tsx
│   │   │   ├── SourceItem.tsx
│   │   │   ├── SourceSelector.tsx
│   │   │   └── VideoPreview.tsx
│   │   ├── Settings/
│   │   │   ├── ShortcutInput.tsx
│   │   │   └── ShortcutManager.tsx
│   │   ├── Logo.tsx
│   │   ├── ScreenRecorder.tsx
│   │   └── TitleBar.tsx
│   ├── types/            # Definições TypeScript
│   │   └── electron.d.ts
│   ├── App.tsx           # Componente principal
│   ├── index.ts          # Processo principal Electron
│   ├── preload.ts        # Script de preload
│   ├── renderer.tsx      # Renderizador React
│   └── index.html        # HTML base
├── forge.config.ts       # Configuração Electron Forge
├── package.json
└── README.md
```

## 🔧 Configuração

### Personalizando Atalhos

1. Abra a aplicação
2. Vá para **Configurações** na barra lateral
3. Clique no campo do atalho que deseja modificar
4. Pressione a nova combinação de teclas
5. O atalho será salvo automaticamente

### Formatos de Vídeo Suportados

Kodo usa o formato **WebM** para gravações, que oferece:

- ✅ Ótima compressão
- ✅ Alta qualidade
- ✅ Compatibilidade com navegadores modernos
- ✅ Codec VP9 ou VP8 (dependendo do suporte do sistema)

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
