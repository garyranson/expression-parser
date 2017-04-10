import {expect} from "chai";
import {Scanner} from "../src/scanner";

describe("Scanner Tests", () => {
  function scan(expr: string) {
    return new Scanner(expr).next();
  }

  function scanFn(expr: string) {
    return function () {
      return new Scanner(expr).next();
    };
  }

  function scanAll(expr: string) {
    let s = new Scanner(expr);
    let a = [];
    while (true) {
      let t = s.next();
      a.push(t);
      if (t.type === "eof")
        return a;
    }
  }

  it("empty string tests", () => {
    expect(scan(null).type).equal("eof");
    expect(scan("  ").type).equal("eof");
    expect(scan(" \n\r \t ").type).equal("eof");
  });

  it("bulk numeric tests", () => {
    for (let i = 0; i < 100; i++) {
      let s = i.toString();
      expect(scan(s)).to.deep.equal({type: "number", value: s, start: 0 , end: s.length - 1});
    }
    for (let i = 0; i < 100; i++) {
      let s = i.toString() + ".";
      expect(scan(s)).to.deep.equal({type: "number", value: s, start: 0, end: s.length - 1});
    }
    for (let i = 0; i < 100; i++) {
      let s = i.toString() + "." + i.toString();
      expect(scan(s)).to.deep.equal({type: "number", value: s, start: 0, end: s.length - 1});
    }
    for (let i = 0; i < 100; i++) {
      let s = "." + i.toString();
      expect(scan(s)).to.deep.equal({type: "number", value: s, start: 0, end: s.length - 1});
    }
  });

  it("simple string tests", () => {
    expect(scan("''")).to.deep.equal({type: "string", value: "", start: 0, end: 1});
    expect(scan("\"\"")).to.deep.equal({type: "string", value: "", start: 0, end: 1});
    expect(scan(" 'simple test'")).to.deep.equal({type: "string", value: "simple test", start: 1, end: 13});
  });

  it("error string tests", () => {
    expect(scanFn(" 'this is a test")).to.throw(Error, "Unterminated quote");
    expect(scanFn(" \"this is a test")).to.throw(Error, "Unterminated quote");
    expect(scanFn("'")).to.throw(Error, "Unterminated quote");
  });

  it("complex string tests", () => {
    expect(scan("  '  \\r  '")).to.deep.equal({type: "string", value: "  \r  ", start: 2, end: 9});
    expect(scan("  '  \\f  '")).to.deep.equal({type: "string", value: "  \f  ", start: 2, end: 9});
    expect(scan("  '  \\n  '")).to.deep.equal({type: "string", value: "  \n  ", start: 2, end: 9});
    expect(scan("  '  \\t  '")).to.deep.equal({type: "string", value: "  \t  ", start: 2, end: 9});
    expect(scan("  '  \\v  '")).to.deep.equal({type: "string", value: "  \v  ", start: 2, end: 9});
    expect(scan("  '  \\\\  '")).to.deep.equal({type: "string", value: "  \\  ", start: 2, end: 9});
    expect(scan("  '  \\\'  '")).to.deep.equal({type: "string", value: "  \'  ", start: 2, end: 9});
    expect(scan("  '  \\\"  '")).to.deep.equal({type: "string", value: "  \"  ", start: 2, end: 9});
    expect(scan("  '  \\q  '")).to.deep.equal({type: "string", value: "  \q  ", start: 2, end: 9});

    expect(scan("  '  A\\rB  '")).to.deep.equal({type: "string", value: "  A\rB  ", start: 2, end: 11});
    expect(scan("  '  A\\fB  '")).to.deep.equal({type: "string", value: "  A\fB  ", start: 2, end: 11});
    expect(scan("  '  A\\nB  '")).to.deep.equal({type: "string", value: "  A\nB  ", start: 2, end: 11});
    expect(scan("  '  A\\tB  '")).to.deep.equal({type: "string", value: "  A\tB  ", start: 2, end: 11});
    expect(scan("  '  A\\vB  '")).to.deep.equal({type: "string", value: "  A\vB  ", start: 2, end: 11});
    expect(scan("  '  A\\\\B  '")).to.deep.equal({type: "string", value: "  A\\B  ", start: 2, end: 11});
    expect(scan("  '  A\\\'B  '")).to.deep.equal({type: "string", value: "  A\'B  ", start: 2, end: 11});
    expect(scan("  '  A\\\"B  '")).to.deep.equal({type: "string", value: "  A\"B  ", start: 2, end: 11});

    expect(scan("  '  A\\rB\\n  B'")).to.deep.equal({type: "string", value: "  A\rB\n  B", start: 2, end: 14});
    expect(scan("  '  A\\fB\\n  A'")).to.deep.equal({type: "string", value: "  A\fB\n  A", start: 2, end: 14});
    expect(scan("  '  A\\nB\\n  C'")).to.deep.equal({type: "string", value: "  A\nB\n  C", start: 2, end: 14});
    expect(scan("  '  A\\tB\\n  D'")).to.deep.equal({type: "string", value: "  A\tB\n  D", start: 2, end: 14});
    expect(scan("  '  A\\vB\\n  E'")).to.deep.equal({type: "string", value: "  A\vB\n  E", start: 2, end: 14});
    expect(scan("  '  A\\\\B\\n  F'")).to.deep.equal({type: "string", value: "  A\\B\n  F", start: 2, end: 14});
    expect(scan("  '  A\\\'B\\n  G'")).to.deep.equal({type: "string", value: "  A\'B\n  G", start: 2, end: 14});
    expect(scan("  '  A\\\"B\\n  H'")).to.deep.equal({type: "string", value: "  A\"B\n  H", start: 2, end: 14});
  });

  it("token tests", () => {
    expect(scan("&&")).to.deep.equal({type: "symbol", value: "&&", start: 0, end: 1});
    expect(scan("||")).to.deep.equal({type: "symbol", value: "||", start: 0, end: 1});
    expect(scan("<")).to.deep.equal({type: "symbol", value: "<", start: 0, end: 0});
    expect(scan(">")).to.deep.equal({type: "symbol", value: ">", start: 0, end: 0});
    expect(scan("==")).to.deep.equal({type: "symbol", value: "==", start: 0, end: 1});
    expect(scan("===")).to.deep.equal({type: "symbol", value: "===", start: 0, end: 2});
    expect(scan("=")).to.deep.equal({type: "symbol", value: "=", start: 0, end: 0});
    expect(scan(">=")).to.deep.equal({type: "symbol", value: ">=", start: 0, end: 1});
    expect(scan("&=")).to.deep.equal({type: "symbol", value: "&", start: 0, end: 0});
    expect(scan("|=")).to.deep.equal({type: "symbol", value: "|", start: 0, end: 0});
    expect(scan("!=")).to.deep.equal({type: "symbol", value: "!=", start: 0, end: 1});
    expect(scan("!==")).to.deep.equal({type: "symbol", value: "!==", start: 0, end: 2});
    expect(scan("<=")).to.deep.equal({type: "symbol", value: "<=", start: 0, end: 1});
  });

  it("combined token test", () => {
    let wordTable =
          "==:symbol,===:symbol,>=:symbol,<=:symbol,.:symbol,||:symbol,&&:symbol,=:symbol,!=:symbol,+:symbol,-:symbol," +
          "_token_fred:token,$token:token,_1:token,bb:token,token:token,$token:token,$token$:token," +
          "1:number,2:number,2.0:number,10.0001:number,20.0:number,20:number,20.323:number," +
          ":eof";
    let words     = wordTable.split(",").map((w) => w.split(":")[0]);
    let tokens    = wordTable.split(",").map((w) => w.split(":")[1]);
    let input     = `   ${words.map((w) => w).join("  \n \r \r \t ")}    `;
    let s         = scanAll(input);
    let rs        = s.map((t) => t.value);
    let ts        = s.map((t) => t.type);

    expect(s.length).equal(words.length);
    expect(s.length).equal(rs.length);
    expect(s.length).equal(ts.length);

    for (let i = 0; i < tokens.length; i++) {
      expect(ts[i]).equal(tokens[i], words[i]);
    }
    for (let i = 0; i < words.length; i++) {
      expect(rs[i]).equal(words[i], words[i]);
    }
  });
});