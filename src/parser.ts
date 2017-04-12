import LexerReader from "./lexer";
import {Expression, ObjectProperties} from "./expressions";
import {LexerToken} from "./scanner";
import {Constants, Creators} from "./parser-creators";

let emptyExpressionList: Array<Expression> = [];

export class Parser {
  parseExpression(input: string): Expression {
    return new ParserImpl(new LexerReader(input || "")).getExpression();
  }
}

class ParserImpl {
  cur: LexerToken;

  constructor(private iterator: LexerReader) {
    console.assert(!!iterator);
    this.consume();
  }

  getExpression() {
    return this.eof()
      ? Constants.literalUndefined
      : this.getExpression2();
  }

  getExpression2() {
    const expr = this.parseExpression();
    if (this.eof()) {
      return expr;
    }
    this.raiseError(`Unconsumed token ${this.cur.value}`);
  }

  consume(): void {
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
      const expr = Creators.createLiteralExpression("string", this.cur.value);
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
    return Creators.createLiteralExpression(type, value);
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