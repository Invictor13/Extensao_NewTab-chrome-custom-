/**
 * Módulo compartilhado de validação de URL.
 * Centralizará futuramente a lógica de validação de URLs aceitas pela extensão.
 */

const URLValidator = {
  /**
   * Protocolos permitidos.
   */
  ALLOWED_PROTOCOLS: ['http:', 'https:'],

  /**
   * Verifica se uma URL possui protocolo suportado e estrutura válida.
   * (Validação inicial para PR01; aprofundamento na PR02).
   *
   * @param {string} urlString
   * @returns {boolean}
   */
  isValid(urlString) {
    if (!urlString || typeof urlString !== 'string') {
      return false;
    }

    try {
      const parsed = new URL(urlString.trim());
      return this.ALLOWED_PROTOCOLS.includes(parsed.protocol);
    } catch {
      return false;
    }
  },

  /**
   * Normaliza uma string de entrada para URL, adicionando https:// se necessário.
   *
   * @param {string} urlString
   * @returns {string}
   */
  normalize(urlString) {
    if (!urlString || typeof urlString !== 'string') {
      return '';
    }
    const trimmed = urlString.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  }
};

// Suporte para ambiente de navegador e Node.js/testes se aplicável
if (typeof module !== 'undefined' && module.exports) {
  module.exports = URLValidator;
} else if (typeof window !== 'undefined') {
  window.URLValidator = URLValidator;
}
