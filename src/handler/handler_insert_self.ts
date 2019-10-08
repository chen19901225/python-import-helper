import * as vscode from "vscode";
export function insert_self(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) { 
    let position = textEditor.selection.active;
    edit.insert(position, "self");
}