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
  ObjectProperties,
  ScopedAccessorExpression,
  UnaryExpression
} from "./expressions";

export const Constants = {
  literalNull:      new Literal("null", null),
  literalTrue:      new Literal("true", true),
  literalFalse:     new Literal("false", false),
  literalUndefined: new Literal("undefined", undefined)
};

export const Creators = {
  createLiteralExpression: function (type: string, value: string): Expression {
    switch (type) {
      case "string":
        return new LiteralString(value);
      case "number":
        return new LiteralNumber(parseFloat(value));
    }
  },

  createMemberCallExpression: function (lhs: Expression, expr: Expression, args: Expression[]): Expression {
    return new MemberCallExpression(lhs, expr, args);
  },

  createMemberAccessorExpression: function (lhs: Expression, rhs: Expression, computed: boolean): Expression {
    return new MemberAccessorExpression(lhs, rhs, computed);
  },
  createCallExpression:           function (lhs: Expression, args: Array<Expression>): Expression {
    return new CallExpression(lhs, args);
  },
  createConstExpression:          function (keyword: string): Expression {
    switch (keyword) {
      case "true":
        return Constants.literalTrue;
      case "false":
        return Constants.literalFalse;
      case "null":
        return Constants.literalNull;
      case "undefined":
        return Constants.literalUndefined;
    }
  },
  createUnaryExpression:          function (op: string, expr: Expression): Expression {
    return new UnaryExpression(op, expr);
  },
  createObjectExpression:         function (properties: ObjectProperties): Expression {
    return new ObjectExpression(properties.names, properties.expressions);
  },
  createArrayExpression:          function (rc: Array<Expression>): Expression {
    return new ArrayExpression(rc);
  },
  createConditionalExpression:    function (test: Expression, trueCondition: Expression, falseCondition: Expression): Expression {
    return new ConditionalExpression(test, trueCondition, falseCondition);
  },
  createScopedAccessorExpression: function (name: string): Expression {
    return new ScopedAccessorExpression(name);
  },
  getOperatorFactory:             function (name: string): ExpressionFactory {
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
};

export interface ExpressionFactory {
  precedence: number;
  create(left: Expression, right: Expression): Expression;
}

class BinaryExpressionFactory implements ExpressionFactory {
  constructor(protected operator: string, public precedence: number) {
  }

  create(left: Expression, right: Expression): Expression {
    return new BinaryExpression(this.operator, left, right);
  }
}
class LogicalExpressionFactory implements ExpressionFactory {
  constructor(protected operator: string, public precedence: number) {
  }

  create(left: Expression, right: Expression): Expression {
    return new LogicalExpression(this.operator, left, right);
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