import * as vscode from "vscode";
import { error } from "util";

export function insert_left_pattern(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) { 

    let position = textEditor.selection.active;
    let currentLine = textEditor.document.lineAt(position.line);
    let content_list = currentLine.text.split("=")
    let left_pattern = content_list[0];
    edit.insert(position, left_pattern.trim());
}