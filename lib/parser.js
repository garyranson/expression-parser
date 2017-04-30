System.register(["./lexer", "./parser-creators"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lexer_1, parser_creators_1, emptyExpressionList, Parser, ParserImpl;
    return {
        setters: [
            function (lexer_1_1) {
                lexer_1 = lexer_1_1;
            },
            function (parser_creators_1_1) {
                parser_creators_1 = parser_creators_1_1;
            }
        ],
        execute: function () {
            emptyExpressionList = [];
            Parser = (function () {
                function Parser() {
                }

                Parser.prototype.parseExpression = function (input) {
                    return new ParserImpl(new lexer_1.default(input || "")).getExpression();
                };
                return Parser;
            }());
            exports_1("Parser", Parser);
            ParserImpl = (function () {
                function ParserImpl(iterator) {
                    this.iterator = iterator;
                    console.assert(!!iterator);
                    this.consume();
                }

                ParserImpl.prototype.getExpression = function () {
                    return this.eof()
                        ? parser_creators_1.Constants.literalUndefined
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
                        var expr = parser_creators_1.Creators.createLiteralExpression("string", this.cur.value);
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
                    return parser_creators_1.Creators.createLiteralExpression(type, value);
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
        }
    };
});
