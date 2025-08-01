import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export interface LiquibaseConfig {
    author: string;
    liquibaseDirectory: string;
    masterChangelogPath: string;
}

export class ConfigUtils {
    private static readonly CONFIG_FILE = 'liquibase-helper.json';

    static async getConfig(): Promise<LiquibaseConfig> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('Nenhuma pasta de workspace aberta');
        }

        const configPath = path.join(workspaceFolder.uri.fsPath, this.CONFIG_FILE);
        
        if (fs.existsSync(configPath)) {
            const configContent = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(configContent);
        }

        // Configuração padrão
        return {
            author: 'dev',
            liquibaseDirectory: 'src/main/resources/db/changelog',
            masterChangelogPath: 'src/main/resources/db/changelog/db.changelog-master.xml'
        };
    }

    static async saveConfig(config: LiquibaseConfig): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('Nenhuma pasta de workspace aberta');
        }

        const configPath = path.join(workspaceFolder.uri.fsPath, this.CONFIG_FILE);
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }

    static async promptForConfig(): Promise<LiquibaseConfig> {
        const author = await vscode.window.showInputBox({
            prompt: 'Digite o nome do autor padrão',
            value: 'dev'
        });

        const liquibaseDirectory = await vscode.window.showInputBox({
            prompt: 'Digite o diretório do Liquibase (relativo ao workspace)',
            value: 'src/main/resources/db/changelog'
        });

        const masterChangelogPath = await vscode.window.showInputBox({
            prompt: 'Digite o caminho do changelog master (relativo ao workspace)',
            value: 'src/main/resources/db/changelog/db.changelog-master.xml'
        });

        if (!author || !liquibaseDirectory || !masterChangelogPath) {
            throw new Error('Todas as configurações são obrigatórias');
        }

        const config: LiquibaseConfig = {
            author,
            liquibaseDirectory,
            masterChangelogPath
        };

        await this.saveConfig(config);
        return config;
    }
}