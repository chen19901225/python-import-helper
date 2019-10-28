import * as vscode from "vscode";
import * as ts from "typescript";
import { error } from "util";
import { start } from "repl";


export function select_node(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cusor = textEditor.selection.active;
    let [startCol, endCol] = getNodeRange(textEditor.document.lineAt(cusor.line).text,
        cusor.character);
    let startPos = new vscode.Position(cusor.line, startCol);
    let endPos = new vscode.Position(cusor.line, endCol);
    textEditor.selection = new vscode.Selection(startPos, endPos);
}
function _wordCount(text: string, search: string, endIndex: number): number {
    let count = 0
    for (let ch of text.slice(0, endIndex - 1)) {
        if (ch === search) {
            count++
        }
    }
    return count;
}

function _get_square_context(text: string, start: number, end: number): [number, number] {
    // 检查 start  in quote
    if (start >= 0) {
        for (let quote of ["'", '"']) {
            if (_wordCount(text, quote, start) % 2 === 1) {
                let sliceString = text.slice(0, start)
                let index = sliceString.lastIndexOf(quote)
                if (index === -1) {
                    throw new error("cannot find " + quote + ' for string: ' + sliceString);
                }
                return _get_square_context(text, index - 1, end);
            }
        }
    }


    if (end < text.length) {
        // 检查  end in quote
        for (let quote of ['"', "'"]) {
            if (_wordCount(text, quote, end) % 2 === 1) {
                // let endString = text.slice(end);
                let quoteIndex = text.indexOf(quote, end + 1)
                if (quoteIndex === -1) {
                    throw new error("cannot find  end" + quote + ' for string: ' + text);
                }
                if (quoteIndex >= 0) {
                    return _get_square_context(text, start, quoteIndex + 1);
                }
            }

        }
    }

    // check start meet quote
    if (start >= 0) {
        let ch = text[start]

        for (let quote of ['"', "'"]) {
            if (ch === quote) {
                let sliceString = text.slice(0, start)
                let startIndex = sliceString.lastIndexOf(ch)
                if (startIndex === -1) {
                    throw new error("cannot find start for " + ch + " for string:" + sliceString);
                }
                return _get_square_context(text, startIndex - 1, end)
            }
        }
    }

    // check end meet quote
    if (end < text.length) {
        let end_ch = text[end]
        for (let quote of ["'", '"']) {
            if (end_ch === quote) {
                let endIndex = text.indexOf(quote, end + 1)
                if (endIndex === -1) {
                    throw new error("cannot find end for " + ch + " for string: " + text);
                }
                return _get_square_context(text, start, endIndex + 1);
            }
        }
    }

    let sliceString = text.slice(0, start)
    let pairs = [['(', ')'], ['[', ']'], ['{', '}']]

    // check start in ()
    if (start >= 0) {
        for (let [search_start, search_end] of pairs) {
            if (_wordCount(text, search_start, start) > _wordCount(text, search_end, start)) {
                let lastIndex = sliceString.lastIndexOf(search_start)
                if (lastIndex === -1) {
                    throw new error("cannot find start " + search_start + " for " + sliceString)
                }
                return _get_square_context(text, lastIndex - 1, end)

            }
        }

    }
    // check end in ()
    if (end < text.length) {
        for (let [search_start, search_end] of pairs) {
            if (_wordCount(text, search_start, start) > _wordCount(text, search_end, start)) {
                let lastIndex = text.indexOf(search_end, end + 1)
                if (lastIndex === -1) {
                    throw new error("cannot find end" + search_end + " for " + text)
                }
                return _get_square_context(text, lastIndex - 1, end)

            }
        }
    }

    // check start meet )


    // check end meet (





    return [start, end]
}

export function searchContextStart(text: string, startCol: number, ret_result: [number]) {
    for (let quote of ['"', "'"]) {
        if (_wordCount(text, quote, startCol) % 2 === 1) {
            // let start = text.lastIndexOf('"', startCol)
            // let reversed_text = text.
            // let [flag, index] = fLastIndex(text, quote, startCol);
            let sliceString = text.slice(0, startCol)
            let index = sliceString.lastIndexOf(quote)
            if (index === -1) {
                throw new error("cannot find " + quote + ' for string: ' + sliceString);
            }
            // if (!flag) {
            //     throw new error('cannot find ' + quote + ' for' + startCol);
            // }

            return index;
        }
    }
    let out_result = [-1];
    let adapter = (col: number) => {
        if (col == -1) {
            out_result[0] = 0;
            return;
        }
        let ch = text[col];
        if (['"', "'"].indexOf(ch) > -1) {
            let sliceStr = text.slice(0, col - 1);
            let index = sliceStr.lastIndexOf(ch)
            if (index === -1) {
                throw new error('cannot find ' + ch + ' for' + (col - 1));
            }
            // let [flag, index] = fLastIndex(text, ch, col - 1);
            // if (!flag) {

            // }
            out_result[0] = index;
            return;

        }
        if (!/[.a-zA-Z0-9_]/.test(ch)) {
            // return i + 1;
            // break;
            // if (col === 0) {
            //     out_result[0] = col;
            //     return;
            // }
            out_result[0] = col + 1;
            return;
            // adapter(col - 1);
        }

        if (col === 0) {
            out_result[0] = 0;
            return;
        }
        adapter(col - 1);
    }

    export function getNodeRange(text: string, col: number): [number, number] {
        // let cursor = textEditor.selection.active;
        let lineText = text;
        let open_parenthes_pos = text.indexOf("(");
        let wordCount = (search: string, endIndex: number) => {
            let count = 0
            for (let ch of text.slice(0, endIndex - 1)) {
                if (ch === search) {
                    count++
                }
            }
            return count;
        }
        // let fLastIndex = (source: string, search: string, lastPos: number): [boolean, number] => {
        //     for (let i = lastPos; i >= 0; i--) {
        //         let currentCh = source[i];
        //         if (currentCh === search) {
        //             return [true, i]
        //         }
        //     }
        //     return [false, 0]
        // }
        let searchStart = (startCol) => {
            for (let quote of ['"', "'"]) {
                if (wordCount(quote, startCol) % 2 === 1) {
                    // let start = text.lastIndexOf('"', startCol)
                    // let reversed_text = text.
                    // let [flag, index] = fLastIndex(text, quote, startCol);
                    let sliceString = text.slice(0, startCol)
                    let index = sliceString.lastIndexOf(quote)
                    if (index === -1) {
                        throw new error("cannot find " + quote + ' for string: ' + sliceString);
                    }
                    // if (!flag) {
                    //     throw new error('cannot find ' + quote + ' for' + startCol);
                    // }

                    return index;
                }
            }
            let out_result = [-1];
            let adapter = (col: number) => {
                if (col == -1) {
                    out_result[0] = 0;
                    return;
                }
                let ch = text[col];
                if (['"', "'"].indexOf(ch) > -1) {
                    let sliceStr = text.slice(0, col - 1);
                    let index = sliceStr.lastIndexOf(ch)
                    if (index === -1) {
                        throw new error('cannot find ' + ch + ' for' + (col - 1));
                    }
                    // let [flag, index] = fLastIndex(text, ch, col - 1);
                    // if (!flag) {

                    // }
                    out_result[0] = index;
                    return;

                }
                if (!/[.a-zA-Z0-9_]/.test(ch)) {
                    // return i + 1;
                    // break;
                    // if (col === 0) {
                    //     out_result[0] = col;
                    //     return;
                    // }
                    out_result[0] = col + 1;
                    return;
                    // adapter(col - 1);
                }

                if (col === 0) {
                    out_result[0] = 0;
                    return;
                }
                adapter(col - 1);

            }


            adapter(startCol);

            if (out_result[0] == -1) {
                throw new error("uncaught exception");
            }
            return out_result[0];


            // 其他
            // for (let i = startCol; i >= 0; i--) {
            //     let ch = text[i]
            //     if (!/[.a-zA-Z0-9_'"]/.test(ch)) {
            //         return i + 1;
            //         break;
            //     }
            //     // start_pos = i;
            // }
            // return 0;
        } // search for start
        if (open_parenthes_pos > -1) {
            if (open_parenthes_pos < col) {
                let end_parenthes_pos = text.indexOf(")", col)
                if (end_parenthes_pos == -1) {
                    throw error("cannot find ) after " + col);
                }
                let startPos = searchStart(open_parenthes_pos - 1);
                return [startPos, end_parenthes_pos + 1];
            }
        }
        // 没有(, 或者(在col之后
        // 也就是
        // let open_square_pos =
        let end_square_pos = text.indexOf("]")
        let end_pos;
        if (end_square_pos == -1) {
            // 不是]调用
            end_pos = text.indexOf(' ', col);
            if (end_pos == -1) {
                end_pos = text.length;
            }

        } else {
            end_pos = end_square_pos;
        }
        let start_pos = searchStart(col);

        return [start_pos, end_pos]
        // return [-1, -1]
    }

    export function wrap_node(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
        // let [start, end] = [-1, -1]
        let startPos: vscode.Position, endPos: vscode.Position
        if (textEditor.selection.isEmpty) {
            let cusor = textEditor.selection.active;
            let [startCol, endCol] = getNodeRange(textEditor.document.lineAt(cusor.line).text,
                cusor.character);
            startPos = new vscode.Position(cusor.line, startCol);
            endPos = new vscode.Position(cusor.line, endCol);
            select_node(textEditor, edit);
        } else {
            let selection = textEditor.selections[0];
            startPos = selection.start
            endPos = selection.end;
        }

        vscode.window.showInputBox({
            password: false,
            placeHolder: "wrap_func",
            prompt: "请输入wrap_func",
        }).then((msg) => {
            if (!msg) {
                return;
            }
            msg = msg.trim();
            if (!msg) {
                return;
            }
            let currentText = textEditor.document.getText(new vscode.Range(startPos, endPos));
            let replaceText = `${msg}(${currentText})`
            textEditor.edit((builder) => {
                builder.replace(new vscode.Range(startPos, endPos), replaceText);
            }).then((success) => {
                let newPosition = new vscode.Position(startPos.line, startPos.character + replaceText.length + 1)
                textEditor.selection = new vscode.Selection(newPosition, newPosition);
            })

        })


    }