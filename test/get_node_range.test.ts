//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { setFlagsFromString } from 'v8';
// import {find_last_vars} from '../src/handler/handler_get_last_line_variable'
import { getNodeRange } from "../src/handler/handler_wrap_node"
import { isPropertyAccessOrQualifiedName } from 'typescript';
import { link } from 'fs';
// Defines a Mocha test suite to group tests of similar kind together
suite("get node range test", () => {
    // test("test dict with =", () => {
    //     let prefix = "org_service_names = "
    //     let suffix = "conf_ele['services'].keys()"
    //     let [start, end] = getNodeRange(prefix + suffix, prefix.length + "conf_ele['services".length)
    //     assert.equal(start, prefix.length, "start error")
    //     assert.equal(end, prefix.length + suffix.length, "end error")
    // })

    test("test double quote string call in func callback", () => {
        let line = '"HEADER,GET,POST,PUT,PATCH,OPTION,DELETE".split(",")'
        let [start, end] = getNodeRange(line, line.length - 2)
        assert.equal(start, 0)
        assert.equal(end, line.length);
    })

    test("test simple var with =", () => {
        let prefix = "a = "
        let suffix = "show_me_the_money"
        let [start, end] = getNodeRange(prefix + suffix, prefix.length + 2);
        assert.equal(start, prefix.length);
        assert.equal(end, prefix.length + suffix.length)
    })




    test("test double quote string call", () => {
        let line = '"HEADER,GET,POST,PUT,PATCH,OPTION,DELETE".split(",")'
        let [start, end] = getNodeRange(line, 2)
        assert.equal(start, 0)
        assert.equal(end, line.length);
    })




    test("test single quote string call", () => {
        let line = "'HEADER,GET,POST,PUT,PATCH,OPTION,DELETE'.split(',')"
        let [start, end] = getNodeRange(line, 2)
        assert.equal(start, 0)
        assert.equal(end, line.length);
    })


    // Defines a Mocha unit test
    test("test var", () => {
        let line = "show_me_the_money"
        let [start, end] = getNodeRange(line, 1)
        assert.equal(start, 0)
        assert.equal(end, line.length)
    })



    test("test func ok", () => {
        let line = "showme(var, var2)"

        let [start, end] = getNodeRange(line, "showme(var,".length)
        // assert.equal(flag, true)
        // assert.equal(vars, "one, two")
        assert.equal(start, 0)
        assert.equal(end, line.length);
    })



    test("with func with =", () => {
        let prefix = "a = "
        let suffix = "showme(var1,var2)"
        let [start, end] = getNodeRange(prefix + suffix, prefix.length + "showme(var1,".length)
        assert.equal(start, prefix.length);
        assert.equal(end, prefix.length + suffix.length);

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