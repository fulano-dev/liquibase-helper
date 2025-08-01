@echo off
echo.
echo ========================================
echo   Liquibase Helper - Instalacao
echo ========================================
echo.

REM Verificar se o VS Code está instalado
where code >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] VS Code nao encontrado no PATH
    echo Por favor, certifique-se de que o VS Code esta instalado
    echo e disponivel no PATH do sistema.
    pause
    exit /b 1
)

REM Verificar se o arquivo .vsix existe
if not exist "liquibase-helper-1.0.0.vsix" (
    echo [ERRO] Arquivo liquibase-helper-1.0.0.vsix nao encontrado
    echo Certifique-se de que o arquivo esta na mesma pasta deste script.
    pause
    exit /b 1
)

echo [INFO] Instalando extensao Liquibase Helper...
echo.

REM Instalar a extensão
code --install-extension liquibase-helper-1.0.0.vsix

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCESSO] Extensao instalada com sucesso!
    echo.
    echo Para usar:
    echo 1. Abra o VS Code
    echo 2. Pressione Ctrl+Shift+P
    echo 3. Digite: "Liquibase: Abrir Liquibase Helper"
    echo.
) else (
    echo.
    echo [ERRO] Falha na instalacao da extensao
    echo Tente instalar manualmente via VS Code.
    echo.
)

pause
