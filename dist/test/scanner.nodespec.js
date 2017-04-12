"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var scanner_1 = require("../src/scanner");
describe("Scanner Tests", function () {
    function scan(expr) {
        return new scanner_1.Scanner(expr).next();
    }
    function scanFn(expr) {
        return function () {
            return new scanner_1.Scanner(expr).next();
        };
    }
    function scanAll(expr) {
        var s = new scanner_1.Scanner(expr);
        var a = [];
        while (true) {
            var t = s.next();
            a.push(t);
            if (t.type === "eof")
                return a;
        }
    }
    it("empty string tests", function () {
        chai_1.expect(scan(null).type).equal("eof");
        chai_1.expect(scan("  ").type).equal("eof");
        chai_1.expect(scan(" \n\r \t ").type).equal("eof");
    });
    it("bulk numeric tests", function () {
        for (var i = 0; i < 100; i++) {
            var s = i.toString();
            chai_1.expect(scan(s)).to.deep.equal({ type: "number", value: s, start: 0, end: s.length - 1 });
        }
        for (var i = 0; i < 100; i++) {
            var s = i.toString() + ".";
            chai_1.expect(scan(s)).to.deep.equal({ type: "number", value: s, start: 0, end: s.length - 1 });
        }
        for (var i = 0; i < 100; i++) {
            var s = i.toString() + "." + i.toString();
            chai_1.expect(scan(s)).to.deep.equal({ type: "number", value: s, start: 0, end: s.length - 1 });
        }
        for (var i = 0; i < 100; i++) {
            var s = "." + i.toString();
            chai_1.expect(scan(s)).to.deep.equal({ type: "number", value: s, start: 0, end: s.length - 1 });
        }
    });
    it("simple string tests", function () {
        chai_1.expect(scan("''")).to.deep.equal({ type: "string", value: "", start: 0, end: 1 });
        chai_1.expect(scan("\"\"")).to.deep.equal({ type: "string", value: "", start: 0, end: 1 });
        chai_1.expect(scan(" 'simple test'")).to.deep.equal({ type: "string", value: "simple test", start: 1, end: 13 });
    });
    it("error string tests", function () {
        chai_1.expect(scanFn(" 'this is a test")).to.throw(Error, "Unterminated quote");
        chai_1.expect(scanFn(" \"this is a test")).to.throw(Error, "Unterminated quote");
        chai_1.expect(scanFn("'")).to.throw(Error, "Unterminated quote");
    });
    it("complex string tests", function () {
        chai_1.expect(scan("  '  \\r  '")).to.deep.equal({ type: "string", value: "  \r  ", start: 2, end: 9 });
        chai_1.expect(scan("  '  \\f  '")).to.deep.equal({ type: "string", value: "  \f  ", start: 2, end: 9 });
        chai_1.expect(scan("  '  \\n  '")).to.deep.equal({ type: "string", value: "  \n  ", start: 2, end: 9 });
        chai_1.expect(scan("  '  \\t  '")).to.deep.equal({ type: "string", value: "  \t  ", start: 2, end: 9 });
        chai_1.expect(scan("  '  \\v  '")).to.deep.equal({ type: "string", value: "  \v  ", start: 2, end: 9 });
        chai_1.expect(scan("  '  \\\\  '")).to.deep.equal({ type: "string", value: "  \\  ", start: 2, end: 9 });
        chai_1.expect(scan("  '  \\\'  '")).to.deep.equal({ type: "string", value: "  \'  ", start: 2, end: 9 });
        chai_1.expect(scan("  '  \\\"  '")).to.deep.equal({ type: "string", value: "  \"  ", start: 2, end: 9 });
        chai_1.expect(scan("  '  \\q  '")).to.deep.equal({ type: "string", value: "  \q  ", start: 2, end: 9 });
        chai_1.expect(scan("  '  A\\rB  '")).to.deep.equal({ type: "string", value: "  A\rB  ", start: 2, end: 11 });
        chai_1.expect(scan("  '  A\\fB  '")).to.deep.equal({ type: "string", value: "  A\fB  ", start: 2, end: 11 });
        chai_1.expect(scan("  '  A\\nB  '")).to.deep.equal({ type: "string", value: "  A\nB  ", start: 2, end: 11 });
        chai_1.expect(scan("  '  A\\tB  '")).to.deep.equal({ type: "string", value: "  A\tB  ", start: 2, end: 11 });
        chai_1.expect(scan("  '  A\\vB  '")).to.deep.equal({ type: "string", value: "  A\vB  ", start: 2, end: 11 });
        chai_1.expect(scan("  '  A\\\\B  '")).to.deep.equal({ type: "string", value: "  A\\B  ", start: 2, end: 11 });
        chai_1.expect(scan("  '  A\\\'B  '")).to.deep.equal({ type: "string", value: "  A\'B  ", start: 2, end: 11 });
        chai_1.expect(scan("  '  A\\\"B  '")).to.deep.equal({ type: "string", value: "  A\"B  ", start: 2, end: 11 });
        chai_1.expect(scan("  '  A\\rB\\n  B'")).to.deep.equal({ type: "string", value: "  A\rB\n  B", start: 2, end: 14 });
        chai_1.expect(scan("  '  A\\fB\\n  A'")).to.deep.equal({ type: "string", value: "  A\fB\n  A", start: 2, end: 14 });
        chai_1.expect(scan("  '  A\\nB\\n  C'")).to.deep.equal({ type: "string", value: "  A\nB\n  C", start: 2, end: 14 });
        chai_1.expect(scan("  '  A\\tB\\n  D'")).to.deep.equal({ type: "string", value: "  A\tB\n  D", start: 2, end: 14 });
        chai_1.expect(scan("  '  A\\vB\\n  E'")).to.deep.equal({ type: "string", value: "  A\vB\n  E", start: 2, end: 14 });
        chai_1.expect(scan("  '  A\\\\B\\n  F'")).to.deep.equal({ type: "string", value: "  A\\B\n  F", start: 2, end: 14 });
        chai_1.expect(scan("  '  A\\\'B\\n  G'")).to.deep.equal({ type: "string", value: "  A\'B\n  G", start: 2, end: 14 });
        chai_1.expect(scan("  '  A\\\"B\\n  H'")).to.deep.equal({ type: "string", value: "  A\"B\n  H", start: 2, end: 14 });
    });
    it("token tests", function () {
        chai_1.expect(scan("&&")).to.deep.equal({ type: "symbol", value: "&&", start: 0, end: 1 });
        chai_1.expect(scan("||")).to.deep.equal({ type: "symbol", value: "||", start: 0, end: 1 });
        chai_1.expect(scan("<")).to.deep.equal({ type: "symbol", value: "<", start: 0, end: 0 });
        chai_1.expect(scan(">")).to.deep.equal({ type: "symbol", value: ">", start: 0, end: 0 });
        chai_1.expect(scan("==")).to.deep.equal({ type: "symbol", value: "==", start: 0, end: 1 });
        chai_1.expect(scan("===")).to.deep.equal({ type: "symbol", value: "===", start: 0, end: 2 });
        chai_1.expect(scan("=")).to.deep.equal({ type: "symbol", value: "=", start: 0, end: 0 });
        chai_1.expect(scan(">=")).to.deep.equal({ type: "symbol", value: ">=", start: 0, end: 1 });
        chai_1.expect(scan("&=")).to.deep.equal({ type: "symbol", value: "&", start: 0, end: 0 });
        chai_1.expect(scan("|=")).to.deep.equal({ type: "symbol", value: "|", start: 0, end: 0 });
        chai_1.expect(scan("!=")).to.deep.equal({ type: "symbol", value: "!=", start: 0, end: 1 });
        chai_1.expect(scan("!==")).to.deep.equal({ type: "symbol", value: "!==", start: 0, end: 2 });
        chai_1.expect(scan("<=")).to.deep.equal({ type: "symbol", value: "<=", start: 0, end: 1 });
    });
    it("combined token test", function () {
        var wordTable = "==:symbol,===:symbol,>=:symbol,<=:symbol,.:symbol,||:symbol,&&:symbol,=:symbol,!=:symbol,+:symbol,-:symbol," +
            "_token_fred:token,$token:token,_1:token,bb:token,token:token,$token:token,$token$:token," +
            "1:number,2:number,2.0:number,10.0001:number,20.0:number,20:number,20.323:number," +
            ":eof";
        var words = wordTable.split(",").map(function (w) { return w.split(":")[0]; });
        var tokens = wordTable.split(",").map(function (w) { return w.split(":")[1]; });
        var input = "   " + words.map(function (w) { return w; }).join("  \n \r \r \t ") + "    ";
        var s = scanAll(input);
        var rs = s.map(function (t) { return t.value; });
        var ts = s.map(function (t) { return t.type; });
        chai_1.expect(s.length).equal(words.length);
        chai_1.expect(s.length).equal(rs.length);
        chai_1.expect(s.length).equal(ts.length);
        for (var i = 0; i < tokens.length; i++) {
            chai_1.expect(ts[i]).equal(tokens[i], words[i]);
        }
        for (var i = 0; i < words.length; i++) {
            chai_1.expect(rs[i]).equal(words[i], words[i]);
        }
    });
});
//# sourceMappingURL=scanner.nodespec.js.map