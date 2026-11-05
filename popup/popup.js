/**
 * Script de inicialização do popup da extensão.
 * (Estrutura base para PR01; persistência completa na PR02).
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('url-input');
  const btnSave = document.getElementById('btn-save');
  const btnClear = document.getElementById('btn-clear');
  const statusMessage = document.getElementById('status-message');

  // Placeholder para PR01: feedback de prontidão da interface
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      if (statusMessage) {
        statusMessage.textContent = 'Estrutura base pronta (PR01). Configuração será ativada no PR02.';
        statusMessage.classList.remove('error');
      }
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (urlInput) {
        urlInput.value = '';
      }
      if (statusMessage) {
        statusMessage.textContent = '';
      }
    });
  }
});
