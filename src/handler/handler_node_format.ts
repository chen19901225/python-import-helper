import * as vscode from "vscode";
import * as ts from "typescript";
import { error } from "util";
import { start } from "repl";


export function format_apply_line(lineText: string, col: number): Array<string> {
    if (lineText.indexOf("=") === -1) {
        return [
            lineText,
        ]
    }
    return [
        lineText,
    ]
}

export function node_format(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cusor = textEditor.selection.active;

    if (!textEditor.selection.isEmpty) {
        cusor = textEditor.selections[0].start;
    }
    let line = textEditor.document.lineAt(cusor.line);
    let lineText = line.text;
    let range = new vscode.Range(cusor, line.range.end)
    let replaced_lines = format_apply_line(lineText, cusor.character);
    let content = replaced_lines.join("\n")
    let newPosition_col = replaced_lines[replaced_lines.length - 1].length
    let newPosition_row = cusor.line - 1 + replaced_lines.length;
    textEditor.edit((builder) => {
        builder.replace(range, content);
    }).then((success) => {
        let newPosition = new vscode.Position(newPosition_row, newPosition_col);
        textEditor.selection = new vscode.Selection(newPosition, newPosition);
    })
}