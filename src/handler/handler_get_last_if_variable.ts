import * as vscode from "vscode";
import { get_variable_list, extraVariablePart } from "../util"

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
        if (content.startsWith("if ") || content.startsWith("elif ")) {
            let vars = get_variable_list(content)
            if (vars[1] === "not") {
                edit.insert(cursor, extraVariablePart(vars[2]));
            } else {
                edit.insert(cursor, extraVariablePart(vars[1]));
            }

            break;
        }
    }

}


export function get_last_if_varible_from_lines(lines: Array<string>) {

}