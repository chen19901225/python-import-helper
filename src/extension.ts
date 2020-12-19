'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { upgradeDelegate } from "./upgrade";
import { function_apply_self } from "./handler/function_apply_self";
import { get_parent_name } from './handler/handler_get_parent_name';
import { get_parent_args } from './handler/get_parent_args'
import { delegate_to_parent } from './handler/handler_delegate_to_parent'
import { handler_dict_unpack, handler_dict_prepend } from './handler/handler_dict_unpack'
import { handler_dict_get_unpack } from './handler/handler_dict_get_unpack'
import { get_original_parent_args } from "./handler/handler_get_original_parent_args"
import { insert_left_pattern } from "./handler/handler_get_left_pattern"
import { get_last_if_variable } from "./handler/handler_get_last_if_variable"
import { get_function_position_argument } from "./handler/handler_get_function_position_argument"
import { get_last_line_variable } from "./handler/handler_get_last_line_variable"
import { show_var_list } from "./handler/handler_show_var_list"
import { file_name } from "./handler/handler_file_name"
import { insert_self } from "./handler/handler_insert_self"
import { get_last_used_variable } from "./handler/handler_get_last_used_variable"
import { get_left_last_part } from "./handler/handler_get_left_last_part"
import { move_op_end } from "./handler/handler_move_op_end"
import { get_current_class_name } from './handler/handler_get_current_class_name'
import { insert_base } from "./handler/handler_insert_base"
import { export_class_to_module } from "./handler/handler_export_class_to_module"
import { get_last_func } from "./handler/handler_get_last_func"
import { wrap_node, select_node } from "./handler/handler_wrap_node"
import { node_format } from "./handler/handler_node_format"
import { handle_var } from "./handler/handler_handle_var"
import { select_history_cusor } from './handler/handler_select_history_cusor';
import { insert_last_import } from './handler/handler_insert_last_import';
import { update_if } from './handler/handler_update_if';
import { insert_import } from './handler/handler_insert_import';
import { var_last_part } from './handler/handler_var_last_part';
import { tornado_export_class_to_urls } from './handler/handler_tornado_export_class_to_urls';
import { cqh_run_pytest_in_terminal } from './handler/handler_cqh_run_pytest_in_terminal';
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
    let disposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.import-upgrade", (textEditor, edit) => {
        if (!(textEditor.selection)) {
            vscode.window.showErrorMessage("You must select a content to convert");
            return;
        }

        // 自动获取鼠标位置
        const editor = vscode.window.activeTextEditor;
        const position = editor.selection.active;
        const currentLine = editor.document.lineAt(position.line);


        // var newPosition = position.with(position.line, currentLine.firstNonWhitespaceCharacterIndex);
        let newPosition = new vscode.Position(position.line, currentLine.firstNonWhitespaceCharacterIndex)
        var newSelection = new vscode.Selection(newPosition, new vscode.Position(position.line, currentLine.range.end.character));
        editor.selection = newSelection;

        upgradeDelegate(textEditor, edit);
    })

    let selectCurrentLineDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-help.select-current-line", (textEditor, edit) => {
        // 第一步获取当前鼠标位置
        const editor = vscode.window.activeTextEditor;
        const position = editor.selection.active;
        const currentLine = editor.document.lineAt(position.line);


        // var newPosition = position.with(position.line, currentLine.firstNonWhitespaceCharacterIndex);
        let newPosition = new vscode.Position(position.line, currentLine.firstNonWhitespaceCharacterIndex)
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

    let getParentArgsDisposable = vscode.commands.registerTextEditorCommand('cqh-python-import-helper.get_parent_args_dict', (textEditor, edit) => {
        get_parent_args(textEditor, edit);
    })
    context.subscriptions.push(getParentArgsDisposable);

    let getOriginalParentArgsDisposable = vscode.commands.registerTextEditorCommand('cqh-python-import-helper.get_parent_original_args', (textEditor, edit) => {
        get_original_parent_args(textEditor, edit);
    })
    context.subscriptions.push(getOriginalParentArgsDisposable)

    let getParentNameDisposable = vscode.commands.registerTextEditorCommand('cqh-python-import-helper.get_parent_name', (textEditor, edit) => {
        get_parent_name(textEditor, edit);
    })
    context.subscriptions.push(getParentNameDisposable);
    let DelegateParentDisposable = vscode.commands.registerTextEditorCommand('cqh-python-import-helper.delegate_to_parent',
        (textEditor, edit) => {
            delegate_to_parent(textEditor, edit);
        })
    context.subscriptions.push(DelegateParentDisposable);

    let DictUpackDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.dict_unpack",
        (textEditor, edit) => {
            handler_dict_unpack(textEditor, edit);
        })
    context.subscriptions.push(DictUpackDisposable);


    let DictGetUpackDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.dict_get_unpack",
        (textEditor, edit) => {
            handler_dict_get_unpack(textEditor, edit);
        })
    context.subscriptions.push(DictGetUpackDisposable);
    let DictGetPrependDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.dict_prepend",
        (textEditor, edit) => {
            handler_dict_prepend(textEditor, edit);
        })
    context.subscriptions.push(DictGetPrependDisposable);

    let getLeftPatternDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.get_left_pattern",
        (textEditor, edit) => {
            insert_left_pattern(textEditor, edit);
        });
    context.subscriptions.push(getLeftPatternDisposable);

    let getLastIfVariablePosable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.get_last_if_variable",
        (textEditor, edit) => {
            get_last_if_variable(textEditor, edit);
        });
    context.subscriptions.push(getLastIfVariablePosable);


    for (let i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        let getFunctionPositionVaraibleDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.get_function_position_argument_" + i,
            (textEditor, edit) => {
                get_function_position_argument(textEditor, edit, i);
            })
        context.subscriptions.push(getFunctionPositionVaraibleDisposable);
    }

    let getLastLineVariableDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.get_last_line_variable",
        (textEditor, edit) => {
            get_last_line_variable(textEditor, edit);
        })
    context.subscriptions.push(getLastLineVariableDisposable);

    let showVarListDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.show_var_list",
        (textEditr, edit) => {
            show_var_list(textEditr, edit);
        });
    context.subscriptions.push(showVarListDisposable);

    let getFileNameDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.get_current_filename",
        (textEdit, edit) => {
            file_name(textEdit, edit);
        })
    context.subscriptions.push(getFileNameDisposable);

    // insert self
    let insertSelfDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.insert_self",
        (textEdit, edit) => {
            insert_self(textEdit, edit);
        })
    context.subscriptions.push(insertSelfDisposable);

    // get last used var
    let getLastUsedVariableDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.get_last_used_variable",
        (textEdit, edit) => {
            get_last_used_variable(textEdit, edit);
        })
    context.subscriptions.push(getLastUsedVariableDisposable)

    // get left last part 
    let getLeftLastPart = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.get_left_last_part",
        (textEdit, edit) => {
            get_left_last_part(textEdit, edit);
        })
    context.subscriptions.push(getLeftLastPart);

    // move op end
    let moveOpEndDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.move_op_end",
        (textEdit, edit) => {
            move_op_end(textEdit, edit);
        })
    context.subscriptions.push(moveOpEndDisposable);

    // get crrent class name
    let getCurrentClassNameDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.get_current_classname",
        (textEdit, edit) => {
            get_current_class_name(textEdit, edit);
        });

    context.subscriptions.push(getCurrentClassNameDisposable);

    // insert base
    let insertBaseDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.insert_base",
        (textEdit, edit) => {
            insert_base(textEdit, edit);
        });

    context.subscriptions.push(insertBaseDisposable);


    let exportClassToModuleDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.export_class_to_module",
        (textEdit, edit) => {
            export_class_to_module(textEdit, edit);
        });
    context.subscriptions.push(exportClassToModuleDisposable);

    let tornadoExportClassToUrlsDiposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.tornado_export_class_to_urls",
        async (textEdit, edit) => {
            await tornado_export_class_to_urls(textEdit, edit);
        });
    context.subscriptions.push(tornadoExportClassToUrlsDiposable);


    let getLastFuncDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.get_last_func",
        (textEdit, edit) => {
            get_last_func(textEdit, edit);
        })
    context.subscriptions.push(getLastFuncDisposable);




    let wrapNodeDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.wrap_node",
        (textEdit, edit) => {
            wrap_node(textEdit, edit);
        });

    context.subscriptions.push(wrapNodeDisposable);

    let SelectNodeDiposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.select_node",
        (textEdit, edit) => {
            select_node(textEdit, edit);
        });
    context.subscriptions.push(SelectNodeDiposable);


    let nodeFormatDiposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.node-format",
        (textEdit, edit) => {
            node_format(textEdit, edit);
        })
    context.subscriptions.push(nodeFormatDiposable);

    let handlerVarDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.handler-var",
        (textEdit, edit) => {
            handle_var(textEdit, edit);
        })

    context.subscriptions.push(handlerVarDisposable);


    let handleSelectHistoryCusorDiposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.select-history-cusor",
        (textEdit, edit) => {
            select_history_cusor(textEdit, edit);
        })
    context.subscriptions.push(handleSelectHistoryCusorDiposable);

    let insertLastImportDiposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.insert-last-import",
        (textEdit, edit) => {
            insert_last_import(textEdit, edit);
        });
    context.subscriptions.push(insertLastImportDiposable);

    let updateIfDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.update_if",
        (textEdit, edit) => {
            update_if(textEdit, edit);
        });
    context.subscriptions.push(updateIfDisposable);

    let insertImportDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.insert_import",
        (textEdit, edit) => {
            insert_import(textEdit, edit);
        })
    context.subscriptions.push(insertImportDisposable);

    let handlerLastVarPartDisposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.handler-last-var-part",
        (textEdit, edit) => {
            var_last_part(textEdit, edit);
        });
    context.subscriptions.push(handlerLastVarPartDisposable);

    let cqh_run_pytest_in_terminal_disposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.cqh_run_pytest_in_terminal", 
    (textEdit, edit) => {
        cqh_run_pytest_in_terminal(textEdit, edit);
    })

    context.subscriptions.push(cqh_run_pytest_in_terminal_disposable);


}

// this method is called when your extension is deactivated
export function deactivate() {
}