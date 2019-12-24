import * as vscode from "vscode";
export function insert_import(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) { 
    let position = textEditor.selection.active;
    edit.insert(position, "import");
}