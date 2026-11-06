/**
 * Script de inicialização e controle do popup da extensão.
 * Gerencia a entrada do usuário, validação, persistência e feedback via chrome.storage.local.
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'customNewTabUrl';

  const urlInput = document.getElementById('url-input');
  const btnSave = document.getElementById('btn-save');
  const btnClear = document.getElementById('btn-clear');
  const statusCard = document.getElementById('status-card');
  const statusIcon = document.getElementById('status-icon');
  const statusTitle = document.getElementById('status-title');
  const statusDesc = document.getElementById('status-desc');
  const statusMessage = document.getElementById('status-message');

  let autoClearTimeout = null;

  const ICONS = {
    success: `
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
      </svg>
    `.trim(),
    error: `
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
      </svg>
    `.trim()
  };

  /**
   * Exibe mensagens de feedback visual refinado para o usuário.
   *
   * @param {string} title - Título principal da notificação.
   * @param {string} [description=''] - Mensagem complementar/secundária.
   * @param {boolean} [isError=false] - Indica se a mensagem é de erro.
   * @param {number} [duration=4500] - Tempo em milissegundos antes do desaparecimento automático (0 = não desaparece).
   */
  function showStatus(title, description = '', isError = false, duration = 4500) {
    if (autoClearTimeout) {
      clearTimeout(autoClearTimeout);
      autoClearTimeout = null;
    }

    if (!statusCard) {
      if (statusMessage) {
        statusMessage.textContent = title + (description ? ` ${description}` : '');
        if (isError) {
          statusMessage.classList.add('error');
        } else {
          statusMessage.classList.remove('error');
        }
      }
      return;
    }

    if (statusTitle) statusTitle.textContent = title;
    if (statusDesc) statusDesc.textContent = description;

    if (statusIcon) {
      statusIcon.innerHTML = isError ? ICONS.error : ICONS.success;
    }

    statusCard.classList.remove('fade-out');
    if (isError) {
      statusCard.classList.remove('success');
      statusCard.classList.add('error');
    } else {
      statusCard.classList.remove('error');
      statusCard.classList.add('success');
    }

    statusCard.classList.add('visible');

    if (duration > 0) {
      autoClearTimeout = setTimeout(() => {
        statusCard.classList.add('fade-out');
        setTimeout(() => {
          clearStatus();
        }, 250);
      }, duration);
    }
  }

  /**
   * Limpa o feedback de status.
   */
  function clearStatus() {
    if (autoClearTimeout) {
      clearTimeout(autoClearTimeout);
      autoClearTimeout = null;
    }

    if (statusCard) {
      statusCard.classList.remove('visible', 'fade-out', 'success', 'error');
    }
    if (statusTitle) statusTitle.textContent = '';
    if (statusDesc) statusDesc.textContent = '';
    if (statusIcon) statusIcon.innerHTML = '';
    if (statusMessage && !statusCard) {
      statusMessage.textContent = '';
      statusMessage.classList.remove('error');
    }
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
          showStatus('Não foi possível carregar a configuração', 'Verifique as permissões de armazenamento.', true);
          return;
        }

        if (result && result[STORAGE_KEY]) {
          urlInput.value = result[STORAGE_KEY];
        } else {
          urlInput.value = '';
        }
      });
    } catch {
      showStatus('Não foi possível carregar a configuração', 'Erro ao acessar o armazenamento local.', true);
    }
  }

  /**
   * Salva o novo endereço após validação e normalização.
   */
  function saveUrl() {
    clearStatus();
    const rawValue = urlInput ? urlInput.value.trim() : '';

    if (!rawValue) {
      showStatus('Por favor, informe um endereço de site.', 'Digite uma URL válida como google.com', true);
      if (urlInput) urlInput.focus();
      return;
    }

    const validator = (typeof window !== 'undefined' && window.URLValidator)
      ? window.URLValidator
      : (typeof URLValidator !== 'undefined' ? URLValidator : null);

    if (!validator || !validator.isValid(rawValue)) {
      showStatus('Endereço inválido', 'Informe um endereço válido utilizando http ou https.', true);
      if (urlInput) urlInput.focus();
      return;
    }

    const normalizedUrl = validator.normalize(rawValue);

    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      showStatus('Erro no armazenamento', 'Não foi possível acessar a extensão.', true);
      return;
    }

    try {
      chrome.storage.local.set({ [STORAGE_KEY]: normalizedUrl }, () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          showStatus('Falha ao salvar', 'Não foi possível registrar o endereço no armazenamento.', true);
          return;
        }

        if (urlInput) {
          urlInput.value = normalizedUrl;
        }
        showStatus('Site salvo com sucesso!', 'Sua nova guia já está configurada.', false);
      });
    } catch {
      showStatus('Falha ao salvar as configurações', 'Tente novamente.', true);
    }
  }

  /**
   * Remove a configuração personalizada e restaura o padrão.
   */
  function removeUrl() {
    clearStatus();

    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      showStatus('Erro no armazenamento', 'Não foi possível acessar a extensão.', true);
      return;
    }

    try {
      chrome.storage.local.remove([STORAGE_KEY], () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          showStatus('Falha ao restaurar', 'Não foi possível remover a configuração.', true);
          return;
        }

        if (urlInput) {
          urlInput.value = '';
        }
        showStatus('Configuração restaurada', 'A nova guia exibirá a página inicial padrão.', false);
      });
    } catch {
      showStatus('Falha ao atualizar o armazenamento', 'Tente novamente.', true);
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
