# Materiais da Ficha da Chrome Web Store — New Tab Custom

Esta pasta é reservada para organizar os ativos gráficos e visuais exigidos ou recomendados para a publicação da extensão **New Tab Custom** no Google Chrome Web Store Developer Dashboard.

---

## 1. Diretrizes para Capturas de Tela (Screenshots)

A Google Chrome Web Store exige no mínimo **1 captura de tela real** (máximo de 5) para permitir a submissão do item para revisão.

### Requisitos Técnicos Oficiais:
- **Dimensão recomendada:** **1280 × 800 pixels** (ou 640 × 400 pixels).
- **Formato:** PNG ou JPEG de alta qualidade.
- **Bordas e Cantos:** Cantos retos (sem cantos arredondados simulados por software gráfico) e sem margens ou barras vazias excessivas (*full bleed*).
- **Autenticidade Obrigatória:**
  - Devem ser **capturas reais** da extensão em execução no navegador Google Chrome.
  - **Não utilizar mockups fictícios, ilustrações conceituais ou imagens que não representem o estado atual da extensão.**

### Sugestão de Organização e Nomenclatura de Arquivos:
1. `screenshot-1-popup.png` (1280 × 800 px)
   - Exibe a janela de popup aberta no canto superior direito do navegador, com o campo de URL preenchido (ex.: `https://google.com`), botão "Salvar" e a notificação de confirmação em verde.
2. `screenshot-2-newtab.png` (1280 × 800 px)
   - Exibe a página de boas-vindas do New Tab Custom aberta na aba inteira (quando nenhuma URL foi configurada ou após restauração), demonstrando o card central elegante, tipografia em tons verdes e o passo a passo de configuração.
3. `screenshot-3-redirect.png` (1280 × 800 px - Opcional)
   - Demonstra a navegação limpa para a página configurada logo após abrir uma nova guia (`Ctrl + T`).

---

## 2. Ícone da Loja (Store Icon)

- **Arquivo Oficial:** `assets/icons/icon128.png` (já incluído no pacote da extensão).
- **Dimensões:** 128 × 128 pixels (com a área da arte centralizada em ~96 × 96 pixels e padding transparente de 16 pixels nas bordas).
- **Formato:** PNG com canal alfa (transparência).

---

## 3. Imagens Promocionais (Promo Tiles)

Ao contrário dos ícones e de pelo menos uma captura de tela, os cartões promocionais **são opcionais** para submeter a extensão na loja. No entanto, fornecer o cartão promocional pequeno é altamente recomendável para que a extensão tenha boa visibilidade nos resultados de busca e nas páginas de categoria da Chrome Web Store.

### 3.1 Small Promo Tile (Pequeno Card Promocional - Opcional):
- **Dimensões Exatas:** **440 × 280 pixels**.
- **Formato:** PNG ou JPEG.
- **Arquivo sugerido nesta pasta:** `promo-small-440x280.png`.
- **Boas Práticas de Design:**
  - Evitar excesso de texto ou fontes pequenas.
  - Utilizar a paleta de cores oficial (tons verdes da identidade visual do projeto e logotipo de `assets/logo.png`).
  - Garantir boa legibilidade e contraste, inclusive quando visualizado em tamanho reduzido.

### 3.2 Marquee Promo Tile (Grande Card Promocional - Opcional):
- **Dimensões Exatas:** **1400 × 560 pixels**.
- **Formato:** PNG ou JPEG.
- **Arquivo sugerido nesta pasta:** `promo-marquee-1400x560.png`.
- Necessário apenas caso se deseje concorrer a destaque editorial nas vitrines principais da loja.

---

## 4. Observação sobre Empacotamento de Produção

Os arquivos armazenados nesta pasta (`assets/store/`) destinam-se exclusivamente ao envio manual pelo desenvolvedor no Developer Console da Chrome Web Store. Eles **não** são empacotados dentro do arquivo ZIP oficial de distribuição da extensão (`dist/new-tab-custom-v<versao>.zip`), mantendo o pacote da extensão enxuto, leve e estritamente restrito aos arquivos de execução em runtime.
