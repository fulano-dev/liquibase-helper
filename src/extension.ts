import * as vscode from 'vscode';
import { LiquibaseWebviewProvider } from './webview/ui';
import { ConfigUtils } from './helpers/configUtils';

export function activate(context: vscode.ExtensionContext) {
    // Registra o comando principal
    const startCommand = vscode.commands.registerCommand('liquibase-helper.start', () => {
        const provider = new LiquibaseWebviewProvider(context);
        provider.createWebview();
    });

    // Registra o comando de configuração
    const configCommand = vscode.commands.registerCommand('liquibase-helper.configure', async () => {
        try {
            await ConfigUtils.promptForConfig();
            vscode.window.showInformationMessage('Configuração do Liquibase Helper salva com sucesso!');
        } catch (error) {
            vscode.window.showErrorMessage(`Erro ao configurar: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    context.subscriptions.push(startCommand, configCommand);
}

export function deactivate() {}