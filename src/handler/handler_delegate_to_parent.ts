import * as vscode from "vscode";
import {parse_function} from '../parser';
import {try_get_definition} from '../util'

export function delegate_to_parent(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const definition = try_get_definition(textEditor, edit);
    const parseResult = parse_function(definition);
    const elements = [];
    for(let arg of parseResult.args) {
        if(['self', 'cls'].indexOf(arg) > -1) {
            continue;
        }
        elements.push(`${arg}=${arg}`);
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
    const insertContent =parseResult.name + '(' + elements.join(", ") + ')';
    let currentPosition = textEditor.selection.active;
    edit.insert(currentPosition, insertContent);
 }