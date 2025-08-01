# Script de Instalação - Liquibase Helper
# Execute este script no PowerShell como Administrador

Write-Host "=== Liquibase Helper - Script de Instalação ===" -ForegroundColor Green

# Função para verificar se um comando existe
function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Verificar pré-requisitos
Write-Host "`n1. Verificando pré-requisitos..." -ForegroundColor Yellow

# Verificar Node.js
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Node.js em: https://nodejs.org/" -ForegroundColor Red
    Write-Host "Pressione qualquer tecla para continuar após instalar o Node.js..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
    if (-not (Test-Command "node")) {
        Write-Host "Node.js ainda não encontrado. Saindo..." -ForegroundColor Red
        exit 1
    }
}

# Verificar NPM
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "✓ NPM encontrado: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ NPM não encontrado (deveria vir com Node.js)" -ForegroundColor Red
    exit 1
}

# Verificar VS Code
if (Test-Command "code") {
    Write-Host "✓ VS Code encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ VS Code não encontrado no PATH" -ForegroundColor Red
    Write-Host "Certifique-se de que o VS Code está instalado e no PATH" -ForegroundColor Red
    Write-Host "Pressione qualquer tecla para continuar mesmo assim..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Instalar VSCE
Write-Host "`n2. Instalando VSCE (VS Code Extension Manager)..." -ForegroundColor Yellow
if (-not (Test-Command "vsce")) {
    try {
        npm install -g vsce
        Write-Host "✓ VSCE instalado com sucesso" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Erro ao instalar VSCE" -ForegroundColor Red
        Write-Host "Tente executar manualmente: npm install -g vsce" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ VSCE já está instalado" -ForegroundColor Green
}

# Navegar para o diretório do projeto
Write-Host "`n3. Navegando para o diretório do projeto..." -ForegroundColor Yellow
$projectPath = "c:\projetos\liquibase-helper"

if (Test-Path $projectPath) {
    Set-Location $projectPath
    Write-Host "✓ Diretório encontrado: $projectPath" -ForegroundColor Green
} else {
    Write-Host "✗ Diretório não encontrado: $projectPath" -ForegroundColor Red
    exit 1
}

# Compilar o projeto
Write-Host "`n4. Compilando o projeto TypeScript..." -ForegroundColor Yellow
try {
    if (Test-Command "tsc") {
        tsc -p ./
    } else {
        # Usar npx como fallback
        npx tsc -p ./
    }
    Write-Host "✓ Compilação concluída" -ForegroundColor Green
}
catch {
    Write-Host "✗ Erro na compilação" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Empacotar a extensão
Write-Host "`n5. Empacotando a extensão..." -ForegroundColor Yellow
try {
    vsce package
    Write-Host "✓ Extensão empacotada com sucesso" -ForegroundColor Green
}
catch {
    Write-Host "✗ Erro ao empacotar extensão" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Encontrar arquivo .vsix
$vsixFile = Get-ChildItem -Name "*.vsix" | Select-Object -First 1
if ($vsixFile) {
    Write-Host "✓ Arquivo criado: $vsixFile" -ForegroundColor Green
} else {
    Write-Host "✗ Arquivo .vsix não encontrado" -ForegroundColor Red
    exit 1
}

# Instalar a extensão no VS Code
Write-Host "`n6. Instalando extensão no VS Code..." -ForegroundColor Yellow
try {
    if (Test-Command "code") {
        code --install-extension $vsixFile
        Write-Host "✓ Extensão instalada com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "⚠ VS Code não encontrado no PATH" -ForegroundColor Yellow
        Write-Host "Instale manualmente:" -ForegroundColor Yellow
        Write-Host "1. Abra o VS Code" -ForegroundColor Yellow
        Write-Host "2. Ctrl+Shift+P" -ForegroundColor Yellow
        Write-Host "3. 'Extensions: Install from VSIX...'" -ForegroundColor Yellow
        Write-Host "4. Selecione: $((Get-Location).Path)\$vsixFile" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "✗ Erro ao instalar extensão" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Resumo final
Write-Host "`n=== Instalação Concluída ===" -ForegroundColor Green
Write-Host "Para usar a extensão:" -ForegroundColor White
Write-Host "1. Abra um projeto no VS Code" -ForegroundColor White
Write-Host "2. Ctrl+Shift+P" -ForegroundColor White
Write-Host "3. Digite: 'Abrir Liquibase Helper'" -ForegroundColor White
Write-Host "`nSe encontrar problemas, consulte GUIA-INSTALACAO.md" -ForegroundColor White

Write-Host "`nPressione qualquer tecla para fechar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
