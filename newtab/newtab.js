/**
 * Script de inicialização da página New Tab.
 * (Estrutura base para PR01; redirecionamento automático na PR03).
 */

document.addEventListener('DOMContentLoaded', () => {
  const statusElement = document.getElementById('newtab-status');
  if (statusElement) {
    statusElement.textContent = 'Página de Nova guia ativa (Fundação PR01).';
  }
});
