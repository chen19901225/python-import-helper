import * as vscode from "vscode";
import { error } from "util";

export function insert_left_pattern(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {

    let position = textEditor.selection.active;
    let currentLine = textEditor.document.lineAt(position.line);
    let text = currentLine.text.trim();
    // if(/^[^=]+=.+$/.test())
    let match = /^\s*([^=]+)=.*$/.exec(text);
    if (match) {
        let pattern = match[1];
        edit.insert(position, pattern.trim());
        return;
    }
    match = /^\s*'([^']+)'\:.*$/.exec(text);
    if (match) {
        let pattern = match[1];
        edit.insert(position, pattern.trim());
        return;
    }

    match = /^\s*"([^"]+)"\:.*$/.exec(text);
    if (match) {
        let pattern = match[1];
        edit.insert(position, pattern.trim());
        return;
    }

    // let content_list = currentLine.text.split("=")
    // let left_pattern = content_list[0];

}