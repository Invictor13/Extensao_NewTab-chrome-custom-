import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import URLValidator from '../shared/url-validator.js';

test('URLValidator: accepts valid URLs and normalizes appropriately', () => {
  // Acceptance criterion 2: Informar "google.com": salvar como "https://google.com"
  assert.equal(URLValidator.isValid('google.com'), true);
  assert.equal(URLValidator.normalize('google.com'), 'https://google.com');

  // Acceptance criterion 4: Informar "http://localhost:3000": aceitar e preservar o endereço
  assert.equal(URLValidator.isValid('http://localhost:3000'), true);
  assert.equal(URLValidator.normalize('http://localhost:3000'), 'http://localhost:3000');

  // Valid HTTPS example
  assert.equal(URLValidator.isValid('https://example.com'), true);
  assert.equal(URLValidator.normalize('https://example.com'), 'https://example.com');

  // Trimming extra whitespace
  assert.equal(URLValidator.isValid('   https://github.com/Invictor13   '), true);
  assert.equal(URLValidator.normalize('   https://github.com/Invictor13   '), 'https://github.com/Invictor13');
});

test('URLValidator: rejects dangerous, invalid, or unsupported protocols', () => {
  // Acceptance criterion 5: javascript:alert(1)
  assert.equal(URLValidator.isValid('javascript:alert(1)'), false);
  assert.equal(URLValidator.normalize('javascript:alert(1)'), 'javascript:alert(1)');

  // Acceptance criterion 6: data:text/html,...
  assert.equal(URLValidator.isValid('data:text/html,Hello'), false);
  assert.equal(URLValidator.normalize('data:text/html,Hello'), 'data:text/html,Hello');

  // Other dangerous/unsupported protocols
  assert.equal(URLValidator.isValid('file:///etc/passwd'), false);
  assert.equal(URLValidator.isValid('chrome://settings'), false);
  assert.equal(URLValidator.isValid('about:blank'), false);

  // Acceptance criterion 7: Empty field
  assert.equal(URLValidator.isValid(''), false);
  assert.equal(URLValidator.isValid('   '), false);
  assert.equal(URLValidator.isValid(null), false);
  assert.equal(URLValidator.isValid(undefined), false);

  // Malformed schemes
  assert.equal(URLValidator.isValid('https://'), false);
  assert.equal(URLValidator.isValid('http://'), false);
});

test('Popup integration: loading, saving, removing, and error handling', () => {
  class MockElement {
    constructor(id) {
      this.id = id;
      this.value = '';
      this.textContent = '';
      this.classList = {
        _classes: new Set(),
        add(cls) { this._classes.add(cls); },
        remove(cls) { this._classes.delete(cls); },
        contains(cls) { return this._classes.has(cls); }
      };
      this._listeners = {};
    }
    addEventListener(event, handler) {
      this._listeners[event] = handler;
    }
    trigger(event, data = {}) {
      if (this._listeners[event]) {
        this._listeners[event](data);
      }
    }
    focus() {
      this._focused = true;
    }
  }

  const elements = {
    'url-input': new MockElement('url-input'),
    'btn-save': new MockElement('btn-save'),
    'btn-clear': new MockElement('btn-clear'),
    'status-card': new MockElement('status-card'),
    'status-icon': new MockElement('status-icon'),
    'status-title': new MockElement('status-title'),
    'status-desc': new MockElement('status-desc'),
    'status-message': new MockElement('status-message')
  };

  const documentListeners = {};
  const mockDocument = {
    getElementById(id) {
      return elements[id] || null;
    },
    addEventListener(event, handler) {
      documentListeners[event] = handler;
    }
  };

  const storageStore = {};
  let simulateLastError = false;

  const mockChrome = {
    storage: {
      local: {
        get(keys, cb) {
          if (simulateLastError) {
            mockChrome.runtime.lastError = { message: 'Simulated get error' };
          } else {
            mockChrome.runtime.lastError = null;
          }
          const res = {};
          keys.forEach(k => {
            if (k in storageStore) res[k] = storageStore[k];
          });
          cb(res);
        },
        set(obj, cb) {
          if (simulateLastError) {
            mockChrome.runtime.lastError = { message: 'Simulated set error' };
          } else {
            mockChrome.runtime.lastError = null;
            Object.assign(storageStore, obj);
          }
          cb();
        },
        remove(keys, cb) {
          if (simulateLastError) {
            mockChrome.runtime.lastError = { message: 'Simulated remove error' };
          } else {
            mockChrome.runtime.lastError = null;
            keys.forEach(k => delete storageStore[k]);
          }
          cb();
        }
      }
    },
    runtime: {
      lastError: null
    }
  };

  const popupCode = fs.readFileSync(new URL('../popup/popup.js', import.meta.url), 'utf8');
  const context = vm.createContext({
    document: mockDocument,
    chrome: mockChrome,
    URLValidator,
    window: { URLValidator },
    console,
    setTimeout,
    clearTimeout
  });
  vm.runInContext(popupCode, context);

  // 1. Initial open without saved configuration: empty input and functional interface
  documentListeners['DOMContentLoaded']();
  assert.equal(elements['url-input'].value, '');
  assert.equal(elements['status-title'].textContent, '');

  // 2. Empty submission attempt
  elements['url-input'].value = '   ';
  elements['btn-save'].trigger('click');
  assert.equal(elements['status-title'].textContent, 'Por favor, informe um endereço de site.');
  assert.equal(elements['status-card'].classList.contains('error'), true);
  assert.equal(elements['status-card'].classList.contains('visible'), true);

  // 3. Invalid submission attempt
  elements['url-input'].value = 'javascript:alert(1)';
  elements['btn-save'].trigger('click');
  assert.equal(elements['status-title'].textContent, 'Endereço inválido');
  assert.equal(elements['status-card'].classList.contains('error'), true);

  // 4. Save google.com: should save https://google.com with "Site salvo com sucesso!" and "Sua nova guia já está configurada."
  elements['url-input'].value = 'google.com';
  elements['btn-save'].trigger('click');
  assert.equal(storageStore['customNewTabUrl'], 'https://google.com');
  assert.equal(elements['url-input'].value, 'https://google.com');
  assert.equal(elements['status-title'].textContent, 'Site salvo com sucesso!');
  assert.equal(elements['status-desc'].textContent, 'Sua nova guia já está configurada.');
  assert.equal(elements['status-card'].classList.contains('success'), true);
  assert.equal(elements['status-card'].classList.contains('error'), false);
  assert.ok(elements['status-icon'].innerHTML.includes('svg'));

  // 5. Reopening popup restores saved URL
  elements['url-input'].value = '';
  documentListeners['DOMContentLoaded']();
  assert.equal(elements['url-input'].value, 'https://google.com');

  // 6. Save http://localhost:3000
  elements['url-input'].value = 'http://localhost:3000';
  elements['btn-save'].trigger('click');
  assert.equal(storageStore['customNewTabUrl'], 'http://localhost:3000');
  assert.equal(elements['url-input'].value, 'http://localhost:3000');
  assert.equal(elements['status-title'].textContent, 'Site salvo com sucesso!');
  assert.equal(elements['status-desc'].textContent, 'Sua nova guia já está configurada.');

  // 7. Remove configuration: deletes key and clears input
  elements['btn-clear'].trigger('click');
  assert.equal(storageStore['customNewTabUrl'], undefined);
  assert.equal(elements['url-input'].value, '');
  assert.equal(elements['status-title'].textContent, 'Configuração restaurada');
  assert.equal(elements['status-card'].classList.contains('success'), true);
  assert.equal(elements['status-card'].classList.contains('error'), false);

  // 8. Reopening popup after removal shows empty input
  documentListeners['DOMContentLoaded']();
  assert.equal(elements['url-input'].value, '');

  // 9. Storage error handling
  simulateLastError = true;
  elements['url-input'].value = 'google.com';
  elements['btn-save'].trigger('click');
  assert.equal(elements['status-title'].textContent, 'Falha ao salvar');
  assert.equal(elements['status-card'].classList.contains('error'), true);

  elements['btn-clear'].trigger('click');
  assert.equal(elements['status-title'].textContent, 'Falha ao restaurar');
  assert.equal(elements['status-card'].classList.contains('error'), true);

  documentListeners['DOMContentLoaded']();
  assert.equal(elements['status-title'].textContent, 'Não foi possível carregar a configuração');
  assert.equal(elements['status-card'].classList.contains('error'), true);
});
