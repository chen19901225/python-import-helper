import * as vscode from "vscode";
import { get_variable_list, extraVariablePart } from "../util"
import {update_last_used_variable} from './handler_get_last_used_variable'
import { insert_self } from "./handler_insert_self";

export function _extraVar(var_str: string) {
    let converted;
    if (var_str.startsWith("isinstance(")) {
        converted = var_str.substring("isinstance(".length, var_str.indexOf(","));
    }
    else {
        converted = extraVariablePart(var_str)
    }
    return converted

}
function _insert(edit: vscode.TextEditorEdit, cusor: vscode.Position, context: string) {
    update_last_used_variable(context);
    edit.insert(cusor, context);
}


export function get_last_if_variable(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let beginLineNo = Math.max(cursor.line - 10, 0)
    let range = new vscode.Range(new vscode.Position(beginLineNo, 0),
        new vscode.Position(cursor.line, line.range.end.character))
    for (let i = cursor.line; i >= beginLineNo; i--) {
        let content = document.lineAt(i).text;
        content = content.trim();
        if (content.startsWith("if ") || content.startsWith("elif ") || content.startsWith("for")) {
            let vars = get_variable_list(content)
            if (vars[1] === "not") {

                _insert(edit, cursor, _extraVar(vars[2]));
            } else {
                _insert(edit, cursor, _extraVar(vars[1]));
            }

            break;
        } else if(content.startsWith("# generated_by_dict_unpack:")) {
            let last_var = content.split(":").pop()
            last_var = last_var.trim()
            _insert(edit, cursor, last_var)
        }

    }

}


export function get_last_if_varible_from_lines(lines: Array<string>) {

}