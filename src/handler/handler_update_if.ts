// cqh-python-import-helper.update_if

import * as vscode from "vscode";
export function update_if(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let position = textEditor.selection.active;
    let lastLineNo = position.line - 1;
    let lastLineText = textEditor.document.lineAt(lastLineNo).text;
    lastLineText = lastLineText.trim();
    if(lastLineText.startsWith("if ") || lastLineText.startsWith("elif ")) {
        let last_var = lastLineText.split(/\s+/)[1];
        edit.insert(position, `[${last_var}] = ${last_var}`);
    }
    // edit.insert(position, "self");
}