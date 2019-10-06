//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';
import { setFlagsFromString } from 'v8';
import {find_last_vars} from '../src/handler/handler_get_last_line_variable'
// Defines a Mocha test suite to group tests of similar kind together
suite("get last line var test", () => {

    // Defines a Mocha unit test
    
    test("test simple ok", () => {
        let lines = [
            "one, two=1, 2"
        ]
        let [flag, vars] = find_last_vars(lines, 0)
        assert.equal(flag, true)
        assert.equal(vars, "one, two")
    })

    test("test fail with no =", () => {
        let lines = [
            "one, two-1, 2"
        ]
        let [flag, vars] = find_last_vars(lines, 0)
        assert.equal(flag, false)
        // assert.equal(vars, "one, two")
    })

    test("test fail with comment", () => {
        let lines = [
            "    #one, two=1, 2"
        ]
        let [flag, vars] = find_last_vars(lines, 8)
        assert.equal(flag, false)
        // assert.equal(vars, "one, two")
    })

    test("test fail with indent ", () => {
        let lines = [
            "    one, two=1, 2"
        ]
        let [flag, vars] = find_last_vars(lines, 0)
        assert.equal(flag, false)
        // assert.equal(vars, "one, two")
    })

    
    
    
});