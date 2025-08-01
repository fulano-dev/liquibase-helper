import * as vscode from 'vscode';

export class GitUtils {
    static async getCurrentBranch(): Promise<string> {
        try {
            // Tenta usar a API do VS Code Git
            const gitExtension = vscode.extensions.getExtension('vscode.git');
            
            if (gitExtension) {
                const gitApi = gitExtension.exports;
                if (gitApi && gitApi.getAPI) {
                    const api = gitApi.getAPI(1);
                    if (api.repositories.length > 0) {
                        const repo = api.repositories[0];
                        const head = repo.state.HEAD;
                        if (head && head.name) {
                            return this.formatBranchName(head.name);
                        }
                    }
                }
            }

            // Fallback: pedir input do usuário
            return await this.getBranchFromUser();
        } catch (error) {
            return await this.getBranchFromUser();
        }
    }

    private static async getBranchFromUser(): Promise<string> {
        const branch = await vscode.window.showInputBox({
            prompt: 'Digite o nome da branch atual (ex: feature/20250731-nome-da-branch)',
            placeHolder: 'feature/20250731-exemplo-branch',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Nome da branch é obrigatório';
                }
                return null;
            }
        });

        if (!branch) {
            throw new Error('Nome da branch não fornecido');
        }

        return this.formatBranchName(branch);
    }

    private static formatBranchName(branchName: string): string {
        // Remove prefixos do gitflow (feature/, hotfix/, release/, etc.)
        const cleaned = branchName
            .replace(/^(feature|hotfix|release|bugfix|support)\//, '')
            .replace(/[^a-zA-Z0-9\-]/g, '-')
            .toLowerCase();
        
        return cleaned;
    }
}