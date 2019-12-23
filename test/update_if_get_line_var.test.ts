//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

// import * as parser from '../src/parser';
import { setFlagsFromString } from 'v8';
import { generate_replace_upack_string } from '../src/handler/handler_dict_get_unpack'
import { update_if_get_line_var } from '../src/handler/handler_update_if';
// Defines a Mocha test suite to group tests of similar kind together
suite("update_if_get_line_var", () => {

    // Defines a Mocha unit test

    test("test simple if", () => {
        let line = "if name:";
        let out = update_if_get_line_var(line);
        assert.equal(out, 'name')
    })


});