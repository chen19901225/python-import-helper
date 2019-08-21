import * as vscode from "vscode";
import { parse_function, FunctionDef } from '../parser';
import { get_variable_list, extraVariablePart } from '../util'
export function get_last_line_variable(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    /**
     * 改的目的假如有以下这种情况
     *      one, two = self.one, self.two
     *      one, two = created_
     * 我希望(one, two), 能有快捷键直接获取上一行的变量
     */
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let beginLineNo = Math.max(cursor.line - 10, 0)
    let range = new vscode.Range(new vscode.Position(beginLineNo, 0),
        new vscode.Position(cursor.line, line.range.end.character))
    let lines = document.getText(range).split(/\r?\n/);
    let [found, vars] = find_last_vars(lines);
    if (found) {
        edit.insert(cursor, vars);
    }
    // for (let i = cursor.line - 1; i >= beginLineNo; i--) {
    //     let content = document.lineAt(i).text;
    //     content = content.trim();
    //     let index = content.indexOf("=")

    //     if (index > -1 && content[index + 1] !== '=' && content[index - 1] !== '!') {
    //         // 忽略 a== b 或者 a!=b 这种情况
    //         let vars = content.split("=")[0]
    //         edit.insert(cursor, vars);
    //         break;
    //     }
    // }

}

function find_last_vars(lines: Array<string>): [boolean, string] {
    for (let i = lines.length - 1; i >= 0; i--) {
        let content = lines[i];
        content = content.trim();
        let index = content.indexOf("=")

        if (index > -1 && content[index + 1] !== '=' && content[index - 1] !== '!') {
            // 忽略 a== b 或者 a!=b 这种情况
            let vars = content.split("=")[0]
            return [true, vars]
        }
    }

    return [false, ""]

}
