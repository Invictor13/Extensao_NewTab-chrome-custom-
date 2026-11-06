# Preparação para Chrome Web Store — New Tab Custom

Este documento reúne todas as informações, textos comerciais, requisitos de design, justificativas de permissões e o checklist detalhado necessário para a submissão e publicação da extensão **New Tab Custom** no [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

> **Atenção:** Os materiais textuais e específicos da ficha da loja estão centralizados no arquivo oficial:
> 👉 **[`assets/store/STORE_LISTING.md`](assets/store/STORE_LISTING.md)**.
> As capturas de tela reais e suas análises técnicas encontram-se em:
> 👉 **[`assets/store/screenshots/`](assets/store/screenshots/)**.

---

## 1. Dados Principais da Extensão

- **Nome Comercial / Oficial:** New Tab Custom
- **Slogan:** Sua nova guia, do seu jeito.
- **Categoria sugerida:** Produtividade (*Productivity*)
  - *Justificativa:* Otimiza o fluxo de trabalho do usuário ao abrir automaticamente sites ou ferramentas prioritárias em cada nova guia aberta.
- **Idioma principal:** Português (Brasil) — `pt-BR`
- **Público-alvo:** Usuários que desejam definir uma página inicial customizada ao abrir uma nova guia no Google Chrome.
- **Preço:** Gratuito
- **Licença do Código-Fonte:** [MIT](LICENSE) (Nota: refere-se à licença do código aberto do repositório, não substituindo nem interferindo nos termos de distribuição e uso da Chrome Web Store).

---

## 2. Textos para a Ficha na Chrome Web Store

### 2.1 Descrição Curta (Resumo — máximo 132 caracteres)
> Sua nova guia, do seu jeito.

*(Versão alternativa para o limite de 132 caracteres:)*
> Personalize a sua página de Nova guia do Google Chrome com qualquer endereço de site de forma rápida, leve e elegante.

*(Contagem: 115 caracteres com espaços — dentro do limite máximo de 132 caracteres permitido pela Chrome Web Store).*

### 2.2 Descrição Detalhada

A descrição detalhada completa, refinada sem termos exagerados ou funcionalidades fictícias, está documentada em [`assets/store/STORE_LISTING.md`](assets/store/STORE_LISTING.md#23-descrição-completa-store-listing-description).

Destaques reais da extensão:
- Personalização do endereço da nova guia.
- Configuração simples via popup.
- Persistência local da URL via `chrome.storage.local`.
- Experiência leve e direta.
- Sem necessidade de criar conta.
- Validação automática de domínios com HTTPS.
- Suporte para desenvolvimento local (`localhost`).
- Botão "Restaurar Padrão" em um clique.

---

## 3. Justificativa de Permissões (Chrome Web Store Developer Privacy Policy)

Ao submeter a extensão, o Google Developer Dashboard solicitará a justificativa de uso de cada permissão declarada no `manifest.json`:

| Permissão | Justificativa Obrigatória para o Painel |
| :--- | :--- |
| `storage` | A permissão `storage` é utilizada exclusivamente para armazenar localmente no dispositivo do usuário a chave `customNewTabUrl`, que contém o endereço do site definido pelo próprio usuário para ser carregado na Nova Guia. Nenhum dado é compartilhado ou enviado a servidores externos. |
| `chrome_url_overrides (newtab)` | O recurso `chrome_url_overrides.newtab` é o propósito central da extensão, permitindo substituir a página padrão de Nova Guia pela página configurada pelo usuário. |

### Práticas de Privacidade (Single Purpose):
- **Coleta de dados:** Nenhuma informação pessoal ou de identificação do usuário é coletada, transmitida ou vendida.
- **Conexões externas:** A extensão não realiza chamadas a APIs de analytics, servidores remotos ou anunciantes.
- **Código remoto:** Não há execução de código hospedado remotamente.

---

## 4. Material Visual e Especificações Gráficas

### 4.1 Ícones do Pacote (Já presentes no repositório):
- `assets/icons/icon16.png` — 16x16 px (Exibição em favicons e menus)
- `assets/icons/icon48.png` — 48x48 px (Exibição na página `chrome://extensions`)
- `assets/icons/icon128.png` — 128x128 px (Ícone principal para o Chrome Web Store e instalação)
- `assets/logo.png` — Imagem oficial de apresentação do logotipo e nome New Tab Custom.

### 4.2 Imagens Promocionais (Materiais Opcionais):
As imagens promocionais não são obrigatórias para submissão, mas fornecem destaque e melhor visualização na loja:
1. **Pequeno Card Promocional (Small Promo Tile - Opcional, recomendado para catálogo):**
   - Dimensões: **440 x 280 pixels**
   - Formato: PNG ou JPEG
   - Conteúdo sugerido: Fundo em tons verdes, logotipo centralizado do New Tab Custom e título legível.
2. **Grande Card Promocional (Marquee Promo Tile - Opcional, recomendado para destaque editorial):**
   - Dimensões: **1400 x 560 pixels**
   - Formato: PNG ou JPEG

### 4.3 Capturas de Tela (Screenshots Reais):
As capturas de tela autênticas fornecidas pelo desenvolvedor estão armazenadas em `assets/store/screenshots/`:
- `01-configuracao-url-popup.png` (314 × 422 px)
- `02-site-salvo-sucesso.png` (316 × 424 px)
- `03-nova-guia-personalizada.png` (1242 × 822 px)

> **Status Técnico das Capturas:**
> - As imagens originais foram mantidas 100% autênticas e sem qualquer redimensionamento artificial.
> - As imagens `01-configuracao-url-popup.png` (314×422 px) e `02-site-salvo-sucesso.png` (316×424 px) focam exclusivamente no popup e **não estão prontas** para upload direto como screenshots principais da Chrome Web Store, pois a loja exige capturas da janela do navegador (1280×800 ou 640×400 px).
> - A imagem `03-nova-guia-personalizada.png` (1242×822 px) também **precisa de adequação técnica** de resolução para se enquadrar perfeitamente no formato aceito (1280×800 px) antes da submissão final.
> - Detalhes e orientações completas em [`assets/store/screenshots/README.md`](assets/store/screenshots/README.md).

---

## 5. Checklist de Submissão

Antes de publicar na Chrome Web Store, certifique-se de cumprir todas as etapas:

- [ ] **Conta de Desenvolvedor:** Possuir uma conta registrada no [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) (taxa única de inscrição de $5 paga ao Google) e verificação em duas etapas (2FA) ativada.
- [ ] **Empacotamento ZIP:**
  - Gerar o arquivo ZIP oficial de produção executando o script automatizado do projeto:
    ```bash
    node scripts/build-package.js
    ```
  - O script criará o pacote em `dist/new-tab-custom-v<versao>.zip` (ex.: `dist/new-tab-custom-v1.0.0.zip`) contendo apenas os arquivos essenciais de execução (`manifest.json` diretamente na raiz, `assets/icons/`, `assets/logo.png`, `newtab/`, `popup/` e `shared/`). A pasta `assets/store/` é excluída automaticamente do pacote.
  - **Atenção:** Nunca faça upload do arquivo ZIP gerado automaticamente pelo GitHub (Download ZIP do repositório), pois este contém arquivos de teste, documentação e metadados que violam ou incham os limites da Chrome Web Store.
  - O script executa automaticamente a validação de integridade do ZIP.
- [ ] **Testes Locais com o Pacote Gerado:**
  - Descompacte o ZIP gerado em uma pasta temporária.
  - No Chrome, acesse `chrome://extensions` e use "Carregar sem compactação" apontando para a pasta descompactada.
  - Verifique que o ícone, o popup e o redirecionamento da nova guia funcionam perfeitamente sem erros no console.
- [ ] **Upload no Chrome Web Store Developer Dashboard:**
  - No dashboard da extensão, navegue até a aba **Pacote** (Package).
  - Faça o upload do arquivo `dist/new-tab-custom-v<versao>.zip`.
  - Confirme que a versão detectada pelo painel coincide com a versão pretendida (ex: 1.0.0).
- [ ] **Ficha do Produto (Store Listing):**
  - Inserir Nome, Descrição Curta (<= 132 chars) e Descrição Completa conforme [`assets/store/STORE_LISTING.md`](assets/store/STORE_LISTING.md).
  - Fazer upload do ícone de 128x128 px (`assets/icons/icon128.png`).
  - Fazer upload das capturas de tela finais adequadas à resolução exigida (1280x800 px).
  - (Opcional) Fazer upload do card promocional pequeno (440x280 px).
- [ ] **Aba de Privacidade (Privacy Practices):**
  - Selecionar a categoria "Produtividade".
  - Preencher a descrição de propósito único (*Single Purpose*).
  - Declarar a justificativa para a permissão `storage`.
  - Confirmar que não há execução de código remoto (*"No, I am not using remote code"*).
  - Confirmar a política de dados: a extensão utiliza apenas armazenamento local (`chrome.storage.local`) e não coleta nem transmite dados pessoais a servidores externos, em conformidade com [PRIVACY.md](PRIVACY.md).
  - Informar a URL pública da Política de Privacidade.
- [ ] **Revisão e Envio:** Clicar em "Submit for Review" (Enviar para análise).
