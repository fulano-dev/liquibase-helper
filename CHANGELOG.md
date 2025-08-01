# Changelog - Liquibase Helper

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [1.0.0] - 2025-08-01

### 🎉 Primeiro Lançamento Público

### ✨ Funcionalidades Principais
- **Interface webview integrada** ao VS Code com formulários intuitivos
- **Upload de arquivos SQL** via drag & drop ou seleção de arquivos
- **Editor de texto integrado** para digitação direta de scripts
- **Numeração sequencial automática** (01-, 02-, 03-...) por branch
- **Detecção automática de branch Git** com fallbacks robustos
- **Organização automática por pastas** baseada no nome da branch
- **Geração completa de changelog.xml** compatível com Liquibase 3.5+
- **Atualização automática do changelog master** com includes
- **Sistema de configuração** flexível por repositório
- **IDs únicos de changeset** baseados em timestamp para evitar conflitos
- **Validação em tempo real** de campos obrigatórios
- **Feedback visual** detalhado de sucesso/erro

### 🔧 Funcionalidades Técnicas Implementadas
- **Remoção inteligente de prefixos gitflow** (feature/, hotfix/, bugfix/, release/)
- **Timestamps únicos** no formato YYYYMMDD-HHMM para IDs de changeset
- **Suporte a múltiplos scripts** na mesma branch com numeração sequencial
- **Preservação da estrutura existente** sem sobrescrever arquivos
- **Integração completa com Git API** do VS Code
- **Sistema de mensagens** bidirecional entre webview e extensão
- **Manipulação robusta de arquivos** com verificação de existência
- **Geração de XML válido** com namespaces e schemas corretos

### 📁 Estrutura de Arquivos Gerada
```
src/main/resources/db/changelog/
├── changesets/
│   └── [nome-da-branch]/
│       ├── [XX]-[nome-script].sql
│       ├── [XX]-[nome-script].rollback.sql
│       ├── [XX]-[proximo-script].sql
│       ├── [XX]-[proximo-script].rollback.sql
│       └── changelog.xml
└── db.changelog-master.xml (atualizado)
```

### 🎯 Comandos VS Code Disponíveis
- `Liquibase: Abrir Liquibase Helper` - Interface principal para criação de scripts
- `Liquibase: Configurar Liquibase Helper` - Interface de configuração

### 📋 Formato de Changelog XML Gerado
- **Namespace Liquibase 3.5** com schemas validados
- **changeSet principal** com sqlFile e rollback
- **changeSet de tag** para versionamento
- **Caminhos relativos** para portabilidade
- **endDelimiter customizado** (~) para compatibilidade

### ⚙️ Sistema de Configuração
- **Arquivo JSON** automático (`liquibase-helper.json`)
- **Configuração de autor** personalizável
- **Caminhos flexíveis** para diretórios Liquibase
- **Interface gráfica** para configuração inicial

---

## Funcionalidades Planejadas para Próximas Versões

### [1.1.0] - Previsto
- **Validação SQL** básica antes da criação
- **Templates** de scripts predefinidos
- **Histórico** de scripts criados
- **Exportação** de configurações
- Correção de IDs duplicados em changeset
- Melhoria no layout dos botões de seleção
- Implementação de timestamps únicos

### [0.1.0] - 2025-07-31
- Implementação de upload de arquivos
- Numeração sequencial automática
- Suporte a múltiplos scripts por branch
- Verificação de pastas existentes

### [0.0.1] - 2025-07-31
- Versão inicial com funcionalidades básicas
- Interface de criação de scripts
- Geração de changelog.xml
- Atualização de changelog master
