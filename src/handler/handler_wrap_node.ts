import * as vscode from "vscode";
import * as ts from "typescript";
import { error } from "util";
import { start } from "repl";


export function select_node(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cusor = textEditor.selection.active;
    let [startCol, endCol] = getNodeRange(textEditor.document.lineAt(cusor.line).text,
        cusor.character);
    let startPos = new vscode.Position(cusor.line, startCol);
    let endPos = new vscode.Position(cusor.line, endCol);
    textEditor.selection = new vscode.Selection(startPos, endPos);
}

export function getNodeRange(text: string, col: number): [number, number] {
    // let cursor = textEditor.selection.active;
    let lineText = text;
    let open_parenthes_pos = text.indexOf("(");
    let wordCount = (search: string, endIndex: number) => {
        let count = 0
        for (let ch of text.slice(0, endIndex - 1)) {
            if (ch === search) {
                count++
            }
        }
        return count;
    }
    let fLastIndex = (source: string, search: string, lastPos: number): [boolean, number] => {
        for (let i = lastPos; i >= 0; i--) {
            let currentCh = source[i];
            if (currentCh === search) {
                return [true, i]
            }
        }
        return [false, 0]
    }
    let searchStart = (startCol) => {
        for (let quote of ['"', "'"]) {
            if (wordCount(quote, startCol) % 2 === 1) {
                // let start = text.lastIndexOf('"', startCol)
                // let reversed_text = text.
                let [flag, index] = fLastIndex(text, quote, startCol);
                if (!flag) {
                    throw new error('cannot find ' + quote + ' for' + startCol);
                }
                return index;
            }
        }


        // 其他
        for (let i = startCol; i >= 0; i--) {
            let ch = text[i]
            if (!/[.a-zA-Z0-9_]/.test(ch)) {
                return i + 1;
                break;
            }
            // start_pos = i;
        }
        return 0;
    }
    if (open_parenthes_pos > -1) {
        if (open_parenthes_pos < col) {
            let end_parenthes_pos = text.indexOf(")", col)
            if (end_parenthes_pos == -1) {
                throw error("cannot find ) after " + col);
            }
            let startPos = searchStart(open_parenthes_pos - 1);
            return [startPos, end_parenthes_pos + 1];
        }
    }
    // 没有(, 或者(在col之后
    // 也就是
    // let open_square_pos =
    let end_square_pos = text.indexOf("]")
    let end_pos;
    if (end_square_pos == -1) {
        // 不是]调用
        end_pos = text.indexOf(' ', col);
        if (end_pos == -1) {
            end_pos = text.length;
        }

    } else {
        end_pos = end_square_pos;
    }
    let start_pos = searchStart(col);

    return [start_pos, end_pos]
    // return [-1, -1]
}

export function wrap_node(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    // let [start, end] = [-1, -1]
    let startPos: vscode.Position, endPos: vscode.Position
    if (textEditor.selection.isEmpty) {
        let cusor = textEditor.selection.active;
        let [startCol, endCol] = getNodeRange(textEditor.document.lineAt(cusor.line).text,
            cusor.character);
        startPos = new vscode.Position(cusor.line, startCol);
        endPos = new vscode.Position(cusor.line, endCol);
        select_node(textEditor, edit);
    } else {
        let selection = textEditor.selections[0];
        startPos = selection.start
        endPos = selection.end;
    }

    vscode.window.showInputBox({
        password: false,
        placeHolder: "wrap_func",
        prompt: "请输入wrap_func",
    }).then((msg) => {
        if (!msg) {
            return;
        }
        msg = msg.trim();
        if (!msg) {
            return;
        }
        let currentText = textEditor.document.getText(new vscode.Range(startPos, endPos));
        let replaceText = `${msg}(${currentText})`
        textEditor.edit((builder) => {
            builder.replace(new vscode.Range(startPos, endPos), replaceText);
        }).then((success) => {
            let newPosition = new vscode.Position(startPos.line, startPos.character + replaceText.length + 1)
            textEditor.selection = new vscode.Selection(newPosition, newPosition);
        })

    })


}