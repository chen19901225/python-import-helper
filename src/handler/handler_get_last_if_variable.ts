import * as vscode from "vscode";
import { get_variable_list, extraVariablePart } from "../util"
import { update_last_used_variable } from './handler_get_last_used_variable'
import { insert_self } from "./handler_insert_self";
import { service_position_history_add_position } from "../service/service_position_history";

export function _extraVar(var_str: string) {
    let converted;
    let startswith_elements = ["isinstance(", "hasattr"]
    for (let ele of startswith_elements) {
        if (var_str.startsWith(ele)) {
            converted = var_str.substring(ele.length, var_str.indexOf(","))
            return converted;
        }
    }
    // if (var_str.startsWith("isinstance(")) {
    //     converted = var_str.substring("isinstance(".length, var_str.indexOf(","));
    // }
    // else if (var_str.startsWith("hasattr(")) {
    //     converted = var_str.substring("hasattr(".length, var_str.indexOf(","));
    // }
    // else {
    converted = extraVariablePart(var_str)
    // }
    return converted

}
function _insert(edit: vscode.TextEditorEdit, cusor: vscode.Position, context: string) {
    update_last_used_variable(context);
    edit.insert(cusor, context);
}


export function get_last_if_variable(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    service_position_history_add_position(cursor);
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let beginLineNo = Math.max(cursor.line - 10, 0)
    let currentIndent = line.firstNonWhitespaceCharacterIndex;
    let range = new vscode.Range(new vscode.Position(beginLineNo, 0),
        new vscode.Position(cursor.line, line.range.end.character))
    for (let i = cursor.line - 1; i >= beginLineNo; i--) {
        let content = document.lineAt(i).text;
        // if()
        let walkLindex = document.lineAt(i);
        if (walkLindex.firstNonWhitespaceCharacterIndex >= currentIndent) {

            continue;
        }
        content = content.trim();
        if (content.startsWith("if ") || content.startsWith("elif ") || content.startsWith("for")) {
            let emptyIndex = content.indexOf(" ")
            content = content.slice(emptyIndex)
            content = content.trim()
            if (content.startsWith("(")) {
                content = content.slice(1)
            }
            let vars = get_variable_list(content)
            if (vars.indexOf("in") > -1) {
                let in_index = vars.indexOf("in");
                let items: vscode.QuickPickItem[] = [];
                items.push({
                    'label': vars[in_index - 1],
                    "description": vars[in_index - 1]
                })
                items.push({
                    'label': vars[in_index + 1],
                    "description": vars[in_index + 1]
                })

                vscode.window.showQuickPick(items).then((item) => {
                    if (item) {
                        let { label } = item;
                        update_last_used_variable(label);
                        let activeEditor = vscode.window.activeTextEditor;

                        activeEditor.insertSnippet(new vscode.SnippetString(label), cursor);

                        // _insert(edit, cursor, _extraVar(vars[2]));    
                    }
                });

            } else {
                if (vars[1] === "not") {

                    _insert(edit, cursor, _extraVar(vars[1]));
                } else {

                    _insert(edit, cursor, _extraVar(vars[0]));
                }
            }



            break;
        } else if (content.startsWith("# generated_by_dict_unpack:")) {
            let last_var = content.split(":").pop()
            last_var = last_var.trim()
            _insert(edit, cursor, last_var);
            break;
        }

    }

}


export function get_last_if_varible_from_lines(lines: Array<string>) {

}