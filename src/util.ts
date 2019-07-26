import * as vscode from 'vscode'

export function try_get_definition(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {

    let currentPosition = textEditor.selection.active;
    let document = textEditor.document;
    let currentLine = document.lineAt(currentPosition.line);
    let currentMinIndent
    if (currentLine.isEmptyOrWhitespace) {
        //如果当前行为空
        currentMinIndent = currentPosition.character
    } else {
        currentMinIndent = textEditor.document.lineAt(currentPosition.line).firstNonWhitespaceCharacterIndex;
    }

    // 当前行的缩进

    if (currentMinIndent === 0) {
        return
    }
    let defLineNo = -1;
    for (let i = currentPosition.line; i >= 0; i--) {
        let warkLine = textEditor.document.lineAt(i);
        if (warkLine.isEmptyOrWhitespace) {
            continue;
        }
        let warkLineIndex = warkLine.firstNonWhitespaceCharacterIndex;

        if (warkLine.firstNonWhitespaceCharacterIndex >= currentMinIndent) {
            continue;
        }
        currentMinIndent = Math.min(warkLineIndex, currentMinIndent);
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


export function get_variable_list(line: string): Array<string> {
    let element_list: Array<string> = [];
    let run = "";
    for (let ch of line) {
        if (ch.match(/[_a-zA-Z0-9.\[\]"'\(\)]/)) {
            run += ch;
        } else {
            if (run && run.length > 0) {
                element_list.push(run)
                run = "";
            }

        }
    }
    if (run && run.length > 0) {
        element_list.push(run);
    }
    return element_list
}