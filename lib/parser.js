var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({__proto__: []} instanceof Array && function (d, b) {
                d.__proto__ = b;
            }) ||
            function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./expressions", "./lexer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    var Expressions = require("./expressions");
    var lexer_1 = require("./lexer");
    var Constants = {
        literalNull: new Expressions.Literal("null", null),
        literalTrue: new Expressions.Literal("true", true),
        literalFalse: new Expressions.Literal("false", false),
        literalUndefined: new Expressions.Literal("undefined", undefined)
    };
    var emptyExpressionList = [];
    var ExpressionFactory = (function () {
        function ExpressionFactory(operator, precedence) {
            this.operator = operator;
            this.precedence = precedence;
        }

        return ExpressionFactory;
    }());
    var BinaryExpressionFactory = (function (_super) {
        __extends(BinaryExpressionFactory, _super);
        function BinaryExpressionFactory() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinaryExpressionFactory.prototype.create = function (left, right) {
            return new Expressions.BinaryExpression(this.operator, left, right);
        };
        return BinaryExpressionFactory;
    }(ExpressionFactory));
    var LogicalExpressionFactory = (function (_super) {
        __extends(LogicalExpressionFactory, _super);
        function LogicalExpressionFactory() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        LogicalExpressionFactory.prototype.create = function (left, right) {
            return new Expressions.LogicalExpression(this.operator, left, right);
        };
        return LogicalExpressionFactory;
    }(ExpressionFactory));
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
    var Parser = (function () {
        function Parser() {
        }

        Parser.prototype.parseExpression = function (input) {
            return new ParserImpl(new lexer_1.default(input || "")).getExpression();
        };
        return Parser;
    }());
    exports.default = Parser;
    var ParserImpl = (function () {
        function ParserImpl(iterator) {
            this.iterator = iterator;
            console.assert(!!iterator);
            this.consume();
        }

        ParserImpl.prototype.getExpression = function () {
            return this.eof()
                ? Constants.literalUndefined
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
                return createConditionalExpression(expr, trueCondition, this.parseExpression());
            }
            this.raiseError("Conditional expression invalid");
        };
        ParserImpl.prototype.parseIt = function () {
            var expr = this.parsePrefix();
            var operator = getOperatorFactory(this.cur.value);
            if (operator) {
                this.consume();
                var e = 1, o = 0;
                var expressions = [/*left*/ expr, /*right*/ this.parsePrefix()];
                var operators = [operator];
                while (operator = getOperatorFactory(this.cur.value)) {
                    this.consume();
                    // If operator on top of stack has greater precedence then pop/push expression
                    while (o >= 0 && operator.precedence <= operators[o].precedence) {
                        e--;
                        expressions[e] = operators[o--].create(/*left*/ expressions[e], /*right*/ expressions[e + 1]);
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
        /**
         *
         * @returns {any}
         */
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
                return createCallExpression(lhs, expr);
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
                return createMemberAccessorExpression(lhs, expr, true);
            }
            this.raiseError("Expected closing ]");
        };
        ParserImpl.prototype.parseNamedMember = function (lhs) {
            this.consume();
            if (this.cur.type === "token") {
                var expr = createLiteralExpression("string", this.cur.value);
                this.consume();
                return this.cur.value === "("
                    ? createMemberCallExpression(lhs, expr, this.parseArgs())
                    : createMemberAccessorExpression(lhs, expr, false);
            }
            this.raiseError("Expected identifier");
        };
        ParserImpl.prototype.parseUnary = function (unary) {
            this.consume();
            return createUnaryExpression(unary, this.parsePrefix());
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
            return createScopedAccessorExpression(name);
        };
        ParserImpl.prototype.parseLiteral = function (type, value) {
            this.consume();
            return createLiteralExpression(type, value);
        };
        ParserImpl.prototype.parseKeyword = function (keyword) {
            this.consume();
            return createConstExpression(keyword);
        };
        ParserImpl.prototype.parseArray = function () {
            this.consume();
            var expressions = this.cur.value === "]" ? [] : this.getExpressionList();
            if (this.expect("]")) {
                return createArrayExpression(expressions);
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
                return createObjectExpression(properties);
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
    exports.ParserImpl = ParserImpl;
    function createLiteralExpression(type, value) {
        switch (type) {
            case "string":
                return new Expressions.LiteralString(value);
            case "number":
                return new Expressions.LiteralNumber(parseFloat(value));
        }
    }

    function createMemberCallExpression(lhs, expr, args) {
        return new Expressions.MemberCallExpression(lhs, expr, args);
    }

    function createMemberAccessorExpression(lhs, rhs, computed) {
        return new Expressions.MemberAccessorExpression(lhs, rhs, computed);
    }

    function createCallExpression(lhs, args) {
        return new Expressions.CallExpression(lhs, args);
    }

    function createUnaryExpression(op, expr) {
        return new Expressions.UnaryExpression(op, expr);
    }

    function createObjectExpression(properties) {
        return new Expressions.ObjectExpression(properties.names, properties.expressions);
    }

    function createArrayExpression(rc) {
        return new Expressions.ArrayExpression(rc);
    }

    function createConstExpression(value) {
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

    function createConditionalExpression(test, trueCondition, falseCondition) {
        return new Expressions.ConditionalExpression(test, trueCondition, falseCondition);
    }

    function createScopedAccessorExpression(name) {
        return new Expressions.ScopedAccessorExpression(name);
    }

    function getOperatorFactory(name) {
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
});
//# sourceMappingURL=parser.js.map