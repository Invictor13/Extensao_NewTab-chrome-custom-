# New Tab Custom — Extensão Google Chrome

Uma extensão minimalista e leve para Google Chrome que permite personalizar a página de Nova guia informando qualquer endereço de site.

---

## 🎯 Objetivo

Por padrão, o Google Chrome não permite que o usuário defina livremente a URL da página de Nova guia. O **New Tab Custom** resolve isso de forma simples, elegante e sem consumir recursos desnecessários.

---

## 🛠️ Tecnologias e Arquitetura

- **Manifest V3:** Padrão moderno e seguro para extensões Chrome.
- **JavaScript Vanilla (ES6+), HTML5 e CSS3:** Zero dependências externas, sem bundlers ou frameworks pesados.
- **Identidade Visual:** Design limpo e moderno em tons verdes, com tipografia legível e botões intuitivos.
- **Segurança:** Sem scripts inline, conformidade total com a Content Security Policy (CSP) do Manifest V3 e validação estrita de URLs.

---

## 📂 Estrutura do Projeto

```text
Extensao_NewTab-chrome-custom-/
├── assets/
│   └── icons/
│       ├── icon16.png        # Ícone da extensão (16x16)
│       ├── icon48.png        # Ícone da extensão (48x48)
│       └── icon128.png       # Ícone da extensão (128x128)
├── newtab/
│   ├── newtab.html           # Página de substituição da Nova Guia
│   ├── newtab.css            # Estilos da página Nova Guia
│   └── newtab.js             # Lógica da Nova Guia
├── popup/
│   ├── popup.html            # Interface de configuração ao clicar no ícone
│   ├── popup.css             # Estilos do popup
│   └── popup.js              # Lógica da interface do popup
├── shared/
│   └── url-validator.js      # Módulo compartilhado para validação e normalização de URL
├── manifest.json             # Manifesto da extensão (Manifest V3)
└── README.md                 # Documentação do projeto
```

---

## 🚀 Como Carregar no Google Chrome (Modo Desenvolvedor)

1. Clone ou baixe este repositório na sua máquina.
2. Abra o Google Chrome e acerte no endereço: `chrome://extensions`.
3. No canto superior direito, ative a chave **"Modo do desenvolvedor"**.
4. Clique no botão **"Carregar sem compactação"** (Load unpacked).
5. Selecione a pasta raiz deste repositório (`Extensao_NewTab-chrome-custom-`).
6. A extensão estará pronta e visível na barra de ferramentas e nas novas guias!

---

## 📌 Status das Etapas (Roadmap de PRs)

- [x] **PR01 — Fundação da Extensão New Tab Custom:** Estrutura base, Manifest V3, layouts de popup e newtab, ícones verdes e módulo compartilhado.
- [x] **PR02 — Interface de Configuração e Persistência:** Implementação da validação avançada e persistência via `chrome.storage.local`.
- [x] **PR03 — Redirecionamento da Nova Guia:** Redirecionamento automático instantâneo e tratamento de tela sem URL configurada.
- [ ] **PR04 — Polimento, Documentação Final e Publicação.**

---

## 👤 Desenvolvedor

**Victor Ladislau Viana**

- **GitHub:** [https://github.com/Invictor13](https://github.com/Invictor13)
- **LinkedIn:** [https://www.linkedin.com/in/victor-ladislau-14402a170/](https://www.linkedin.com/in/victor-ladislau-14402a170/)
