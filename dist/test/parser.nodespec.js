"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("../src/parser");
var chai_1 = require("chai");
var expressions_1 = require("../src/expressions");
describe("Parser Test Plan", function () {
    var parser;
    function parse(str) {
        return parser.parseExpression(str);
    }
    function parseFn(str) {
        return function () {
            return parser.parseExpression(str);
        };
    }
    beforeEach(function () {
        parser = new parser_1.default();
    });
    it("empty input", function () {
        chai_1.expect(parse("")).deep.equal(new expressions_1.Literal("undefined", undefined));
        chai_1.expect(parse(null)).deep.equal(new expressions_1.Literal("undefined", undefined));
        chai_1.expect(parse(undefined)).deep.equal(new expressions_1.Literal("undefined", undefined));
    });
    it("numeric literal primitives", function () {
        chai_1.expect(parse("0")).deep.equal(new expressions_1.LiteralNumber(0));
        chai_1.expect(parse("10")).deep.equal(new expressions_1.LiteralNumber(10));
        chai_1.expect(parse("10.01")).deep.equal(new expressions_1.LiteralNumber(10.01));
        chai_1.expect(parse("010.01")).deep.equal(new expressions_1.LiteralNumber(10.01));
        chai_1.expect(parse("2010.01")).deep.equal(new expressions_1.LiteralNumber(2010.01));
    });
    it("string literal primitives", function () {
        chai_1.expect(parse("' 0 '")).deep.equal(new expressions_1.LiteralString(" 0 "));
        chai_1.expect(parse("' 10 '")).deep.equal(new expressions_1.LiteralString(" 10 "));
        chai_1.expect(parse("' 10.01 '")).deep.equal(new expressions_1.LiteralString(" 10.01 "));
        chai_1.expect(parse("' 010.01 '")).deep.equal(new expressions_1.LiteralString(" 010.01 "));
        chai_1.expect(parse("' 2010.01 '")).deep.equal(new expressions_1.LiteralString(" 2010.01 "));
        chai_1.expect(parse("\" 0 \"")).deep.equal(new expressions_1.LiteralString(" 0 "));
        chai_1.expect(parse("\" 10 \"")).deep.equal(new expressions_1.LiteralString(" 10 "));
        chai_1.expect(parse("\" 10.01 \"")).deep.equal(new expressions_1.LiteralString(" 10.01 "));
        chai_1.expect(parse("\" 010.01 \"")).deep.equal(new expressions_1.LiteralString(" 010.01 "));
        chai_1.expect(parse("\" 2010.01 \"")).deep.equal(new expressions_1.LiteralString(" 2010.01 "));
        chai_1.expect(parse("\" \\n \"")).deep.equal(new expressions_1.LiteralString(" \n "));
        chai_1.expect(parse("' \\n '")).deep.equal(new expressions_1.LiteralString(" \n "));
    });
    it("token literal primitives", function () {
        chai_1.expect(parse("token")).deep.equal(new expressions_1.ScopedAccessorExpression("token"));
        chai_1.expect(parse("_token")).deep.equal(new expressions_1.ScopedAccessorExpression("_token"));
        chai_1.expect(parse("$token")).deep.equal(new expressions_1.ScopedAccessorExpression("$token"));
        chai_1.expect(parse("_token_")).deep.equal(new expressions_1.ScopedAccessorExpression("_token_"));
        chai_1.expect(parse("$token$")).deep.equal(new expressions_1.ScopedAccessorExpression("$token$"));
    });
    it("unary expression", function () {
        chai_1.expect(parse("+1.1")).deep.equal(new expressions_1.UnaryExpression("+", new expressions_1.LiteralNumber(1.1)));
        chai_1.expect(parse("-1.1")).deep.equal(new expressions_1.UnaryExpression("-", new expressions_1.LiteralNumber(1.1)));
        chai_1.expect(parse("!1")).deep.equal(new expressions_1.UnaryExpression("!", new expressions_1.LiteralNumber(1)));
    });
    it("binary test", function () {
        chai_1.expect(parse("1+2")).deep.equal(new expressions_1.BinaryExpression("+", new expressions_1.LiteralNumber(1), new expressions_1.LiteralNumber(2)));
        chai_1.expect(parse("2-3")).deep.equal(new expressions_1.BinaryExpression("-", new expressions_1.LiteralNumber(2), new expressions_1.LiteralNumber(3)));
        chai_1.expect(parse("3/4")).deep.equal(new expressions_1.BinaryExpression("/", new expressions_1.LiteralNumber(3), new expressions_1.LiteralNumber(4)));
        chai_1.expect(parse("4*5")).deep.equal(new expressions_1.BinaryExpression("*", new expressions_1.LiteralNumber(4), new expressions_1.LiteralNumber(5)));
        chai_1.expect(parse("5%6")).deep.equal(new expressions_1.BinaryExpression("%", new expressions_1.LiteralNumber(5), new expressions_1.LiteralNumber(6)));
        chai_1.expect(parse("1+2-3")).deep.equal(new expressions_1.BinaryExpression("-", new expressions_1.BinaryExpression("+", new expressions_1.LiteralNumber(1), new expressions_1.LiteralNumber(2)), new expressions_1.LiteralNumber(3)));
        chai_1.expect(parse("1+2/3")).deep.equal(new expressions_1.BinaryExpression("+", new expressions_1.LiteralNumber(1), new expressions_1.BinaryExpression("/", new expressions_1.LiteralNumber(2), new expressions_1.LiteralNumber(3))));
        chai_1.expect(parse("1*2+3")).deep.equal(new expressions_1.BinaryExpression("+", new expressions_1.BinaryExpression("*", new expressions_1.LiteralNumber(1), new expressions_1.LiteralNumber(2)), new expressions_1.LiteralNumber(3)));
        chai_1.expect(parse("a*b+c")).deep.equal(new expressions_1.BinaryExpression("+", new expressions_1.BinaryExpression("*", new expressions_1.ScopedAccessorExpression("a"), new expressions_1.ScopedAccessorExpression("b")), new expressions_1.ScopedAccessorExpression("c")));
        chai_1.expect(parse("aa*bb+cc")).deep.equal(new expressions_1.BinaryExpression("+", new expressions_1.BinaryExpression("*", new expressions_1.ScopedAccessorExpression("aa"), new expressions_1.ScopedAccessorExpression("bb")), new expressions_1.ScopedAccessorExpression("cc")));
        chai_1.expect(parse("5>6")).deep.equal(new expressions_1.BinaryExpression(">", new expressions_1.LiteralNumber(5), new expressions_1.LiteralNumber(6)));
        chai_1.expect(parse("5<6")).deep.equal(new expressions_1.BinaryExpression("<", new expressions_1.LiteralNumber(5), new expressions_1.LiteralNumber(6)));
        chai_1.expect(parse("5<=6")).deep.equal(new expressions_1.BinaryExpression("<=", new expressions_1.LiteralNumber(5), new expressions_1.LiteralNumber(6)));
        chai_1.expect(parse("5>=6")).deep.equal(new expressions_1.BinaryExpression(">=", new expressions_1.LiteralNumber(5), new expressions_1.LiteralNumber(6)));
        chai_1.expect(parse("5==6")).deep.equal(new expressions_1.BinaryExpression("==", new expressions_1.LiteralNumber(5), new expressions_1.LiteralNumber(6)));
        chai_1.expect(parse("5===6")).deep.equal(new expressions_1.BinaryExpression("===", new expressions_1.LiteralNumber(5), new expressions_1.LiteralNumber(6)));
        chai_1.expect(parse("5!==6")).deep.equal(new expressions_1.BinaryExpression("!==", new expressions_1.LiteralNumber(5), new expressions_1.LiteralNumber(6)));
        chai_1.expect(parse("5!=6")).deep.equal(new expressions_1.BinaryExpression("!=", new expressions_1.LiteralNumber(5), new expressions_1.LiteralNumber(6)));
    });
    it("Constants", function () {
        chai_1.expect(parse("true")).deep.equal(new expressions_1.Literal("true", true));
        chai_1.expect(parse("false")).deep.equal(new expressions_1.Literal("false", false));
        chai_1.expect(parse("null")).deep.equal(new expressions_1.Literal("null", null));
        chai_1.expect(parse("undefined")).deep.equal(new expressions_1.Literal("undefined", undefined));
    });
    it("logical test", function () {
        chai_1.expect(parse("1||2")).deep.equal(new expressions_1.LogicalExpression("||", new expressions_1.LiteralNumber(1), new expressions_1.LiteralNumber(2)));
        chai_1.expect(parse("2&&3")).deep.equal(new expressions_1.LogicalExpression("&&", new expressions_1.LiteralNumber(2), new expressions_1.LiteralNumber(3)));
    });
    it("conditional test", function () {
        chai_1.expect(parse("1?2:3")).deep.equal(new expressions_1.ConditionalExpression(new expressions_1.LiteralNumber(1), new expressions_1.LiteralNumber(2), new expressions_1.LiteralNumber(3)));
        chai_1.expect(parseFn("1?2 3")).to.throw(Error);
        chai_1.expect(parseFn("1?2:")).to.throw(Error);
    });
    it("brackets test", function () {
        chai_1.expect(parse("(1+2)/3")).deep.equal(new expressions_1.BinaryExpression("/", new expressions_1.BinaryExpression("+", new expressions_1.LiteralNumber(1), new expressions_1.LiteralNumber(2)), new expressions_1.LiteralNumber(3)));
        chai_1.expect(parse("1+(2/3)")).deep.equal(new expressions_1.BinaryExpression("+", new expressions_1.LiteralNumber(1), new expressions_1.BinaryExpression("/", new expressions_1.LiteralNumber(2), new expressions_1.LiteralNumber(3))));
        chai_1.expect(parse("1*(2+3)")).deep.equal(new expressions_1.BinaryExpression("*", new expressions_1.LiteralNumber(1), new expressions_1.BinaryExpression("+", new expressions_1.LiteralNumber(2), new expressions_1.LiteralNumber(3))));
        chai_1.expect(parseFn("1*(2+3")).to.throw(Error);
    });
    it("member accessors", function () {
        chai_1.expect(parse("a.b")).deep.equal(new expressions_1.MemberAccessorExpression(new expressions_1.ScopedAccessorExpression("a"), new expressions_1.LiteralString("b"), false));
        chai_1.expect(parse("a.b.c")).deep.equal(new expressions_1.MemberAccessorExpression(new expressions_1.MemberAccessorExpression(new expressions_1.ScopedAccessorExpression("a"), new expressions_1.LiteralString("b"), false), new expressions_1.LiteralString("c"), false));
        chai_1.expect(parseFn("a..")).to.throw(Error);
        chai_1.expect(parseFn("a.'b'")).to.throw(Error);
        chai_1.expect(parseFn("a.1")).to.throw(Error);
    });
    it("member calls", function () {
        chai_1.expect(parse("a.b()")).deep.equal(new expressions_1.MemberCallExpression(new expressions_1.ScopedAccessorExpression("a"), new expressions_1.LiteralString("b"), []));
        chai_1.expect(parse("a.b(1)")).deep.equal(new expressions_1.MemberCallExpression(new expressions_1.ScopedAccessorExpression("a"), new expressions_1.LiteralString("b"), [new expressions_1.LiteralNumber(1)]));
        chai_1.expect(parse("a.b(1,2)")).deep.equal(new expressions_1.MemberCallExpression(new expressions_1.ScopedAccessorExpression("a"), new expressions_1.LiteralString("b"), [new expressions_1.LiteralNumber(1), new expressions_1.LiteralNumber(2)]));
        chai_1.expect(parse("a.b(d,e)")).deep.equal(new expressions_1.MemberCallExpression(new expressions_1.ScopedAccessorExpression("a"), new expressions_1.LiteralString("b"), [new expressions_1.ScopedAccessorExpression("d"), new expressions_1.ScopedAccessorExpression("e")]));
        chai_1.expect(parseFn("a.b(")).to.throw(Error);
        chai_1.expect(parseFn("a.b(c")).to.throw(Error);
    });
    it("scope calls", function () {
        chai_1.expect(parse("a()")).deep.equal(new expressions_1.CallExpression(new expressions_1.ScopedAccessorExpression("a"), []));
        chai_1.expect(parse("b(1)")).deep.equal(new expressions_1.CallExpression(new expressions_1.ScopedAccessorExpression("b"), [new expressions_1.LiteralNumber(1)]));
        chai_1.expect(parse("b(1,true)")).deep.equal(new expressions_1.CallExpression(new expressions_1.ScopedAccessorExpression("b"), [new expressions_1.LiteralNumber(1), new expressions_1.Literal("true", true)]));
        chai_1.expect(parse("b(1,true,d)")).deep.equal(new expressions_1.CallExpression(new expressions_1.ScopedAccessorExpression("b"), [new expressions_1.LiteralNumber(1), new expressions_1.Literal("true", true), new expressions_1.ScopedAccessorExpression("d")]));
        chai_1.expect(parse("b(1,true,d,f)")).deep.equal(new expressions_1.CallExpression(new expressions_1.ScopedAccessorExpression("b"), [new expressions_1.LiteralNumber(1), new expressions_1.Literal("true", true), new expressions_1.ScopedAccessorExpression("d"), new expressions_1.ScopedAccessorExpression("f")]));
        chai_1.expect(parseFn("a(")).to.throw(Error);
        chai_1.expect(parseFn("a(fred")).to.throw(Error);
    });
    it("member computed accessors", function () {
        chai_1.expect(parse("a[b]")).deep.equal(new expressions_1.MemberAccessorExpression(new expressions_1.ScopedAccessorExpression("a"), new expressions_1.ScopedAccessorExpression("b"), true));
        chai_1.expect(parse("a[1]")).deep.equal(new expressions_1.MemberAccessorExpression(new expressions_1.ScopedAccessorExpression("a"), new expressions_1.LiteralNumber(1), true));
        chai_1.expect(parseFn("a[1")).to.throw(Error);
        chai_1.expect(parseFn("a[")).to.throw(Error);
        chai_1.expect(parseFn("a[1 2")).to.throw(Error);
        chai_1.expect(parseFn("a[1 2]")).to.throw(Error);
        chai_1.expect(parseFn("a[]")).to.throw(Error);
    });
    it("array", function () {
        chai_1.expect(parse("[]")).deep.equal(new expressions_1.ArrayExpression([]));
        chai_1.expect(parse("[1]")).deep.equal(new expressions_1.ArrayExpression([new expressions_1.LiteralNumber(1)]));
        chai_1.expect(parse("[a]")).deep.equal(new expressions_1.ArrayExpression([new expressions_1.ScopedAccessorExpression("a")]));
        chai_1.expect(parse("[\"str\"]")).deep.equal(new expressions_1.ArrayExpression([new expressions_1.LiteralString("str")]));
        chai_1.expect(parse("[1,2]")).deep.equal(new expressions_1.ArrayExpression([new expressions_1.LiteralNumber(1), new expressions_1.LiteralNumber(2)]));
        chai_1.expect(parseFn("[1")).to.throw(Error);
        chai_1.expect(parseFn("[")).to.throw(Error);
    });
    it("object", function () {
        chai_1.expect(parseFn("{")).to.throw(Error);
        chai_1.expect(parse("{}")).deep.equal(new expressions_1.ObjectExpression([], []));
        chai_1.expect(parse("{a:1}")).deep.equal(new expressions_1.ObjectExpression(["a"], [new expressions_1.LiteralNumber(1)]));
        chai_1.expect(parse("{a:1,b:2}")).deep.equal(new expressions_1.ObjectExpression(["a", "b"], [new expressions_1.LiteralNumber(1), new expressions_1.LiteralNumber(2)]));
        chai_1.expect(parseFn("{a:")).to.throw(Error);
        chai_1.expect(parseFn("{a:1")).to.throw(Error);
        chai_1.expect(parseFn("{a 1")).to.throw(Error);
        chai_1.expect(parseFn("{1:1}")).to.throw(Error);
    });
});
//# sourceMappingURL=parser.nodespec.js.map