import * as vscode from "vscode";
import * as ts from "typescript";
import { error } from "util";
import { start } from "repl";


export function select_node(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let startPos: vscode.Position, endPos: vscode.Position
    if (textEditor.selection.isEmpty) {
        let cusor = textEditor.selection.active;
        let [startCol, endCol] = getNodeRange(textEditor.document.lineAt(cusor.line).text,
            cusor.character);
        startPos = new vscode.Position(cusor.line, startCol);
        endPos = new vscode.Position(cusor.line, endCol);
    } else {
        let selection = textEditor.selections[0];
        endPos = selection.end;
        let line = textEditor.document.lineAt(selection.start.line);
        startPos = new vscode.Position(selection.start.line,
            line.text.indexOf("("))
    }


    textEditor.selection = new vscode.Selection(startPos, endPos);
}
function _wordCount(text: string, search: string, endIndex: number): number {
    let count = 0
    for (let ch of text.slice(0, endIndex + 1)) {
        if (ch === search) {
            count++
        }
    }
    return count;
}

function _get_square_context(text: string, start: number, end: number): [number, number] {
    let [ch, end_ch] = [text[start], text[end]]
    // check start meet quote
    if (start >= 0) {
        // let ch = text[start]

        for (let quote of ['"', "'"]) {
            if (ch === quote) {
                // let sliceString = text.slice(0, start)
                // let startIndex = sliceString.lastIndexOf(ch)
                // if (startIndex === -1) {
                //     throw new error("cannot find start for " + ch + " for string:" + sliceString);
                // }
                return _get_square_context(text, start - 1, end)
            }
        }
    }

    // check end meet quote
    if (end < text.length) {
        // let end_ch = text[end]
        for (let quote of ["'", '"']) {
            if (end_ch === quote) {
                // let endIndex = text.indexOf(quote, end + 1)
                // if (endIndex === -1) {
                //     throw new error("cannot find end for " + end_ch + " for string: " + text);
                // }
                return _get_square_context(text, start, end + 1);
            }
        }
    }

    // 检查 start  in quote
    let sliceString = text.slice(0, start + 1)
    let endString = text.slice(0, end + 1);
    if (start >= 0) {
        for (let quote of ["'", '"']) {
            if (_wordCount(text, quote, start) % 2 === 1) {

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
                let quoteIndex = text.indexOf(quote, end)
                if (quoteIndex === -1) {
                    throw new error("cannot find  end" + quote + ' for string: ' + text);
                }
                if (quoteIndex >= 0) {
                    return _get_square_context(text, start, quoteIndex + 1);
                }
            }

        }
    }



    // let sliceString = text.slice(0, start)
    let pairs = [['(', ')'], ['[', ']'], ['{', '}']]


    // check start meet )
    if (start >= 0) {
        for (let [search_start, search_end] of pairs) {
            let ch = text[start]
            if ([search_start, search_end].indexOf(ch) > -1) {
                // let startIndex = sliceString.lastIndexOf(search_start)
                // if (startIndex === -1) {
                //     throw new error("cannot find start" + search_start + " for string " + sliceString);
                // }
                return _get_square_context(text, start - 1, end)
            }

        }
    }


    // check end meet (
    if (end < text.length) {
        for (let [search_start, search_end] of pairs) {
            let end_ch = text[end]
            if ([search_start, search_end].indexOf(end_ch) > -1) {
                // let startIndex = text.indexOf(search_end, end + 1);
                // if (startIndex === -1) {
                //     throw new error("cannot find start" + search_start + " for string " + sliceString);
                // }
                return _get_square_context(text, start, end + 1)
            }

        }
    }


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
            if (_wordCount(text, search_start, end) > _wordCount(text, search_end, end)) {
                let lastIndex = text.indexOf(search_end, end + 1)
                if (lastIndex === -1) {
                    throw new error("cannot find end" + search_end + " for " + text)
                }
                return _get_square_context(text, lastIndex - 1, end)

            }
        }
    }







    return [start, end]
}

// export function searchContextStart(text: string, startCol: number, ret_result: [number]) {
//     for (let quote of ['"', "'"]) {
//         if (_wordCount(text, quote, startCol) % 2 === 1) {
//             // let start = text.lastIndexOf('"', startCol)
//             // let reversed_text = text.
//             // let [flag, index] = fLastIndex(text, quote, startCol);
//             let sliceString = text.slice(0, startCol)
//             let index = sliceString.lastIndexOf(quote)
//             if (index === -1) {
//                 throw new error("cannot find " + quote + ' for string: ' + sliceString);
//             }
//             // if (!flag) {
//             //     throw new error('cannot find ' + quote + ' for' + startCol);
//             // }

//             return index;
//         }
//     }
//     let out_result = [-1];
//     let adapter = (col: number) => {
//         if (col == -1) {
//             out_result[0] = 0;
//             return;
//         }
//         let ch = text[col];
//         if (['"', "'"].indexOf(ch) > -1) {
//             let sliceStr = text.slice(0, col - 1);
//             let index = sliceStr.lastIndexOf(ch)
//             if (index === -1) {
//                 throw new error('cannot find ' + ch + ' for' + (col - 1));
//             }
//             // let [flag, index] = fLastIndex(text, ch, col - 1);
//             // if (!flag) {

//             // }
//             out_result[0] = index;
//             return;

//         }
//         if (!/[.a-zA-Z0-9_]/.test(ch)) {
//             // return i + 1;
//             // break;
//             // if (col === 0) {
//             //     out_result[0] = col;
//             //     return;
//             // }
//             out_result[0] = col + 1;
//             return;
//             // adapter(col - 1);
//         }

//         if (col === 0) {
//             out_result[0] = 0;
//             return;
//         }
//         adapter(col - 1);
//     }
// }

export function getNodeRange(text: string, col: number): [number, number] {
    // let [start, end] = [col, col]

    // while (true) {
    //     [start, end] = _get_square_context(text, start, end);
    //     let _search_start = (startCol: number): number => {
    //         if (startCol <= 0) {
    //             return startCol;
    //         }
    //         let ch = text[startCol];
    //         if (!/[._a-zA-Z0-9]/.test(ch)) {
    //             return startCol;
    //         }
    //         return _search_start(startCol - 1);
    //     }

    //     let _search_end = (startCol: number): number => {
    //         if (startCol >= text.length) {
    //             return startCol
    //         }
    //         let ch = text[startCol]
    //         if (!/[._a-zA-Z0-9]/.test(ch)) {
    //             return startCol;
    //         }
    //         return _search_end(startCol + 1);

    //     }
    //     let new_start = _search_start(start)
    //     let new_end = _search_end(end)
    //     if (new_start === start && new_end === new_end) {
    //         if (new_start < 0) {
    //             new_start = 0;
    //         }
    //         if (new_end > text.length) {
    //             new_end = text.length
    //         }
    //         return [new_start, new_end]
    //     }
    //     // return getNodeRange()
    //     // return [start, end]
    //     [start, end] = [new_start, new_end]
    // }
    let equal_index = text.indexOf('=')
    let search_start = (col: number): number => {
        for (let index = col; index < text.length; index++) {
            let ch = text[index]
            if (!/\s/.test(ch)) {
                return index;
            }
        }

        // return search_start(co)
    }

    let search_end = (col: number): number => {
        for (let i = col; i >= 0; i--) {
            let ch = text[i];
            if (!/\s/.test(ch)) {
                return i;
            }
        }
        return 0;
    }
    let end = search_end(text.length - 1);
    let start = search_start(0);
    if (equal_index > -1) {
        start = search_start(equal_index + 1);
    }
    return [start, end + 1]
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