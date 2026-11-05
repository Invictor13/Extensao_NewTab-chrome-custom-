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

### 4.2 Imagens Promocionais (A serem geradas antes da submissão):
1. **Pequeno Card Promocional (Small Promo Tile - Obrigatório):**
   - Dimensões: **440 x 280 pixels**
   - Formato: PNG ou JPEG
   - Conteúdo sugerido: Fundo em gradiente suave verde (#e8f5e9 a #ffffff), logotipo centralizado do New Tab Custom e título legível.
2. **Grande Card Promocional (Marquee Promo Tile - Opcional, recomendado para destaque):**
   - Dimensões: **1400 x 560 pixels**
   - Formato: PNG ou JPEG

### 4.3 Sugestões de Capturas de Tela (Screenshots):
A loja exige no mínimo 1 e permite até 5 capturas de tela.
- **Dimensões recomendadas:** **1280 x 800 pixels** (ou **640 x 400 pixels**), sem cantos arredondados e sem barras de rolagem desnecessárias.
- **Screenshot 1 — Interface do Popup:**
  - Mostra a caixa de diálogo de configuração com um endereço preenchido (ex.: `https://google.com`), botão "Salvar" e mensagem de sucesso em verde.
- **Screenshot 2 — Tela Alternativa da Nova Guia (Sem URL configurada):**
  - Mostra o card de boas-vindas centralizado da página `newtab.html`, com as instruções elegantes de configuração passo a passo.
- **Screenshot 3 — Exemplo de Redirecionamento em Ação:**
  - Demonstração do navegador abrindo instantaneamente o site configurado na nova aba.

---

## 5. Checklist de Submissão

Antes de publicar na Chrome Web Store, certifique-se de cumprir todas as etapas:

- [ ] **Conta de Desenvolvedor:** Possuir uma conta registrada no [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) (taxa única de inscrição de $5 paga ao Google).
- [ ] **Empacotamento ZIP:**
  - Gerar o arquivo ZIP contendo apenas os arquivos essenciais de execução (`manifest.json`, `assets/`, `newtab/`, `popup/`, `shared/`).
  - Não incluir pastas de testes (`test/`), `.git/`, ou arquivos `.md` no arquivo ZIP enviado para a loja.
  - Comando sugerido:
    ```bash
    zip -r new-tab-custom-v1.0.0.zip manifest.json assets newtab popup shared
    ```
- [ ] **Testes Locais:** Verificar que o arquivo descompactado carrega em modo desenvolvedor sem erros no console.
- [ ] **Ficha do Produto:**
  - Inserir Nome, Descrição Curta (<= 132 chars) e Descrição Detalhada deste documento.
  - Fazer upload do ícone de 128x128 px.
  - Fazer upload de pelo menos 1 screenshot (1280x800 px) e do card promocional (440x280 px).
- [ ] **Aba de Privacidade:**
  - Selecionar a categoria correta ("Produtividade").
  - Declarar a justificativa para a permissão `storage`.
  - Confirmar que a extensão não coleta dados do usuário e está em conformidade com as políticas de Single Purpose da Google.
- [ ] **Revisão e Envio:** Clicar em "Submit for Review" (Enviar para análise).
