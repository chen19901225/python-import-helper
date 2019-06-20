import * as vscode from "vscode";
export function function_apply_self(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let currentPosition = textEditor.selection.active;
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
    let defEndLineNo=-1;
    for(let i=defLineNo;i<=currentPosition.line;i++) {

    }
    if(defEndLineNo === -1) {
        throw Error("cannot find def end line");
    }
    


    const definition =
}


function getIndent(text: string) {
    const match = text.match(/^\s+/);
    if (!match) {
        return 0;
    }
    return match[0].length;
}