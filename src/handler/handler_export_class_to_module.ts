import * as vscode from "vscode";
import { error } from "util";
import { get_variable_list } from "../util";
import { convert_filename } from "./handler_file_name"
import * as path from "path"
import { openSync, existsSync } from "fs";
import * as fs from "fs"
let startText = '# generated_by_export_class:'

function get_selected_content_or_class_name(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit): string {
    if (!textEditor.selection.isEmpty) {
        let selection = textEditor.document.getText(textEditor.selections[0])
        return selection;
    }
    let fsPath = textEditor.document.uri.fsPath;
    let baseName = path.basename(fsPath);
    let baseNameWithoutExt = baseName.split(".")[0]
    return convert_filename(baseNameWithoutExt, "class_style");


}

function getCurrentName(textEditor: vscode.TextEditor) {
    let fsPath = textEditor.document.uri.fsPath;
    let baseName = path.basename(fsPath);
    let baseNameWithoutExt = baseName.split(".")[0]
    return baseNameWithoutExt
}
function search_init_or_create(textEditor: vscode.TextEditor,
    edit: vscode.TextEditorEdit): [string, string] {
    let fsPath = textEditor.document.uri.fsPath;
    let dirName = path.dirname(fsPath);
    // path.sep
    let initPath = dirName + `${path.sep}__init__.py`
    if (!existsSync(initPath)) {
        fs.writeFileSync(initPath, '', 'utf-8')
    }
    let read_content = fs.readFileSync(initPath, { encoding: 'utf-8' })
    return [initPath, read_content]

}
function _parse_content(text: string): Array<[string, string]> {
    let lines = text.split(/\r?\n/)
    let parsed_lines = []
    let i = 0;
    let current_ele = []

    while (i < lines.length) {
        let currentLine = lines[i];
        currentLine = currentLine.trim();
        if (currentLine.length === 0) {
            i += 1;
            continue;
        }

        if (currentLine.startsWith(startText)) {
            let [name, exported] = currentLine.slice(startText.length).split("||");
            let nextLine = lines[i + 1];
            let expected_content = `from .${name} import ${exported}`
            if (nextLine !== expected_content) {
                throw error(`exported ${expected_content} got ${currentLine}`);
                return;
            }
            parsed_lines.push([currentLine.slice(startText.length), nextLine]);
        }
        i++;
    }
    return parsed_lines;
}

function save_content_to_path(save_path: string, lines: Array<[string, string]>) {
    let alls = []
    let content_lines = []
    for (let line of lines) {
        content_lines.push(startText + line[0]);
        content_lines.push(line[1]);
        content_lines.push('');
        let all_ele = line[0].split('||')[1];
        alls.push(`    '${all_ele}'`);
    }
    content_lines.push("__all__ = [")
    let i = 0;
    for (i = 0; i < alls.length; i++) {
        if (i != alls.length - 1) {
            content_lines.push(`${alls[i]},`)
        } else {
            content_lines.push(alls[i]);
        }
    }
    content_lines.push("]")
    let final_content = content_lines.join("\r\n") + "\r\n";
    fs.writeFileSync(save_path, final_content, "utf-8");
}

export function export_class_to_module(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let [initPath, read_content] = search_init_or_create(textEditor, edit);
    let exported_content = get_selected_content_or_class_name(textEditor, edit);
    let currentName = getCurrentName(textEditor);
    let key = `${currentName}||${exported_content}`;
    let import_statement = `from .${currentName} import ${exported_content}`
    let parsed_lines = _parse_content(read_content);
    let is_inserted = false;

    for (let line of parsed_lines) {
        if (line[0] === key) {
            is_inserted = true;
            return;
        }
    }
    parsed_lines.push([key, import_statement]);
    save_content_to_path(initPath, parsed_lines);
    vscode.window.showInformationMessage('success to export');


}