/**
 * Script de inicialização e controle do popup da extensão.
 * Gerencia a entrada do usuário, validação, persistência e feedback via chrome.storage.local.
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'customNewTabUrl';

  const urlInput = document.getElementById('url-input');
  const btnSave = document.getElementById('btn-save');
  const btnClear = document.getElementById('btn-clear');
  const statusMessage = document.getElementById('status-message');

  /**
   * Exibe mensagens de feedback para o usuário.
   *
   * @param {string} text - Texto a ser exibido.
   * @param {boolean} isError - Indica se a mensagem é de erro.
   */
  function showStatus(text, isError = false) {
    if (!statusMessage) return;
    statusMessage.textContent = text;
    if (isError) {
      statusMessage.classList.add('error');
    } else {
      statusMessage.classList.remove('error');
    }
  }

  /**
   * Limpa o feedback de status.
   */
  function clearStatus() {
    if (!statusMessage) return;
    statusMessage.textContent = '';
    statusMessage.classList.remove('error');
  }

  /**
   * Carrega o endereço anteriormente salvo do armazenamento local.
   */
  function loadSavedUrl() {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      return;
    }

    try {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          showStatus('Não foi possível carregar a configuração salva.', true);
          return;
        }

        if (result && result[STORAGE_KEY]) {
          urlInput.value = result[STORAGE_KEY];
        } else {
          urlInput.value = '';
        }
      });
    } catch {
      showStatus('Não foi possível acessar o armazenamento.', true);
    }
  }

  /**
   * Salva o novo endereço após validação e normalização.
   */
  function saveUrl() {
    clearStatus();
    const rawValue = urlInput ? urlInput.value.trim() : '';

    if (!rawValue) {
      showStatus('Por favor, informe um endereço de site.', true);
      if (urlInput) urlInput.focus();
      return;
    }

    const validator = (typeof window !== 'undefined' && window.URLValidator)
      ? window.URLValidator
      : (typeof URLValidator !== 'undefined' ? URLValidator : null);

    if (!validator || !validator.isValid(rawValue)) {
      showStatus('Endereço inválido. Informe um endereço válido (http ou https).', true);
      if (urlInput) urlInput.focus();
      return;
    }

    const normalizedUrl = validator.normalize(rawValue);

    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      showStatus('Erro ao acessar o armazenamento da extensão.', true);
      return;
    }

    try {
      chrome.storage.local.set({ [STORAGE_KEY]: normalizedUrl }, () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          showStatus('Falha ao salvar o endereço no armazenamento.', true);
          return;
        }

        if (urlInput) {
          urlInput.value = normalizedUrl;
        }
        showStatus('Endereço salvo com sucesso!');
      });
    } catch {
      showStatus('Falha ao salvar as configurações.', true);
    }
  }

  /**
   * Remove a configuração personalizada e restaura o padrão.
   */
  function removeUrl() {
    clearStatus();

    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      showStatus('Erro ao acessar o armazenamento da extensão.', true);
      return;
    }

    try {
      chrome.storage.local.remove([STORAGE_KEY], () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          showStatus('Falha ao remover a configuração.', true);
          return;
        }

        if (urlInput) {
          urlInput.value = '';
        }
        showStatus('Configuração removida com sucesso!');
      });
    } catch {
      showStatus('Falha ao atualizar o armazenamento.', true);
    }
  }

  // Event Listeners
  if (btnSave) {
    btnSave.addEventListener('click', saveUrl);
  }

  if (btnClear) {
    btnClear.addEventListener('click', removeUrl);
  }

  if (urlInput) {
    // Permitir salvar ao pressionar Enter no campo de texto
    urlInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        saveUrl();
      }
    });

    // Limpar mensagem de status ao digitar
    urlInput.addEventListener('input', () => {
      if (statusMessage && statusMessage.textContent) {
        clearStatus();
      }
    });
  }

  // Inicialização
  loadSavedUrl();
});
