import * as Expressions from "./expressions";
import LexerReader from "./lexer";

interface ObjectProperties {
  names: string[];
  expressions: Array<Expression>;
}

let Constants = {
  literalNull:      new Expressions.Literal("null", null),
  literalTrue:      new Expressions.Literal("true", true),
  literalFalse:     new Expressions.Literal("false", false),
  literalUndefined: new Expressions.Literal("undefined", undefined)
};

let emptyExpressionList: Array<Expression> = [];

abstract class ExpressionFactory {
  constructor(protected operator: string, public precedence: number) {
  }

  abstract create(left: Expression, right: Expression): Expression;
}
class BinaryExpressionFactory extends ExpressionFactory {
  create(left: Expression, right: Expression): Expression {
    return new Expressions.BinaryExpression(this.operator, left, right);
  }
}
class LogicalExpressionFactory extends ExpressionFactory {
  create(left: Expression, right: Expression): Expression {
    return new Expressions.LogicalExpression(this.operator, left, right);
  }
}
const BinaryFactories = {
  or:               new LogicalExpressionFactory("||", 10),
  and:              new LogicalExpressionFactory("&&", 20),
  equal:            new BinaryExpressionFactory("==", 30),
  notEqual:         new BinaryExpressionFactory("!=", 30),
  absEqual:         new BinaryExpressionFactory("===", 30),
  absNotEqual:      new BinaryExpressionFactory("!==", 30),
  greaterThan:      new BinaryExpressionFactory(">", 40),
  lessThan:         new BinaryExpressionFactory("<", 40),
  greaterEqualThan: new BinaryExpressionFactory(">=", 40),
  lessEqualThan:    new BinaryExpressionFactory("<=", 40),
  add:              new BinaryExpressionFactory("+", 50),
  subtract:         new BinaryExpressionFactory("-", 50),
  multiply:         new BinaryExpressionFactory("*", 60),
  divide:           new BinaryExpressionFactory("/", 60),
  modulus:          new BinaryExpressionFactory("%", 60)
};
export default class Parser {
  parseExpression(input: string): Expression {
    return new ParserImpl(new LexerReader(input || "")).getExpression();
  }
}
export class ParserImpl {
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
      return createConditionalExpression(expr, trueCondition, this.parseExpression());
    }
    this.raiseError("Conditional expression invalid");
  }

  parseIt(): Expression {
    let expr     = this.parsePrefix();
    let operator = getOperatorFactory(this.cur.value);

    if (operator) {
      this.consume();
      let e             = 1, o = 0;
      const expressions = [/*left*/expr, /*right*/this.parsePrefix()];
      const operators   = [operator];

      while (operator = getOperatorFactory(this.cur.value)) {
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
      return createCallExpression(lhs, expr);
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
      return createMemberAccessorExpression(lhs, expr, true);
    }
    this.raiseError("Expected closing ]");
  }

  parseNamedMember(lhs: Expression): Expression {
    this.consume();
    if (this.cur.type === "token") {
      const expr = createLiteralExpression("string", this.cur.value);
      this.consume();
      return this.cur.value === "("
        ? createMemberCallExpression(lhs, expr, this.parseArgs())
        : createMemberAccessorExpression(lhs, expr, false);
    }
    this.raiseError("Expected identifier");
  }

  parseUnary(unary: string) {
    this.consume();
    return createUnaryExpression(unary, this.parsePrefix());
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
    return createScopedAccessorExpression(name);
  }

  parseLiteral(type: string, value: string) {
    this.consume();
    return createLiteralExpression(type, value);
  }

  parseKeyword(keyword: string): Expression {
    this.consume();
    return createConstExpression(keyword);
  }

  parseArray(): Expression {
    this.consume();
    let expressions = this.cur.value === "]" ? [] : this.getExpressionList();
    if (this.expect("]")) {
      return createArrayExpression(expressions);
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
      return createObjectExpression(properties);
    }
    this.raiseError("Unexpected End");
  }

  parseObjectProperties(): ObjectProperties {
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

function createLiteralExpression(type: string, value: string): Expression {
  switch (type) {
    case "string":
      return new Expressions.LiteralString(value);
    case "number":
      return new Expressions.LiteralNumber(parseFloat(value));
  }
}
function createMemberCallExpression(lhs: Expression, expr: Expression, args: Expression[]): Expression {
  return new Expressions.MemberCallExpression(lhs, expr, args);
}
function createMemberAccessorExpression(lhs: Expression, rhs: Expression, computed: boolean): Expression {
  return new Expressions.MemberAccessorExpression(lhs, rhs, computed);
}
function createCallExpression(lhs: Expression, args: Array<Expression>): Expression {
  return new Expressions.CallExpression(lhs, args);
}
function createUnaryExpression(op: string, expr: Expression): Expression {
  return new Expressions.UnaryExpression(op, expr);
}
function createObjectExpression(properties: ObjectProperties): Expression {
  return new Expressions.ObjectExpression(properties.names, properties.expressions);
}
function createArrayExpression(rc: Array<Expression>): Expression {
  return new Expressions.ArrayExpression(rc);
}
function createConstExpression(value: string): Expression {
  switch (value) {
    case "true":
      return Constants.literalTrue;
    case "false":
      return Constants.literalFalse;
    case "null":
      return Constants.literalNull;
    case "undefined":
      return Constants.literalUndefined;
  }
}
function createConditionalExpression(test: Expression, trueCondition: Expression, falseCondition: Expression) {
  return new Expressions.ConditionalExpression(test, trueCondition, falseCondition);
}
function createScopedAccessorExpression(name: string) {
  return new Expressions.ScopedAccessorExpression(name);
}
function getOperatorFactory(name: string): ExpressionFactory {
  switch (name) {
    case "||" :
      return BinaryFactories.or;
    case "&&" :
      return BinaryFactories.and;
    case "==":
      return BinaryFactories.equal;
    case "!=":
      return BinaryFactories.notEqual;
    case "===":
      return BinaryFactories.absEqual;
    case "!==":
      return BinaryFactories.absNotEqual;
    case "<":
      return BinaryFactories.lessThan;
    case ">":
      return BinaryFactories.greaterThan;
    case "<=":
      return BinaryFactories.lessEqualThan;
    case ">=":
      return BinaryFactories.greaterEqualThan;
    case "+" :
      return BinaryFactories.add;
    case "-" :
      return BinaryFactories.subtract;
    case "*" :
      return BinaryFactories.multiply;
    case "/" :
      return BinaryFactories.divide;
    case "%" :
      return BinaryFactories.modulus;
  }
}