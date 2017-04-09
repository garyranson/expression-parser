(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./instructions"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    var Instructions = require("./instructions");
    var Compiler = (function () {
        function Compiler() {
            this.visitor = new CompileVisitor();
        }

        Compiler.prototype.compile = function (ast) {
            return ast.visit(this.visitor);
        };
        return Compiler;
    }());
    exports.Compiler = Compiler;
    var CompileVisitor = (function () {
        function CompileVisitor() {
        }

        CompileVisitor.prototype.visitBinary = function (operator, left, right) {
            var instruction = new (getBinaryInstruction(operator))(left.visit(this), right.visit(this));
            return instruction.isConstant()
                ? new Instructions.LiteralInstruction(instruction.eval())
                : instruction;
        };
        CompileVisitor.prototype.visitLogicalOr = function (left, right) {
            var leftIns = left.visit(this);
            return leftIns.isConstant()
                ? leftIns.eval()
                    ? leftIns
                    : right.visit(this)
                : new Instructions.LogicalOrInstruction(leftIns, right.visit(this));
        };
        CompileVisitor.prototype.visitLogicalAnd = function (left, right) {
            var ins = new Instructions.LogicalAndInstruction(left.visit(this), right.visit(this));
            return ins.isConstant()
                ? new Instructions.LiteralInstruction(ins.eval(null))
                : ins;
        };
        CompileVisitor.prototype.visitLogical = function (operator, left, right) {
            switch (operator) {
                case "||":
                    return this.visitLogicalOr(left, right);
                case "&&":
                    return this.visitLogicalAnd(left, right);
            }
        };
        CompileVisitor.prototype.visitLiteral = function (value, raw) {
            return new Instructions.LiteralInstruction(value);
        };
        CompileVisitor.prototype.visitScopedAccessor = function (name) {
            return new Instructions.ScopedAccessorInstruction(name);
        };
        CompileVisitor.prototype.visitMember = function (object, property, computed) {
            var p = property.visit(this);
            return p.isConstant()
                ? new Instructions.MemberAccessorInstruction(object.visit(this), property.visit(this))
                : new Instructions.DirectMemberAccessorInstruction(object.visit(this), p.eval());
        };
        CompileVisitor.prototype.visitMemberCall = function (object, expression, args) {
            return new (getMemberCallInstruction(args.length))(object.visit(this), expression.visit(this), this.resolveArgs(args));
        };
        CompileVisitor.prototype.visitCall = function (callee, args) {
            return new (getCallInstruction(args.length))(callee.visit(this), this.resolveArgs(args));
        };
        CompileVisitor.prototype.visitConditional = function (test, consequent, alternate) {
            var testIns = test.visit(this);
            return testIns.isConstant()
                ? testIns.eval()
                    ? consequent.visit(this)
                    : alternate.visit(this)
                : new Instructions.ConditionalInstruction(testIns, consequent.visit(this), alternate.visit(this));
        };
        CompileVisitor.prototype.visitUnary = function (operator, argument) {
            var ctor = getUnaryInstruction(operator);
            var instruction = new ctor(argument.visit(this));
            return instruction.isConstant() ? new Instructions.LiteralInstruction(instruction.eval()) : instruction;
        };
        CompileVisitor.prototype.visitArray = function (elements) {
            return new Instructions.ArrayInstruction(this.resolveArgs(elements));
        };
        CompileVisitor.prototype.visitObject = function (propertyNames, expressions) {
            var inst = new Instructions.ObjectInstruction(propertyNames, this.resolveArgs(expressions));
            return inst.isConstant()
                ? new Instructions.LiteralInstruction(inst.eval(null))
                : inst;
        };
        CompileVisitor.prototype.resolveArgs = function (args) {
            var _this = this;
            return args.map(function (arg) {
                return arg.visit(_this);
            });
        };
        return CompileVisitor;
    }());

    function getUnaryInstruction(operator) {
        switch (operator) {
            case "+":
                return Instructions.UnaryPlusInstruction;
            case "-":
                return Instructions.UnaryMinusInstruction;
            case "!":
                return Instructions.UnaryNotInstruction;
        }
    }

    function getCallInstruction(length) {
        switch (length) {
            case 0:
                return Instructions.ScopeCall0Instruction;
            case 1:
                return Instructions.ScopeCall1Instruction;
            case 2:
                return Instructions.ScopeCall2Instruction;
            case 3:
                return Instructions.ScopeCall3Instruction;
            default:
                return Instructions.ScopeCallInstruction;
        }
    }

    function getMemberCallInstruction(length) {
        switch (length) {
            case 0:
                return Instructions.MemberCall0Instruction;
            case 1:
                return Instructions.MemberCall1Instruction;
            case 2:
                return Instructions.MemberCall2Instruction;
            case 3:
                return Instructions.MemberCall3Instruction;
            default:
                return Instructions.MemberCallInstruction;
        }
    }

    function getBinaryInstruction(operator) {
        switch (operator) {
            case "==":
                return Instructions.BinaryEqualInstruction;
            case "!=":
                return Instructions.BinaryNotEqualInstruction;
            case "===":
                return Instructions.BinaryAbsEqualInstruction;
            case "!==":
                return Instructions.BinaryAbsNotEqualInstruction;
            case "<":
                return Instructions.BinaryLessThanInstruction;
            case ">":
                return Instructions.BinaryGreaterThanInstruction;
            case "<=":
                return Instructions.BinaryLessEqualThanInstruction;
            case ">=":
                return Instructions.BinaryGreaterEqualThanInstruction;
            case "+":
                return Instructions.BinaryAddInstruction;
            case "-":
                return Instructions.BinarySubtractInstruction;
            case "*":
                return Instructions.BinaryMultiplyInstruction;
            case "/":
                return Instructions.BinaryDivideInstruction;
            case "%":
                return Instructions.BinaryModulusInstruction;
        }
    }
});
//# sourceMappingURL=compiler.js.map