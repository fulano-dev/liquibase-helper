import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export interface ScriptData {
    scriptName: string;
    scriptContent: string;
    rollbackContent: string;
    author: string;
    comment: string;
}

export interface FolderInfo {
    exists: boolean;
    folderPath: string;
    nextNumber: number;
}

export class FileUtils {
    static async checkExistingFolder(branchName: string, liquibaseDirectory: string): Promise<FolderInfo> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('Nenhuma pasta de workspace aberta');
        }

        const workspacePath = workspaceFolder.uri.fsPath;
        const branchFolderPath = path.join(workspacePath, liquibaseDirectory, 'changesets', branchName);
        
        if (fs.existsSync(branchFolderPath)) {
            // Verifica quantos scripts já existem
            const files = fs.readdirSync(branchFolderPath);
            const sqlFiles = files.filter(file => file.endsWith('.sql') && !file.includes('.rollback.'));
            const nextNumber = sqlFiles.length + 1;
            
            return {
                exists: true,
                folderPath: branchFolderPath,
                nextNumber: nextNumber
            };
        }

        return {
            exists: false,
            folderPath: branchFolderPath,
            nextNumber: 1
        };
    }

    static async createLiquibaseStructure(
        branchName: string,
        scriptData: ScriptData,
        liquibaseDirectory: string,
        masterChangelogPath: string
    ): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('Nenhuma pasta de workspace aberta');
        }

        const workspacePath = workspaceFolder.uri.fsPath;
        const branchFolderPath = path.join(workspacePath, liquibaseDirectory, 'changesets', branchName);

        // Cria o diretório da branch se não existir
        if (!fs.existsSync(branchFolderPath)) {
            fs.mkdirSync(branchFolderPath, { recursive: true });
        }

        // Determina o próximo número de script
        const folderInfo = await this.checkExistingFolder(branchName, liquibaseDirectory);
        const scriptNumber = folderInfo.nextNumber.toString().padStart(2, '0');

        // Gera timestamps únicos baseados no número do script
        const now = new Date();
        const baseTimestamp = this.formatTimestamp(new Date(now.getTime() + (folderInfo.nextNumber * 60000))); // +N minutos baseado no número do script

        // Cria os arquivos de script
        const scriptFileName = `${scriptNumber}-${scriptData.scriptName}.sql`;
        const rollbackFileName = `${scriptNumber}-${scriptData.scriptName}.rollback.sql`;

        const scriptPath = path.join(branchFolderPath, scriptFileName);
        const rollbackPath = path.join(branchFolderPath, rollbackFileName);

        fs.writeFileSync(scriptPath, scriptData.scriptContent);
        fs.writeFileSync(rollbackPath, scriptData.rollbackContent);

        // Atualiza ou cria o changelog.xml
        await this.updateOrCreateChangelog(
            branchFolderPath,
            baseTimestamp,
            baseTimestamp, // Não usamos mais rollbackTimestamp separado
            scriptData.author,
            scriptData.comment,
            scriptFileName,
            rollbackFileName,
            branchName,
            folderInfo.nextNumber === 1 // É o primeiro script?
        );

        // Atualiza o changelog master apenas se for o primeiro script da branch
        if (folderInfo.nextNumber === 1) {
            await this.updateMasterChangelog(workspacePath, masterChangelogPath, branchName, scriptData.comment);
        }

        vscode.window.showInformationMessage(`Script ${scriptNumber} criado em: ${branchFolderPath}`);
    }

    private static formatTimestamp(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}${month}${day}-${hours}${minutes}`;
    }

    private static async updateOrCreateChangelog(
        branchFolderPath: string,
        baseTimestamp: string,
        rollbackTimestamp: string,
        author: string,
        comment: string,
        scriptFileName: string,
        rollbackFileName: string,
        branchName: string,
        isFirstScript: boolean
    ): Promise<void> {
        const changelogPath = path.join(branchFolderPath, 'changelog.xml');
        
        if (isFirstScript) {
            // Para o primeiro script, cria o tagDatabase com timestamp anterior
            const tagTimestamp = this.formatTimestamp(new Date(new Date().getTime() - 60000)); // -1 minuto
            
            const changelogContent = this.generateChangelogXml(
                baseTimestamp,
                tagTimestamp, // Usa timestamp anterior para tagDatabase
                author,
                comment,
                scriptFileName,
                rollbackFileName,
                branchName
            );
            fs.writeFileSync(changelogPath, changelogContent);
        } else {
            // Atualiza changelog.xml existente
            await this.addScriptToChangelog(
                changelogPath,
                baseTimestamp,
                author,
                comment,
                scriptFileName,
                rollbackFileName
            );
        }
    }

    private static async addScriptToChangelog(
        changelogPath: string,
        timestamp: string,
        author: string,
        comment: string,
        scriptFileName: string,
        rollbackFileName: string
    ): Promise<void> {
        if (!fs.existsSync(changelogPath)) {
            throw new Error(`Arquivo changelog não encontrado: ${changelogPath}`);
        }

        let content = fs.readFileSync(changelogPath, 'utf8');
        
        // Encontra o local para inserir o novo changeSet (antes do tagDatabase)
        const tagChangeSetPattern = /<changeSet[^>]*>\s*<tagDatabase/;
        const tagMatch = content.search(tagChangeSetPattern);
        
        if (tagMatch === -1) {
            throw new Error('Arquivo changelog malformado - tag changeSet não encontrada');
        }

        const newChangeSet = `
  <changeSet id="${timestamp}" author="${author}"> 
    <comment>${comment}</comment> 
    <sqlFile path="${scriptFileName}" relativeToChangelogFile="true" endDelimiter="~" /> 
    <rollback>
      <sqlFile path="${rollbackFileName}" relativeToChangelogFile="true" endDelimiter="~" /> 
    </rollback>
  </changeSet>

`;

        // Insere o novo changeSet antes do tagDatabase
        const beforeTag = content.substring(0, tagMatch);
        const afterTag = content.substring(tagMatch);
        
        content = beforeTag + newChangeSet + afterTag;
        
        fs.writeFileSync(changelogPath, content);
    }

    private static generateChangelogXml(
        baseTimestamp: string,
        tagTimestamp: string, // Mudança: agora recebe timestamp específico para tag
        author: string,
        comment: string,
        scriptFileName: string,
        rollbackFileName: string,
        branchName: string
    ): string {
        return `<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog" 
                   xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext" 
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog-ext http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd
                                       http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.5.xsd">

  <changeSet id="${baseTimestamp}" author="${author}"> 
    <comment>${comment}</comment> 
    <sqlFile path="${scriptFileName}" relativeToChangelogFile="true" endDelimiter="~" /> 
    <rollback>
      <sqlFile path="${rollbackFileName}" relativeToChangelogFile="true" endDelimiter="~" /> 
    </rollback>
  </changeSet>

  <changeSet id="${tagTimestamp}" author="${author}">
    <tagDatabase tag="${branchName}" />
  </changeSet>
</databaseChangeLog>`;
    }

    private static async updateMasterChangelog(
        workspacePath: string,
        masterChangelogPath: string,
        branchName: string,
        comment: string
    ): Promise<void> {
        const masterPath = path.join(workspacePath, masterChangelogPath);
        
        if (!fs.existsSync(masterPath)) {
            throw new Error(`Arquivo changelog master não encontrado: ${masterPath}`);
        }

        let content = fs.readFileSync(masterPath, 'utf8');
        
        // Encontra o local para inserir a nova linha (antes do fechamento do databaseChangeLog)
        const insertPoint = content.lastIndexOf('</databaseChangeLog>');
        if (insertPoint === -1) {
            throw new Error('Arquivo changelog master malformado');
        }

        const newInclude = `  <!-- ${comment} -->
  <include file="changesets\\${branchName}\\changelog.xml" relativeToChangelogFile="true" />
  
`;

        content = content.substring(0, insertPoint) + newInclude + content.substring(insertPoint);
        
        fs.writeFileSync(masterPath, content);
    }
}