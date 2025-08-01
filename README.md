# Liquibase Helper - Extensão VS Code

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/fulano-dev/liquibase-helper)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.50+-blue.svg)](https://code.visualstudio.com/)

**A extensão definitiva para simplificar a criação e organização de scripts Liquibase!**

Automatiza a criação de estruturas Liquibase padronizadas, numeração sequencial de scripts, e geração de changelogs XML compatíveis com Liquibase.

## 🚀 Funcionalidades Principais

### ✨ **Interface Gráfica Intuitiva**
- **Webview integrada** ao VS Code com formulários organizados
- **Upload de arquivos SQL** via drag & drop ou seleção
- **Editor de texto** para digitação direta de scripts
- **Validação em tempo real** de campos obrigatórios
- **Feedback visual** de sucesso/erro nas operações

### 🔢 **Numeração Automática Inteligente**
- **Sequenciamento automático**: 01-, 02-, 03-... dentro da branch
- **Detecção de scripts existentes** para continuar numeração
- **IDs únicos de changeset** baseados em timestamp (YYYYMMDD-HHMM)
- **Prevenção de conflitos** entre desenvolvedores

### 📁 **Organização Automática por Branch**
- **Detecção automática** da branch Git atual
- **Criação automática** de pasta baseada no nome da branch
- **Remoção inteligente** de prefixos gitflow (feature/, hotfix/, bugfix/, etc.)
- **Múltiplos scripts** por branch com numeração sequencial

### 🔄 **Gestão Completa de Changelog**
- **Geração automática** de changelog.xml para cada branch
- **Atualização automática** do changelog master
- **Estrutura Liquibase padrão** (changeset + tag)
- **Inclusão automática** de scripts de rollback
- **Endereçamento relativo** dos arquivos SQL

### ⚙️ **Configuração Flexível**
- **Arquivo de configuração** por repositório (`liquibase-helper.json`)
- **Configuração de autor** padrão
- **Caminhos personalizáveis** para diretórios Liquibase
- **Interface de configuração** integrada ao VS Code

## 📦 Instalação

### Via Arquivo .vsix (Método Recomendado)
1. **Baixe a extensão:**
   - Acesse os [Releases do GitHub](https://github.com/fulano-dev/liquibase-helper/releases)
   - Baixe o arquivo `liquibase-helper-1.0.0.vsix`

2. **Instale no VS Code:**
   ```powershell
   code --install-extension liquibase-helper-1.0.0.vsix
   ```
   
   Ou pelo VS Code:
   - `Ctrl+Shift+P` → "Extensions: Install from VSIX..."
   - Selecione o arquivo baixado

### Via Command Line (Requer arquivo local)
```powershell
# Navegue até o diretório onde está o arquivo .vsix
cd C:\Downloads
code --install-extension liquibase-helper-1.0.0.vsix
```

## 🎯 Como Usar

### 1. **Abra um projeto com Git no VS Code**
   A extensão detecta automaticamente a branch Git atual.

### 2. **Configure a extensão (primeira vez):**
   - `Ctrl+Shift+P` → "Liquibase: Configurar Liquibase Helper"
   - **Autor Padrão:** Seu nome/usuário (aparecerá nos changesets)
   - **Diretório do Liquibase:** Caminho relativo onde estão os changelogs (ex: `src/main/resources/db/changelog`)
   - **Changelog Master:** Caminho do arquivo master (ex: `src/main/resources/db/changelog/db.changelog-master.xml`)

### 3. **Execute a extensão:**
   - `Ctrl+Shift+P` → "Liquibase: Abrir Liquibase Helper"
   - Ou use o comando: `liquibase-helper.start`

### 4. **Crie seus scripts usando a interface:**
   
   **📋 Formulário Principal:**
   - **Nome do Script:** Digite um nome descritivo (ex: `criar-tabela-usuarios`)
   - **Comentário:** Descrição do que o script faz
   - **Conteúdo SQL:** Cole ou digite o script SQL principal
   - **Rollback SQL:** Cole ou digite o script de rollback
   
   **📁 Upload de Arquivos:**
   - Use "Carregar Arquivo SQL" para fazer upload de arquivos .sql
   - Use "Carregar Arquivo Rollback" para fazer upload do rollback
   
   **✅ Criação:**
   - Clique em "Criar Scripts" para gerar toda a estrutura automaticamente

### 5. **Resultado Automático:**
   - ✅ Pasta criada baseada na branch atual
   - ✅ Scripts numerados sequencialmente 
   - ✅ Changelog.xml gerado
   - ✅ Master changelog atualizado

## 📁 Estrutura Gerada

Para uma branch `feature/20250731-criar-usuarios`, a extensão criará automaticamente:

```
src/main/resources/db/changelog/
├── changesets/
│   └── 20250731-criar-usuarios/              # Pasta baseada na branch
│       ├── 01-criar-tabela-usuarios.sql      # Script principal numerado
│       ├── 01-criar-tabela-usuarios.rollback.sql  # Script de rollback
│       ├── 02-adicionar-indices.sql          # Próximo script (se houver)
│       ├── 02-adicionar-indices.rollback.sql
│       └── changelog.xml                     # Changelog da branch
└── db.changelog-master.xml                   # Master atualizado automaticamente
```

### 📋 Exemplo de changelog.xml gerado:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog" 
                   xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext" 
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog-ext 
                                       http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd
                                       http://www.liquibase.org/xml/ns/dbchangelog 
                                       http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.5.xsd">

  <!-- Script SQL Principal -->
  <changeSet id="20250731-1430" author="joao.dev"> 
    <comment>Script para criar tabela de usuários</comment> 
    <sqlFile path="01-criar-tabela-usuarios.sql" relativeToChangelogFile="true" endDelimiter="~" /> 
    <rollback>
      <sqlFile path="01-criar-tabela-usuarios.rollback.sql" relativeToChangelogFile="true" endDelimiter="~" /> 
    </rollback>
  </changeSet>

  <!-- Tag para versionamento -->
  <changeSet id="20250731-1431" author="joao.dev">
    <tagDatabase tag="20250731-criar-usuarios" />
  </changeSet>
</databaseChangeLog>
```

### 🏷️ Características dos IDs Gerados:
- **Formato:** `YYYYMMDD-HHMM` (ex: `20250731-1430`)
- **Único por execução:** Baseado no timestamp exato
- **Sequencial por branch:** Scripts numerados 01-, 02-, 03-...
- **Sem conflitos:** Cada execução gera IDs únicos 
    </rollback>
  </changeSet>

  <changeSet id="20250731-1431" author="joao.dev">
    <tagDatabase tag="20250731-criar-usuarios" />
  </changeSet>
</databaseChangeLog>
```

## ⚙️ Configuração

A extensão cria automaticamente um arquivo `liquibase-helper.json` na raiz do seu projeto:

```json
{
  "author": "joao.dev",                        // Autor que aparece nos changesets
  "liquibaseDirectory": "src/main/resources/db/changelog",  // Diretório base do Liquibase
  "masterChangelogPath": "src/main/resources/db/changelog/db.changelog-master.xml"  // Changelog master
}
```

### 🔧 Como Configurar:

1. **Via Interface:**
   - `Ctrl+Shift+P` → "Liquibase: Configurar Liquibase Helper"
   - Preencha os campos na interface
   - Configurações são salvas automaticamente

2. **Edição Manual:**
   - Edite o arquivo `liquibase-helper.json` na raiz do projeto
   - A extensão carrega as configurações automaticamente

### 📋 Parâmetros de Configuração:

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| `author` | Nome que aparece no campo `author` dos changesets | `"joao.dev"` |
| `liquibaseDirectory` | Diretório onde estão os changelogs (relativo à raiz) | `"src/main/resources/db/changelog"` |
| `masterChangelogPath` | Caminho completo do changelog master | `"src/main/resources/db/changelog/db.changelog-master.xml"` |

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
src/
├── extension.ts              # 📍 Ponto de entrada e ativação da extensão
├── helpers/
│   ├── configUtils.ts        # ⚙️ Gerenciamento de configurações JSON
│   ├── fileUtils.ts          # 📁 Criação de arquivos e estruturas Liquibase
│   └── gitUtils.ts           # 🔗 Utilitários Git e detecção de branch
└── webview/
    └── ui.ts                 # 🎨 Interface webview e manipulação de formulários
```

### ⚡ Executar em Modo de Desenvolvimento

1. **Clone e prepare o projeto:**
   ```powershell
   git clone https://github.com/fulano-dev/liquibase-helper.git
   cd liquibase-helper
   npm install
   ```

2. **Abra no VS Code e execute:**
   - Abra o projeto no VS Code
   - Pressione `F5` para iniciar o modo debug
   - Uma nova janela do VS Code será aberta (Extension Development Host)
   - Execute o comando `Liquibase: Abrir Liquibase Helper`

### 🔨 Scripts Disponíveis

```powershell
npm run compile      # Compila TypeScript para JavaScript
npm run watch        # Compila em modo watch (auto-recompila)
npm run package      # Cria arquivo .vsix para distribuição
npm run install-local  # Instala extensão localmente
```

### 📦 Criar Pacote para Distribuição

```powershell
# Compilar o projeto
npm run compile

# Gerar arquivo .vsix
npm run package

# Resultado: liquibase-helper-1.0.0.vsix
```

## 🚨 Troubleshooting

### ❌ Erro: "Cannot find module 'path'"
**Solução:**
```powershell
# Instale as dependências do projeto
npm install
```

### ❌ Erro: "Branch atual não encontrada"
**Causa:** A extensão não conseguiu detectar a branch Git automaticamente.

**Soluções:**
1. Certifique-se de que o projeto está em um repositório Git
2. Execute `git status` para verificar se há uma branch ativa
3. A extensão tentará usar a API Git do VS Code como fallback

### ❌ Erro: "Changelog master não encontrado"
**Causa:** O arquivo de changelog master configurado não existe.

**Soluções:**
1. Verifique se o caminho em `liquibaseDirectory` está correto
2. Verifique se o arquivo `masterChangelogPath` existe
3. Crie o arquivo master manualmente se necessário:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog">
   </databaseChangeLog>
   ```

### ❌ Extensão não aparece no Command Palette
**Soluções:**
1. Verifique se a instalação foi bem-sucedida
2. Reinicie o VS Code completamente
3. Verifique se não há erros no console: `Help > Toggle Developer Tools`
4. Certifique-se de ter um workspace aberto (a extensão só funciona com projetos abertos)

### ❌ Interface não carrega / Webview em branco
**Soluções:**
1. Verifique o console do VS Code para erros JavaScript
2. Reinicie o VS Code
3. Execute `Developer: Reload Window` (`Ctrl+Shift+P`)

### ❌ Numeração de scripts incorreta
**Causa:** Scripts existentes na pasta não seguem o padrão esperado.

**Solução:**
- A extensão procura por arquivos no formato `XX-*.sql` (ex: `01-`, `02-`)
- Renomeie scripts existentes para seguir esse padrão se necessário

### 🆘 Obtendo Ajuda Adicional

1. **Console de Desenvolvimento:**
   - `Help > Toggle Developer Tools`
   - Verifique a aba "Console" para erros detalhados

2. **Logs da Extensão:**
   - `View > Output`
   - Selecione "Log (Window)" no dropdown para ver logs do VS Code

3. **Reportar Problemas:**
   - [GitHub Issues](https://github.com/fulano-dev/liquibase-helper/issues)
   - Inclua informações sobre: SO, versão do VS Code, logs de erro

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Aqui está como você pode ajudar:

### 🐛 Reportando Bugs
1. Acesse [GitHub Issues](https://github.com/fulano-dev/liquibase-helper/issues)
2. Verifique se o bug já foi reportado
3. Crie uma nova issue com:
   - Descrição detalhada do problema
   - Passos para reproduzir
   - Versão do VS Code e SO
   - Screenshots se aplicável

### 💡 Sugerindo Melhorias
1. Abra uma [Feature Request](https://github.com/fulano-dev/liquibase-helper/issues)
2. Descreva a funcionalidade desejada
3. Explique como isso melhoraria a extensão

### 🔧 Contribuindo com Código
1. **Fork** o projeto
2. **Clone** seu fork localmente
3. **Crie uma branch** para sua feature:
   ```powershell
   git checkout -b feature/minha-nova-funcionalidade
   ```
4. **Faça suas modificações** e teste
5. **Commit** suas mudanças:
   ```powershell
   git commit -m "Adiciona nova funcionalidade X"
   ```
6. **Push** para sua branch:
   ```powershell
   git push origin feature/minha-nova-funcionalidade
   ```
7. **Abra um Pull Request** no GitHub

### 📋 Guidelines para Contribuição
- Use TypeScript para todo código novo
- Siga as convenções de código existentes
- Adicione comentários para lógica complexa
- Teste suas mudanças antes de enviar
- Atualize documentação se necessário

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

### 📝 Resumo da Licença MIT:
- ✅ Uso comercial permitido
- ✅ Modificação permitida  
- ✅ Distribuição permitida
- ✅ Uso privado permitido
- ❌ Nenhuma garantia fornecida
- ❌ Nenhuma responsabilidade assumida

---

## 📞 Suporte e Contato

- **GitHub:** [fulano-dev/liquibase-helper](https://github.com/fulano-dev/liquibase-helper)
- **Issues:** [Reportar problemas](https://github.com/fulano-dev/liquibase-helper/issues)
- **Email:** joao@fulano.dev

**Feito com ❤️ para a comunidade de desenvolvedores**
