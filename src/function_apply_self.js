"use strict";
exports.__esModule = true;
var vscode = require("vscode");
var parser_1 = require("./parser");
function function_apply_self(textEditor, edit) {
    var currentPosition = textEditor.selection.active;
    var document = textEditor.document;
    // 当前行的缩进
    var currentLineIndent = textEditor.document.lineAt(currentPosition.line).firstNonWhitespaceCharacterIndex;
    var defLineNo = -1;
    for (var i = currentPosition.line; i >= 0; i--) {
        var warkLine = textEditor.document.lineAt(i);
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
    var defEndLineNo = -1;
    for (var i = defLineNo; i <= currentPosition.line; i++) {
        var iterLine = document.lineAt(i);
        if (iterLine.text.match(")[ \w,\[\]]*:$")) {
            defEndLineNo = i;
            break;
        }
    }
    if (defEndLineNo === -1) {
        throw Error("cannot find def end line");
    }
    var defStartPosition = new vscode.Position(defLineNo, document.lineAt(defLineNo).firstNonWhitespaceCharacterIndex);
    var defEndPosition = new vscode.Position(defEndLineNo, document.lineAt(defEndLineNo).range.end.character);
    // 获取到定义之后， 就应该parse定义了
    var definition = document.getText(new vscode.Range(defStartPosition, defEndPosition));
    var parseResult = parser_1.parse_function(definition);
    generate_apply_statement(parseResult, currentPosition);
}
exports.function_apply_self = function_apply_self;
function generate_apply_statement(parseResult, currentPosition) {
}
function getIndent(text) {
    var match = text.match(/^\s+/);
    if (!match) {
        return 0;
    }
    return match[0].length;
}
