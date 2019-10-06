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
// import * as parser from '../src/parser';
import { setFlagsFromString } from 'v8';
import {removeVarType} from '../src/util'
// Defines a Mocha test suite to group tests of similar kind together
suite("get left pattern test", () => {

    // Defines a Mocha unit test
    
    test("test no type", () => {
        let line = "show, me";
        let out = removeVarType(line);
        assert.equal(out, 'show, me')
    })
    test("test one with type with string", () => {
        let line = "name: string";
        let out = removeVarType(line);
        assert.equal(out, "name")
    })

    test("test one type with int", () => {
        let line = "name: int";
        let out = removeVarType(line);
        assert.equal(out, "name")
    })
    
    test("test one type with dict", () => {
        let line = "name: dict[str, str]";
        let out = removeVarType(line);
        assert.equal(out, "name")
    })

    test("test one type with list", () => {
        let line = "name: List[str]";
        let out = removeVarType(line);
        assert.equal(out, "name")
    })

    
});