import * as vscode from 'vscode'

export function try_get_definition(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {

    let currentPosition = textEditor.selection.active;
    let document = textEditor.document;
    let currentLine = document.lineAt(currentPosition.line);
    let currentLineIndent
    if (currentLine.isEmptyOrWhitespace) {
        //如果当前行为空
        currentLineIndent = currentPosition.character
    } else {
        currentLineIndent = textEditor.document.lineAt(currentPosition.line).firstNonWhitespaceCharacterIndex;
    }

    // 当前行的缩进

    if (currentLineIndent === 0) {
        return
    }
    let defLineNo = -1;
    for (let i = currentPosition.line; i >= 0; i--) {
        let warkLine = textEditor.document.lineAt(i);
        if(warkLine.firstNonWhitespaceCharacterIndex>=currentLineIndent) {
            continue;
        }
        let contentWithoutIndent = warkLine.text.trim();
        if (contentWithoutIndent.startsWith("def ")) {
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
        if (iterLine.text.match(/\)(->\s*[ \w,\[\]\.]*\s*)?:\s*$/)) {
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
    return definition;
}