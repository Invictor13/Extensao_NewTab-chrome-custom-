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
    console
  });
  vm.runInContext(popupCode, context);

  // 1. Initial open without saved configuration: empty input and functional interface
  documentListeners['DOMContentLoaded']();
  assert.equal(elements['url-input'].value, '');
  assert.equal(elements['status-message'].textContent, '');

  // 2. Empty submission attempt
  elements['url-input'].value = '   ';
  elements['btn-save'].trigger('click');
  assert.equal(elements['status-message'].textContent, 'Por favor, informe um endereço de site.');
  assert.equal(elements['status-message'].classList.contains('error'), true);

  // 3. Invalid submission attempt
  elements['url-input'].value = 'javascript:alert(1)';
  elements['btn-save'].trigger('click');
  assert.equal(elements['status-message'].textContent, 'Endereço inválido. Informe um endereço válido (http ou https).');
  assert.equal(elements['status-message'].classList.contains('error'), true);

  // 4. Save google.com: should save https://google.com
  elements['url-input'].value = 'google.com';
  elements['btn-save'].trigger('click');
  assert.equal(storageStore['customNewTabUrl'], 'https://google.com');
  assert.equal(elements['url-input'].value, 'https://google.com');
  assert.equal(elements['status-message'].textContent, 'Endereço salvo com sucesso!');
  assert.equal(elements['status-message'].classList.contains('error'), false);

  // 5. Reopening popup restores saved URL
  elements['url-input'].value = '';
  documentListeners['DOMContentLoaded']();
  assert.equal(elements['url-input'].value, 'https://google.com');

  // 6. Save http://localhost:3000
  elements['url-input'].value = 'http://localhost:3000';
  elements['btn-save'].trigger('click');
  assert.equal(storageStore['customNewTabUrl'], 'http://localhost:3000');
  assert.equal(elements['url-input'].value, 'http://localhost:3000');
  assert.equal(elements['status-message'].textContent, 'Endereço salvo com sucesso!');

  // 7. Remove configuration: deletes key and clears input
  elements['btn-clear'].trigger('click');
  assert.equal(storageStore['customNewTabUrl'], undefined);
  assert.equal(elements['url-input'].value, '');
  assert.equal(elements['status-message'].textContent, 'Configuração removida com sucesso!');
  assert.equal(elements['status-message'].classList.contains('error'), false);

  // 8. Reopening popup after removal shows empty input
  documentListeners['DOMContentLoaded']();
  assert.equal(elements['url-input'].value, '');

  // 9. Storage error handling
  simulateLastError = true;
  elements['url-input'].value = 'google.com';
  elements['btn-save'].trigger('click');
  assert.equal(elements['status-message'].textContent, 'Falha ao salvar o endereço no armazenamento.');
  assert.equal(elements['status-message'].classList.contains('error'), true);

  elements['btn-clear'].trigger('click');
  assert.equal(elements['status-message'].textContent, 'Falha ao remover a configuração.');
  assert.equal(elements['status-message'].classList.contains('error'), true);

  documentListeners['DOMContentLoaded']();
  assert.equal(elements['status-message'].textContent, 'Não foi possível carregar a configuração salva.');
  assert.equal(elements['status-message'].classList.contains('error'), true);
});
