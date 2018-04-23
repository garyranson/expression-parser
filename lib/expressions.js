"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Literal = /** @class */ (function () {
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
var LiteralConcatenate = /** @class */ (function () {
    function LiteralConcatenate(expressions) {
        this.expressions = expressions;
    }
    LiteralConcatenate.prototype.visit = function (visitor) {
        return visitor.visitConcatenate(this.expressions);
    };
    return LiteralConcatenate;
}());
exports.LiteralConcatenate = LiteralConcatenate;
var Token = /** @class */ (function () {
    function Token(raw) {
        this.raw = raw;
    }
    Token.prototype.visit = function (visitor) {
        return visitor.visitToken(this.raw);
    };
    return Token;
}());
exports.Token = Token;
var LiteralString = /** @class */ (function () {
    function LiteralString(raw) {
        this.raw = raw;
    }
    LiteralString.prototype.visit = function (visitor) {
        return visitor.visitLiteral(this.raw, this.raw);
    };
    return LiteralString;
}());
exports.LiteralString = LiteralString;
var LiteralNumber = /** @class */ (function () {
    function LiteralNumber(value) {
        this.value = value;
    }
    LiteralNumber.prototype.visit = function (visitor) {
        return visitor.visitLiteral(this.value, undefined);
    };
    return LiteralNumber;
}());
exports.LiteralNumber = LiteralNumber;
var ScopedAccessorExpression = /** @class */ (function () {
    function ScopedAccessorExpression(name) {
        this.name = name;
    }
    ScopedAccessorExpression.prototype.visit = function (visitor) {
        return visitor.visitScopedAccessor(this.name);
    };
    return ScopedAccessorExpression;
}());
exports.ScopedAccessorExpression = ScopedAccessorExpression;
var MemberAccessorExpression = /** @class */ (function () {
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
var MemberCallExpression = /** @class */ (function () {
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
var ConditionalExpression = /** @class */ (function () {
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
var UnaryExpression = /** @class */ (function () {
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
var CallExpression = /** @class */ (function () {
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
var ArrayExpression = /** @class */ (function () {
    function ArrayExpression(elements) {
        this.elements = elements;
    }
    ArrayExpression.prototype.visit = function (visitor) {
        return visitor.visitArray(this.elements);
    };
    return ArrayExpression;
}());
exports.ArrayExpression = ArrayExpression;
var ObjectExpression = /** @class */ (function () {
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
var BinaryExpression = /** @class */ (function () {
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
var LogicalExpression = /** @class */ (function () {
    function LogicalExpression(operator, left, right) {
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    LogicalExpression.prototype.visit = function (visitor) {
        return visitor.visitLogical(this.operator, this.left, this.right);
    };
    return LogicalExpression;
}());
exports.LogicalExpression = LogicalExpression;
