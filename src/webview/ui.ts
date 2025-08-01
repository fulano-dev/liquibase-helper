import * as vscode from 'vscode';
import { ConfigUtils, LiquibaseConfig } from '../helpers/configUtils';
import { GitUtils } from '../helpers/gitUtils';
import { FileUtils, ScriptData } from '../helpers/fileUtils';

export class LiquibaseWebviewProvider {
    private context: vscode.ExtensionContext;
    private panel?: vscode.WebviewPanel;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public createWebview(): void {
        this.panel = vscode.window.createWebviewPanel(
            'liquibaseHelper',
            'Liquibase Helper',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        this.panel.webview.html = this.getWebviewContent();
        this.panel.webview.onDidReceiveMessage(
            this.handleMessage.bind(this),
            undefined,
            this.context.subscriptions
        );
    }

    private async handleMessage(message: any): Promise<void> {
        try {
            switch (message.command) {
                case 'loadConfig':
                    await this.loadConfig();
                    break;
                case 'saveConfig':
                    await this.saveConfig(message.config);
                    break;
                case 'createScripts':
                    await this.createScripts(message.data);
                    break;
                case 'getBranch':
                    await this.getBranchName();
                    break;
                case 'checkFolder':
                    await this.checkExistingFolder(message.branchName);
                    break;
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Erro: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async loadConfig(): Promise<void> {
        try {
            const config = await ConfigUtils.getConfig();
            this.panel?.webview.postMessage({
                command: 'configLoaded',
                config: config
            });
        } catch (error) {
            this.panel?.webview.postMessage({
                command: 'configError',
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    private async saveConfig(config: LiquibaseConfig): Promise<void> {
        try {
            await ConfigUtils.saveConfig(config);
            vscode.window.showInformationMessage('Configuração salva com sucesso!');
            this.panel?.webview.postMessage({
                command: 'configSaved'
            });
        } catch (error) {
            throw error;
        }
    }

    private async getBranchName(): Promise<void> {
        try {
            const branchName = await GitUtils.getCurrentBranch();
            this.panel?.webview.postMessage({
                command: 'branchLoaded',
                branchName: branchName
            });
        } catch (error) {
            this.panel?.webview.postMessage({
                command: 'branchError',
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    private async checkExistingFolder(branchName: string): Promise<void> {
        try {
            const config = await ConfigUtils.getConfig();
            const folderInfo = await FileUtils.checkExistingFolder(branchName, config.liquibaseDirectory);
            
            if (folderInfo.exists) {
                this.panel?.webview.postMessage({
                    command: 'folderInfo',
                    folderPath: folderInfo.folderPath,
                    nextNumber: folderInfo.nextNumber
                });
            } else {
                this.panel?.webview.postMessage({
                    command: 'folderNotFound'
                });
            }
        } catch (error) {
            this.panel?.webview.postMessage({
                command: 'branchError',
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    private async createScripts(data: ScriptData): Promise<void> {
        try {
            const config = await ConfigUtils.getConfig();
            const branchName = await GitUtils.getCurrentBranch();
            
            await FileUtils.createLiquibaseStructure(
                branchName,
                data,
                config.liquibaseDirectory,
                config.masterChangelogPath
            );

            this.panel?.webview.postMessage({
                command: 'scriptsCreated'
            });
        } catch (error) {
            throw error;
        }
    }

    private getWebviewContent(): string {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liquibase Helper</title>
    <link href="#" rel="stylesheet">
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--vscode-input-border);
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 2px;
        }
        textarea {
            min-height: 100px;
            resize: vertical;
        }
        button {
            padding: 8px 16px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 2px;
            cursor: pointer;
            margin-right: 10px;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .secondary {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        .secondary:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        .branch-info {
            background-color: var(--vscode-textBlockQuote-background);
            padding: 10px;
            border-left: 4px solid var(--vscode-textBlockQuote-border);
            margin-bottom: 20px;
        }
        .hidden {
            display: none;
        }
        .error {
            color: var(--vscode-errorForeground);
            font-size: 0.9em;
        }
        .success {
            color: var(--vscode-terminal-ansiGreen);
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Liquibase Helper</h1>
        
        <!-- Configuração -->
        <div class="section">
            <h2>Configuração</h2>
            <div class="form-group">
                <label for="author">Autor Padrão:</label>
                <input type="text" id="author" placeholder="Seu nome de usuário">
            </div>
            <div class="form-group">
                <label for="liquibaseDir">Diretório do Liquibase:</label>
                <input type="text" id="liquibaseDir" placeholder="src/main/resources/db/changelog">
            </div>
            <div class="form-group">
                <label for="masterChangelog">Caminho do Changelog Master:</label>
                <input type="text" id="masterChangelog" placeholder="src/main/resources/db/changelog/db.changelog-master.xml">
            </div>
            <button onclick="saveConfig()">Salvar Configuração</button>
            <button class="secondary" onclick="loadConfig()">Carregar Configuração</button>
            <div id="configStatus"></div>
        </div>

        <!-- Informações da Branch -->
        <div class="section">
            <h2>Informações da Branch</h2>
            <div id="branchInfo" class="branch-info hidden">
                <strong>Branch atual:</strong> <span id="currentBranch"></span><br>
                <strong>Pasta será criada:</strong> <span id="folderName"></span>
            </div>
            <button onclick="loadBranch()">Carregar Branch Atual</button>
            <div id="branchStatus"></div>
        </div>

        <!-- Criação de Scripts -->
        <div class="section">
            <h2>Criar Scripts Liquibase</h2>
            
            <!-- Método de entrada -->
            <div class="form-group">
                <label>Método de Entrada:</label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" id="methodText" name="inputMethod" value="text" checked onchange="toggleInputMethod()">
                        Digitar SQL
                    </label>
                    
                    <label class="radio-option">
                        <input type="radio" id="methodFile" name="inputMethod" value="file" onchange="toggleInputMethod()">
                        Upload de Arquivos
                    </label>
                </div>
            </div>

            <!-- Upload de arquivos -->
            <div id="fileUploadSection" class="hidden">
                <div class="form-group">
                    <label for="scriptFile">Arquivo SQL Principal:</label>
                    <input type="file" id="scriptFile" accept=".sql" onchange="loadFileContent('scriptFile', 'scriptContent')">
                </div>
                <div class="form-group">
                    <label for="rollbackFile">Arquivo SQL Rollback:</label>
                    <input type="file" id="rollbackFile" accept=".sql" onchange="loadFileContent('rollbackFile', 'rollbackContent')">
                </div>
            </div>

            <div class="form-group">
                <label for="scriptName">Nome do Script:</label>
                <input type="text" id="scriptName" placeholder="exemplo-criacao-tabela">
                <small>O número será adicionado automaticamente (01-, 02-, etc.)</small>
            </div>
            <div class="form-group">
                <label for="comment">Comentário:</label>
                <input type="text" id="comment" placeholder="Script para criar tabela de usuários">
            </div>
            
            <!-- Seção de entrada de texto -->
            <div id="textInputSection">
                <div class="form-group">
                    <label for="scriptContent">Conteúdo do Script SQL:</label>
                    <textarea id="scriptContent" placeholder="CREATE TABLE usuarios (...)~"></textarea>
                </div>
                <div class="form-group">
                    <label for="rollbackContent">Conteúdo do Rollback SQL:</label>
                    <textarea id="rollbackContent" placeholder="DROP TABLE usuarios~"></textarea>
                </div>
            </div>

            <!-- Informações da pasta -->
            <div id="folderInfo" class="hidden">
                <div class="branch-info">
                    <strong>Pasta de destino:</strong> <span id="targetFolder"></span><br>
                    <strong>Próximo número:</strong> <span id="nextNumber"></span>
                </div>
            </div>

            <button onclick="createScripts()">Criar Scripts</button>
            <button class="secondary" onclick="checkExistingFolder()">Verificar Pasta Existente</button>
            <div id="scriptStatus"></div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function saveConfig() {
            const config = {
                author: document.getElementById('author').value,
                liquibaseDirectory: document.getElementById('liquibaseDir').value,
                masterChangelogPath: document.getElementById('masterChangelog').value
            };

            if (!config.author || !config.liquibaseDirectory || !config.masterChangelogPath) {
                showStatus('configStatus', 'Todos os campos de configuração são obrigatórios', 'error');
                return;
            }

            vscode.postMessage({
                command: 'saveConfig',
                config: config
            });
        }

        function loadConfig() {
            vscode.postMessage({
                command: 'loadConfig'
            });
        }

        function loadBranch() {
            vscode.postMessage({
                command: 'getBranch'
            });
        }

        function checkExistingFolder() {
            const branchName = document.getElementById('currentBranch').textContent;
            if (!branchName) {
                showStatus('scriptStatus', 'Carregue a branch primeiro', 'error');
                return;
            }

            vscode.postMessage({
                command: 'checkFolder',
                branchName: branchName
            });
        }

        function toggleInputMethod() {
            const isFileMethod = document.getElementById('methodFile').checked;
            const fileSection = document.getElementById('fileUploadSection');
            const textSection = document.getElementById('textInputSection');
            
            if (isFileMethod) {
                fileSection.classList.remove('hidden');
                textSection.classList.add('hidden');
            } else {
                fileSection.classList.add('hidden');
                textSection.classList.remove('hidden');
            }
        }

        function loadFileContent(fileInputId, textareaId) {
            const fileInput = document.getElementById(fileInputId);
            const textarea = document.getElementById(textareaId);
            
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    textarea.value = e.target.result;
                };
                
                reader.readAsText(file);
            }
        }

        function createScripts() {
            const data = {
                scriptName: document.getElementById('scriptName').value,
                comment: document.getElementById('comment').value,
                scriptContent: document.getElementById('scriptContent').value,
                rollbackContent: document.getElementById('rollbackContent').value,
                author: document.getElementById('author').value
            };

            if (!data.scriptName || !data.comment || !data.scriptContent || !data.rollbackContent || !data.author) {
                showStatus('scriptStatus', 'Todos os campos são obrigatórios', 'error');
                return;
            }

            vscode.postMessage({
                command: 'createScripts',
                data: data
            });
        }

        function showStatus(elementId, message, type = 'success') {
            const element = document.getElementById(elementId);
            element.textContent = message;
            element.className = type;
            setTimeout(() => {
                element.textContent = '';
                element.className = '';
            }, 5000);
        }

        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.command) {
                case 'configLoaded':
                    document.getElementById('author').value = message.config.author;
                    document.getElementById('liquibaseDir').value = message.config.liquibaseDirectory;
                    document.getElementById('masterChangelog').value = message.config.masterChangelogPath;
                    showStatus('configStatus', 'Configuração carregada com sucesso');
                    break;
                case 'configError':
                    showStatus('configStatus', 'Erro ao carregar configuração: ' + message.error, 'error');
                    break;
                case 'configSaved':
                    showStatus('configStatus', 'Configuração salva com sucesso');
                    break;
                case 'branchLoaded':
                    document.getElementById('currentBranch').textContent = message.branchName;
                    document.getElementById('folderName').textContent = message.branchName;
                    document.getElementById('branchInfo').classList.remove('hidden');
                    showStatus('branchStatus', 'Branch carregada com sucesso');
                    break;
                case 'branchError':
                    showStatus('branchStatus', 'Erro ao carregar branch: ' + message.error, 'error');
                    break;
                case 'scriptsCreated':
                    showStatus('scriptStatus', 'Scripts criados com sucesso!');
                    // Limpa os campos
                    document.getElementById('scriptName').value = '';
                    document.getElementById('comment').value = '';
                    document.getElementById('scriptContent').value = '';
                    document.getElementById('rollbackContent').value = '';
                    // Atualiza informações da pasta
                    checkExistingFolder();
                    break;
                case 'folderInfo':
                    document.getElementById('targetFolder').textContent = message.folderPath;
                    document.getElementById('nextNumber').textContent = message.nextNumber.toString().padStart(2, '0');
                    document.getElementById('folderInfo').classList.remove('hidden');
                    showStatus('scriptStatus', 'Pasta encontrada. Próximo script será: ' + message.nextNumber.toString().padStart(2, '0') + '-');
                    break;
                case 'folderNotFound':
                    document.getElementById('folderInfo').classList.add('hidden');
                    showStatus('scriptStatus', 'Nova pasta será criada para esta branch');
                    break;
            }
        });

        // Load config on startup
        loadConfig();
    </script>
</body>
</html>`;
    }
}