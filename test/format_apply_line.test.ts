//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import {find_last_vars} from '../src/handler/handler_get_last_line_variable'
import { format_apply_line, format_dict_line, format_func_line } from "../src/handler/handler_node_format"
// Defines a Mocha test suite to group tests of similar kind together
suite("format apply line ", () => {
    test("no =", () => {
        let line = "test"
        let col = 0
        let lines = format_apply_line(line, col)
        assert.deepEqual(lines, [line])
    })
    test("one apply", () => {
        let line = "dict(name=name, age=age)"
        let col = 0
        let lines = format_dict_line(line)
        let prefix = " ".repeat("dict(".length)
        assert.deepEqual(lines, [
            "#" + line,
            "dict(",
            prefix + "name=name,",
            prefix + "age=age",
            ")"
        ])
    })

    test("def and with apply", () => {
        let line = "def fn(self, name=none, method='GET'):"
        let col = 0
        let lines = format_func_line(line)
        let prefix = " ".repeat(4)
        assert.deepEqual(lines, [
            "#" + line,
            "def fn(",
            prefix + "self,",
            prefix + "name=none,",
            prefix + "method='GET'",
            "):"
        ])
    })

    test("def apply with partial", () => {
        let line = "def fn(self, name=none, method='GET'"
        let col = 0
        let lines = format_func_line(line)
        let prefix = " ".repeat(4)
        assert.deepEqual(lines, [
            "#" + line,
            "def fn(",
            prefix + "self,",
            prefix + "name=none,",
            prefix + "method='GET'",

        ])
    })

    test("test simple apply one", () => {
        let line = "name=none, method='GET'"
        let col = 0
        let lines = format_dict_line(line)

        assert.deepEqual(lines, [
            "#" + line,
            "name=none,",
            "method='GET'",

        ])
    })
})