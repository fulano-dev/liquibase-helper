# Liquibase Helper - Extensão VS Code

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=liquibase-team.liquibase-helper)
[![Downloads](https://img.shields.io/badge/downloads-0+-brightgreen.svg)](https://marketplace.visualstudio.com/items?itemName=liquibase-team.liquibase-helper)
[![Rating](https://img.shields.io/badge/rating-⭐⭐⭐⭐⭐-yellow.svg)](https://marketplace.visualstudio.com/items?itemName=liquibase-team.liquibase-helper)

**A extensão definitiva para simplificar a criação e organização de scripts Liquibase!**

![Liquibase Helper Demo](https://raw.githubusercontent.com/liquibase-team/liquibase-helper/main/media/demo.gif)

## 🚀 Funcionalidades

### ✨ **Interface Gráfica Intuitiva**
- **Upload de arquivos SQL** ou digitação direta
- **Formulários organizados** com validação
- **Feedback visual** de todas as operações

### 🔢 **Numeração Automática**
- **Sequenciamento inteligente**: 01-, 02-, 03-...
- **Detecção de scripts existentes** na branch
- **IDs únicos de changeset** sem conflitos

### 📁 **Organização por Branch**
- **Criação automática** de pastas baseada na branch Git
- **Remoção de prefixos** gitflow (feature/, hotfix/, etc.)
- **Múltiplos scripts** por branch

### 🔄 **Gestão de Changelog**
- **Changelog.xml padronizado** automaticamente
- **Atualização do master** changelog
- **Rollback scripts** incluídos

### ⚙️ **Configuração Flexível**
- **Configurações por repositório**
- **Autor personalizado**
- **Caminhos configuráveis**

## 📦 Instalação

### Via VS Code Marketplace
1. Abra o VS Code
2. Vá para Extensions (`Ctrl+Shift+X`)
3. Procure por "Liquibase Helper"
4. Clique em "Install"

### Via Command Line
```bash
code --install-extension liquibase-team.liquibase-helper
```

## 🎯 Como Usar

1. **Abra um projeto com Liquibase no VS Code**

2. **Execute a extensão:**
   - `Ctrl+Shift+P` → "Abrir Liquibase Helper"
   - Ou use o comando: `liquibase-helper.start`

3. **Configure a extensão (primeira vez):**
   - **Autor Padrão:** Seu nome de usuário
   - **Diretório do Liquibase:** Caminho relativo (ex: `src/main/resources/db/changelog`)
   - **Changelog Master:** Caminho do arquivo master (ex: `src/main/resources/db/changelog/db.changelog-master.xml`)

4. **Crie seus scripts:**
   - Clique em "Carregar Branch Atual"
   - Preencha o nome do script (ex: `criar-tabela-usuarios`)
   - Adicione um comentário descritivo
   - Cole o conteúdo SQL do script
   - Cole o conteúdo SQL do rollback
   - Clique em "Criar Scripts"

## Estrutura Gerada

Para uma branch `feature/20250731-criar-usuarios`, a extensão criará:

```
src/main/resources/db/changelog/
├── changesets/
│   └── 20250731-criar-usuarios/
│       ├── 01-criar-tabela-usuarios.sql
│       ├── 01-criar-tabela-usuarios.rollback.sql
│       └── changelog.xml
└── db.changelog-master.xml (atualizado)
```

### Exemplo de changelog.xml gerado:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog" 
                   xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext" 
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog-ext http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd
                                       http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.5.xsd">

  <changeSet id="20250731-1430" author="joao.dev"> 
    <comment>Script para criar tabela de usuários</comment> 
    <sqlFile path="01-criar-tabela-usuarios.sql" relativeToChangelogFile="true" endDelimiter="~" /> 
    <rollback>
      <sqlFile path="01-criar-tabela-usuarios.rollback.sql" relativeToChangelogFile="true" endDelimiter="~" /> 
    </rollback>
  </changeSet>

  <changeSet id="20250731-1431" author="joao.dev">
    <tagDatabase tag="20250731-criar-usuarios" />
  </changeSet>
</databaseChangeLog>
```

## Configuração

A extensão cria um arquivo `liquibase-helper.json` na raiz do seu projeto:

```json
{
  "author": "joao.dev",
  "liquibaseDirectory": "src/main/resources/db/changelog",
  "masterChangelogPath": "src/main/resources/db/changelog/db.changelog-master.xml"
}
```

## Desenvolvimento

### Estrutura do Projeto

```
src/
├── extension.ts              # Ponto de entrada
├── helpers/
│   ├── configUtils.ts        # Gerenciamento de configurações
│   ├── fileUtils.ts          # Criação de arquivos e estruturas
│   └── gitUtils.ts           # Utilitários Git
└── webview/
    └── ui.ts                 # Interface do usuário
```

### Executar em Modo de Desenvolvimento

1. Abra o projeto no VS Code
2. Pressione `F5` para iniciar o modo debug
3. Uma nova janela do VS Code será aberta
4. Execute o comando `liquibase-helper.start`

### Compilar

```bash
npm run compile
```

### Empacotar

```bash
vsce package
```

## Troubleshooting

### Erro: "Cannot find module 'path'"
- Certifique-se de ter instalado as dependências: `npm install`

### Erro: "Branch atual não encontrada"
- A extensão tentará usar a API Git do VS Code
- Como fallback, solicitará que você digite o nome da branch

### Erro: "Changelog master não encontrado"
- Verifique se o caminho configurado está correto
- Certifique-se de que o arquivo existe

### Extensão não aparece no VS Code
- Verifique se a instalação foi bem-sucedida
- Reinicie o VS Code
- Verifique se não há erros no console: `Help > Toggle Developer Tools`

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## Licença

MIT License - veja LICENSE.md para detalhes.
