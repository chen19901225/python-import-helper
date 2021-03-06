import * as vscode from "vscode";
import {parse_function, FunctionDef} from '../parser';
import {try_get_definition} from '../util'
import { error } from "util";

export function get_original_parent_args(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const definition = try_get_definition(textEditor, edit);
    const parseResult = parse_function(definition);
    const elements = [];
    let selection_word = '';
    // 我应该直接弹框选择

    
    let arg_list: Array<string> = [];
    for(let arg of parseResult.args) {
        arg_list.push(`${arg}`)
    }
    for(let kwarg of parseResult.kwargs) {
        arg_list.push(`${kwarg}=${kwarg}`);
    }
    if(parseResult.star_args!=='') {
        arg_list.push(`*${parseResult.star_args}`)
    }
    if(parseResult.star_kwargs!=='') {
        arg_list.push(`**${parseResult.star_kwargs}`)
    }
    let quickPickItem: vscode.QuickPickItem[] = [];
    let i = 0;
    for(;i<Math.min(arg_list.length, 10); i++) {
        quickPickItem.push({
            label: `${i}.${arg_list[i]}`,
            description: `${i}`
        })
    }
    let getInsertedContent=(index: string) => {
        return arg_list.slice(Number.parseInt(index)).join(", ")
    }
    let currentPosition = textEditor.selection.active;
    vscode.window.showQuickPick(quickPickItem).then((item) => {
        if(item) {
            let activeEditor = vscode.window.activeTextEditor;
            let insertedText = getInsertedContent(item.description);
            activeEditor.insertSnippet(new vscode.SnippetString(insertedText), currentPosition)
        }
    })



    // if (selection_word === '') {
    //     for(let arg of parseResult.args) {
    //         if(['self', 'cls'].indexOf(arg) > -1) {
    //             continue;
    //         }
    //         elements.push(`${arg}`);
    //     }
    //     for(let kwarg of parseResult.kwargs) {
    //         elements.push(`${kwarg}=${kwarg}`);
    //     }
    //     if(parseResult.star_args!=='') {
    //         elements.push(`*${parseResult.star_args}`)
    //     }
    //     if(parseResult.star_kwargs!=='') {
    //         elements.push(`**${parseResult.star_kwargs}`)
    //     }
    //     const insertContent = elements.join(", ");
    //     let currentPosition = textEditor.selection.active;
    //     edit.insert(currentPosition, insertContent);
    // } else {
    //     let range = textEditor.selections[0];
    //     let match_result = false;
    //     for(let arg of parseResult.args) {
    //         if(['self', 'cls'].indexOf(arg) > -1) {
    //             continue;
    //         }

    //         if(arg === selection_word) {
    //             match_result = true;
    //         }
    //         if(match_result) {
    //             elements.push(`${arg}`);
    //         }
            
    //     }
    //     if(!match_result) {
    //         console.error("cannot find param " + selection_word);
    //         vscode.window.showErrorMessage("cannot find param " + selection_word);
    //         throw new error("cannot find param " + selection_word)
    //     }
    //     for(let kwarg of parseResult.kwargs) {
    //         elements.push(`${kwarg}=${kwarg}`);
    //     }
    //     if(parseResult.star_args!=='') {
    //         elements.push(`*${parseResult.star_args}`)
    //     }
    //     if(parseResult.star_kwargs!=='') {
    //         elements.push(`**${parseResult.star_kwargs}`)
    //     }
    //     const insertContent = elements.join(", ");
    //     let newEnd = new vscode.Position(range.start.line,range.start.character + insertContent.length);
    //     // edit.replace(range, insertContent)
    //     textEditor.edit(builder => {
    //         builder.replace(range, insertContent)
            
            
    //     }).then(success=> {
    //         textEditor.selection = new vscode.Selection(newEnd, newEnd);
    //     })

    // }
    
 }