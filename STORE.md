# Preparação para Chrome Web Store — New Tab Custom

Este documento reúne todas as informações, textos comerciais, requisitos de design, justificativas de permissões e o checklist detalhado necessário para a submissão e publicação da extensão **New Tab Custom** no [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

---

## 1. Dados Principais da Extensão

- **Nome Comercial / Oficial:** New Tab Custom
- **Categoria sugerida:** Produtividade (*Productivity*) ou Ferramentas de Pesquisa (*Search Tools*)
- **Idioma principal:** Português (Brasil) — `pt-BR`
- **Público-alvo:** Usuários que desejam definir uma página inicial customizada ao abrir uma nova guia no Google Chrome.
- **Preço:** Gratuito

---

## 2. Textos para a Ficha na Chrome Web Store

### 2.1 Descrição Curta (Resumo — máximo 132 caracteres)
> Personalize a sua página de Nova guia do Google Chrome com qualquer endereço de site de forma rápida, leve e elegante.

*(Contagem: 115 caracteres com espaços — dentro do limite máximo de 132 caracteres permitido pela Chrome Web Store).*

### 2.2 Descrição Detalhada

```text
Defina facilmente qualquer site como sua página inicial ao abrir uma Nova Guia no Google Chrome!

O New Tab Custom é uma extensão minimalista, rápida e elegante criada para oferecer total liberdade sobre a sua experiência de navegação. Abra seu buscador preferido, dashboard de trabalho, painel de anotações ou intranet instantaneamente a cada nova guia.

Principais Recursos:
⚡ Redirecionamento Instantâneo: Abre o endereço configurado sem telas intermediárias ou atrasos perceptíveis.
🎨 Visual Elegante e Minimalista: Interface limpa com design moderno em tons verdes, focada em simplicidade e usabilidade.
🔒 Segurança e Privacidade Total: Sem rastreadores, sem telemetria e sem coleta de dados. Seu endereço configurado fica salvo exclusivamente na memória local do seu próprio navegador.
⚙️ Validação Inteligente: Digite domínios simples como "google.com" e a extensão normaliza automaticamente com segurança para HTTPS.
💻 Suporte para Desenvolvedores: Aceita servidores locais e portas customizadas (ex: http://localhost:3000).
🔄 Restaurar Padrão: Remova a URL a qualquer momento com apenas um clique.

Como Funciona:
1. Instale a extensão e clique no ícone do New Tab Custom na barra de ferramentas.
2. Digite o endereço do site que você deseja abrir (ex: https://notion.so, google.com ou seu painel de tarefas).
3. Clique em "Salvar".
4. Pronto! Sempre que você abrir uma nova guia, ela será carregada diretamente no endereço escolhido.

Desenvolvido com foco em desempenho (Manifest V3 e zero dependências pesadas).
```

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

---

## 4. Material Visual e Especificações Gráficas

A Chrome Web Store requer os seguintes ativos visuais para aprovação:

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
   - Conteúdo sugerido: Fundo em gradiente suave verde (#e8f5e9 a #ffffff), logotipo centralizado do New Tab Custom e título legível.
2. **Grande Card Promocional (Marquee Promo Tile - Opcional, recomendado para destaque editorial):**
   - Dimensões: **1400 x 560 pixels**
   - Formato: PNG ou JPEG

### 4.3 Capturas de Tela (Screenshots - Obrigatório pelo menos 1):
A loja exige no mínimo 1 e permite até 5 capturas de tela reais da extensão.
- **Dimensões recomendadas:** **1280 x 800 pixels** (ou **640 x 400 pixels**), sem cantos arredondados artificiais e sem barras de rolagem desnecessárias.
- **Autenticidade:** Devem ser capturas reais da extensão em funcionamento no Chrome. Não utilizar mockups fictícios.
- **Screenshot 1 — Interface do Popup:**
  - Mostra a caixa de diálogo de configuração com um endereço preenchido (ex.: `https://google.com`), botão "Salvar" e mensagem de sucesso em verde.
- **Screenshot 2 — Tela Alternativa da Nova Guia (Sem URL configurada):**
  - Mostra o card de boas-vindas centralizado da página `newtab.html`, com as instruções elegantes de configuração passo a passo.
- **Screenshot 3 — Exemplo de Redirecionamento em Ação:**
  - Demonstração do navegador abrindo o site configurado na nova aba.

As diretrizes detalhadas de organização dos arquivos visuais da loja encontram-se em `assets/store/README.md`.

---

## 5. Checklist de Submissão

Antes de publicar na Chrome Web Store, certifique-se de cumprir todas as etapas:

- [ ] **Conta de Desenvolvedor:** Possuir uma conta registrada no [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) (taxa única de inscrição de $5 paga ao Google) e verificação em duas etapas (2FA) ativada.
- [ ] **Empacotamento ZIP:**
  - Gerar o arquivo ZIP oficial de produção executando o script automatizado do projeto:
    ```bash
    node scripts/build-package.js
    ```
  - O script criará o pacote em `dist/new-tab-custom-v<versao>.zip` (ex.: `dist/new-tab-custom-v1.0.0.zip`) contendo apenas os arquivos essenciais de execução (`manifest.json` diretamente na raiz, `assets/`, `newtab/`, `popup/` e `shared/`).
  - **Atenção:** Nunca faça upload do arquivo ZIP gerado automaticamente pelo GitHub (Download ZIP do repositório), pois este contém arquivos de teste, documentação e metadados que violam ou incham os limites da Chrome Web Store.
  - O script executa automaticamente a validação de integridade do ZIP (presença dos ícones, páginas e consistência com a versão do manifest).
- [ ] **Testes Locais com o Pacote Gerado:**
  - Descompacte o ZIP gerado em uma pasta temporária.
  - No Chrome, acesse `chrome://extensions` e use "Carregar sem compactação" apontando para a pasta descompactada.
  - Verifique que o ícone, o popup e o redirecionamento da nova guia funcionam perfeitamente sem erros no console.
- [ ] **Upload no Chrome Web Store Developer Dashboard:**
  - No dashboard da extensão, navegue até a aba **Pacote** (Package).
  - Faça o upload do arquivo `dist/new-tab-custom-v<versao>.zip`.
  - Confirme que a versão detectada pelo painel coincide com a versão pretendida (ex: 1.0.0).
- [ ] **Como Preparar Versões Futuras:**
  - Para lançar uma nova versão (ex.: 1.0.1 ou 1.1.0):
    1. Atualize o campo `"version"` no `manifest.json`.
    2. Execute `node scripts/build-package.js`.
    3. O script criará automaticamente `dist/new-tab-custom-v<nova-versao>.zip` e executará todas as validações de integridade.
    4. Submeta o novo arquivo ZIP no Developer Dashboard.
- [ ] **Ficha do Produto (Store Listing):**
  - Inserir Nome, Descrição Curta (<= 132 chars) e Descrição Detalhada deste documento.
  - Fazer upload do ícone de 128x128 px (`assets/icons/icon128.png`).
  - Fazer upload de pelo menos 1 screenshot real (1280x800 px).
  - (Opcional) Fazer upload do card promocional pequeno (440x280 px).
- [ ] **Aba de Privacidade (Privacy Practices):**
  - Selecionar a categoria correta ("Produtividade").
  - Preencher a descrição de propósito único (*Single Purpose*).
  - Declarar a justificativa para a permissão `storage`.
  - Confirmar que não há execução de código remoto (*"No, I am not using remote code"*).
  - Confirmar a política de dados: a extensão utiliza apenas armazenamento local (`chrome.storage.local`) e não coleta nem transmite dados pessoais a servidores externos, em conformidade com [PRIVACY.md](PRIVACY.md).
  - Informar a URL pública da Política de Privacidade.
- [ ] **Revisão e Envio:** Clicar em "Submit for Review" (Enviar para análise).
