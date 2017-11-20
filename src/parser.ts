import LexerReader from "./lexer";
import {Expression, ObjectProperties} from "./expressions";
import {LexerToken} from "./scanner";
import {Constants, Creators} from "./parser-creators";

let emptyExpressionList: Array<Expression> = [];

export class Parser {
  parseExpression(input: string): Expression {
    let parser = new ParserImpl(input || "");

    if (parser.eof()) {
      return Constants.literalUndefined;
    }
    const expr = parser.parseExpression();
    if (parser.eof()) {
      return expr;
    }
    parser.raiseError("Unconsumed token");
  }

  parseExpressions(input: string) {
    let parser = new ParserImpl(input || "");

    const expressions: Expression[] = [];

    while (!parser.eof()) {
      if (parser.expect(",")) {
        expressions.push(Constants.literalUndefined);
        // Trailing comma?
        if (parser.eof()) {
          expressions.push(Constants.literalUndefined);
        }
      } else {
        expressions.push(parser.parseExpression());
        if (parser.eof()) {
          break;
        }
        if (parser.expect(",")) {
          // Trailing comma?
          if (parser.eof()) {
            expressions.push(Constants.literalUndefined);
          }
        } else {
          parser.raiseError("Unexpected token. Expected comma or eof");
        }
      }
    }
    return expressions;
  }

  parseContent(input: string) {
    if (!input) {
      input = "";
    }
    let parser = new ParserImpl(input || "");

    let pos = input.indexOf("${");

    if (pos === -1) {
      return Creators.createLiteralString(input);
    }

    let concat: Expression[] = [];
    let lastPos              = 0;

    while (pos !== -1) {
      if (lastPos !== pos) {
        concat.push(Creators.createLiteralString(input.substr(lastPos, pos - lastPos)));
      }
      parser.reset(pos + 2);
      concat.push(parser.parseExpression());
      lastPos = parser.cur.end + 1;
      if (!parser.expect("}")) {
        parser.raiseError("Malformed Content Expression");
      }
      pos = input.indexOf("${", lastPos);
      if (pos === -1 && lastPos < input.length) {
        concat.push(Creators.createLiteralString(input.substr(lastPos)));
      }
    }
    return concat.length === 1
      ? concat[0]
      : Creators.createConcatenate(concat);
  }
}

class ParserImpl {
  private iterator: LexerReader;
          cur: LexerToken;

  constructor(input: string) {
    this.iterator = new LexerReader(input);
    this.consume();
  }

  consume(): void {
    this.cur = this.iterator.next();
  }

  reset(pos: number): void {
    this.iterator.setPos(pos);
    this.cur = this.iterator.next();
  }

  expect(str: string): boolean {
    if (this.cur.value === str) {
      this.consume();
      return true;
    }
    return false;
  }

  eof(): boolean {
    return this.cur.type === "eof";
  }

  parseExpression(): Expression {
    let result = this.parseIt();
    return this.cur.value === "?"
      ? this.parseConditionalExpression(result)
      : result;
  }

  parseConditionalExpression(expr: Expression): Expression {
    this.consume();
    let trueCondition = this.parseExpression();
    if (this.expect(":")) {
      return Creators.createConditionalExpression(expr, trueCondition, this.parseExpression());
    }
    this.raiseError("Conditional expression invalid");
  }

  parseIt(): Expression {
    let expr     = this.parsePrefix();
    let operator = Creators.getOperatorFactory(this.cur.value);

    if (operator) {
      this.consume();
      let e             = 1, o = 0;
      const expressions = [/*left*/expr, /*right*/this.parsePrefix()];
      const operators   = [operator];

      while (operator = Creators.getOperatorFactory(this.cur.value)) {
        this.consume();
        // If operator on top of stack has greater precedence then pop/push expression
        while (o >= 0 && operator.precedence <= operators[o].precedence) {
          e--;
          expressions[e] = operators[o--].create(/*left*/expressions[e], /*right*/expressions[e + 1]);
        }
        operators[++o]   = operator;
        expressions[++e] = this.parsePrefix();
      }
      expr = expressions[e];
      for (let i = e - 1; i >= 0; i--) {
        expr = operators[o--].create(expressions[i], expr);
      }
    }
    return expr;
  }

  /**
   *
   * @returns {any}
   */
  parsePrefix(): Expression {
    switch (this.cur.value) {
      case "+":
      case "-":
      case "!":
        return this.parseUnary(this.cur.value);
    }

    let expr = this.parsePrimary();

    while (true) {
      switch (this.cur.value) {
        case ".":
          expr = this.parseNamedMember(expr);
          break;
        case "[":
          expr = this.parseComputedMember(expr);
          break;
        case "(":
          expr = this.parseCallExpression(expr);
          break;
        default:
          return expr;
      }
    }
  }

  parseCallExpression(lhs: Expression): Expression {
    this.consume();
    const expr = this.cur.value === ")" ? emptyExpressionList : this.getExpressionList();
    if (this.expect(")")) {
      return Creators.createCallExpression(lhs, expr);
    }
    this.raiseError("Expected close bracket");
  }

  parseComputedMember(lhs: Expression): Expression {
    this.consume();
    if (this.expect("]")) {
      this.raiseError("Expected expression");
    }
    const expr = this.parseExpression();
    if (this.expect("]")) {
      return Creators.createMemberAccessorExpression(lhs, expr, true);
    }
    this.raiseError("Expected closing ]");
  }

  parseNamedMember(lhs: Expression): Expression {
    this.consume();
    if (this.cur.type === "token") {
      const expr = Creators.createLiteralString(this.cur.value);
      this.consume();
      return this.cur.value === "("
        ? Creators.createMemberCallExpression(lhs, expr, this.parseArgs())
        : Creators.createMemberAccessorExpression(lhs, expr, false);
    }
    this.raiseError("Expected identifier");
  }

  parseUnary(unary: string) {
    this.consume();
    return Creators.createUnaryExpression(unary, this.parsePrefix());
  }

  parsePrimary() {
    switch (this.cur.value) {
      case "(" :
        return this.parseBrackets();
      case "[" :
        return this.parseArray();
      case "{":
        return this.parseObject();
      case "true":
      case "false":
      case "null":
      case "undefined":
        return this.parseKeyword(this.cur.value);
    }
    switch (this.cur.type) {
      case "string":
      case "number":
        return this.parseLiteral(this.cur.type, this.cur.value);
      case "token":
        return this.parseIdentifier(this.cur.value);
    }
    this.raiseError("Unexpected token");
  }

  parseIdentifier(name: string) {
    this.consume();
    return Creators.createScopedAccessorExpression(name);
  }

  parseLiteral(type: string, value: string) {
    this.consume();
    return type === "number"
      ? Creators.createLiteralNumber(value)
      : Creators.createLiteralString(value);
  }

  parseKeyword(keyword: string): Expression {
    this.consume();
    return Creators.createConstExpression(keyword);
  }

  parseArray(): Expression {
    this.consume();
    let expressions = this.cur.value === "]" ? [] : this.getExpressionList();
    if (this.expect("]")) {
      return Creators.createArrayExpression(expressions);
    }
    this.raiseError("Unexpected token");
  }

  parseBrackets(): Expression {
    this.consume();
    let expr = this.parseExpression();
    if (this.expect(")")) {
      return expr;
    }
    this.raiseError("Expected )");
  }

  parseObject(): Expression {
    this.consume();
    const properties = this.parseObjectProperties();
    if (this.expect("}")) {
      return Creators.createObjectExpression(properties);
    }
    this.raiseError("Unexpected End");
  }

  private parseObjectProperties(): ObjectProperties {
    let propertyNames: Array<string>   = [];
    let expressions: Array<Expression> = [];

    if (this.cur.value !== "}") {
      do {
        if (this.cur.type !== "token") {
          this.raiseError("Expected a name token");
        }
        propertyNames.push(this.cur.value);
        this.consume();
        if (!this.expect(":")) {
          this.raiseError("Expected a colon");
        }
        expressions.push(this.parseExpression());
      } while (this.expect(","));
    }
    return {
      names:       propertyNames,
      expressions: expressions
    };
  }

  parseArgs(): Expression[] {
    this.consume();
    if (this.expect(")")) {
      return emptyExpressionList;
    }
    const args = this.getExpressionList();
    if (this.expect(")")) {
      return args;
    }
    this.raiseError("missing )");
  }

  getExpressionList(): Array<Expression> {
    let args: Array<Expression> = [];
    do {
      args.push(this.parseExpression());
    } while (this.expect(","));
    return args;
  }

  raiseError(msg: string): Error {
    throw new Error(`${msg} ${this.cur.value}`);
  }
}