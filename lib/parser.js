"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("./lexer");
var parser_creators_1 = require("./parser-creators");
var emptyExpressionList = [];
var Parser = /** @class */ (function () {
    function Parser() {
    }
    Parser.prototype.parseExpression = function (input) {
        var parser = new ParserImpl(input || "");
        if (parser.eof()) {
            return parser_creators_1.Constants.literalUndefined;
        }
        var expr = parser.parseExpression();
        if (parser.eof()) {
            return expr;
        }
        parser.raiseError("Unconsumed token");
    };
    Parser.prototype.parseExpressions = function (input) {
        var parser = new ParserImpl(input || "");
        var expressions = [];
        while (!parser.eof()) {
            if (parser.expect(",")) {
                expressions.push(parser_creators_1.Constants.literalUndefined);
                // Trailing comma?
                if (parser.eof()) {
                    expressions.push(parser_creators_1.Constants.literalUndefined);
                }
            }
            else {
                expressions.push(parser.parseExpression());
                if (parser.eof()) {
                    break;
                }
                if (parser.expect(",")) {
                    // Trailing comma?
                    if (parser.eof()) {
                        expressions.push(parser_creators_1.Constants.literalUndefined);
                    }
                }
                else {
                    parser.raiseError("Unexpected token. Expected comma or eof");
                }
            }
        }
        return expressions;
    };
    Parser.prototype.parseContent = function (input) {
        if (!input) {
            input = "";
        }
        var parser = new ParserImpl(input || "");
        var pos = input.indexOf("${");
        if (pos === -1) {
            return parser_creators_1.Creators.createLiteralString(input);
        }
        var concat = [];
        var lastPos = 0;
        while (pos !== -1) {
            if (lastPos !== pos) {
                concat.push(parser_creators_1.Creators.createLiteralString(input.substr(lastPos, pos - lastPos)));
            }
            parser.reset(pos + 2);
            concat.push(parser.parseExpression());
            lastPos = parser.cur.end + 1;
            if (!parser.expect("}")) {
                parser.raiseError("Malformed Content Expression");
            }
            pos = input.indexOf("${", lastPos);
            if (pos === -1 && lastPos < input.length) {
                concat.push(parser_creators_1.Creators.createLiteralString(input.substr(lastPos)));
            }
        }
        return concat.length === 1
            ? concat[0]
            : parser_creators_1.Creators.createConcatenate(concat);
    };
    return Parser;
}());
exports.Parser = Parser;
var ParserImpl = /** @class */ (function () {
    function ParserImpl(input) {
        this.iterator = new lexer_1.default(input);
        this.consume();
    }
    ParserImpl.prototype.consume = function () {
        this.cur = this.iterator.next();
    };
    ParserImpl.prototype.reset = function (pos) {
        this.iterator.setPos(pos);
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
            return parser_creators_1.Creators.createConditionalExpression(expr, trueCondition, this.parseExpression());
        }
        this.raiseError("Conditional expression invalid");
    };
    ParserImpl.prototype.parseIt = function () {
        var expr = this.parsePrefix();
        var operator = parser_creators_1.Creators.getOperatorFactory(this.cur.value);
        if (operator) {
            this.consume();
            var e = 1, o = 0;
            var expressions = [/*left*/ expr, /*right*/ this.parsePrefix()];
            var operators = [operator];
            while (operator = parser_creators_1.Creators.getOperatorFactory(this.cur.value)) {
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
            return parser_creators_1.Creators.createCallExpression(lhs, expr);
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
            return parser_creators_1.Creators.createMemberAccessorExpression(lhs, expr, true);
        }
        this.raiseError("Expected closing ]");
    };
    ParserImpl.prototype.parseNamedMember = function (lhs) {
        this.consume();
        if (this.cur.type === "token") {
            var expr = parser_creators_1.Creators.createLiteralString(this.cur.value);
            this.consume();
            return this.cur.value === "("
                ? parser_creators_1.Creators.createMemberCallExpression(lhs, expr, this.parseArgs())
                : parser_creators_1.Creators.createMemberAccessorExpression(lhs, expr, false);
        }
        this.raiseError("Expected identifier");
    };
    ParserImpl.prototype.parseUnary = function (unary) {
        this.consume();
        return parser_creators_1.Creators.createUnaryExpression(unary, this.parsePrefix());
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
        return parser_creators_1.Creators.createScopedAccessorExpression(name);
    };
    ParserImpl.prototype.parseLiteral = function (type, value) {
        this.consume();
        return type === "number"
            ? parser_creators_1.Creators.createLiteralNumber(value)
            : parser_creators_1.Creators.createLiteralString(value);
    };
    ParserImpl.prototype.parseKeyword = function (keyword) {
        this.consume();
        return parser_creators_1.Creators.createConstExpression(keyword);
    };
    ParserImpl.prototype.parseArray = function () {
        this.consume();
        var expressions = this.cur.value === "]" ? [] : this.getExpressionList();
        if (this.expect("]")) {
            return parser_creators_1.Creators.createArrayExpression(expressions);
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
            return parser_creators_1.Creators.createObjectExpression(properties);
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
