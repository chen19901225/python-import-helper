import * as vscode from "vscode";
import { update_last_used_variable } from "./handler_get_last_used_variable";
import { service_position_history_add_position } from "../service/service_position_history";

export function get_last_func(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {

    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let beginLineNo = Math.max(cursor.line - 50, 0)
    // let range = new vscode.Range(new vscode.Position(beginLineNo, 0),
    //     new vscode.Position(cursor.line, line.range.end.character))
    for (let i = cursor.line - 1; i >= beginLineNo; i--) {
        let content = document.lineAt(i).text;
        content = content.trim();
        if (content.startsWith("def")) {
            let func_part = content.split(/\s+/)[1]
            let func_name = func_part.split("(")[0];
            update_last_used_variable(func_name);
            service_position_history_add_position(cursor);
            edit.insert(cursor, func_name);

            break;
        }

    }

}