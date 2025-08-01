# 📦 Guia de Distribuição - Liquibase Helper

Este documento descreve as opções para distribuir a extensão **Liquibase Helper** para usuários finais.

## 🎯 Método Recomendado: Distribuição via .vsix

### ✅ Vantagens
- ✅ **Distribuição imediata** sem aprovação de marketplace
- ✅ **Controle total** sobre versões e atualizações  
- ✅ **Sem custos** de publicação
- ✅ **Instalação simples** para usuários técnicos
- ✅ **Funciona offline** após download

### 📋 Processo de Distribuição

#### 1. **Gerar Arquivo .vsix**
```powershell
# No diretório do projeto
npm run compile
npm run package

# Resultado: liquibase-helper-1.0.0.vsix (≈28KB)
```

#### 2. **Criar Release no GitHub**
1. Acesse: https://github.com/fulano-dev/liquibase-helper
2. Clique em **"Releases"** → **"Create a new release"**
3. **Tag version:** `v1.0.0`
4. **Release title:** `"Liquibase Helper v1.0.0 - Primeiro Lançamento"`
5. **Descrição:** Cole o conteúdo do CHANGELOG.md
6. **Anexar arquivo:** `liquibase-helper-1.0.0.vsix`
7. Marque como **"Latest release"**
8. Clique em **"Publish release"**

#### 3. **Compartilhar com Usuários**
**Link direto do release:**
```
https://github.com/fulano-dev/liquibase-helper/releases/tag/v1.0.0
```

### 📥 Instruções para Usuários Finais

#### **Método 1: Via Command Line (Recomendado)**
```powershell
# 1. Baixar o arquivo .vsix do GitHub Releases
# 2. Executar comando de instalação
code --install-extension liquibase-helper-1.0.0.vsix
```

#### **Método 2: Via Interface do VS Code**
1. Baixar `liquibase-helper-1.0.0.vsix` do GitHub
2. No VS Code: `Ctrl+Shift+P`
3. Digite: **"Extensions: Install from VSIX..."**
4. Selecione o arquivo baixado
5. Reinicie o VS Code se solicitado

#### **Método 3: Script de Instalação Automática**
Criar um script `install.ps1`:
```powershell
# install.ps1
Write-Host "📦 Instalando Liquibase Helper..."

# Verificar se VS Code está instalado
if (!(Get-Command code -ErrorAction SilentlyContinue)) {
    Write-Error "❌ VS Code não encontrado. Instale o Visual Studio Code primeiro."
    exit 1
}

# Baixar e instalar
$url = "https://github.com/fulano-dev/liquibase-helper/releases/download/v1.0.0/liquibase-helper-1.0.0.vsix"
$output = "$env:TEMP\liquibase-helper-1.0.0.vsix"

Invoke-WebRequest -Uri $url -OutFile $output
code --install-extension $output
Remove-Item $output

Write-Host "✅ Liquibase Helper instalado com sucesso!"
Write-Host "🚀 Execute: Ctrl+Shift+P → 'Liquibase: Abrir Liquibase Helper'"
```

---

## 🔄 Alternativa: VS Code Marketplace (Futuro)

### 📋 Pré-requisitos para Marketplace
- **Publisher verificado** no Azure DevOps
- **Ícone de alta qualidade** (128x128px)
- **Screenshots e GIFs** demonstrativos  
- **Documentação completa**
- **Política de privacidade** (se aplicável)
- **Taxa de publicação** (se aplicável)

### 🛠️ Processo de Publicação
```powershell
# 1. Configurar publisher
vsce create-publisher fulano-dev

# 2. Login
vsce login fulano-dev

# 3. Publicar
vsce publish

# 4. Verificar
# https://marketplace.visualstudio.com/items?itemName=fulano-dev.liquibase-helper
```

### ⚖️ Comparação de Métodos

| Aspecto | .vsix Distribution | VS Code Marketplace |
|---------|-------------------|---------------------|
| **Tempo para distribuir** | ⚡ Imediato | 🐌 2-7 dias (revisão) |
| **Custo** | 🆓 Grátis | 💰 Possível taxa |
| **Controle** | 🎯 Total | 📋 Revisão da Microsoft |
| **Descoberta** | 👥 Manual | 🔍 Busca automática |
| **Atualizações** | 📱 Manual | 🔄 Automáticas |
| **Instalação** | 💻 Técnica | 👆 Um clique |

---

## 📊 Recomendação Final

### Para Agora: **Distribuição .vsix**
- ✅ Implementação imediata
- ✅ Sem barreiras burocráticas
- ✅ Funcional para equipes técnicas
- ✅ Feedback rápido dos usuários

### Para Futuro: **Marketplace + .vsix**
- 🎯 Manter ambos os métodos
- 🔍 Marketplace para descoberta
- 📦 .vsix para versões beta/customizadas
