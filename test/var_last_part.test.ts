//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import {find_last_vars} from '../src/handler/handler_get_last_line_variable'
import { get_last_part_range } from '../src/handler/handler_var_last_part'
// Defines a Mocha test suite to group tests of similar kind together
suite("var last port ", () => {
    test("test at the end", () => {
        let obj: Array<[string, number]> = [
            ["_var", "_var".length -1],
            ['_var ', "_var ".length -2],
            ["_var=", "_var=".length-2]
        ];
        for (let [line_text, index] of obj) {

            let [start, end] = get_last_part_range(line_text, index, index);

            assert.equal(end, index, `end, ${end}, ${line_text[end]}`);
            assert.equal(start, 1, `start: ${start}`);
        }
    })





    // test("test fail with no =", () => {
    //     let lines = [
    //         "one, two-1, 2"
    //     ]
    //     let [flag, vars] = find_last_vars(lines, 0)
    //     assert.equal(flag, false)
    //     // assert.equal(vars, "one, two")
    // })

    // test("test fail with comment", () => {
    //     let lines = [
    //         "    #one, two=1, 2"
    //     ]
    //     let [flag, vars] = find_last_vars(lines, 8)
    //     assert.equal(flag, false)
    //     // assert.equal(vars, "one, two")
    // })

    // test("test fail with indent ", () => {
    //     let lines = [
    //         "    one, two=1, 2"
    //     ]
    //     let [flag, vars] = find_last_vars(lines, 0)
    //     assert.equal(flag, false)
    //     // assert.equal(vars, "one, two")
    // })




});