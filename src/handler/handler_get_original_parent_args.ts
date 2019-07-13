import * as vscode from "vscode";
import {parse_function, FunctionDef} from '../parser';
import {try_get_definition} from '../util'

export function get_original_parent_args(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const definition = try_get_definition(textEditor, edit);
    const parseResult = parse_function(definition);
    const elements = [];
    for(let arg of parseResult.args) {
        if(['self', 'cls'].indexOf(arg) > -1) {
            continue;
        }
        elements.push(`${arg}`);
    }
    for(let kwarg of parseResult.kwargs) {
        elements.push(`${kwarg}=${kwarg}`);
    }
    if(parseResult.star_args!=='') {
        elements.push(`*${parseResult.star_args}`)
    }
    if(parseResult.star_kwargs!=='') {
        elements.push(`**${parseResult.star_kwargs}`)
    }
    const insertContent = elements.join(", ");
    let currentPosition = textEditor.selection.active;
    edit.insert(currentPosition, insertContent);
 }