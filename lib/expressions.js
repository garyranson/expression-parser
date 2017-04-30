System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Literal, LiteralString, LiteralNumber, ScopedAccessorExpression, MemberAccessorExpression, MemberCallExpression,
        ConditionalExpression, UnaryExpression, CallExpression, ArrayExpression, ObjectExpression, BinaryExpression,
        LogicalExpression;
    return {
        setters: [],
        execute: function () {
            Literal = (function () {
                function Literal(raw, value) {
                    this.raw = raw;
                    this.value = value;
                }

                Literal.prototype.visit = function (visitor) {
                    return visitor.visitLiteral(this.value, this.raw);
                };
                return Literal;
            }());
            exports_1("Literal", Literal);
            LiteralString = (function () {
                function LiteralString(raw) {
                    this.raw = raw;
                }

                LiteralString.prototype.visit = function (visitor) {
                    return visitor.visitLiteral(this.raw, this.raw);
                };
                return LiteralString;
            }());
            exports_1("LiteralString", LiteralString);
            LiteralNumber = (function () {
                function LiteralNumber(value) {
                    this.value = value;
                }

                LiteralNumber.prototype.visit = function (visitor) {
                    return visitor.visitLiteral(this.value, undefined);
                };
                return LiteralNumber;
            }());
            exports_1("LiteralNumber", LiteralNumber);
            ScopedAccessorExpression = (function () {
                function ScopedAccessorExpression(name) {
                    this.name = name;
                }

                ScopedAccessorExpression.prototype.visit = function (visitor) {
                    return visitor.visitScopedAccessor(this.name);
                };
                return ScopedAccessorExpression;
            }());
            exports_1("ScopedAccessorExpression", ScopedAccessorExpression);
            MemberAccessorExpression = (function () {
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
            exports_1("MemberAccessorExpression", MemberAccessorExpression);
            MemberCallExpression = (function () {
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
            exports_1("MemberCallExpression", MemberCallExpression);
            ConditionalExpression = (function () {
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
            exports_1("ConditionalExpression", ConditionalExpression);
            UnaryExpression = (function () {
                function UnaryExpression(unaryType, argument) {
                    this.unaryType = unaryType;
                    this.argument = argument;
                }

                UnaryExpression.prototype.visit = function (visitor) {
                    return visitor.visitUnary(this.unaryType, this.argument);
                };
                return UnaryExpression;
            }());
            exports_1("UnaryExpression", UnaryExpression);
            CallExpression = (function () {
                function CallExpression(callee, args) {
                    this.callee = callee;
                    this.args = args;
                }

                CallExpression.prototype.visit = function (visitor) {
                    return visitor.visitCall(this.callee, this.args);
                };
                return CallExpression;
            }());
            exports_1("CallExpression", CallExpression);
            ArrayExpression = (function () {
                function ArrayExpression(elements) {
                    this.elements = elements;
                }

                ArrayExpression.prototype.visit = function (visitor) {
                    return visitor.visitArray(this.elements);
                };
                return ArrayExpression;
            }());
            exports_1("ArrayExpression", ArrayExpression);
            ObjectExpression = (function () {
                function ObjectExpression(propertyNames, expressions) {
                    this.propertyNames = propertyNames;
                    this.expressions = expressions;
                }

                ObjectExpression.prototype.visit = function (visitor) {
                    return visitor.visitObject(this.propertyNames, this.expressions);
                };
                return ObjectExpression;
            }());
            exports_1("ObjectExpression", ObjectExpression);
            BinaryExpression = (function () {
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
            exports_1("BinaryExpression", BinaryExpression);
            LogicalExpression = (function () {
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
            exports_1("LogicalExpression", LogicalExpression);
        }
    };
});
