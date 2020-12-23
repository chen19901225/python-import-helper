import * as vscode from "vscode"
import { extname } from "path";



export interface IConfig extends vscode.WorkspaceConfiguration {
    insert_list: Array<string>
}

export function getConfig(): IConfig {
    let config = vscode.workspace.getConfiguration("python-import-helper") as IConfig;
    return config
}