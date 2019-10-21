import * as vscode from "vscode";
import { error } from "util";
import * as path from "path"
import * as fs from "fs";
import { convert_filename } from './handler_file_name'

function convertClassName(name: string) {
    return convert_filename(name, 'class_style')
}

export function insert_base(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let uri = textEditor.document.uri;
    let fsPath = uri.fsPath;
    if (!fsPath) {
        vscode.window.showErrorMessage("不处理tmp文件");
        return;
    }
    if (!fsPath.endsWith(".py")) {
        vscode.window.showErrorMessage("not py files ");
        return;
    }
    let dirName = path.dirname(fsPath);
    let names = fs.readdirSync(dirName);
    let match = (name: string) => {
        if (name == "base.py") {
            return true;
        }
        if (name.endsWith("_base.py")) {
            return true;
        }
        return false;
    }
    let position = textEditor.selection.active;
    for (let name of names) {
        if (!name.endsWith(".py")) {
            continue;
        }
        if (match(name)) {
            let basename = path.basename(name).split(".")[0];
            let getClassName = convertClassName(basename);
            let comment = '# generated_by_dict_unpack:' + getClassName;
            let lines = [
                comment,
                `from .${basename} import ${getClassName}`
            ]
            let content = lines.join('\r\n') + '\r\n';
            edit.insert(position, content);
            return;
        }

    }




}