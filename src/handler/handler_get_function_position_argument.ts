import * as vscode from "vscode";
import { parse_function, FunctionDef } from '../parser';
import { try_get_definition } from '../util'
export function get_function_position_argument(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, index: number) {
    let currentPosition = textEditor.selection.active;
    let document = textEditor.document;
    // 当前行的缩进
    let currentLine = document.lineAt(currentPosition.line);
    let currentLineIndent;
    if (currentLine.isEmptyOrWhitespace) {
        currentLineIndent = currentPosition.character
    } else {
        currentLineIndent = textEditor.document.lineAt(currentPosition.line).firstNonWhitespaceCharacterIndex;
    }

    if (currentLineIndent === 0) {
        return
    }
    const definition = try_get_definition(textEditor, edit);
    const parseResult = parse_function(definition);
    let args = parseResult.args;
    // if (args[0] === "self" || args[0] === "cls") {
    //     args = args.slice(1);
    // }
    args = [...args, ...parseResult.kwargs];
    let variable;
    if (index >= args.length) {
        variable = args[args.length - 1]
    } else {
        variable = args[index - 1];
    }


    //const insert_content = generate_apply_statement(parseResult, currentLineIndent);
    edit.insert(currentPosition, variable);

}
