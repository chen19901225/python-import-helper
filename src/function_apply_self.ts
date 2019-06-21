import * as vscode from "vscode";
import {parse_function} from './parser';
export function function_apply_self(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let currentPosition = textEditor.selection.active;
    let document = textEditor.document;
    // 当前行的缩进
    let currentLineIndent = textEditor.document.lineAt(currentPosition.line).firstNonWhitespaceCharacterIndex;
    let defLineNo = -1;
    for (let i = currentPosition.line; i >= 0; i--) {
        let warkLine = textEditor.document.lineAt(i);
        if (warkLine.text.startsWith("def ") &&
            warkLine.firstNonWhitespaceCharacterIndex + 4 === currentLineIndent) {
            defLineNo = i;
            break;
        }
    }
    if (defLineNo === -1) {
        throw Error("cannot find def");
    }
    // 找到defLineNo之后， 开始找def的结束
    let defEndLineNo = -1;
    for (let i = defLineNo; i <= currentPosition.line; i++) {
        let iterLine = document.lineAt(i);
        if (iterLine.text.match(")[ \w,\[\]]*:$")) {
            defEndLineNo = i;
            break;
        }

    }
    if (defEndLineNo === -1) {
        throw Error("cannot find def end line");
    }

    const defStartPosition = new vscode.Position(defLineNo, document.lineAt(defLineNo).firstNonWhitespaceCharacterIndex);
    const defEndPosition = new vscode.Position(
        defEndLineNo,
        document.lineAt(defEndLineNo).range.end.character
    )



    // 获取到定义之后， 就应该parse定义了
    const definition = document.getText(new vscode.Range(defStartPosition,
        defEndPosition));
    const parseResult = parse_function(definition);
    generate_apply_statement(parseResult, currentPosition);
    
}

function generate_apply_statement(parseResult, currentPosition: vscode.Position) {
    
}


function getIndent(text: string) {
    const match = text.match(/^\s+/);
    if (!match) {
        return 0;
    }
    return match[0].length;
}