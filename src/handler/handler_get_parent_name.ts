import * as vscode from "vscode";
import { parse_function } from '../parser';
import { try_get_definition } from '../util'
import { service_position_history_add_position } from "../service/service_position_history";
import { update_last_used_variable } from "./handler_get_last_used_variable";

export function get_parent_name(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const definition = try_get_definition(textEditor, edit);
    const parseResult = parse_function(definition);

    let insertContent = parseResult.name;
    let currentPosition = textEditor.selection.active;
    let quickItems: vscode.QuickPickItem[] = []
    service_position_history_add_position(currentPosition);
    update_last_used_variable(insertContent);
    edit.insert(currentPosition, insertContent);
}