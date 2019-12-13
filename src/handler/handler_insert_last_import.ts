import * as vscode from "vscode";
import { error } from "util";

export function insert_last_import(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    let lastLine = textEditor.document.lineAt(cursor.line - 1);
    let [flag, import_str] = get_last_import(lastLine.text);
    if (flag) {
        edit.insert(cursor, import_str);
    }
}

export function get_last_import(text: string): [boolean, string] {
    text = text.trim();
    if (text.startsWith("from ")) {
        return [true, text.split(" ").pop()];
    } else {
        return [false, ' not starts with from']
    }
    return [false, '']
}