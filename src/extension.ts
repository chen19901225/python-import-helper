'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {upgradeDelegate} from "./upgrade";
import {function_apply_self} from "./handler/function_apply_self";
import {get_parent_name} from './handler/handler_get_parent_name';
import {get_parent_args} from './handler/get_parent_args'



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('[cqh-python-import-helper] Congratulations, your extension "cqh-python-import-helper" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
    //     // The code you place here will be executed every time your command is executed

    //     // Display a message box to the user
    //     vscode.window.showInformationMessage('Hello World!');
    // });
    let disposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.import-upgrade",(textEditor, edit) => {
        if (!(textEditor.selection)) {
            vscode.window.showErrorMessage("You must select a content to convert");
            return;
        }

        // 自动获取鼠标位置
        const editor = vscode.window.activeTextEditor;
        const position = editor.selection.active;
        const currentLine = editor.document.lineAt(position.line);


        // var newPosition = position.with(position.line, currentLine.firstNonWhitespaceCharacterIndex);
        let newPosition= new vscode.Position(position.line, currentLine.firstNonWhitespaceCharacterIndex)
        var newSelection = new vscode.Selection(newPosition, new vscode.Position(position.line, currentLine.range.end.character));
        editor.selection = newSelection;

        upgradeDelegate(textEditor, edit);
    })

    let selectCurrentLineDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-help.select-current-line",(textEditor, edit) => {
        // 第一步获取当前鼠标位置
        const editor = vscode.window.activeTextEditor;
        const position = editor.selection.active;
        const currentLine = editor.document.lineAt(position.line);


        // var newPosition = position.with(position.line, currentLine.firstNonWhitespaceCharacterIndex);
        let newPosition= new vscode.Position(position.line, currentLine.firstNonWhitespaceCharacterIndex)
        var newSelection = new vscode.Selection(newPosition, new vscode.Position(position.line, currentLine.range.end.character));
        editor.selection = newSelection;

    });
    context.subscriptions.push(selectCurrentLineDisposable);
    context.subscriptions.push(disposable);

    let functionApplySelfDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.function_apply_self", 
    (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
        function_apply_self(textEditor, edit);
    })
    context.subscriptions.push(functionApplySelfDisposable);

    let getParentArgsDisposable = vscode.commands.registerTextEditorCommand('cqh-python-import-helper.get_parent_args', (textEditor, edit) => {
        get_parent_args(textEditor, edit);
    })
    context.subscriptions.push(getParentArgsDisposable);

    let getParentNameDisposable = vscode.commands.registerTextEditorCommand('cqh-python-import-helper.get_parent_name', (textEditor, edit) => {
        get_parent_name(textEditor, edit);
    })
}

// this method is called when your extension is deactivated
export function deactivate() {
}