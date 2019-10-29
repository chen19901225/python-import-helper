//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import {find_last_vars} from '../src/handler/handler_get_last_line_variable'
import { format_apply_line } from "../src/handler/handler_node_format"
// Defines a Mocha test suite to group tests of similar kind together
suite("format apply line ", () => {
    test("no =", () => {
        let line = "test"
        let col = 0
        let lines = format_apply_line(line, col)
        assert.deepEqual(lines, [line])
    })
    test("one apply", () => {
        let line = "dict(name=name, age=age"
        let col = 4
        let lines = format_apply_line(line, col)
        assert.deepEqual(lines, [
            "name=name,",
            "age=age"
        ])
    })
})