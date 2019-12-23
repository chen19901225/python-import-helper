// cqh-python-import-helper.update_if

import * as vscode from "vscode";
export function update_if(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let position = textEditor.selection.active;
    let lastLineNo = position.line - 1;
    let lastLineText = textEditor.document.lineAt(lastLineNo).text;
    lastLineText = lastLineText.trim();
    if (lastLineText.startsWith("if ") || lastLineText.startsWith("elif ")) {
        let last_var = update_if_get_line_var(lastLineText);
        edit.insert(position, `[${last_var}] = ${last_var}`);
    }
    // edit.insert(position, "self");
}

export function update_if_get_line_var(text: string): string {
    let last_var = text.split(/\s+/)[1];
    if (last_var.endsWith(":")) {
        last_var = last_var.slice(0, last_var.length - 1);
    }
    return last_var
}