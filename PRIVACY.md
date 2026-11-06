# Política de Privacidade — New Tab Custom

**Última atualização:** Novembro de 2026
**Extensão:** New Tab Custom
**Versão:** 1.0.0
**Desenvolvedor:** Victor Ladislau Viana
**Repositório:** [https://github.com/Invictor13/Extensao_NewTab-chrome-custom-](https://github.com/Invictor13/Extensao_NewTab-chrome-custom-)

---

## 1. Visão Geral e Propósito Único

A extensão **New Tab Custom** tem como objetivo único permitir que o usuário defina e personalize o endereço web (URL) que será aberto automaticamente sempre que uma nova guia (*New Tab*) for iniciada no navegador Google Chrome.

Esta Política de Privacidade descreve com total transparência como a extensão trata dados, em conformidade com as Políticas de Programa para Desenvolvedores da Chrome Web Store (*Chrome Web Store Developer Program Policies*) e os requisitos de Uso Limitado (*Limited Use*).

---

## 2. Tratamento e Armazenamento de Dados

A extensão realiza exclusivamente o tratamento local de dados necessários para o cumprimento de sua funcionalidade principal:

- **Dado Armazenado:** Apenas o endereço web (URL) inserido voluntariamente pelo usuário através do menu de configuração (*popup*). O valor é armazenado sob a chave `customNewTabUrl`.
- **Local de Armazenamento:** A URL é salva estritamente no armazenamento local do navegador do próprio usuário, por meio da API oficial `chrome.storage.local`.
- **Diferenciação Técnica Importante:** A extensão realiza o tratamento de dados no âmbito do armazenamento local do dispositivo. Contudo, **nenhum dado é coletado, transmitido, compartilhado, vendido ou enviado para servidores externos, desenvolvedor ou terceiros**.

---

## 3. Coleta de Informações, Telemetria e Analytics

- **Sem Coleta de Informações Pessoais:** A extensão não coleta nomes, endereços de e-mail, senhas, endereços IP, geolocalização ou identificadores de dispositivo.
- **Sem Rastreamento de Navegação:** A extensão não monitora o histórico de navegação, cliques, hábitos de uso, cookies ou sessões de outros sites acessados pelo usuário.
- **Sem Telemetria ou Métricas de Uso:** Não há scripts de rastreamento, Google Analytics, telemetria, logs de depuração remotos ou ferramentas analíticas de terceiros embutidas no código.
- **Sem Transmissão para Servidores Externos:** A base de código da extensão não realiza chamadas às APIs de rede (`fetch`, `XMLHttpRequest`, `WebSocket`, `navigator.sendBeacon`) ou a qualquer servidor remoto.

---

## 4. Permissões Solicitadas e Justificativas Técnicas

A extensão segue com rigor o princípio do menor privilégio (*least privilege*), solicitando apenas a permissão estritamente necessária para seu funcionamento:

| Permissão | Justificativa Técnica |
| :--- | :--- |
| `storage` | Utilizada exclusivamente para permitir que o navegador salve e consulte a chave `customNewTabUrl` via `chrome.storage.local`. Essa permissão viabiliza que a URL configurada pelo usuário persista entre aberturas de abas e reinicializações do navegador. |

A extensão **não** solicita permissões amplas de acesso a sites (como `<all_urls>`, `*://*/*`, `tabs`, `activeTab`, `webRequest`, `cookies` ou `scripting`).

---

## 5. Código Remoto e Segurança

- **Zero Código Remoto:** Em estrita conformidade com os requisitos de segurança do Manifest V3, a extensão não carrega, não referencia e não executa código hospedado remotamente (como scripts externos de CDN ou bibliotecas dinâmicas).
- **Sem Execução Dinâmica:** A extensão não utiliza funções perigosas de execução em tempo de execução, como `eval()` ou `new Function()`.
- **Integridade de Scripts:** Todos os arquivos de lógica, interface e estilo (HTML, CSS, JavaScript) estão integralmente contidos no pacote local da extensão.

---

## 6. Links Externos

A interface da extensão (popup e tela informativa de nova guia) disponibiliza exclusivamente links diretos para os perfis profissionais do desenvolvedor (GitHub e LinkedIn). Esses links são abertos em uma nova aba mediante clique voluntário do usuário, utilizando atributos de segurança `rel="noopener noreferrer"`. A extensão não rastreia e não intercepta esses acessos.

---

## 7. Retenção e Exclusão de Dados

- Os dados gravados em `chrome.storage.local` permanecem no navegador do usuário enquanto este mantiver a URL configurada.
- O usuário pode remover o endereço salvo a qualquer momento clicando no botão **"Restaurar Padrão"** no popup da extensão.
- Caso a extensão seja desinstalada do Google Chrome pelo usuário, todos os dados mantidos em `chrome.storage.local` são apagados automaticamente e de forma definitiva pelo próprio navegador.

---

## 8. Alterações nesta Política

Caso haja atualizações funcionais que alterem as práticas de privacidade da extensão, esta política será atualizada no repositório oficial com a respectiva revisão de data.

---

## 9. Contato e Suporte

Dúvidas ou solicitações referentes à privacidade ou ao funcionamento da extensão podem ser encaminhadas diretamente ao desenvolvedor:

- **Desenvolvedor:** Victor Ladislau Viana
- **GitHub:** [https://github.com/Invictor13](https://github.com/Invictor13)
- **LinkedIn:** [https://www.linkedin.com/in/victor-ladislau-14402a170/](https://www.linkedin.com/in/victor-ladislau-14402a170/)
