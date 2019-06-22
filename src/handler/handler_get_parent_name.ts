import * as vscode from "vscode";
import { parse_function } from '../parser';
import { try_get_definition } from '../util'

export function get_parent_name(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const definition = try_get_definition(textEditor, edit);
    const parseResult = parse_function(definition);
    
    const insertContent = parseResult.name;
    let currentPosition = textEditor.selection.active;
    edit.insert(currentPosition, insertContent);
}