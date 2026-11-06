# Capturas de Tela Oficiais — New Tab Custom

Este diretório contém as capturas de tela reais da extensão **New Tab Custom**, fornecidas pelo proprietário do projeto para fins de documentação, auditoria de interface e submissão na Google Chrome Web Store.

---

## 📸 Arquivos e Conteúdo Demonstrado

### 1. `01-configuracao-url-popup.png`
- **Dimensões:** 314 × 422 pixels (formato PNG, 8-bit RGBA)
- **Tamanho:** ~26 KB
- **Descrição do Conteúdo:**
  - Demonstra a interface visual limpa do popup de configuração da extensão (`popup/popup.html`).
  - Exibe o logotipo oficial centralizado no topo com o título "New Tab Custom" e o subtítulo "Personalize a sua página inicial".
  - O campo de texto ("Endereço do site:") está focado e preenchido com a URL de exemplo: `https://github.com/Invictor13`.
  - Apresenta os dois botões de ação: **"Salvar"** (botão primário verde escuro) e **"Restaurar Padrão"** (botão secundário com contorno suave).
  - Exibe o rodapé com os devidos créditos a **Victor Ladislau Viana** e os links de navegação para GitHub e LinkedIn.

### 2. `02-site-salvo-sucesso.png`
- **Dimensões:** 316 × 424 pixels (formato PNG, 8-bit RGBA)
- **Tamanho:** ~29 KB
- **Descrição do Conteúdo:**
  - Demonstra a reação interativa e o feedback visual de sucesso após o clique no botão "Salvar".
  - Exibe o card de notificação em tons suaves de verde com ícone circular de confirmação (*check*), contendo a mensagem:
    > **Site salvo com sucesso!**
    > Sua nova guia já está configurada.
  - Comprova a execução bem-sucedida da persistência de dados via `chrome.storage.local`.

### 3. `03-nova-guia-personalizada.png`
- **Dimensões:** 1242 × 822 pixels (formato PNG, 8-bit RGBA)
- **Tamanho:** ~515 KB
- **Descrição do Conteúdo:**
  - Demonstra a experiência real da extensão integrada à interface completa do navegador Google Chrome.
  - A janela do navegador exibe uma nova guia que foi redirecionada automaticamente para o endereço configurado (`https://github.com/Invictor13` — página de perfil de Victor Ladislau Viana no GitHub, em modo escuro).
  - No canto superior direito, a janela de popup do New Tab Custom está aberta sobre a página, evidenciando o endereço salvo e a integridade de funcionamento da extensão diretamente em uso prático no navegador.

---

## 🔍 Avaliação Técnica para Chrome Web Store

A Google Chrome Web Store possui requisitos formais específicos para as imagens da ficha do produto:

| Requisito Chrome Web Store | Status das Capturas Atuais | Análise e Recomendações |
| :--- | :--- | :--- |
| **Autenticidade** | ✅ Totalmente autênticas | Capturas reais, sem renderizações fictícias ou mockups 3D simulados. |
| **Formato** | ✅ PNG (8-bit RGBA) | Formato aceito nativamente pela loja (PNG ou JPEG). |
| **Dimensões Recomendadas** | ⚠️ Parcialmente em conformidade | • `01-configuracao-url-popup.png` (314×422 px) e `02-site-salvo-sucesso.png` (316×424 px) focam estritamente na janela do popup.<br>• `03-nova-guia-personalizada.png` possui **1242 × 822 px**, muito próxima da recomendação padrão (**1280 × 800 px**). |

### 💡 Recomendações Técnicas para o Proprietário:
1. **Preservação de Integridade:** As imagens originais foram mantidas 100% intocadas neste repositório, respeitando as restrições éticas de não esticar, cortar ou alterar artificialmente o conteúdo.
2. **Para a Submissão na Chrome Web Store:**
   - A captura `03-nova-guia-personalizada.png` pode ser aceita ou necessitar de leve ajuste de enquadramento da janela do Chrome para atingir exatamente **1280 × 800 pixels**.
   - Para as capturas 01 e 02 (que mostram apenas o popup), o Google recomenda capturar a janela inteira do navegador (em resolução 1280x800 ou 640x400) com o popup aberto no canto superior direito sobre uma página limpa ou de exemplo, para que a loja aprove sem restrições.
