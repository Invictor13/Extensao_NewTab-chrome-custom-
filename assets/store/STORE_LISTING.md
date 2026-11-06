# Ficha Oficial da Chrome Web Store — New Tab Custom

Este documento reúne todo o material textual, metadados, justificativas de privacidade e especificações gráficas preparados para a submissão e publicação da extensão **New Tab Custom** na Google Chrome Web Store.

---

## 1. Identidade e Metadados do Produto

- **Nome da Extensão:** New Tab Custom
- **Slogan Oficial:** Sua nova guia, do seu jeito.
- **Desenvolvedor:** Victor Ladislau Viana
- **GitHub:** [https://github.com/Invictor13](https://github.com/Invictor13)
- **LinkedIn:** [https://www.linkedin.com/in/victor-ladislau-14402a170/](https://www.linkedin.com/in/victor-ladislau-14402a170/)
- **Licença do Código-Fonte:** MIT (conforme arquivo `LICENSE` no repositório)
- **Versão:** 1.0.0
- **Idioma Principal:** Português (Brasil) — `pt-BR`
- **Preço:** Gratuito (sem compras no aplicativo ou assinaturas)

### Categoria Selecionada
- **Categoria Principal Recomendada:** **Produtividade** (*Productivity*)
  - **Justificativa:** O propósito central da extensão é otimizar o fluxo de trabalho do usuário, permitindo acesso imediato aos sites, buscadores, dashboards ou intranets que ele utiliza com frequência a cada nova guia aberta, sem etapas intermediárias.
- **Categoria Secundária (Alternativa):** **Ferramentas de Pesquisa** (*Search Tools*) ou **Fluxo de Trabalho e Planejamento** (*Workflow & Planning*).

---

## 2. Textos do Listing da Chrome Web Store

### 2.1 Nome do Item
```text
New Tab Custom
```

### 2.2 Descrição Curta (Resumo — máximo 132 caracteres)
> Sua nova guia, do seu jeito.

*(Versão alternativa para o limite de 132 caracteres:)*
> Personalize a sua página de Nova guia do Google Chrome com qualquer endereço de site de forma rápida, leve e elegante.

*(Contagem de caracteres com espaços: 115 caracteres — 100% dentro do limite máximo de 132 caracteres estabelecido pela Chrome Web Store).*

### 2.3 Descrição Completa (Store Listing Description)

```text
Personalize a sua página de Nova guia do Google Chrome com qualquer endereço de site de sua preferência de forma rápida, leve e elegante.

O New Tab Custom é uma extensão desenvolvida para oferecer controle direto sobre a sua experiência ao abrir uma nova guia. Seja para acessar instantaneamente seu buscador favorito, seu painel de tarefas, seu ambiente de documentação ou o ambiente de desenvolvimento local, a extensão redireciona a navegação de forma automática e transparente.

Principais Recursos:
• Personalização do endereço da nova guia: defina qualquer endereço web para ser carregado automaticamente ao abrir uma nova aba.
• Configuração simples: acesse o popup da extensão na barra de ferramentas a qualquer momento para informar, alterar ou consultar o endereço configurado.
• Persistência local da URL: seu endereço fica salvo exclusivamente no navegador do seu dispositivo por meio da API oficial chrome.storage.local.
• Experiência leve e direta: redirecionamento imediato utilizando APIs nativas do navegador, sem scripts pesados, sem atrasos perceptíveis e com consumo mínimo de memória.
• Sem necessidade de criar conta: instale e comece a usar imediatamente, sem cadastros, formulários de login ou assinaturas.
• Validação inteligente: ao informar domínios como "google.com", a extensão normaliza o endereço de forma segura com o protocolo HTTPS.
• Suporte a desenvolvimento local: compatível com endereços locais e portas personalizadas (como http://localhost:3000).
• Restauração em um clique: o botão "Restaurar Padrão" remove o endereço configurado e retorna a extensão ao estado original sempre que desejar.

Como Usar:
1. Clique no ícone do New Tab Custom na barra de ferramentas do Google Chrome.
2. No campo "Endereço do site:", digite a URL desejada (exemplo: google.com ou https://notion.so).
3. Clique em "Salvar" ou pressione a tecla Enter.
4. Abra uma nova guia (Ctrl+T ou Cmd+T) e aproveite a sua navegação personalizada.

Desenvolvido com tecnologia moderna Manifest V3 e foco total em leveza e transparência.
```

*Nota de Conformidade: Todos os recursos mencionados acima correspondem estritamente à implementação existente no código (`popup/popup.js`, `newtab/newtab.js`, `shared/url-validator.js`). Não foram utilizadas expressões proibidas ou exageradas como "segurança absoluta", "privacidade garantida" ou "a melhor extensão do mercado".*

---

## 3. Práticas de Privacidade (Aba Privacy no Developer Dashboard)

### 3.1 Declaração de Propósito Único (Single Purpose)
> O New Tab Custom tem a finalidade única de permitir que o usuário configure e personalize o endereço de site (URL) que será aberto automaticamente sempre que uma nova guia for iniciada no Google Chrome.

### 3.2 Justificativa de Permissões Solicitadas

| Permissão Declarada | Justificativa Obrigatória para o Painel |
| :--- | :--- |
| `storage` | A permissão `storage` é utilizada exclusivamente para armazenar localmente no dispositivo do usuário, através de `chrome.storage.local`, a chave `customNewTabUrl` contendo a URL configurada pelo próprio usuário. Essa permissão é essencial para manter a preferência salva entre sessões de navegação. |
| `chrome_url_overrides.newtab` | Recurso nativo do manifesto utilizado estritamente para substituir a página padrão de Nova Guia pela página funcional da extensão (`newtab/newtab.html`), que executa a navegação para a URL configurada pelo usuário. |

### 3.3 Questionário de Práticas de Dados da Chrome Web Store
- **A extensão coleta dados pessoais do usuário?**
  **Não.** A extensão não coleta nomes, e-mails, endereços, senhas, CPF/documentos, telefones ou identificadores do dispositivo.
- **A extensão rastreia a navegação do usuário?**
  **Não.** A extensão não lê abas abertas, histórico de navegação, cookies de terceiros ou termos de busca.
- **A extensão envia dados para servidores externos ou serviços de telemetria?**
  **Não.** A extensão não utiliza APIs remotas, não executa chamadas de rede (`fetch`, `XMLHttpRequest`, `WebSocket`) e não possui ferramentas de telemetria ou analytics (como Google Analytics).
- **A extensão faz uso de código hospedado remotamente?**
  **Não** (*"No, I am not using remote code"*). Todo o código JavaScript, HTML e CSS é empacotado localmente dentro da extensão, em conformidade com as diretrizes do Manifest V3.
- **URL da Política de Privacidade:**
  Deverá apontar para a versão publicada online de `PRIVACY.md` (por exemplo, na página do repositório no GitHub ou GitHub Pages do projeto).

---

## 4. Materiais Gráficos e Visuais

### 4.1 Ícones da Extensão (Já validados no repositório)
- `assets/icons/icon16.png` — 16 × 16 pixels (favicons, menus contextuais).
- `assets/icons/icon48.png` — 48 × 48 pixels (gerenciador de extensões do Chrome).
- `assets/icons/icon128.png` — 128 × 128 pixels (ícone da extensão na Chrome Web Store).

### 4.2 Capturas de Tela Oficiais (Screenshots Reais)
Localizadas em `assets/store/screenshots/`:
1. `01-configuracao-url-popup.png` (314 × 422 pixels): Demonstração da interface do popup com o campo preenchido e botões de ação.
2. `02-site-salvo-sucesso.png` (316 × 424 pixels): Feedback de sucesso exibindo a notificação "Site salvo com sucesso! Sua nova guia já está configurada.".
3. `03-nova-guia-personalizada.png` (1242 × 822 pixels): Nova guia aberta no navegador com a página configurada carregada e o popup de gerenciamento em primeiro plano.

Consulte `assets/store/screenshots/README.md` para a análise técnica completa das dimensões e orientações para a submissão.

### 4.3 Materiais Promocionais (Promo Tiles — Opcionais)
A Google Chrome Web Store não obriga o envio de cartões promocionais para submissão simples, porém eles são altamente recomendados para destaque visual na loja.

#### Small Promo Tile (Pequeno Card Promocional - Opcional):
- **Status:** Opcional (não incluso na PR; orientações fornecidas).
- **Dimensões Obrigatórias da Loja:** **440 × 280 pixels**.
- **Formato:** PNG ou JPEG de alta definição.
- **Diretrizes de Criação:**
  - Fundo limpo utilizando a paleta de tons verdes da identidade visual do projeto (`#1b5e20`, `#2e7d32`, `#e8f5e9` e branco).
  - Logotipo oficial centralizado (baseado em `assets/logo.png`).
  - Tipografia nítida com o nome "New Tab Custom" e o slogan "Sua nova guia, do seu jeito".
  - Evitar excesso de texto ou detalhes gráficos miúdos que percam legibilidade em telas pequenas.

#### Marquee Promo Tile (Grande Card Promocional - Opcional):
- **Status:** Opcional.
- **Dimensões Obrigatórias da Loja:** **1400 × 560 pixels**.
- **Formato:** PNG ou JPEG.
- **Diretrizes de Criação:** Utilizado exclusivamente pela curadoria editorial do Google caso a extensão seja indicada a destaque nas páginas de topo da Chrome Web Store.

---

## 5. Checklist de Publicação para o Desenvolvedor

Antes de submeter a extensão no Developer Dashboard, complete os seguintes passos:

1. **Conta de Desenvolvedor:**
   - Possuir registro ativo no [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole).
   - Verificação em duas etapas (2FA) configurada na conta Google associada.
2. **Geração do Pacote:**
   - Gerar o pacote oficial com `node scripts/build-package.js`.
   - Confirmar a integridade em `dist/new-tab-custom-v1.0.0.zip`.
3. **Upload do Pacote:**
   - Na aba "Package" do painel, fazer o upload do arquivo ZIP oficial gerado.
4. **Preenchimento da Ficha da Loja:**
   - Copiar o Nome, Descrição Curta e Descrição Completa presentes na Seção 2 deste documento.
   - Selecionar a Categoria "Produtividade".
   - Definir o idioma principal como "Português (Brasil)".
   - Fazer o upload do ícone de 128x128 px (`assets/icons/icon128.png`).
   - Fazer o upload de pelo menos uma captura de tela (recomendada `03-nova-guia-personalizada.png` ou novas capturas em 1280x800 px).
5. **Preenchimento das Declarações de Privacidade:**
   - Inserir a declaração de propósito único (Seção 3.1).
   - Inserir a justificativa técnica para a permissão `storage` (Seção 3.2).
   - Declarar que não utiliza código remoto.
   - Fornecer a URL pública de `PRIVACY.md`.
6. **Envio para Revisão:**
   - Clicar em "Submit for Review".
