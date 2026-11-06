/**
 * scripts/build-package.js
 *
 * Gera o pacote ZIP oficial de distribuição da extensão New Tab Custom
 * e valida sua estrutura e conformidade para a Chrome Web Store.
 *
 * Requisitos:
 * - Executável diretamente via Node.js sem dependências externas adicionais.
 * - Inclui exclusivamente: manifest.json, assets/, newtab/, popup/, shared/.
 * - manifest.json na raiz do arquivo ZIP.
 * - Salva o pacote em `dist/new-tab-custom-v<versao>.zip`.
 * - Valida a integridade do manifest, presença dos arquivos referenciados,
 *   presença de ícones, ausência de arquivos de dev e consistência interna do ZIP.
 */

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const zlib = require('node:zlib');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const MANIFEST_PATH = path.resolve(ROOT_DIR, 'manifest.json');

// Diretórios e arquivos permitidos no pacote
const ALLOWED_ROOT_ITEMS = [
  'manifest.json',
  'assets',
  'newtab',
  'popup',
  'shared'
];

// Padrões terminantemente proibidos no pacote
const FORBIDDEN_PATTERNS = [
  /^\.git(\/|$)/,
  /^node_modules(\/|$)/,
  /^test(\/|$)/,
  /^scripts(\/|$)/,
  /^dist(\/|$)/,
  /^assets\/store(\/|$)/,
  /\.md$/i,
  /\.DS_Store$/i,
  /Thumbs\.db$/i,
  /^\.vscode(\/|$)/,
  /^\.idea(\/|$)/,
  /\.log$/i
];

/**
 * Coleta recursivamente todos os arquivos relativos a partir de um diretório base.
 */
function collectFiles(dirPath, relativeTo = ROOT_DIR) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.relative(relativeTo, fullPath).split(path.sep).join('/');

    // Ignora pastas ou arquivos correspondentes a padrões proibidos
    if (FORBIDDEN_PATTERNS.some((p) => p.test(relPath))) {
      continue;
    }

    if (entry.isDirectory()) {
      files = files.concat(collectFiles(fullPath, relativeTo));
    } else if (entry.isFile()) {
      files.push(relPath);
    }
  }

  return files;
}

/**
 * Lê e valida o manifest.json em disco.
 */
function readAndValidateSourceManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Arquivo manifest.json não encontrado em: ${MANIFEST_PATH}`);
  }

  const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8');
  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch (err) {
    throw new Error(`manifest.json contém JSON inválido: ${err.message}`);
  }

  if (manifest.manifest_version !== 3) {
    throw new Error(`manifest_version deve ser 3, encontrado: ${manifest.manifest_version}`);
  }

  if (!manifest.version || typeof manifest.version !== 'string') {
    throw new Error(`Versão do manifest ausente ou inválida: ${manifest.version}`);
  }

  return manifest;
}

/**
 * Lista todos os arquivos que devem ser incluídos no pacote.
 */
function getSourceFilesToPackage() {
  const fileList = [];

  for (const item of ALLOWED_ROOT_ITEMS) {
    const fullPath = path.join(ROOT_DIR, item);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Recurso obrigatório não encontrado no projeto: ${item}`);
    }

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const dirFiles = collectFiles(fullPath, ROOT_DIR);
      fileList.push(...dirFiles);
    } else if (stat.isFile()) {
      fileList.push(item);
    }
  }

  fileList.sort();
  return fileList;
}

/**
 * Cria o arquivo ZIP de forma portável em Node.js (sem dependências externas de npm).
 * Utiliza o formato ZIP padrão PKWARE.
 */
function createZipArchive(files, rootDir, outputPath) {
  const localHeaders = [];
  const centralDirectoryHeaders = [];
  let currentOffset = 0;

  for (const relPath of files) {
    const fullPath = path.join(rootDir, relPath);
    const content = fs.readFileSync(fullPath);
    const stat = fs.statSync(fullPath);

    const filenameBuffer = Buffer.from(relPath, 'utf8');
    const crc = crc32(content);
    const compressed = zlib.deflateRawSync(content, { level: 9 });

    // Se a compressão não reduzir o tamanho, usamos armazenamento (STORE = 0), senão DEFLATE (8)
    const useDeflate = compressed.length < content.length;
    const compressionMethod = useDeflate ? 8 : 0;
    const dataToWrite = useDeflate ? compressed : content;
    const compressedSize = dataToWrite.length;
    const uncompressedSize = content.length;

    const { dosDate, dosTime } = toDosDateTime(stat.mtime || new Date());

    // Local file header (30 bytes + filename)
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local file header signature
    localHeader.writeUInt16LE(20, 4);         // Version needed to extract (2.0)
    localHeader.writeUInt16LE(0x0800, 6);     // General purpose bit flag (UTF-8 = bit 11)
    localHeader.writeUInt16LE(compressionMethod, 8); // Compression method
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(crc, 14);       // CRC-32
    localHeader.writeUInt32LE(compressedSize, 18);
    localHeader.writeUInt32LE(uncompressedSize, 22);
    localHeader.writeUInt16LE(filenameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);         // Extra field length

    const localEntry = Buffer.concat([localHeader, filenameBuffer, dataToWrite]);
    localHeaders.push(localEntry);

    // Central directory header (46 bytes + filename)
    const cdHeader = Buffer.alloc(46);
    cdHeader.writeUInt32LE(0x02014b50, 0); // Central file header signature
    cdHeader.writeUInt16LE(20, 4);         // Version made by
    cdHeader.writeUInt16LE(20, 6);         // Version needed to extract
    cdHeader.writeUInt16LE(0x0800, 8);     // Flags (UTF-8)
    cdHeader.writeUInt16LE(compressionMethod, 10);
    cdHeader.writeUInt16LE(dosTime, 12);
    cdHeader.writeUInt16LE(dosDate, 14);
    cdHeader.writeUInt32LE(crc, 16);
    cdHeader.writeUInt32LE(compressedSize, 20);
    cdHeader.writeUInt32LE(uncompressedSize, 24);
    cdHeader.writeUInt16LE(filenameBuffer.length, 28);
    cdHeader.writeUInt16LE(0, 30);         // Extra field length
    cdHeader.writeUInt16LE(0, 32);         // File comment length
    cdHeader.writeUInt16LE(0, 34);         // Disk number start
    cdHeader.writeUInt16LE(0, 36);         // Internal file attributes
    cdHeader.writeUInt32LE(0x81a40000, 38);// External file attributes (regular file -rw-r--r--)
    cdHeader.writeUInt32LE(currentOffset, 42); // Relative offset of local header

    centralDirectoryHeaders.push(Buffer.concat([cdHeader, filenameBuffer]));

    currentOffset += localEntry.length;
  }

  const centralDirectoryOffset = currentOffset;
  const centralDirectoryData = Buffer.concat(centralDirectoryHeaders);
  const centralDirectorySize = centralDirectoryData.length;

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // End of central dir signature
  eocd.writeUInt16LE(0, 4);          // Disk number
  eocd.writeUInt16LE(0, 6);          // Disk with central dir
  eocd.writeUInt16LE(files.length, 8); // Number of entries on this disk
  eocd.writeUInt16LE(files.length, 10);// Total number of entries
  eocd.writeUInt32LE(centralDirectorySize, 12);
  eocd.writeUInt32LE(centralDirectoryOffset, 16);
  eocd.writeUInt16LE(0, 20);         // Comment length

  const finalZipBuffer = Buffer.concat([
    Buffer.concat(localHeaders),
    centralDirectoryData,
    eocd
  ]);

  fs.writeFileSync(outputPath, finalZipBuffer);
}

/**
 * Lê os arquivos contidos em um ZIP criado, retornando a lista de caminhos e extrator de arquivo.
 */
function readZipEntries(zipBuffer) {
  // Encontrar o End of Central Directory (EOCD)
  const eocdSignature = 0x06054b50;
  let eocdOffset = -1;

  for (let i = zipBuffer.length - 22; i >= Math.max(0, zipBuffer.length - 65557); i--) {
    if (zipBuffer.readUInt32LE(i) === eocdSignature) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error('Assinatura EOCD do arquivo ZIP não encontrada.');
  }

  const totalEntries = zipBuffer.readUInt16LE(eocdOffset + 10);
  const cdSize = zipBuffer.readUInt32LE(eocdOffset + 12);
  const cdOffset = zipBuffer.readUInt32LE(eocdOffset + 16);

  let offset = cdOffset;
  const entries = [];

  for (let i = 0; i < totalEntries; i++) {
    const sig = zipBuffer.readUInt32LE(offset);
    if (sig !== 0x02014b50) {
      throw new Error(`Assinatura de diretório central inválida no índice ${i}.`);
    }

    const compressionMethod = zipBuffer.readUInt16LE(offset + 10);
    const compressedSize = zipBuffer.readUInt32LE(offset + 20);
    const uncompressedSize = zipBuffer.readUInt32LE(offset + 24);
    const filenameLen = zipBuffer.readUInt16LE(offset + 28);
    const extraLen = zipBuffer.readUInt16LE(offset + 30);
    const commentLen = zipBuffer.readUInt16LE(offset + 32);
    const localHeaderOffset = zipBuffer.readUInt32LE(offset + 42);

    const filename = zipBuffer.toString('utf8', offset + 46, offset + 46 + filenameLen);

    entries.push({
      filename,
      compressionMethod,
      compressedSize,
      uncompressedSize,
      localHeaderOffset
    });

    offset += 46 + filenameLen + extraLen + commentLen;
  }

  function readFile(entry) {
    const locSig = zipBuffer.readUInt32LE(entry.localHeaderOffset);
    if (locSig !== 0x04034b50) {
      throw new Error(`Assinatura do cabeçalho local inválida para ${entry.filename}`);
    }
    const nameLen = zipBuffer.readUInt16LE(entry.localHeaderOffset + 26);
    const extLen = zipBuffer.readUInt16LE(entry.localHeaderOffset + 28);
    const dataStart = entry.localHeaderOffset + 30 + nameLen + extLen;
    const compressedData = zipBuffer.subarray(dataStart, dataStart + entry.compressedSize);

    if (entry.compressionMethod === 0) {
      return compressedData;
    } else if (entry.compressionMethod === 8) {
      return zlib.inflateRawSync(compressedData);
    } else {
      throw new Error(`Método de compressão desconhecido: ${entry.compressionMethod}`);
    }
  }

  return { entries, readFile };
}

/**
 * Validação automática rigorosa do pacote ZIP gerado.
 */
function validatePackage(zipPath, expectedVersion) {
  const results = {
    valid: true,
    errors: [],
    warnings: [],
    details: {}
  };

  if (!fs.existsSync(zipPath)) {
    results.valid = false;
    results.errors.push(`Arquivo de distribuição não encontrado: ${zipPath}`);
    return results;
  }

  const zipBuffer = fs.readFileSync(zipPath);
  let zip;
  try {
    zip = readZipEntries(zipBuffer);
  } catch (err) {
    results.valid = false;
    results.errors.push(`Falha ao abrir ou inspecionar ZIP: ${err.message}`);
    return results;
  }

  const entryNames = zip.entries.map((e) => e.filename);
  results.details.entryCount = entryNames.length;
  results.details.files = entryNames;

  // 1. Confirmar que manifest.json está na raiz do pacote
  if (!entryNames.includes('manifest.json')) {
    results.valid = false;
    results.errors.push('O arquivo manifest.json NÃO está presente na raiz do pacote ZIP.');
  }

  // 2. Validar que o JSON do Manifest é legível e decodificável
  let packageManifest = null;
  const manifestEntry = zip.entries.find((e) => e.filename === 'manifest.json');
  if (manifestEntry) {
    try {
      const manifestBuffer = zip.readFile(manifestEntry);
      packageManifest = JSON.parse(manifestBuffer.toString('utf8'));
    } catch (err) {
      results.valid = false;
      results.errors.push(`manifest.json interno ao ZIP é ilegível ou inválido: ${err.message}`);
    }
  }

  if (packageManifest) {
    // Coerência entre versão do manifest e parâmetro esperado
    if (packageManifest.version !== expectedVersion) {
      results.valid = false;
      results.errors.push(
        `Versão no manifest do ZIP (${packageManifest.version}) não corresponde ao pacote esperado (${expectedVersion}).`
      );
    }

    if (packageManifest.manifest_version !== 3) {
      results.valid = false;
      results.errors.push(`manifest_version inválido: ${packageManifest.manifest_version} (esperado: 3).`);
    }

    // 3. Confirmar que todos os arquivos referenciados pelo Manifest existem no ZIP
    const referencedFiles = [];

    // Ícones globais
    if (packageManifest.icons) {
      for (const [size, iconPath] of Object.entries(packageManifest.icons)) {
        referencedFiles.push({ path: iconPath, description: `Ícone de extensão ${size}px` });
      }
    }

    // Ação (Popup e seus ícones)
    if (packageManifest.action) {
      if (packageManifest.action.default_popup) {
        referencedFiles.push({
          path: packageManifest.action.default_popup,
          description: 'Página HTML do popup'
        });
      }
      if (packageManifest.action.default_icon) {
        for (const [size, iconPath] of Object.entries(packageManifest.action.default_icon)) {
          referencedFiles.push({
            path: iconPath,
            description: `Ícone da ação do popup ${size}px`
          });
        }
      }
    }

    // Chrome URL Overrides (Newtab)
    if (packageManifest.chrome_url_overrides) {
      if (packageManifest.chrome_url_overrides.newtab) {
        referencedFiles.push({
          path: packageManifest.chrome_url_overrides.newtab,
          description: 'Página HTML da Nova Guia'
        });
      }
    }

    // Verificar se cada arquivo referenciado existe no ZIP
    for (const ref of referencedFiles) {
      if (!entryNames.includes(ref.path)) {
        results.valid = false;
        results.errors.push(`Arquivo referenciado no manifest ausente no ZIP: "${ref.path}" (${ref.description}).`);
      }
    }

    // 4. Confirmar que os ícones declarados estão presentes
    const requiredIcons = [
      'assets/icons/icon16.png',
      'assets/icons/icon48.png',
      'assets/icons/icon128.png'
    ];
    for (const icon of requiredIcons) {
      if (!entryNames.includes(icon)) {
        results.valid = false;
        results.errors.push(`Ícone obrigatório ausente no ZIP: ${icon}`);
      }
    }

    // Verificar também presença do assets/logo.png
    if (!entryNames.includes('assets/logo.png')) {
      results.valid = false;
      results.errors.push('Logotipo oficial (assets/logo.png) ausente no ZIP.');
    }
  }

  // 5. Verificar se os diretórios e arquivos essenciais estão incluídos
  const essentialFiles = [
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

  for (const essential of essentialFiles) {
    if (!entryNames.includes(essential)) {
      results.valid = false;
      results.errors.push(`Recurso essencial ausente no pacote: ${essential}`);
    }
  }

  // 6. Verificar se arquivos de desenvolvimento foram excluídos
  for (const entry of entryNames) {
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(entry)) {
        results.valid = false;
        results.errors.push(`Arquivo de desenvolvimento/proibido detectado dentro do ZIP: "${entry}"`);
      }
    }
  }

  // 7. Confirmar que a estrutura interna não tem diretório raiz intermediário (ex: "NewTab/manifest.json")
  for (const entry of entryNames) {
    if (entry.endsWith('manifest.json') && entry !== 'manifest.json') {
      results.valid = false;
      results.errors.push(
        `manifest.json aninhado detectado ("${entry}"). O manifest deve ficar diretamente na raiz do ZIP.`
      );
    }
  }

  return results;
}

/**
 * Utilitário CRC-32
 */
let crcTable = null;
function makeCrcTable() {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
}

function crc32(buf) {
  if (!crcTable) crcTable = makeCrcTable();
  let c = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xff];
  }
  return (c ^ (-1)) >>> 0;
}

function toDosDateTime(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const dosYear = year < 1980 ? 0 : year - 1980;
  const dosMonth = d.getMonth() + 1;
  const dosDay = d.getDate();
  const dosHour = d.getHours();
  const dosMinute = d.getMinutes();
  const dosSecond = Math.floor(d.getSeconds() / 2);

  const dosDate = (dosYear << 9) | (dosMonth << 5) | dosDay;
  const dosTime = (dosHour << 11) | (dosMinute << 5) | dosSecond;

  return { dosDate, dosTime };
}

/**
 * Função orquestradora principal.
 */
function buildPackage() {
  console.log('='.repeat(60));
  console.log('  New Tab Custom — Geração do Pacote Oficial de Distribuição');
  console.log('='.repeat(60));

  // 1. Validar manifest na fonte
  console.log('\n[1/4] Lendo e validando manifest.json...');
  const manifest = readAndValidateSourceManifest();
  console.log(`      ✓ Manifest V3 válido (v${manifest.version})`);

  // 2. Coletar arquivos
  console.log('\n[2/4] Selecionando arquivos para inclusão no pacote...');
  const filesToPackage = getSourceFilesToPackage();
  console.log(`      ✓ ${filesToPackage.length} arquivos selecionados para o pacote:`);
  for (const f of filesToPackage) {
    console.log(`        - ${f}`);
  }

  // 3. Garantir diretório dist/ e gerar o ZIP
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const zipFilename = `new-tab-custom-v${manifest.version}.zip`;
  const zipPath = path.join(DIST_DIR, zipFilename);

  console.log(`\n[3/4] Empacotando em: ${path.relative(ROOT_DIR, zipPath)}...`);
  createZipArchive(filesToPackage, ROOT_DIR, zipPath);
  const stats = fs.statSync(zipPath);
  console.log(`      ✓ Pacote ZIP gerado com sucesso (${(stats.size / 1024).toFixed(2)} KB).`);

  // 4. Validar o pacote gerado
  console.log('\n[4/4] Executando validação automática da estrutura do ZIP...');
  const validation = validatePackage(zipPath, manifest.version);

  if (!validation.valid) {
    console.error('\n❌ ERRO NA VALIDAÇÃO DO PACOTE:');
    for (const err of validation.errors) {
      console.error(`   - ${err}`);
    }
    process.exit(1);
  }

  console.log('      ✓ manifest.json presente na raiz do ZIP.');
  console.log('      ✓ JSON do manifest legível e sintaxe válida.');
  console.log('      ✓ Todos os arquivos referenciados pelo manifest existem no ZIP.');
  console.log('      ✓ Ícones e assets essenciais confirmados.');
  console.log('      ✓ Nenhum arquivo de desenvolvimento (.git, test, .md) incluído.');
  console.log('      ✓ Estrutura de caminhos relativos consistente.');

  console.log('\n' + '='.repeat(60));
  console.log('✨ SUCESSO: Pacote oficial pronto para distribuição!');
  console.log(`📦 Arquivo: ${zipPath}`);
  console.log(`📐 Tamanho: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`🏷️  Versão: ${manifest.version}`);
  console.log('='.repeat(60) + '\n');

  return {
    zipPath,
    zipFilename,
    version: manifest.version,
    size: stats.size,
    filesCount: filesToPackage.length
  };
}

// Se executado diretamente pelo terminal
if (require.main === module) {
  try {
    buildPackage();
  } catch (err) {
    console.error('\n❌ FALHA NA GERAÇÃO DO PACOTE:', err.message);
    process.exit(1);
  }
}

module.exports = {
  buildPackage,
  validatePackage,
  readZipEntries,
  getSourceFilesToPackage,
  ALLOWED_ROOT_ITEMS,
  FORBIDDEN_PATTERNS
};
