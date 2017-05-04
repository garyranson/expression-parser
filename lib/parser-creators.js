"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var expressions_1 = require("./expressions");
exports.Constants = {
    literalNull: new expressions_1.Literal("null", null),
    literalTrue: new expressions_1.Literal("true", true),
    literalFalse: new expressions_1.Literal("false", false),
    literalUndefined: new expressions_1.Literal("undefined", undefined)
};
exports.Creators = {
    createConcatenate: function (set) {
        return new expressions_1.LiteralConcatenate(set);
    },
    createLiteralString: function (value) {
        return new expressions_1.LiteralString(value);
    },
    createLiteralNumer: function (value) {
        return new expressions_1.LiteralNumber(parseFloat(value));
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
