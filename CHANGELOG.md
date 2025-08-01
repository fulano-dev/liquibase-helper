# Changelog - Liquibase Helper

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [1.0.0] - 2025-07-31

### 🎉 Primeiro Lançamento Público

### ✨ Adicionado
- **Interface gráfica completa** para criação de scripts Liquibase
- **Upload de arquivos SQL** e rollback
- **Numeração sequencial automática** (01-, 02-, 03-...)
- **Detecção automática de branch Git**
- **Organização por pastas** baseada na branch
- **Geração de changelog.xml padronizado**
- **Atualização automática do changelog master**
- **Configurações personalizáveis** por repositório
- **IDs únicos de changeset** sem conflitos
- **Validação de campos obrigatórios**
- **Feedback visual** de todas as operações

### 🔧 Funcionalidades Técnicas
- **Remoção de prefixos gitflow** (feature/, hotfix/, etc.)
- **Timestamps únicos** para evitar conflitos
- **Suporte a múltiplos scripts** na mesma branch
- **Preservação de estrutura existente**
- **Integração com Git do VS Code**

### 📁 Estrutura Gerada
```
src/main/resources/db/changelog/
├── changesets/
│   └── 20250731-nome-da-branch/
│       ├── 01-script-name.sql
│       ├── 01-script-name.rollback.sql
│       ├── 02-segundo-script.sql
│       ├── 02-segundo-script.rollback.sql
│       └── changelog.xml
└── db.changelog-master.xml
```

### 🎯 Comandos Disponíveis
- `Liquibase: Abrir Liquibase Helper` - Interface principal
- `Liquibase: Configurar Liquibase Helper` - Configurações

---

## Versões Anteriores (Desenvolvimento)

### [0.1.1] - 2025-07-31
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
