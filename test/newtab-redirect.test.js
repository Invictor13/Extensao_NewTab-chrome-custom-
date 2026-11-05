import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import URLValidator from '../shared/url-validator.js';

function createMockEnvironment({
  savedUrl = undefined,
  simulateStorageError = false,
  currentHref = 'https://example.com/newtab.html',
  sessionStorageData = {}
} = {}) {
  const statusElement = {
    id: 'newtab-status',
    textContent: '',
    classList: {
      _classes: new Set(),
      add(cls) { this._classes.add(cls); },
      remove(cls) { this._classes.delete(cls); },
      contains(cls) { return this._classes.has(cls); }
    }
  };

  const documentListeners = {};
  const mockDocument = {
    readyState: 'complete',
    getElementById(id) {
      if (id === 'newtab-status') return statusElement;
      return null;
    },
    addEventListener(event, handler) {
      documentListeners[event] = handler;
    }
  };

  const replacedUrls = [];
  const assignedHrefs = [];

  const mockLocation = {
    href: currentHref,
    replace(url) {
      replacedUrls.push(url);
    }
  };

  const storageStore = {};
  if (savedUrl !== undefined) {
    storageStore['customNewTabUrl'] = savedUrl;
  }

  const mockChrome = {
    storage: {
      local: {
        get(keys, cb) {
          if (simulateStorageError) {
            mockChrome.runtime.lastError = { message: 'Storage read failure' };
          } else {
            mockChrome.runtime.lastError = null;
          }
          const res = {};
          keys.forEach((k) => {
            if (k in storageStore) res[k] = storageStore[k];
          });
          cb(res);
        },
        set(obj, cb) {
          Object.assign(storageStore, obj);
          if (cb) cb();
        }
      }
    },
    runtime: {
      lastError: null
    }
  };

  const sessionStore = { ...sessionStorageData };
  const mockSessionStorage = {
    getItem(key) {
      return sessionStore[key] ?? null;
    },
    setItem(key, val) {
      sessionStore[key] = String(val);
    },
    removeItem(key) {
      delete sessionStore[key];
    },
    clear() {
      for (const k of Object.keys(sessionStore)) delete sessionStore[k];
    }
  };

  return {
    mockDocument,
    mockLocation,
    mockChrome,
    mockSessionStorage,
    statusElement,
    replacedUrls,
    assignedHrefs,
    documentListeners,
    storageStore,
    sessionStore
  };
}

function runNewTabScript(env) {
  const newTabCode = fs.readFileSync(new URL('../newtab/newtab.js', import.meta.url), 'utf8');
  const context = vm.createContext({
    document: env.mockDocument,
    window: {
      location: env.mockLocation,
      URLValidator
    },
    sessionStorage: env.mockSessionStorage,
    URL,
    Date,
    parseInt,
    chrome: env.mockChrome,
    URLValidator,
    console
  });
  vm.runInContext(newTabCode, context);
}

test('New Tab Redirect: redirects to valid HTTPS URL', () => {
  const env = createMockEnvironment({ savedUrl: 'https://example.com' });
  runNewTabScript(env);

  assert.equal(env.replacedUrls.length, 1);
  assert.equal(env.replacedUrls[0], 'https://example.com');
  assert.equal(env.statusElement.textContent, 'Redirecionando...');
  assert.equal(env.statusElement.classList.contains('error'), false);
  // Also records attempt in sessionStorage
  assert.equal(env.sessionStore['newtab_redirect_count'], '1');
});

test('New Tab Redirect: redirects to valid HTTP URL (e.g. localhost)', () => {
  const env = createMockEnvironment({ savedUrl: 'http://localhost:3000' });
  runNewTabScript(env);

  assert.equal(env.replacedUrls.length, 1);
  assert.equal(env.replacedUrls[0], 'http://localhost:3000');
  assert.equal(env.statusElement.textContent, 'Redirecionando...');
  assert.equal(env.statusElement.classList.contains('error'), false);
});

test('New Tab Redirect: no URL configured keeps functional welcome screen without redirect', () => {
  const env = createMockEnvironment({ savedUrl: undefined });
  runNewTabScript(env);

  assert.equal(env.replacedUrls.length, 0);
  assert.equal(env.statusElement.textContent, 'Nenhum endereço configurado. Use o ícone da extensão para definir.');
  assert.equal(env.statusElement.classList.contains('error'), false);
});

test('New Tab Redirect: empty string or whitespace keeps functional welcome screen', () => {
  const env = createMockEnvironment({ savedUrl: '   ' });
  runNewTabScript(env);

  assert.equal(env.replacedUrls.length, 0);
  assert.equal(env.statusElement.textContent, 'Nenhum endereço configurado. Use o ícone da extensão para definir.');
  assert.equal(env.statusElement.classList.contains('error'), false);
});

test('New Tab Redirect: rejects invalid or malformed URL and shows error message', () => {
  const env = createMockEnvironment({ savedUrl: 'https://' });
  runNewTabScript(env);

  assert.equal(env.replacedUrls.length, 0);
  assert.equal(
    env.statusElement.textContent,
    'O endereço configurado é inválido ou utiliza um protocolo não suportado. Atualize pelo popup da extensão.'
  );
  assert.equal(env.statusElement.classList.contains('error'), true);
});

test('New Tab Redirect: rejects disallowed protocols (javascript:, data:, file:, chrome:)', () => {
  const disallowed = [
    'javascript:alert(1)',
    'data:text/html,<h1>Test</h1>',
    'file:///etc/passwd',
    'chrome://settings'
  ];

  for (const url of disallowed) {
    const env = createMockEnvironment({ savedUrl: url });
    runNewTabScript(env);

    assert.equal(env.replacedUrls.length, 0, `Should not redirect for ${url}`);
    assert.equal(
      env.statusElement.textContent,
      'O endereço configurado é inválido ou utiliza um protocolo não suportado. Atualize pelo popup da extensão.',
      `Should show error message for ${url}`
    );
    assert.equal(env.statusElement.classList.contains('error'), true);
  }
});

test('New Tab Redirect: handles storage failure gracefully without blank screen', () => {
  const env = createMockEnvironment({ simulateStorageError: true });
  runNewTabScript(env);

  assert.equal(env.replacedUrls.length, 0);
  assert.equal(
    env.statusElement.textContent,
    'Não foi possível ler as configurações da extensão. Verifique as permissões.'
  );
  assert.equal(env.statusElement.classList.contains('error'), true);
});

test('New Tab Redirect: persistence after simulated browser restart', () => {
  // First session: URL saved
  const sharedStorage = { customNewTabUrl: 'https://duckduckgo.com' };

  // Browser restart: create a new fresh window and document session with persisted chrome.storage.local
  const envRestart = createMockEnvironment();
  Object.assign(envRestart.mockChrome.storage.local, {
    get(keys, cb) {
      const res = {};
      keys.forEach((k) => {
        if (k in sharedStorage) res[k] = sharedStorage[k];
      });
      cb(res);
    }
  });

  runNewTabScript(envRestart);
  assert.equal(envRestart.replacedUrls.length, 1);
  assert.equal(envRestart.replacedUrls[0], 'https://duckduckgo.com');
});

test('New Tab Redirect: prevents self-redirection loops if configured URL is identical to current new tab page', () => {
  const currentTabUrl = 'https://example.com/newtab.html';
  const env = createMockEnvironment({
    savedUrl: currentTabUrl,
    currentHref: currentTabUrl
  });

  runNewTabScript(env);

  assert.equal(env.replacedUrls.length, 0);
  assert.equal(
    env.statusElement.textContent,
    'O endereço configurado aponta para a própria Nova Guia. Altere o endereço no popup.'
  );
  assert.equal(env.statusElement.classList.contains('error'), true);
});

test('New Tab Redirect: detects and halts rapid redirect loops in the same tab', () => {
  const env = createMockEnvironment({
    savedUrl: 'https://example.com',
    sessionStorageData: {
      newtab_redirect_count: '2',
      newtab_last_redirect_time: Date.now().toString()
    }
  });

  runNewTabScript(env);

  assert.equal(env.replacedUrls.length, 0);
  assert.equal(
    env.statusElement.textContent,
    'Loop de redirecionamento detectado. O redirecionamento automático foi interrompido.'
  );
  assert.equal(env.statusElement.classList.contains('error'), true);
});
