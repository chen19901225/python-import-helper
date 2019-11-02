import * as vscode from "vscode";
import {removeVarType} from "../util"
export function get_left_last_part(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) { 
    let position = textEditor.selection.active;
    let currentLine = textEditor.document.lineAt(position.line);
    let text = currentLine.text.trim();
    // if(/^[^=]+=.+$/.test())
    let match = /^\s*([^=]+)=.*$/.exec(text);
    if (match) {
        let eleWithoutType = removeVarType(match[1])
        let pattern = eleWithoutType
        if(eleWithoutType.indexOf(".") > -1) {
            pattern = eleWithoutType.split(".").pop();
        } else if(eleWithoutType.indexOf("__") > -1) {
            let index = eleWithoutType.indexOf("__")
            pattern = eleWithoutType.slice(index+2)
        }
        edit.insert(position, pattern.trim());
        return;
    }

}
