#!/bin/bash

echo ""
echo "========================================"
echo "   Liquibase Helper - Instalação"
echo "========================================"
echo ""

# Verificar se o VS Code está instalado
if ! command -v code &> /dev/null; then
    echo "[ERRO] VS Code não encontrado no PATH"
    echo "Por favor, certifique-se de que o VS Code está instalado"
    echo "e disponível no PATH do sistema."
    exit 1
fi

# Verificar se o arquivo .vsix existe
if [ ! -f "liquibase-helper-1.0.0.vsix" ]; then
    echo "[ERRO] Arquivo liquibase-helper-1.0.0.vsix não encontrado"
    echo "Certifique-se de que o arquivo está na mesma pasta deste script."
    exit 1
fi

echo "[INFO] Instalando extensão Liquibase Helper..."
echo ""

# Instalar a extensão
code --install-extension liquibase-helper-1.0.0.vsix

if [ $? -eq 0 ]; then
    echo ""
    echo "[SUCESSO] Extensão instalada com sucesso!"
    echo ""
    echo "Para usar:"
    echo "1. Abra o VS Code"
    echo "2. Pressione Ctrl+Shift+P (Cmd+Shift+P no Mac)"
    echo "3. Digite: \"Liquibase: Abrir Liquibase Helper\""
    echo ""
else
    echo ""
    echo "[ERRO] Falha na instalação da extensão"
    echo "Tente instalar manualmente via VS Code."
    echo ""
fi

read -p "Pressione Enter para continuar..."
