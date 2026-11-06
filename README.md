# New Tab Custom — Extensão Google Chrome

Uma extensão minimalista, elegante e ultraleve para Google Chrome que permite personalizar a página de Nova guia (New Tab) com o endereço de qualquer site ou serviço da sua escolha.

---

## 🎯 Apresentação do Produto

Por padrão, os navegadores baseados no Chromium não oferecem uma forma direta e flexível de definir uma página inicial customizada ao abrir uma nova guia. O **New Tab Custom** foi criado para preencher essa lacuna de maneira rápida, limpa e segura.

Com uma identidade visual moderna em tons verdes e foco total em desempenho, a extensão substitui a página de nova guia padrão e navega imediatamente para o site configurado — sem intermediários, sem atrasos e sem coletar qualquer tipo de dado.

---

## ✨ Funcionalidades Principais

- **Redirecionamento Instantâneo:** Ao abrir uma nova guia, a extensão redireciona de imediato para a URL definida, utilizando `window.location.replace` para preservar o histórico limpo de navegação.
- **Configuração Simples via Popup:** Altere ou consulte a URL atual a qualquer momento clicando no ícone da extensão na barra de ferramentas.
- **Validação e Normalização Inteligente:**
  - Digite `google.com` e a extensão normaliza automaticamente para `https://google.com`.
  - Suporte completo para servidores locais e portas personalizadas (ex: `http://localhost:3000`).
  - Proteção estrita contra protocolos inseguros ou maliciosos (`javascript:`, `data:`, `file:`, `chrome:`).
- **Proteção contra Loops:** Mecanismos integrados para prevenir redirecionamentos circulares ou loops rápidos entre páginas.
- **Restauração em Um Clique:** Botão "Restaurar Padrão" para remover a URL configurada e voltar a exibir a tela de boas-vindas funcional.
- **Persistência Local e Segura:** As preferências são armazenadas exclusivamente no navegador através da API `chrome.storage.local`.

---

## 🛠️ Tecnologias, Arquitetura e Permissões

- **Manifest V3:** Arquitetura moderna em conformidade total com as diretrizes do Google Chrome.
- **Zero Dependências:** Desenvolvida inteiramente com JavaScript Vanilla (ES6+), HTML5 e CSS3 puro, sem necessidade de bundlers, bibliotecas pesadas ou node_modules em runtime.
- **Segurança e CSP:** Total conformidade com a Content Security Policy do Manifest V3 — zero scripts inline e validação rigorosa de entradas.
- **Permissões Solicitadas:**
  - `storage`: **Única permissão requerida.** Utilizada estritamente para salvar e consultar localmente no navegador a chave `customNewTabUrl` contendo a URL definida pelo usuário. Não há solicitação de permissões invasivas (como `webRequest`, `tabs` ou `activeTab`).
  - **Zero Telemetria:** A extensão não se conecta a nenhum servidor externo, analítico ou banco de dados remoto. A privacidade do usuário é 100% preservada.

---

## 📂 Estrutura do Projeto

```text
Extensao_NewTab-chrome-custom-/
├── assets/
│   ├── icons/
│   │   ├── icon16.png        # Ícone da extensão para favicons e menus (16x16)
│   │   ├── icon48.png        # Ícone da extensão para gerenciador de extensões (48x48)
│   │   └── icon128.png       # Ícone de alta resolução para Chrome Web Store (128x128)
│   ├── store/                # Diretório reservado para capturas e materiais visuais da loja
│   │   └── README.md         # Diretrizes técnicas para screenshots reais e promo tiles
│   └── logo.png              # Logotipo oficial em alta definição (símbolo + tipografia)
├── newtab/
│   ├── newtab.html           # Página de substituição da Nova Guia (chrome_url_overrides)
│   ├── newtab.css            # Estilos com identidade visual verde e responsiva
│   └── newtab.js             # Lógica de recuperação de storage e redirecionamento seguro
├── popup/
│   ├── popup.html            # Interface de configuração rápida (action popup)
│   ├── popup.css             # Estilos do popup de configuração
│   └── popup.js              # Manipulação de formulário, validação e persistência
├── scripts/
│   └── build-package.js      # Script de empacotamento oficial e validação para distribuição
├── shared/
│   └── url-validator.js      # Módulo compartilhado para validação e normalização de URLs
├── test/
│   ├── newtab-redirect.test.js      # Testes automatizados do ciclo da Nova Guia
│   ├── package.test.js              # Testes automatizados de integridade do pacote ZIP
│   └── popup-and-validator.test.js  # Testes automatizados de validação e popup
├── PRIVACY.md                # Política de Privacidade e transparência de dados
├── STORE.md                  # Materiais e especificações para submissão na Chrome Web Store
├── manifest.json             # Manifesto de configuração da extensão (V3)
└── README.md                 # Documentação completa do projeto
```

---

## 🚀 Como Instalar em Modo Desenvolvedor

1. Faça o clone deste repositório ou baixe o arquivo ZIP e descompacte:
   ```bash
   git clone https://github.com/Invictor13/Extensao_NewTab-chrome-custom-.git
   ```
2. Abra o Google Chrome e digite na barra de endereços:
   ```text
   chrome://extensions
   ```
3. No canto superior direito da página, ative a opção **"Modo do desenvolvedor"** (Developer mode).
4. Clique no botão **"Carregar sem compactação"** (Load unpacked) no canto superior esquerdo.
5. Selecione a pasta raiz deste repositório.
6. A extensão estará instalada! Fixe o ícone na barra de ferramentas clicando no menu de extensões (ícone de quebra-cabeça).

---

## ⚙️ Guia de Uso: Configurar e Remover um Endereço

### Para configurar um novo endereço:
1. Clique no ícone do **New Tab Custom** na barra de ferramentas do Chrome.
2. No campo **"Endereço do site:"**, digite a URL que deseja abrir em cada nova guia (ex.: `google.com`, `https://notion.so` ou `http://localhost:3000`).
3. Clique no botão **"Salvar"** ou pressione `Enter`.
4. Uma mensagem de confirmação verde será exibida. Abra uma nova guia (`Ctrl + T` ou `Cmd + T`) para ver o redirecionamento imediato em ação!

### Para remover ou restaurar o padrão:
1. Abra o popup da extensão clicando no ícone na barra de ferramentas.
2. Clique no botão **"Restaurar Padrão"**.
3. O endereço salvo será removido da memória do navegador.
4. Ao abrir uma nova guia, você verá a tela inicial elegante e informativa do **New Tab Custom**, com instruções de uso.

---

## 📦 Pacote Oficial de Produção e Distribuição

Para publicar a extensão na Chrome Web Store ou distribuí-la para testes, é necessário utilizar o pacote ZIP oficial de produção — gerado pelo script automatizado do projeto —, e **não** o ZIP de código-fonte fornecido automaticamente pelo GitHub.

### Como gerar o pacote ZIP oficial:

Requisito: **Node.js (v18+)** instalado.

No terminal, a partir da raiz do projeto:
```bash
node scripts/build-package.js
```

### O que o processo realiza:
1. **Leitura dinâmica do `manifest.json`:** Lê e valida o manifesto na raiz, extraindo com precisão a versão oficial (ex.: `1.0.0`).
2. **Filtragem estrita de arquivos:**
   - **Incluídos no ZIP:** `manifest.json` (diretamente na raiz), `assets/`, `newtab/`, `popup/` e `shared/`.
   - **Excluídos do ZIP:** pastas de desenvolvimento (`.git/`, `test/`, `scripts/`, `node_modules/`), arquivos de documentação (`README.md`, `STORE.md`), arquivos ocultos (`.DS_Store`, `Thumbs.db`) e relatórios.
3. **Criação do ZIP:** Gera o arquivo padronizado na pasta `dist/` com a nomenclatura oficial `dist/new-tab-custom-v<versao>.zip` (ex: `dist/new-tab-custom-v1.0.0.zip`).
4. **Validação automática instantânea:**
   - Confirmação de `manifest.json` na raiz do pacote.
   - Verificação de integridade sintática do JSON do manifesto.
   - Confirmação de existência dentro do pacote de todos os arquivos referenciados pelo manifesto (ícones de 16, 48 e 128 px, páginas HTML do popup e newtab, scripts e estilos).
   - Confirmação de ausência total de arquivos de desenvolvimento proibidos.

### Como instalar o pacote ZIP manualmente para testes:
1. Descompacte o arquivo `dist/new-tab-custom-v<versao>.zip` em uma pasta local limpa de sua escolha.
2. Abra o Chrome e navegue até `chrome://extensions`.
3. Ative o **Modo do desenvolvedor** no canto superior direito.
4. Clique em **"Carregar sem compactação"** e selecione a pasta descompactada.
5. Verifique o funcionamento da extensão em ambiente idêntico ao de produção.

---

## 🧪 Testes Automatizados

O projeto conta com uma suíte abrangente de testes automatizados utilizando o test runner nativo do Node.js, sem dependências externas.

### Como executar os testes:

Requisito: **Node.js (v18+)** instalado no ambiente.

No terminal, a partir da raiz do projeto, execute:
```bash
node --test
```

### Cenários cobertos pelos testes:
- Validação e normalização de protocolos (`http`, `https`, e prefixo automático em domínios simples).
- Rejeição estrita de protocolos perigosos (`javascript:`, `data:`, `file:`, `chrome:`).
- Persistência e limpeza via `chrome.storage.local`.
- Redirecionamento automático e comportamento com e sem URL configurada.
- Resiliência contra loops repetidos ou redirecionamentos para a própria página de nova guia.
- Tratamento gracioso de falhas no armazenamento.
- **Geração e integridade do pacote ZIP:** verificação de presença do `manifest.json` na raiz, correspondência de versão, inclusão de todos os arquivos necessários e exclusão estrita de arquivos proibidos.

---

## 📌 Status das Etapas (Roadmap do Projeto)

- [x] **PR01 — Fundação da Extensão New Tab Custom:** Estrutura base Manifest V3, layouts de popup e newtab, ícones verdes e módulo compartilhado.
- [x] **PR02 — Interface de Configuração e Persistência:** Implementação da validação avançada e persistência via `chrome.storage.local`.
- [x] **PR03 — Redirecionamento da Nova Guia:** Redirecionamento automático instantâneo, tela de boas-vindas e proteção contra loops.
- [x] **PR04 — Polimento Final, Documentação e Preparação para Chrome Web Store:** Auditoria técnica completa, aprimoramentos de acessibilidade, documentação expandida e kit de submissão para a loja.
- [x] **PR05 — Refinamento da Experiência de Salvamento e Redirecionamento Instantâneo:** Ajustes de transição, mitigação de flashes de tela e polimento de UX.
- [x] **PR06 — Pacote Oficial de Distribuição e Preparação para Release:** Automação e validação estrita da geração do ZIP oficial de produção (`dist/new-tab-custom-v1.0.0.zip`) sem arquivos de desenvolvimento.
- [x] **PR07 — Auditoria de Conformidade e Preparação para Chrome Web Store:** Auditoria completa e diagnósticos técnicos para a loja.
- [x] **PR08 — Documentação, Política de Privacidade e Preparação dos Materiais da Chrome Web Store:** Criação de `PRIVACY.md`, estruturação de `assets/store/`, revisão de requisitos e refinamento documental.

---

## 🔒 Privacidade

A extensão prioriza a segurança e transparência: os dados são salvos exclusivamente no armazenamento local do navegador do usuário através de `chrome.storage.local`. Não há rastreamento, telemetria, analytics ou envio de dados para servidores externos. Para mais detalhes, consulte a [Política de Privacidade](PRIVACY.md).

---

## 👤 Desenvolvedor

**Victor Ladislau Viana**

- **GitHub:** [https://github.com/Invictor13](https://github.com/Invictor13)
- **LinkedIn:** [https://www.linkedin.com/in/victor-ladislau-14402a170/](https://www.linkedin.com/in/victor-ladislau-14402a170/)

---

## 📄 Licença

Os direitos autorais deste projeto pertencem ao desenvolvedor Victor Ladislau Viana. A definição e formalização dos termos de licença de uso do código-fonte permanecem a critério do proprietário do repositório.
