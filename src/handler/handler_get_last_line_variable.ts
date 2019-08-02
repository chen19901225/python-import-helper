import * as vscode from "vscode";
import { parse_function, FunctionDef } from '../parser';
import { get_variable_list, extraVariablePart } from '../util'
export function get_last_line_variable(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let beginLineNo = Math.max(cursor.line - 10, 0)
    let range = new vscode.Range(new vscode.Position(beginLineNo, 0),
        new vscode.Position(cursor.line, line.range.end.character))
    for (let i = cursor.line; i >= beginLineNo; i--) {
        let content = document.lineAt(i).text;
        content = content.trim();
        if (content.includes("=")) {
            let vars = get_variable_list(content)
            edit.insert(cursor, extraVariablePart(vars[0]));
            break;
        }
    }

}
