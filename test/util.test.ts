
// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as parser from '../src/parser';
import { setFlagsFromString } from 'v8';
import { get_variable_list } from "../src/util"
// Defines a Mocha test suite to group tests of similar kind together
suite("util Tests", () => {

    // Defines a Mocha unit test
    test("single assign", () => {
        let line = "name='test'";
        let vars = get_variable_list(line);
        assert.deepEqual(vars, ["name", "'test'"])
    });

    test("multi assign", () => {
        let line = "name,status='test',200";
        let vars = get_variable_list(line);
        assert.deepEqual(vars, ["name", "status", "'test'", 200])
    })

    test("parent", () => {
        let line = "name,status=(1, 2)";
        let vars = get_variable_list(line);
        assert.deepEqual(vars, ["name", "status", "(1, 2)"])
    })




});