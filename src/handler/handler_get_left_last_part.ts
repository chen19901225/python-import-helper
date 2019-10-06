import * as vscode from "vscode";
export function get_left_last_part(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) { 
    let position = textEditor.selection.active;
    let currentLine = textEditor.document.lineAt(position.line);
    let text = currentLine.text.trim();
    // if(/^[^=]+=.+$/.test())
    let match = /^\s*([^=]+)=.*$/.exec(text);
    if (match) {
        let pattern = match[1].split(".").pop();
        edit.insert(position, pattern.trim());
        return;
    }

}
