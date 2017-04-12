"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("../src/lexer");
var chai_1 = require("chai");
describe("Lexer Reader Tests 1..", function () {
    it("Simple Test 1", function () {
        var lr = new lexer_1.default("");
        chai_1.expect(lr.next()).to.deep.equal({ type: "eof", value: "", start: 0, end: 0 });
    });
    it("Simple Test 2", function () {
        var lr = new lexer_1.default("one");
        chai_1.expect(lr.next()).to.deep.equal({ type: "token", value: "one", start: 0, end: 2 });
        chai_1.expect(lr.next()).to.deep.equal({ type: "eof", value: "", start: 3, end: 3 });
        chai_1.expect(lr.next()).to.deep.equal({ type: "eof", value: "", start: 3, end: 3 });
        chai_1.expect(lr.next()).to.deep.equal({ type: "eof", value: "", start: 3, end: 3 });
    });
});
//# sourceMappingURL=lexer.nodespec.js.map