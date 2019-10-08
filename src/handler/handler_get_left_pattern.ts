import * as vscode from "vscode";
import { error } from "util";
import {removeVarType} from "../util"


export function get_insert_context(text: string): [boolean, string] {
    let match = /^\s*([^=]+)=.*$/.exec(text);
    if (match) {
        let pattern = match[1];
        // edit.insert(position, pattern.trim());
        return [true, removeVarType(pattern)];
        // return;
    }
    match = /^\s*'([^']+)'\:.*$/.exec(text);
    if (match) {
        let pattern = match[1];
        // edit.insert(position, pattern.trim());
        return [true, removeVarType(pattern)];
        // return;
    }

    match = /^\s*"([^"]+)"\:.*$/.exec(text);
    if (match) {
        let pattern = match[1];
        // edit.insert(position, pattern.trim());
        return [true, removeVarType(pattern)];
        // return;
    }
    return [false, ""]
}

export function insert_left_pattern(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {

    let position = textEditor.selection.active;
    let currentLine = textEditor.document.lineAt(position.line);
    let text = currentLine.text.trim();
    let [found, inserted_text] = get_insert_context(text);
    if(found) {
        edit.insert(position, inserted_text);
    }
    // if(/^[^=]+=.+$/.test())


    // let content_list = currentLine.text.split("=")
    // let left_pattern = content_list[0];

}