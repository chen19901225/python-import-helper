import * as vscode from "vscode";
import {removeVarType} from "../util"
export function get_left_last_part(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) { 
    let position = textEditor.selection.active;
    let currentLine = textEditor.document.lineAt(position.line);
    let text = currentLine.text.trim();
    // if(/^[^=]+=.+$/.test())
    let match = /^\s*([^=]+)=.*$/.exec(text);
    if (match) {
        let pattern = removeVarType(match[1]).split(".").pop();
        edit.insert(position, pattern.trim());
        return;
    }

}
