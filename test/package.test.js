/**
 * test/package.test.js
 *
 * Testes automatizados para a geração, integridade e validação
 * do pacote oficial de distribuição ZIP da extensão.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const {
  buildPackage,
  validatePackage,
  readZipEntries,
  getSourceFilesToPackage,
  FORBIDDEN_PATTERNS
} = require('../scripts/build-package.js');

test('Package Build & Validation: Generates official ZIP package matching manifest', () => {
  const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../manifest.json'), 'utf8'));
  const result = buildPackage();

  assert.ok(result.zipPath, 'Caminho do ZIP deve ser retornado');
  assert.equal(result.version, manifest.version, 'Versão do pacote deve ser idêntica à do manifest.json');
  assert.equal(result.zipFilename, `new-tab-custom-v${manifest.version}.zip`);
  assert.ok(fs.existsSync(result.zipPath), 'Arquivo ZIP deve existir fisicamente em dist/');
  assert.ok(result.size > 0, 'Arquivo ZIP deve ter tamanho maior que 0');
});

test('Package Build & Validation: ZIP contains manifest.json at root and all required runtime files', () => {
  const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../manifest.json'), 'utf8'));
  const zipPath = path.resolve(__dirname, `../dist/new-tab-custom-v${manifest.version}.zip`);

  const zipBuffer = fs.readFileSync(zipPath);
  const { entries, readFile } = readZipEntries(zipBuffer);
  const entryNames = entries.map((e) => e.filename);

  // manifest.json diretamente na raiz
  assert.ok(entryNames.includes('manifest.json'), 'manifest.json deve estar na raiz do ZIP');

  // Validar leitura do manifest de dentro do ZIP
  const manifestEntry = entries.find((e) => e.filename === 'manifest.json');
  const manifestInZip = JSON.parse(readFile(manifestEntry).toString('utf8'));
  assert.equal(manifestInZip.name, manifest.name);
  assert.equal(manifestInZip.version, manifest.version);
  assert.equal(manifestInZip.manifest_version, 3);

  // Presença de todos os arquivos essenciais
  const requiredFiles = [
    'manifest.json',
    'assets/logo.png',
    'assets/icons/icon16.png',
    'assets/icons/icon48.png',
    'assets/icons/icon128.png',
    'newtab/newtab.html',
    'newtab/newtab.css',
    'newtab/newtab.js',
    'popup/popup.html',
    'popup/popup.css',
    'popup/popup.js',
    'shared/url-validator.js'
  ];

  for (const file of requiredFiles) {
    assert.ok(entryNames.includes(file), `Arquivo essencial "${file}" deve estar no ZIP`);
  }

  // Verificar se todos os arquivos referenciados no manifest do ZIP existem
  assert.ok(entryNames.includes(manifestInZip.action.default_popup));
  assert.ok(entryNames.includes(manifestInZip.chrome_url_overrides.newtab));
  for (const iconPath of Object.values(manifestInZip.icons)) {
    assert.ok(entryNames.includes(iconPath), `Ícone referenciado "${iconPath}" deve estar no ZIP`);
  }
});

test('Package Build & Validation: ZIP strictly excludes development and documentation files', () => {
  const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../manifest.json'), 'utf8'));
  const zipPath = path.resolve(__dirname, `../dist/new-tab-custom-v${manifest.version}.zip`);

  const zipBuffer = fs.readFileSync(zipPath);
  const { entries } = readZipEntries(zipBuffer);
  const entryNames = entries.map((e) => e.filename);

  for (const name of entryNames) {
    for (const pattern of FORBIDDEN_PATTERNS) {
      assert.ok(
        !pattern.test(name),
        `Arquivo de desenvolvimento proibido não pode estar no ZIP: "${name}"`
      );
    }
  }

  // Checagens explícitas
  assert.ok(!entryNames.includes('README.md'), 'README.md não pode estar no ZIP');
  assert.ok(!entryNames.includes('STORE.md'), 'STORE.md não pode estar no ZIP');
  assert.ok(!entryNames.some((n) => n.startsWith('test/')), 'Pasta test/ não pode estar no ZIP');
  assert.ok(!entryNames.some((n) => n.startsWith('scripts/')), 'Pasta scripts/ não pode estar no ZIP');
  assert.ok(!entryNames.some((n) => n.startsWith('.git/')), 'Pasta .git/ não pode estar no ZIP');
});

test('Package Build & Validation: validatePackage detects missing or invalid files correctly', () => {
  const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../manifest.json'), 'utf8'));
  const validZipPath = path.resolve(__dirname, `../dist/new-tab-custom-v${manifest.version}.zip`);

  // Caso válido
  const validCheck = validatePackage(validZipPath, manifest.version);
  assert.equal(validCheck.valid, true);
  assert.equal(validCheck.errors.length, 0);

  // Caso versão divergente
  const mismatchCheck = validatePackage(validZipPath, '9.9.9');
  assert.equal(mismatchCheck.valid, false);
  assert.ok(mismatchCheck.errors.some((e) => e.includes('não corresponde ao pacote esperado')));

  // Caso arquivo inexistente
  const nonExistentCheck = validatePackage('/caminho/falso/inexistente.zip', manifest.version);
  assert.equal(nonExistentCheck.valid, false);
  assert.ok(nonExistentCheck.errors.some((e) => e.includes('não encontrado')));
});
