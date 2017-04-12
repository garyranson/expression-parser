/*
import {Parser} from "../src/parser";
import {expect} from "chai";
import {
  ArrayExpression,
  BinaryExpression,
  CallExpression,
  ConditionalExpression,
  Expression,
  Literal,
  LiteralNumber,
  LiteralString,
  LogicalExpression,
  MemberAccessorExpression,
  MemberCallExpression,
  ObjectExpression,
  ScopedAccessorExpression,
  UnaryExpression
} from "../src/expressions";

describe("Parser Test Plan", () => {
  let parser: Parser;

  function parse(str: string): Expression {
    return parser.parseExpression(str);
  }

  function parseFn(str: string): any {
    return function () {
      return parser.parseExpression(str);
    };
  }

  beforeEach(() => {
    parser = new Parser();
  });

  it("empty input", () => {
    expect(parse("")).deep.equal(new Literal("undefined", undefined));
    expect(parse(null)).deep.equal(new Literal("undefined", undefined));
    expect(parse(undefined)).deep.equal(new Literal("undefined", undefined));
  });
  it("numeric literal primitives", () => {
    expect(parse("0")).deep.equal(new LiteralNumber(0));
    expect(parse("10")).deep.equal(new LiteralNumber(10));
    expect(parse("10.01")).deep.equal(new LiteralNumber(10.01));
    expect(parse("010.01")).deep.equal(new LiteralNumber(10.01));
    expect(parse("2010.01")).deep.equal(new LiteralNumber(2010.01));
  });
  it("string literal primitives", () => {
    expect(parse("' 0 '")).deep.equal(new LiteralString(" 0 "));
    expect(parse("' 10 '")).deep.equal(new LiteralString(" 10 "));
    expect(parse("' 10.01 '")).deep.equal(new LiteralString(" 10.01 "));
    expect(parse("' 010.01 '")).deep.equal(new LiteralString(" 010.01 "));
    expect(parse("' 2010.01 '")).deep.equal(new LiteralString(" 2010.01 "));
    expect(parse("\" 0 \"")).deep.equal(new LiteralString(" 0 "));
    expect(parse("\" 10 \"")).deep.equal(new LiteralString(" 10 "));
    expect(parse("\" 10.01 \"")).deep.equal(new LiteralString(" 10.01 "));
    expect(parse("\" 010.01 \"")).deep.equal(new LiteralString(" 010.01 "));
    expect(parse("\" 2010.01 \"")).deep.equal(new LiteralString(" 2010.01 "));
    expect(parse("\" \\n \"")).deep.equal(new LiteralString(" \n "));
    expect(parse("' \\n '")).deep.equal(new LiteralString(" \n "));
  });
  it("token literal primitives", () => {
    expect(parse("token")).deep.equal(new ScopedAccessorExpression("token"));
    expect(parse("_token")).deep.equal(new ScopedAccessorExpression("_token"));
    expect(parse("$token")).deep.equal(new ScopedAccessorExpression("$token"));
    expect(parse("_token_")).deep.equal(new ScopedAccessorExpression("_token_"));
    expect(parse("$token$")).deep.equal(new ScopedAccessorExpression("$token$"));
  });
  it("unary expression", () => {
    expect(parse("+1.1")).deep.equal(new UnaryExpression("+", new LiteralNumber(1.1)));
    expect(parse("-1.1")).deep.equal(new UnaryExpression("-", new LiteralNumber(1.1)));
    expect(parse("!1")).deep.equal(new UnaryExpression("!", new LiteralNumber(1)));
  });
  it("binary test", () => {
    expect(parse("1+2")).deep.equal(new BinaryExpression("+", new LiteralNumber(1), new LiteralNumber(2)));
    expect(parse("2-3")).deep.equal(new BinaryExpression("-", new LiteralNumber(2), new LiteralNumber(3)));
    expect(parse("3/4")).deep.equal(new BinaryExpression("/", new LiteralNumber(3), new LiteralNumber(4)));
    expect(parse("4*5")).deep.equal(new BinaryExpression("*", new LiteralNumber(4), new LiteralNumber(5)));
    expect(parse("5%6")).deep.equal(new BinaryExpression("%", new LiteralNumber(5), new LiteralNumber(6)));
    expect(parse("1+2-3")).deep.equal(new BinaryExpression("-", new BinaryExpression("+", new LiteralNumber(1), new LiteralNumber(2)), new LiteralNumber(3)));
    expect(parse("1+2/3")).deep.equal(new BinaryExpression("+", new LiteralNumber(1), new BinaryExpression("/", new LiteralNumber(2), new LiteralNumber(3))));
    expect(parse("1*2+3")).deep.equal(new BinaryExpression("+", new BinaryExpression("*", new LiteralNumber(1), new LiteralNumber(2)), new LiteralNumber(3)));
    expect(parse("a*b+c")).deep.equal(new BinaryExpression("+", new BinaryExpression("*", new ScopedAccessorExpression("a"), new ScopedAccessorExpression("b")), new ScopedAccessorExpression("c")));
    expect(parse("aa*bb+cc")).deep.equal(new BinaryExpression("+", new BinaryExpression("*", new ScopedAccessorExpression("aa"), new ScopedAccessorExpression("bb")), new ScopedAccessorExpression("cc")));
    expect(parse("5>6")).deep.equal(new BinaryExpression(">", new LiteralNumber(5), new LiteralNumber(6)));
    expect(parse("5<6")).deep.equal(new BinaryExpression("<", new LiteralNumber(5), new LiteralNumber(6)));
    expect(parse("5<=6")).deep.equal(new BinaryExpression("<=", new LiteralNumber(5), new LiteralNumber(6)));
    expect(parse("5>=6")).deep.equal(new BinaryExpression(">=", new LiteralNumber(5), new LiteralNumber(6)));
    expect(parse("5==6")).deep.equal(new BinaryExpression("==", new LiteralNumber(5), new LiteralNumber(6)));
    expect(parse("5===6")).deep.equal(new BinaryExpression("===", new LiteralNumber(5), new LiteralNumber(6)));
    expect(parse("5!==6")).deep.equal(new BinaryExpression("!==", new LiteralNumber(5), new LiteralNumber(6)));
    expect(parse("5!=6")).deep.equal(new BinaryExpression("!=", new LiteralNumber(5), new LiteralNumber(6)));
  });
  it("Constants", () => {
    expect(parse("true")).deep.equal(new Literal("true", true));
    expect(parse("false")).deep.equal(new Literal("false", false));
    expect(parse("null")).deep.equal(new Literal("null", null));
    expect(parse("undefined")).deep.equal(new Literal("undefined", undefined));
  });
  it("logical test", () => {
    expect(parse("1||2")).deep.equal(new LogicalExpression("||", new LiteralNumber(1), new LiteralNumber(2)));
    expect(parse("2&&3")).deep.equal(new LogicalExpression("&&", new LiteralNumber(2), new LiteralNumber(3)));
  });
  it("conditional test", () => {
    expect(parse("1?2:3")).deep.equal(new ConditionalExpression(new LiteralNumber(1), new LiteralNumber(2), new LiteralNumber(3)));
    expect(parseFn("1?2 3")).to.throw(Error);
    expect(parseFn("1?2:")).to.throw(Error);
  });
  it("brackets test", () => {
    expect(parse("(1+2)/3")).deep.equal(new BinaryExpression("/", new BinaryExpression("+", new LiteralNumber(1), new LiteralNumber(2)), new LiteralNumber(3)));
    expect(parse("1+(2/3)")).deep.equal(new BinaryExpression("+", new LiteralNumber(1), new BinaryExpression("/", new LiteralNumber(2), new LiteralNumber(3))));
    expect(parse("1*(2+3)")).deep.equal(new BinaryExpression("*", new LiteralNumber(1), new BinaryExpression("+", new LiteralNumber(2), new LiteralNumber(3))));
    expect(parseFn("1*(2+3")).to.throw(Error);
  });
  it("member accessors", () => {
    expect(parse("a.b")).deep.equal(new MemberAccessorExpression(new ScopedAccessorExpression("a"), new LiteralString("b"), false));
    expect(parse("a.b.c")).deep.equal(new MemberAccessorExpression(new MemberAccessorExpression(new ScopedAccessorExpression("a"), new LiteralString("b"), false), new LiteralString("c"), false));
    expect(parseFn("a..")).to.throw(Error);
    expect(parseFn("a.'b'")).to.throw(Error);
    expect(parseFn("a.1")).to.throw(Error);
  });
  it("member calls", () => {
    expect(parse("a.b()")).deep.equal(new MemberCallExpression(new ScopedAccessorExpression("a"), new LiteralString("b"), []));
    expect(parse("a.b(1)")).deep.equal(new MemberCallExpression(new ScopedAccessorExpression("a"), new LiteralString("b"), [new LiteralNumber(1)]));
    expect(parse("a.b(1,2)")).deep.equal(new MemberCallExpression(new ScopedAccessorExpression("a"), new LiteralString("b"), [new LiteralNumber(1), new LiteralNumber(2)]));
    expect(parse("a.b(d,e)")).deep.equal(new MemberCallExpression(new ScopedAccessorExpression("a"), new LiteralString("b"), [new ScopedAccessorExpression("d"), new ScopedAccessorExpression("e")]));
    expect(parseFn("a.b(")).to.throw(Error);
    expect(parseFn("a.b(c")).to.throw(Error);
  });
  it("scope calls", () => {
    expect(parse("a()")).deep.equal(new CallExpression(new ScopedAccessorExpression("a"), []));
    expect(parse("b(1)")).deep.equal(new CallExpression(new ScopedAccessorExpression("b"), [new LiteralNumber(1)]));
    expect(parse("b(1,true)")).deep.equal(new CallExpression(new ScopedAccessorExpression("b"), [new LiteralNumber(1), new Literal("true", true)]));
    expect(parse("b(1,true,d)")).deep.equal(new CallExpression(new ScopedAccessorExpression("b"), [new LiteralNumber(1), new Literal("true", true), new ScopedAccessorExpression("d")]));
    expect(parse("b(1,true,d,f)")).deep.equal(new CallExpression(new ScopedAccessorExpression("b"), [new LiteralNumber(1), new Literal("true", true), new ScopedAccessorExpression("d"), new ScopedAccessorExpression("f")]));
    expect(parseFn("a(")).to.throw(Error);
    expect(parseFn("a(fred")).to.throw(Error);
  });
  it("member computed accessors", () => {
    expect(parse("a[b]")).deep.equal(new MemberAccessorExpression(new ScopedAccessorExpression("a"), new ScopedAccessorExpression("b"), true));
    expect(parse("a[1]")).deep.equal(new MemberAccessorExpression(new ScopedAccessorExpression("a"), new LiteralNumber(1), true));
    expect(parseFn("a[1")).to.throw(Error);
    expect(parseFn("a[")).to.throw(Error);
    expect(parseFn("a[1 2")).to.throw(Error);
    expect(parseFn("a[1 2]")).to.throw(Error);
    expect(parseFn("a[]")).to.throw(Error);
  });
  it("array", () => {
    expect(parse("[]")).deep.equal(new ArrayExpression([]));
    expect(parse("[1]")).deep.equal(new ArrayExpression([new LiteralNumber(1)]));
    expect(parse("[a]")).deep.equal(new ArrayExpression([new ScopedAccessorExpression("a")]));
    expect(parse("[\"str\"]")).deep.equal(new ArrayExpression([new LiteralString("str")]));
    expect(parse("[1,2]")).deep.equal(new ArrayExpression([new LiteralNumber(1), new LiteralNumber(2)]));
    expect(parseFn("[1")).to.throw(Error);
    expect(parseFn("[")).to.throw(Error);
  });
  it("object", () => {
    expect(parseFn("{")).to.throw(Error);
    expect(parse("{}")).deep.equal(new ObjectExpression([], []));
    expect(parse("{a:1}")).deep.equal(new ObjectExpression(["a"], [new LiteralNumber(1)]));
    expect(parse("{a:1,b:2}")).deep.equal(new ObjectExpression(["a", "b"], [new LiteralNumber(1), new LiteralNumber(2)]));
    expect(parseFn("{a:")).to.throw(Error);
    expect(parseFn("{a:1")).to.throw(Error);
    expect(parseFn("{a 1")).to.throw(Error);
    expect(parseFn("{1:1}")).to.throw(Error);
  });
 });*/
