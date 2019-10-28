import * as vscode from "vscode";
import {get_variable_list} from "../util"
export function handler_dict_get_unpack(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let replaceContent = generate_replace_upack_string(line.text);
    // edit.replace(line.range, replaceContent);
    edit.insert(cursor, replaceContent);
}

export function generate_replace_upack_string(source: string) {
    let element_list = [];
    let run = "";
    let [left, right] = source.split("=")
    element_list = get_variable_list(left);
    let out = [];
    let source_var: string = right;
    let right_side_list = []
    let is_first = true;
    for (let ele of element_list) {
        out.push(ele);
        if (!is_first) {
            right_side_list.push(`${source_var}.get("${ele}")`)
        } else {
            is_first = false;
            right_side_list.push(`.get("${ele}")`)
        }
    }
    return right_side_list.join(", ")
}