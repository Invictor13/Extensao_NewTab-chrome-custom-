# Materiais da Ficha da Chrome Web Store — New Tab Custom

Esta pasta reúne e organiza os materiais visuais, capturas de tela e a documentação textual necessários para a publicação da extensão **New Tab Custom** na Google Chrome Web Store.

---

## 📂 Estrutura desta Pasta

```text
assets/store/
├── screenshots/                     # Capturas de tela reais da extensão
│   ├── 01-configuracao-url-popup.png   # Popup da extensão com URL informada
│   ├── 02-site-salvo-sucesso.png       # Popup com feedback de sucesso
│   ├── 03-nova-guia-personalizada.png  # Nova guia aberta no navegador com site configurado
│   └── README.md                       # Detalhamento técnico de cada captura e resoluções
├── README.md                        # Este documento explicativo
└── STORE_LISTING.md                 # Ficha oficial e textos completos para a Chrome Web Store
```

---

## 1. Ficha Oficial da Loja

O documento principal para preenchimento do Developer Dashboard encontra-se em:
👉 **[`STORE_LISTING.md`](./STORE_LISTING.md)**

Nele constam:
- Nome oficial, slogan e descrição curta.
- Descrição completa detalhada em Português do Brasil.
- Justificativa da categoria (**Produtividade**).
- Respostas para a aba de privacidade e justificativas de permissões (`storage`).
- Checklist de submissão do desenvolvedor.

---

## 2. Capturas de Tela (Screenshots)

As capturas de tela reais fornecidas pelo proprietário estão organizadas em **[`screenshots/`](./screenshots/)**:

1. **`01-configuracao-url-popup.png`** (314 × 422 px): Visualização do popup da extensão com endereço preenchido.
2. **`02-site-salvo-sucesso.png`** (316 × 424 px): Feedback visual de confirmação do salvamento em `chrome.storage.local`.
3. **`03-nova-guia-personalizada.png`** (1242 × 822 px): Experiência completa do navegador com a nova guia redirecionada.

Consulte o documento **[`screenshots/README.md`](./screenshots/README.md)** para orientações técnicas sobre resoluções e conformidade com as regras da loja.

---

## 3. Ícone da Loja (Store Icon)

- **Arquivo Oficial:** `assets/icons/icon128.png` (já incluído no pacote da extensão).
- **Dimensões:** 128 × 128 pixels (com a arte centralizada e fundo transparente).
- **Formato:** PNG com canal alfa (transparência).

---

## 4. Imagens Promocionais (Promo Tiles — Opcionais)

As imagens promocionais não são obrigatórias para submissão, mas aumentam o destaque da extensão na loja:

- **Small Promo Tile (Pequeno Card Promocional - Opcional):**
  - Dimensões: **440 × 280 pixels**.
  - Formato: PNG ou JPEG.
  - Conteúdo recomendado: Paleta de tons verdes da identidade visual, logotipo oficial (`assets/logo.png`), nome "New Tab Custom" e o slogan "Sua nova guia, do seu jeito".
- **Marquee Promo Tile (Grande Card Promocional - Opcional):**
  - Dimensões: **1400 × 560 pixels**.
  - Necessário apenas caso se deseje concorrer a destaque editorial nas vitrines principais da loja.

---

## 5. Observação sobre Empacotamento de Produção

Os arquivos armazenados nesta pasta (`assets/store/`) destinam-se exclusivamente ao envio manual pelo desenvolvedor no Developer Console da Chrome Web Store. Eles são automaticamente excluídos do pacote oficial de distribuição (`dist/new-tab-custom-v<versao>.zip`) pelo script `scripts/build-package.js`, mantendo o pacote da extensão enxuto, leve e estritamente restrito aos arquivos de execução em runtime.
