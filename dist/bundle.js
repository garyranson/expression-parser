    (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a)return a(o, !0);
                    if (i)return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {exports: {}};
                t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }

        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++)s(r[o]);
        return s
    })({
        1: [function (require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {value: true});
            var Literal = (function () {
                function Literal(raw, value) {
                    this.raw = raw;
                    this.value = value;
                }

                Literal.prototype.visit = function (visitor) {
                    return visitor.visitLiteral(this.value, this.raw);
                };
                return Literal;
            }());
            exports.Literal = Literal;
            var LiteralString = (function () {
                function LiteralString(raw) {
                    this.raw = raw;
                }

                LiteralString.prototype.visit = function (visitor) {
                    return visitor.visitLiteral(this.raw, this.raw);
                };
                return LiteralString;
            }());
            exports.LiteralString = LiteralString;
            var LiteralNumber = (function () {
                function LiteralNumber(value) {
                    this.value = value;
                }

                LiteralNumber.prototype.visit = function (visitor) {
                    return visitor.visitLiteral(this.value, undefined);
                };
                return LiteralNumber;
            }());
            exports.LiteralNumber = LiteralNumber;
            var ScopedAccessorExpression = (function () {
                function ScopedAccessorExpression(name) {
                    this.name = name;
                }

                ScopedAccessorExpression.prototype.visit = function (visitor) {
                    return visitor.visitScopedAccessor(this.name);
                };
                return ScopedAccessorExpression;
            }());
            exports.ScopedAccessorExpression = ScopedAccessorExpression;
            var MemberAccessorExpression = (function () {
                function MemberAccessorExpression(object, property, computed) {
                    this.object = object;
                    this.property = property;
                    this.computed = computed;
                }

                MemberAccessorExpression.prototype.visit = function (visitor) {
                    return visitor.visitMember(this.object, this.property, this.computed);
                };
                return MemberAccessorExpression;
            }());
            exports.MemberAccessorExpression = MemberAccessorExpression;
            var MemberCallExpression = (function () {
                function MemberCallExpression(object, member, args) {
                    this.object = object;
                    this.member = member;
                    this.args = args;
                }

                MemberCallExpression.prototype.visit = function (visitor) {
                    return visitor.visitMemberCall(this.object, this.member, this.args);
                };
                return MemberCallExpression;
            }());
            exports.MemberCallExpression = MemberCallExpression;
            var ConditionalExpression = (function () {
                function ConditionalExpression(test, consequent, alternate) {
                    this.test = test;
                    this.consequent = consequent;
                    this.alternate = alternate;
                }

                ConditionalExpression.prototype.visit = function (visitor) {
                    return visitor.visitConditional(this.test, this.consequent, this.alternate);
                };
                return ConditionalExpression;
            }());
            exports.ConditionalExpression = ConditionalExpression;
            var UnaryExpression = (function () {
                function UnaryExpression(unaryType, argument) {
                    this.unaryType = unaryType;
                    this.argument = argument;
                }

                UnaryExpression.prototype.visit = function (visitor) {
                    return visitor.visitUnary(this.unaryType, this.argument);
                };
                return UnaryExpression;
            }());
            exports.UnaryExpression = UnaryExpression;
            var CallExpression = (function () {
                function CallExpression(callee, args) {
                    this.callee = callee;
                    this.args = args;
                }

                CallExpression.prototype.visit = function (visitor) {
                    return visitor.visitCall(this.callee, this.args);
                };
                return CallExpression;
            }());
            exports.CallExpression = CallExpression;
            var ArrayExpression = (function () {
                function ArrayExpression(elements) {
                    this.elements = elements;
                }

                ArrayExpression.prototype.visit = function (visitor) {
                    return visitor.visitArray(this.elements);
                };
                return ArrayExpression;
            }());
            exports.ArrayExpression = ArrayExpression;
            var ObjectExpression = (function () {
                function ObjectExpression(propertyNames, expressions) {
                    this.propertyNames = propertyNames;
                    this.expressions = expressions;
                }

                ObjectExpression.prototype.visit = function (visitor) {
                    return visitor.visitObject(this.propertyNames, this.expressions);
                };
                return ObjectExpression;
            }());
            exports.ObjectExpression = ObjectExpression;
            var BinaryExpression = (function () {
                function BinaryExpression(operator, left, right) {
                    this.operator = operator;
                    this.left = left;
                    this.right = right;
                }

                BinaryExpression.prototype.visit = function (visitor) {
                    return visitor.visitBinary(this.operator, this.left, this.right);
                };
                return BinaryExpression;
            }());
            exports.BinaryExpression = BinaryExpression;
            var LogicalExpression = (function () {
                function LogicalExpression(operator, left, right) {
                    this.operator = operator;
                    this.left = left;
                    this.right = right;
                }

                LogicalExpression.prototype.visit = function (visitor) {
                    return visitor.visitBinary(this.operator, this.left, this.right);
                };
                return LogicalExpression;
            }());
            exports.LogicalExpression = LogicalExpression;

        }, {}], 2: [function (require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {value: true});
            var parser_1 = require("./parser");
            exports.Parser = parser_1.Parser;

        }, {"./parser": 4}], 3: [function (require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {value: true});
            var scanner_1 = require("./scanner");
            var LexerReader = (function () {
                function LexerReader(value) {
                    this.reader = new scanner_1.Scanner(value);
                }

                LexerReader.prototype.next = function () {
                    return this.reader.next();
                };
                return LexerReader;
            }());
            exports.default = LexerReader;

        }, {"./scanner": 5}], 4: [function (require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {value: true});
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

        }, {"./expressions": 1, "./lexer": 3}], 5: [function (require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {value: true});
            var Scanner = (function () {
                function Scanner(str) {
                    this.str = str || "";
                    this.idx = 0;
                    this.mark = 0;
                    this.eof = !str;
                }

                Scanner.prototype.next = function () {
                    var ch = this.readPastWhitespace();
                    return ((ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122) || ch === 95 || ch === 36)
                        ? this.readIdentifier()
                        : ((ch >= 48 && ch <= 57) || (ch === 46 && this.peek1() >= 48 && this.peek1() <= 57))
                            ? this.readNumber()
                            : ((ch === 34 || ch === 39))
                                ? this.readString(ch === 34 ? "\"" : "'")
                                : ch
                                    ? this.readSymbol(ch)
                                    : this.createEofToken();
                };
                Scanner.prototype.readPastWhitespace = function () {
                    var ch = this.eof ? 0 : this.str.charCodeAt(this.idx);
                    while (ch === 32 || ch === 9 || ch === 10 || ch === 13 || ch === 160) {
                        ch = this.str.charCodeAt(++this.idx);
                    }
                    this.mark = this.idx;
                    return ch;
                };
                Scanner.prototype.readString = function (quoteChar) {
                    this.consume();
                    var slash = this.str.indexOf("\\", this.idx);
                    var quote = this.str.indexOf(quoteChar, this.idx);
                    return slash === -1 && quote !== -1
                        ? this.createStringToken(quote)
                        : this.readComplexString(quoteChar, quote, slash);
                };
                Scanner.prototype.readComplexString = function (q, quote, slash) {
                    var str = this.str;
                    var sb = "";
                    var i = this.idx;
                    while (quote !== -1) {
                        if (slash === -1 || quote < slash) {
                            return this.createStringToken(quote, sb + str.substring(i, quote));
                        }
                        sb += (str.substring(i, slash) + unescape(str.charCodeAt(slash + 1)));
                        i = slash + 2;
                        if (quote < i) {
                            quote = str.indexOf(q, i);
                        }
                        slash = str.indexOf("\\", i);
                    }
                    this.raiseError("Unterminated quote");
                };
                Scanner.prototype.readNumber = function () {
                    var ch = this.consume();
                    while (ch >= 48 && ch <= 57) {
                        ch = this.consume();
                    }
                    if (ch === 46) {
                        ch = this.consume();
                        while (ch >= 48 && ch <= 57) {
                            ch = this.consume();
                        }
                    }
                    return this.createToken("number", 0);
                };
                Scanner.prototype.readIdentifier = function () {
                    var ch = this.consume();
                    while (ch === 36 || ch === 95 || (ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122) || (ch >= 48 && ch <= 57)) {
                        ch = this.consume();
                    }
                    return this.createToken("token", 0);
                };
                Scanner.prototype.readSymbol = function (ch) {
                    return this.createToken("symbol", (ch === 60 || ch === 62)
                        ? ((this.peek1() === 61) ? 2 : 1)
                        : (ch === 38 || ch === 124)
                            ? ((this.peek1() === ch) ? 2 : 1)
                            : ((ch === 61 || ch === 33) && this.peek1() === 61)
                                ? ((this.peek2() === 61) ? 3 : 2)
                                : 1);
                };
                Scanner.prototype.createToken = function (type, skip) {
                    this.idx += skip;
                    return new LexerToken(type, this.str.substring(this.mark, this.idx), this.mark, this.idx - 1);
                };
                Scanner.prototype.createEofToken = function () {
                    this.idx = this.str.length;
                    this.eof = true;
                    return new LexerToken("eof", "", this.str.length, this.str.length);
                };
                Scanner.prototype.createStringToken = function (endPos, str) {
                    this.idx = endPos + 1;
                    return new LexerToken("string", str || this.str.substring(this.mark + 1, endPos), this.mark, endPos);
                };
                Scanner.prototype.raiseError = function (msg) {
                    this.idx = this.str.length;
                    this.eof = true;
                    throw new Error(msg);
                };
                Scanner.prototype.peek1 = function () {
                    return this.str.charCodeAt(this.idx + 1);
                };
                Scanner.prototype.peek2 = function () {
                    return this.str.charCodeAt(this.idx + 2);
                };
                Scanner.prototype.consume = function () {
                    return this.str.charCodeAt(++this.idx);
                };
                return Scanner;
            }());
            exports.Scanner = Scanner;
            function unescape(ch) {
                switch (ch) {
                    case 114:
                        return "\r";
                    case 102:
                        return "\f";
                    case 110:
                        return "\n";
                    case 116:
                        return "\t";
                    case 118:
                        return "\v";
                    case 92:
                        return "\\";
                    case 39:
                        return "'";
                    case 34:
                        return "\"";
                    default:
                        return String.fromCharCode(ch);
                }
            }

            var LexerToken = (function () {
                function LexerToken(type, value, start, end) {
                    this.type = type;
                    this.value = value;
                    this.start = start;
                    this.end = end;
                }

                return LexerToken;
            }());
            exports.LexerToken = LexerToken;

        }, {}]
    }, {}, [2])

//# sourceMappingURL=bundle.js.map
