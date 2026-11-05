/**
 * Módulo compartilhado de validação e normalização de URL.
 * Garante que apenas URLs válidas com protocolo http: ou https: sejam aceitas.
 */

const URLValidator = {
  /**
   * Protocolos permitidos.
   */
  ALLOWED_PROTOCOLS: ['http:', 'https:'],

  /**
   * Normaliza uma string de entrada para URL.
   * Adiciona https:// apenas se nenhum protocolo tiver sido informado.
   * Não converte protocolos alternativos ou perigosos (ex.: javascript:, data:, chrome:) em https://.
   *
   * @param {string} urlString
   * @returns {string}
   */
  normalize(urlString) {
    if (!urlString || typeof urlString !== 'string') {
      return '';
    }

    const trimmed = urlString.trim();
    if (!trimmed) {
      return '';
    }

    // Se já possui http:// ou https://
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    // Se possui qualquer outro esquema/protocolo (ex: javascript:, data:, file:, chrome:)
    // Não devemos adicionar https://, mantemos para que seja devidamente rejeitado
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/i.test(trimmed)) {
      return trimmed;
    }

    // Se começar com barras relativas de protocolo '//'
    if (trimmed.startsWith('//')) {
      return `https:${trimmed}`;
    }

    // Sem protocolo identificado, assume https://
    return `https://${trimmed}`;
  },

  /**
   * Verifica se uma URL possui protocolo suportado (http/https) e estrutura válida.
   * Utiliza a API URL do JavaScript para conformidade e validação rigorosa.
   *
   * @param {string} urlString
   * @returns {boolean}
   */
  isValid(urlString) {
    if (!urlString || typeof urlString !== 'string') {
      return false;
    }

    const trimmed = urlString.trim();
    if (!trimmed) {
      return false;
    }

    const normalized = this.normalize(trimmed);
    if (!normalized) {
      return false;
    }

    try {
      const parsed = new URL(normalized);

      // Apenas http: e https: são aceitos
      if (!this.ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
        return false;
      }

      // O hostname não pode estar vazio nem conter espaços
      if (!parsed.hostname || parsed.hostname.trim() === '' || parsed.hostname.includes(' ')) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
};

// Suporte para ambiente de navegador e Node.js/testes se aplicável
if (typeof module !== 'undefined' && module.exports) {
  module.exports = URLValidator;
} else if (typeof window !== 'undefined') {
  window.URLValidator = URLValidator;
}
