/**
 * Script de inicialização e redirecionamento da página New Tab.
 * Recupera o endereço configurado no chrome.storage.local, valida com URLValidator
 * e redireciona automaticamente ou exibe feedback/instruções funcionais.
 */

(function () {
  const STORAGE_KEY = 'customNewTabUrl';

  /**
   * Obtém a instância do validador compartilhado.
   *
   * @returns {object|null}
   */
  function getValidator() {
    if (typeof window !== 'undefined' && window.URLValidator) {
      return window.URLValidator;
    }
    if (typeof URLValidator !== 'undefined') {
      return URLValidator;
    }
    return null;
  }

  /**
   * Revela a interface visual da New Tab quando necessário (ex.: sem URL configurada, erro ou loop).
   */
  function revealUI(callback) {
    const applyReveal = () => {
      const wrapper = document.querySelector && (document.querySelector('.newtab-wrapper') || document.querySelector('.welcome-card'));
      if (wrapper && wrapper.classList) {
        wrapper.classList.add('visible');
      }
      if (callback) callback();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyReveal, { once: true });
    } else {
      applyReveal();
    }
  }

  /**
   * Exibe mensagens de feedback na página de nova guia e torna a interface visível.
   *
   * @param {string} message - Texto a ser exibido.
   * @param {boolean} isError - Indica se a mensagem deve receber estilo de erro.
   */
  function showStatus(message, isError = false) {
    revealUI(() => {
      const statusElement = document.getElementById('newtab-status');
      if (!statusElement) return;

      statusElement.textContent = message;
      if (isError) {
        statusElement.classList.add('error');
      } else {
        statusElement.classList.remove('error');
      }
    });
  }

  /**
   * Registra uma tentativa de redirecionamento para detecção de loop no sessionStorage.
   */
  function recordRedirectAttempt() {
    try {
      if (typeof sessionStorage === 'undefined') return;
      const count = parseInt(sessionStorage.getItem('newtab_redirect_count') || '0', 10);
      sessionStorage.setItem('newtab_last_redirect_time', Date.now().toString());
      sessionStorage.setItem('newtab_redirect_count', (count + 1).toString());
    } catch {
      // Falhas no sessionStorage não devem impedir a execução
    }
  }

  /**
   * Verifica se sucessivos redirecionamentos ocorreram na mesma aba em curto intervalo.
   *
   * @returns {boolean}
   */
  function isRapidLoopDetected() {
    try {
      if (typeof sessionStorage === 'undefined') return false;
      const lastTime = parseInt(sessionStorage.getItem('newtab_last_redirect_time') || '0', 10);
      const count = parseInt(sessionStorage.getItem('newtab_redirect_count') || '0', 10);
      const now = Date.now();

      if (lastTime && (now - lastTime < 3000) && count >= 1) {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  /**
   * Realiza a navegação/redirecionamento para a URL de destino de forma segura e sem histórico residual.
   *
   * @param {string} targetUrl - URL de destino.
   */
  function redirectTo(targetUrl) {
    recordRedirectAttempt();
    try {
      window.location.replace(targetUrl);
    } catch {
      window.location.href = targetUrl;
    }
  }

  /**
   * Verifica se a URL de destino aponta para a própria página de nova guia,
   * evitando loops infinitos de redirecionamento.
   *
   * @param {string} targetUrl - URL a ser testada.
   * @returns {boolean}
   */
  function isSelfRedirect(targetUrl) {
    try {
      const current = window.location.href;
      const target = new URL(targetUrl, current).href;
      return target === current;
    } catch {
      return false;
    }
  }

  /**
   * Lógica principal de verificação e redirecionamento.
   */
  function handleNewTab() {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      showStatus('Não foi possível acessar as configurações da extensão.', true);
      return;
    }

    try {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          showStatus('Não foi possível ler as configurações da extensão. Verifique as permissões.', true);
          return;
        }

        const savedUrl = result ? result[STORAGE_KEY] : null;

        // Caso 1: Nenhuma URL configurada
        if (!savedUrl || typeof savedUrl !== 'string' || !savedUrl.trim()) {
          showStatus('Nenhum endereço configurado. Use o ícone da extensão para definir.');
          return;
        }

        const trimmedUrl = savedUrl.trim();
        const validator = getValidator();

        // Caso 2: Validador indisponível ou URL inválida/não autorizada
        if (!validator || !validator.isValid(trimmedUrl)) {
          showStatus(
            'O endereço configurado é inválido ou utiliza um protocolo não suportado. Atualize pelo popup da extensão.',
            true
          );
          return;
        }

        const normalizedUrl = validator.normalize(trimmedUrl);

        // Caso 3: Prevenção contra loop de redirecionamento para a própria página
        if (isSelfRedirect(normalizedUrl)) {
          showStatus('O endereço configurado aponta para a própria Nova Guia. Altere o endereço no popup.', true);
          return;
        }

        // Caso 4: Prevenção contra loop rápido/repetido na mesma guia
        if (isRapidLoopDetected()) {
          showStatus('Loop de redirecionamento detectado. O redirecionamento automático foi interrompido.', true);
          return;
        }

        // Caso 5: URL válida - efetuar redirecionamento imediato sem renderizar/exibir a interface
        redirectTo(normalizedUrl);
      });
    } catch {
      showStatus('Ocorreu um erro ao inicializar a Nova Guia. Tente novamente.', true);
    }
  }

  // Executa o mais cedo possível para redirecionar antes de renderizar o DOM.
  // Não aguarda DOMContentLoaded para disparar a busca em chrome.storage.local
  // e redirecionar, garantindo redirecionamento verdadeiramente instantâneo.
  handleNewTab();
})();
