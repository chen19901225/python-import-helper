import * as vscode from "vscode";
export function function_apply_self(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let currentPosition = textEditor.selection.active;
    let currentLineIndent = textEditor.document.lineAt(currentPosition.line).firstNonWhitespaceCharacterIndex;
    

    const definition=
}


function getIndent(text: string) {
    const match = text.match(/^\s+/);
    if(!match) {
        return 0;
    }
    return match[0].length;
}