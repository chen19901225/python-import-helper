import * as vscode from "vscode";
import {parse_function, FunctionDef} from '../parser';
import {try_get_definition} from '../util'

export function get_parent_args(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const definition = try_get_definition(textEditor, edit);
    const parseResult = parse_function(definition);
    const elements = [];
    
    // let elements: Array<string> = [];
    for(let arg of parseResult.args) {
        if(['self', 'cls'].indexOf(arg) > -1) {
            elements.push(`${arg}`);
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
    let quickPickItem: vscode.QuickPickItem[] = [];
    let i = 0;
    for(;i<Math.min(elements.length, 10); i++) {
        quickPickItem.push({
            label: `${i}.${elements[i]}`,
            description: `${i}`
        })
    }
    let getInsertedContent=(index: string) => {
        return elements.slice(Number.parseInt(index)).join(", ")
    }
    let currentPosition = textEditor.selection.active;
    vscode.window.showQuickPick(quickPickItem).then((item) => {
        if(item) {
            let activeEditor = vscode.window.activeTextEditor;
            let insertedText = getInsertedContent(item.description);
            activeEditor.insertSnippet(new vscode.SnippetString(insertedText), currentPosition)
        }
    })
    
    // const insertContent = elements.join(", ");
    // let currentPosition = textEditor.selection.active;
    // edit.insert(currentPosition, insertContent);
 }