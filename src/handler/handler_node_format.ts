import * as vscode from "vscode";
import * as ts from "typescript";
import { error } from "util";
import { start } from "repl";


function format_dict_line(lineText: string) {
    // dict(name=name, age=age)
    let lines = ["dict("]
    let stripped = lineText.slice("dict(".length)
    if (lineText.endsWith(")")) {
        stripped = lineText.slice("dict(".length, lineText.length - 1);
    }
    let prefix = " ".repeat("dict(".length)
    for (let piece of stripped.split(/,\s*/)) {
        piece = piece.trim()
        if (piece.length === 0) {
            continue;
        }
        lines.push(prefix + `${piece},`)
    }
    let last_line = lines[lines.length - 1]
    lines[lines.length - 1] = last_line.slice(0, last_line.length - 1)
    if (lineText.endsWith(")")) {
        lines.push(")")
    }
    return lines
}

export function format_func_line(lineText: string) {
    let lines: Array<string> = [];
    let first_index = lineText.indexOf("(")

    if (first_index === -1) {
        vscode.window.showErrorMessage("cannot find ( for format_func_line");
        throw new error("cannot find (");
    }
    let prefix = " ".repeat(4)
    lines.push(lineText.slice(0, first_index + 1));
    let end_index = lineText.indexOf(")");
    // if(first_index === -1) {
    //     vscode.window.showErrorMessage("cannot find ) for format_func_line");
    //     throw new error("cannot find ) for format_func_line");
    // }
    let content: string;
    if (end_index > -1) {
        // lines.push(lineText.slice(end_index))
        content = lineText.slice(first_index + 1, end_index)
    } else {
        content = lineText.slice(first_index + 1)
    }
    let pieces = content.split(",")
    for (let piece of pieces) {
        piece = piece.trim()
        if (piece.length === 0) {
            continue;
        }
        lines.push(prefix + piece + ",")
    }
    let lastLine = lines.pop()
    lastLine = lastLine.slice(0, lastLine.length - 1)
    lines.push(lastLine)

    if (end_index > -1) {
        lines.push(lineText.slice(end_index))
    }
    return lines

}

function format_simple_apply_line(lineText: string) {
    let lines: Array<string> = []
    for (let piece of lineText.split(/,\s*/)) {
        piece = piece.trim();
        if (piece.length === 0) {
            continue;
        }
        lines.push(piece + ",")
    }
    let lastLine = lines.pop()
    lastLine = lastLine.slice(0, lastLine.length - 1)
    lines.push(lastLine)
    return lines
}

export function format_apply_line(lineText: string, col: number): Array<string> {

    if (lineText.startsWith("dict(")) {// dict handler
        return format_dict_line(lineText);
    }
    if (/def\s*[^(]+\([^)]*\)?:?/.test(lineText)) {
        return format_func_line(lineText);
    }
    if (/([^=]+=[^,]+,?\s*)+/.test(lineText)) {
        return format_simple_apply_line(lineText)
    }
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
    let replaced_lines = format_apply_line(lineText.slice(cusor.character), 0);
    let prefix = " ".repeat(cusor.character);
    for (let i = 1; i < replaced_lines.length; i++) {
        replaced_lines[i] = prefix + replaced_lines[i];
    }
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