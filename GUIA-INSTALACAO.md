# Guia Passo a Passo - Liquibase Helper

## 📋 Pré-requisitos

### 1. Instalar Node.js
1. Acesse: https://nodejs.org/
2. Baixe a versão LTS (recomendada)
3. Execute o instalador seguindo as instruções padrão
4. Teste a instalação:
   ```bash
   node --version
   npm --version
   ```

### 2. Instalar VSCE (VS Code Extension Manager)
```bash
npm install -g vsce
```

## 🔧 Compilação e Instalação

### Passo 1: Preparar o Ambiente
```bash
# Navegue até a pasta do projeto
cd "c:\projetos\liquibase-helper"

# Instale as dependências (quando disponível)
npm install
```

### Passo 2: Compilar o TypeScript
```bash
# Compila o projeto
npm run compile

# Ou use o comando direto
tsc -p ./
```

### Passo 3: Empacotar a Extensão
```bash
# Cria o arquivo .vsix
vsce package
```

### Passo 4: Instalar no VS Code
```bash
# Instala a extensão empacotada
code --install-extension liquibase-helper-0.0.1.vsix
```

**Ou instale via interface:**
1. Abra o VS Code
2. `Ctrl+Shift+P`
3. Digite: "Extensions: Install from VSIX..."
4. Selecione o arquivo `liquibase-helper-0.0.1.vsix`

## 🚀 Primeiro Uso

### 1. Configuração Inicial
1. Abra um projeto no VS Code
2. `Ctrl+Shift+P` → "Configurar Liquibase Helper"
3. Defina:
   - **Autor:** Seu nome/usuário
   - **Diretório Liquibase:** `src/main/resources/db/changelog`
   - **Changelog Master:** `src/main/resources/db/changelog/db.changelog-master.xml`

### 2. Usar a Extensão
1. `Ctrl+Shift+P` → "Abrir Liquibase Helper"
2. Clique em "Carregar Branch Atual"
3. Preencha os campos:
   - Nome do script
   - Comentário descritivo
   - SQL do script
   - SQL do rollback
4. Clique em "Criar Scripts"

## 📁 Estrutura Esperada do Projeto

Seu projeto deve ter uma estrutura similar a:
```
meu-projeto/
├── src/
│   └── main/
│       └── resources/
│           └── db/
│               └── changelog/
│                   ├── db.changelog-master.xml
│                   └── changesets/
│                       └── (pastas geradas automaticamente)
├── liquibase-helper.json (criado automaticamente)
└── outros arquivos...
```

## 📝 Exemplo de Uso Completo

### Cenário: Criar tabela de usuários

1. **Branch atual:** `feature/20250731-criar-usuarios`
2. **Nome do script:** `criar-tabela-usuarios`
3. **Comentário:** `Script para criar tabela de usuários do sistema`
4. **SQL Script:**
   ```sql
   CREATE TABLE usuarios (
       id BIGINT PRIMARY KEY,
       nome VARCHAR(100) NOT NULL,
       email VARCHAR(150) UNIQUE NOT NULL,
       data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   )~
   ```
5. **SQL Rollback:**
   ```sql
   DROP TABLE usuarios~
   ```

### Resultado gerado:
```
src/main/resources/db/changelog/
├── changesets/
│   └── 20250731-criar-usuarios/
│       ├── 01-criar-tabela-usuarios.sql
│       ├── 01-criar-tabela-usuarios.rollback.sql
│       └── changelog.xml
└── db.changelog-master.xml (atualizado)
```

## 🐛 Solução de Problemas

### Erro: "npm não reconhecido"
- **Causa:** Node.js não instalado ou não está no PATH
- **Solução:** Reinstale o Node.js e reinicie o terminal

### Erro: "vsce não reconhecido" 
- **Causa:** VSCE não instalado globalmente
- **Solução:** `npm install -g vsce`

### Erro: "tsc não reconhecido"
- **Causa:** TypeScript não encontrado
- **Solução:** `npm install -g typescript` ou use `npx tsc -p ./`

### Erro: "Cannot find module 'path'"
- **Causa:** Dependências não instaladas
- **Solução:** `npm install` (quando package.json estiver completo)

### Extensão não aparece no VS Code
1. Verifique se a instalação foi bem-sucedida
2. Reinicie o VS Code completamente
3. `Ctrl+Shift+P` → "Developer: Reload Window"
4. Verifique erros: `Help > Toggle Developer Tools`

### Branch não detectada automaticamente
- A extensão pedirá para você digitar manualmente
- Formato esperado: `feature/20250731-nome-da-branch`

### Changelog master não encontrado
1. Verifique se o arquivo existe no caminho configurado
2. Use "Configurar Liquibase Helper" para corrigir o caminho
3. Crie o arquivo manualmente se necessário:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                      xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog 
                                          http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.5.xsd">
   </databaseChangeLog>
   ```

## 📚 Comandos Disponíveis

- `Liquibase: Abrir Liquibase Helper` - Interface principal
- `Liquibase: Configurar Liquibase Helper` - Configurações

## 🔄 Desenvolvimento e Debug

### Executar em modo desenvolvimento:
1. Abra o projeto da extensão no VS Code
2. Pressione `F5`
3. Uma nova janela do VS Code será aberta
4. Teste a extensão na nova janela

### Recompilar após mudanças:
```bash
npm run compile
```

### Watch mode (recompila automaticamente):
```bash
npm run watch
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique se seguiu todos os pré-requisitos
2. Consulte a seção de solução de problemas
3. Verifique o console do VS Code para erros específicos
4. Entre em contato com a equipe de desenvolvimento
