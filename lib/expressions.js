"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
