"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("./lexer");
var expressions_1 = require("./expressions");
var emptyExpressionList = [];
var Parser = (function () {
    function Parser() {
    }
    Parser.prototype.parseExpression = function (input) {
        return new ParserImpl(new lexer_1.default(input || "")).getExpression();
    };
    return Parser;
}());
exports.Parser = Parser;
var ParserImpl = (function () {
    function ParserImpl(iterator) {
        this.iterator = iterator;
        console.assert(!!iterator);
        this.consume();
    }
    ParserImpl.prototype.getExpression = function () {
        return this.eof()
            ? exports.Constants.literalUndefined
            : this.getExpression2();
    };
    ParserImpl.prototype.getExpression2 = function () {
        var expr = this.parseExpression();
        if (this.eof()) {
            return expr;
        }
        this.raiseError("Unconsumed token " + this.cur.value);
    };
    ParserImpl.prototype.consume = function () {
        this.cur = this.iterator.next();
    };
    ParserImpl.prototype.expect = function (str) {
        if (this.cur.value === str) {
            this.consume();
            return true;
        }
        return false;
    };
    ParserImpl.prototype.eof = function () {
        return this.cur.type === "eof";
    };
    ParserImpl.prototype.parseExpression = function () {
        var result = this.parseIt();
        return this.cur.value === "?"
            ? this.parseConditionalExpression(result)
            : result;
    };
    ParserImpl.prototype.parseConditionalExpression = function (expr) {
        this.consume();
        var trueCondition = this.parseExpression();
        if (this.expect(":")) {
            return Creators.createConditionalExpression(expr, trueCondition, this.parseExpression());
        }
        this.raiseError("Conditional expression invalid");
    };
    ParserImpl.prototype.parseIt = function () {
        var expr = this.parsePrefix();
        var operator = Creators.getOperatorFactory(this.cur.value);
        if (operator) {
            this.consume();
            var e = 1, o = 0;
            var expressions = [expr, this.parsePrefix()];
            var operators = [operator];
            while (operator = Creators.getOperatorFactory(this.cur.value)) {
                this.consume();
                while (o >= 0 && operator.precedence <= operators[o].precedence) {
                    e--;
                    expressions[e] = operators[o--].create(expressions[e], expressions[e + 1]);
                }
                operators[++o] = operator;
                expressions[++e] = this.parsePrefix();
            }
            expr = expressions[e];
            for (var i = e - 1; i >= 0; i--) {
                expr = operators[o--].create(expressions[i], expr);
            }
        }
        return expr;
    };
    ParserImpl.prototype.parsePrefix = function () {
        switch (this.cur.value) {
            case "+":
            case "-":
            case "!":
                return this.parseUnary(this.cur.value);
        }
        var expr = this.parsePrimary();
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
    };
    ParserImpl.prototype.parseCallExpression = function (lhs) {
        this.consume();
        var expr = this.cur.value === ")" ? emptyExpressionList : this.getExpressionList();
        if (this.expect(")")) {
            return Creators.createCallExpression(lhs, expr);
        }
        this.raiseError("Expected close bracket");
    };
    ParserImpl.prototype.parseComputedMember = function (lhs) {
        this.consume();
        if (this.expect("]")) {
            this.raiseError("Expected expression");
        }
        var expr = this.parseExpression();
        if (this.expect("]")) {
            return Creators.createMemberAccessorExpression(lhs, expr, true);
        }
        this.raiseError("Expected closing ]");
    };
    ParserImpl.prototype.parseNamedMember = function (lhs) {
        this.consume();
        if (this.cur.type === "token") {
            var expr = Creators.createLiteralExpression("string", this.cur.value);
            this.consume();
            return this.cur.value === "("
                ? Creators.createMemberCallExpression(lhs, expr, this.parseArgs())
                : Creators.createMemberAccessorExpression(lhs, expr, false);
        }
        this.raiseError("Expected identifier");
    };
    ParserImpl.prototype.parseUnary = function (unary) {
        this.consume();
        return Creators.createUnaryExpression(unary, this.parsePrefix());
    };
    ParserImpl.prototype.parsePrimary = function () {
        switch (this.cur.value) {
            case "(":
                return this.parseBrackets();
            case "[":
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
    };
    ParserImpl.prototype.parseIdentifier = function (name) {
        this.consume();
        return Creators.createScopedAccessorExpression(name);
    };
    ParserImpl.prototype.parseLiteral = function (type, value) {
        this.consume();
        return Creators.createLiteralExpression(type, value);
    };
    ParserImpl.prototype.parseKeyword = function (keyword) {
        this.consume();
        return Creators.createConstExpression(keyword);
    };
    ParserImpl.prototype.parseArray = function () {
        this.consume();
        var expressions = this.cur.value === "]" ? [] : this.getExpressionList();
        if (this.expect("]")) {
            return Creators.createArrayExpression(expressions);
        }
        this.raiseError("Unexpected token");
    };
    ParserImpl.prototype.parseBrackets = function () {
        this.consume();
        var expr = this.parseExpression();
        if (this.expect(")")) {
            return expr;
        }
        this.raiseError("Expected )");
    };
    ParserImpl.prototype.parseObject = function () {
        this.consume();
        var properties = this.parseObjectProperties();
        if (this.expect("}")) {
            return Creators.createObjectExpression(properties);
        }
        this.raiseError("Unexpected End");
    };
    ParserImpl.prototype.parseObjectProperties = function () {
        var propertyNames = [];
        var expressions = [];
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
            names: propertyNames,
            expressions: expressions
        };
    };
    ParserImpl.prototype.parseArgs = function () {
        this.consume();
        if (this.expect(")")) {
            return emptyExpressionList;
        }
        var args = this.getExpressionList();
        if (this.expect(")")) {
            return args;
        }
        this.raiseError("missing )");
    };
    ParserImpl.prototype.getExpressionList = function () {
        var args = [];
        do {
            args.push(this.parseExpression());
        } while (this.expect(","));
        return args;
    };
    ParserImpl.prototype.raiseError = function (msg) {
        throw new Error(msg + " " + this.cur.value);
    };
    return ParserImpl;
}());
exports.Constants = {
    literalNull: new expressions_1.Literal("null", null),
    literalTrue: new expressions_1.Literal("true", true),
    literalFalse: new expressions_1.Literal("false", false),
    literalUndefined: new expressions_1.Literal("undefined", undefined)
};
var Creators = {
    createLiteralExpression: function (type, value) {
        switch (type) {
            case "string":
                return new expressions_1.LiteralString(value);
            case "number":
                return new expressions_1.LiteralNumber(parseFloat(value));
        }
    },
    createMemberCallExpression: function (lhs, expr, args) {
        return new expressions_1.MemberCallExpression(lhs, expr, args);
    },
    createMemberAccessorExpression: function (lhs, rhs, computed) {
        return new expressions_1.MemberAccessorExpression(lhs, rhs, computed);
    },
    createCallExpression: function (lhs, args) {
        return new expressions_1.CallExpression(lhs, args);
    },
    createConstExpression: function (keyword) {
        switch (keyword) {
            case "true":
                return exports.Constants.literalTrue;
            case "false":
                return exports.Constants.literalFalse;
            case "null":
                return exports.Constants.literalNull;
            case "undefined":
                return exports.Constants.literalUndefined;
        }
    },
    createUnaryExpression: function (op, expr) {
        return new expressions_1.UnaryExpression(op, expr);
    },
    createObjectExpression: function (properties) {
        return new expressions_1.ObjectExpression(properties.names, properties.expressions);
    },
    createArrayExpression: function (rc) {
        return new expressions_1.ArrayExpression(rc);
    },
    createConditionalExpression: function (test, trueCondition, falseCondition) {
        return new expressions_1.ConditionalExpression(test, trueCondition, falseCondition);
    },
    createScopedAccessorExpression: function (name) {
        return new expressions_1.ScopedAccessorExpression(name);
    },
    getOperatorFactory: function (name) {
        switch (name) {
            case "||":
                return BinaryFactories.or;
            case "&&":
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
            case "+":
                return BinaryFactories.add;
            case "-":
                return BinaryFactories.subtract;
            case "*":
                return BinaryFactories.multiply;
            case "/":
                return BinaryFactories.divide;
            case "%":
                return BinaryFactories.modulus;
        }
    }
};
var BinaryExpressionFactory = (function () {
    function BinaryExpressionFactory(operator, precedence) {
        this.operator = operator;
        this.precedence = precedence;
    }
    BinaryExpressionFactory.prototype.create = function (left, right) {
        return new expressions_1.BinaryExpression(this.operator, left, right);
    };
    return BinaryExpressionFactory;
}());
var LogicalExpressionFactory = (function () {
    function LogicalExpressionFactory(operator, precedence) {
        this.operator = operator;
        this.precedence = precedence;
    }
    LogicalExpressionFactory.prototype.create = function (left, right) {
        return new expressions_1.LogicalExpression(this.operator, left, right);
    };
    return LogicalExpressionFactory;
}());
var BinaryFactories = {
    or: new LogicalExpressionFactory("||", 10),
    and: new LogicalExpressionFactory("&&", 20),
    equal: new BinaryExpressionFactory("==", 30),
    notEqual: new BinaryExpressionFactory("!=", 30),
    absEqual: new BinaryExpressionFactory("===", 30),
    absNotEqual: new BinaryExpressionFactory("!==", 30),
    greaterThan: new BinaryExpressionFactory(">", 40),
    lessThan: new BinaryExpressionFactory("<", 40),
    greaterEqualThan: new BinaryExpressionFactory(">=", 40),
    lessEqualThan: new BinaryExpressionFactory("<=", 40),
    add: new BinaryExpressionFactory("+", 50),
    subtract: new BinaryExpressionFactory("-", 50),
    multiply: new BinaryExpressionFactory("*", 60),
    divide: new BinaryExpressionFactory("/", 60),
    modulus: new BinaryExpressionFactory("%", 60)
};
//# sourceMappingURL=parser.js.map