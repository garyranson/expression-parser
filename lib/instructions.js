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
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    var emptyScope = Object.freeze({});

    function evaluateAll(scope, args) {
        var rc = [];
        for (var i = 0; i < args.length; i++) {
            rc[i] = args[i].eval(scope);
        }
        return rc;
    }

    function isConstant(args) {
        for (var i = 0; i < args.length; i++) {
            if (!args[i].isConstant()) {
                return false;
            }
        }
        return true;
    }

    function failSafe() {
        throw "cannot call";
    }

    function safeCall(fn, method) {
        return (fn && fn[method]) || failSafe;
    }

    var BinaryBase = (function () {
        function BinaryBase(left, right) {
            this.left = left;
            this.right = right;
        }

        BinaryBase.prototype.isConstant = function () {
            return this.left.isConstant() && this.right.isConstant();
        };
        return BinaryBase;
    }());
    var LiteralInstruction = (function () {
        function LiteralInstruction(value) {
            this.value = value;
        }

        LiteralInstruction.prototype.eval = function (scope) {
            return this.value;
        };
        LiteralInstruction.prototype.isConstant = function () {
            return true;
        };
        return LiteralInstruction;
    }());
    exports.LiteralInstruction = LiteralInstruction;
    var ScopedAccessorInstruction = (function () {
        function ScopedAccessorInstruction(name) {
            this.name = name;
        }

        ScopedAccessorInstruction.prototype.eval = function (scope) {
            return scope[this.name];
        };
        ScopedAccessorInstruction.prototype.isConstant = function () {
            return false;
        };
        return ScopedAccessorInstruction;
    }());
    exports.ScopedAccessorInstruction = ScopedAccessorInstruction;
    var MemberAccessorInstruction = (function () {
        function MemberAccessorInstruction(object, property) {
            this.object = object;
            this.property = property;
        }

        MemberAccessorInstruction.prototype.eval = function (scope) {
            return this.object.eval(scope)[this.property.eval(scope)];
        };
        MemberAccessorInstruction.prototype.isConstant = function () {
            return false;
        };
        return MemberAccessorInstruction;
    }());
    exports.MemberAccessorInstruction = MemberAccessorInstruction;
    var DirectMemberAccessorInstruction = (function () {
        function DirectMemberAccessorInstruction(object, propertyName) {
            this.object = object;
            this.propertyName = propertyName;
        }

        DirectMemberAccessorInstruction.prototype.eval = function (scope) {
            return this.object.eval(scope)[this.propertyName];
        };
        DirectMemberAccessorInstruction.prototype.isConstant = function () {
            return false;
        };
        return DirectMemberAccessorInstruction;
    }());
    exports.DirectMemberAccessorInstruction = DirectMemberAccessorInstruction;
    var ConditionalInstruction = (function () {
        function ConditionalInstruction(test, consequent, alternate) {
            this.test = test;
            this.consequent = consequent;
            this.alternate = alternate;
        }

        ConditionalInstruction.prototype.eval = function (scope) {
            return this.test.eval(scope) ? this.consequent.eval(scope) : this.alternate.eval(scope);
        };
        ConditionalInstruction.prototype.isConstant = function () {
            return this.test.isConstant();
        };
        return ConditionalInstruction;
    }());
    exports.ConditionalInstruction = ConditionalInstruction;
    var UnaryPlusInstruction = (function () {
        function UnaryPlusInstruction(argument) {
            this.argument = argument;
        }

        UnaryPlusInstruction.prototype.eval = function (scope) {
            return +this.argument.eval(scope);
        };
        UnaryPlusInstruction.prototype.isConstant = function () {
            return this.argument.isConstant();
        };
        return UnaryPlusInstruction;
    }());
    exports.UnaryPlusInstruction = UnaryPlusInstruction;
    var UnaryMinusInstruction = (function () {
        function UnaryMinusInstruction(argument) {
            this.argument = argument;
        }

        UnaryMinusInstruction.prototype.eval = function (scope) {
            return -this.argument.eval(scope);
        };
        UnaryMinusInstruction.prototype.isConstant = function () {
            return this.argument.isConstant();
        };
        return UnaryMinusInstruction;
    }());
    exports.UnaryMinusInstruction = UnaryMinusInstruction;
    var UnaryNotInstruction = (function () {
        function UnaryNotInstruction(argument) {
            this.argument = argument;
        }

        UnaryNotInstruction.prototype.eval = function (scope) {
            return !this.argument.eval(scope);
        };
        UnaryNotInstruction.prototype.isConstant = function () {
            return this.argument.isConstant();
        };
        return UnaryNotInstruction;
    }());
    exports.UnaryNotInstruction = UnaryNotInstruction;
    var MemberCallInstruction = (function () {
        function MemberCallInstruction(callee, member, args) {
            this.callee = callee;
            this.member = member;
            this.args = args;
        }

        MemberCallInstruction.prototype.eval = function (scope) {
            var result = this.callee.eval(scope);
            return safeCall(result, this.member.eval(scope)).apply(result, evaluateAll(scope, this.args));
        };
        MemberCallInstruction.prototype.isConstant = function () {
            return isConstant(this.args);
        };
        return MemberCallInstruction;
    }());
    exports.MemberCallInstruction = MemberCallInstruction;
    var MemberCall0Instruction = (function () {
        function MemberCall0Instruction(callee, member) {
            this.callee = callee;
            this.member = member;
        }

        MemberCall0Instruction.prototype.eval = function (scope) {
            var result = this.callee.eval(scope);
            return safeCall(result, this.member.eval(scope)).call(result);
        };
        MemberCall0Instruction.prototype.isConstant = function () {
            return true;
        };
        return MemberCall0Instruction;
    }());
    exports.MemberCall0Instruction = MemberCall0Instruction;
    var MemberCall1Instruction = (function () {
        function MemberCall1Instruction(callee, member, args) {
            this.callee = callee;
            this.member = member;
            this.a1 = args[0];
        }

        MemberCall1Instruction.prototype.eval = function (scope) {
            var result = this.callee.eval(scope);
            return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope));
        };
        MemberCall1Instruction.prototype.isConstant = function () {
            return this.a1.isConstant();
        };
        return MemberCall1Instruction;
    }());
    exports.MemberCall1Instruction = MemberCall1Instruction;
    var MemberCall2Instruction = (function () {
        function MemberCall2Instruction(callee, member, args) {
            this.callee = callee;
            this.member = member;
            this.a1 = args[0];
            this.a2 = args[1];
        }

        MemberCall2Instruction.prototype.eval = function (scope) {
            var result = this.callee.eval(scope);
            return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope), this.a2.eval(scope));
        };
        MemberCall2Instruction.prototype.isConstant = function () {
            return isConstant([this.a1, this.a2]);
        };
        return MemberCall2Instruction;
    }());
    exports.MemberCall2Instruction = MemberCall2Instruction;
    var MemberCall3Instruction = (function () {
        function MemberCall3Instruction(callee, member, args) {
            this.callee = callee;
            this.member = member;
            this.a1 = args[0];
            this.a2 = args[1];
            this.a3 = args[2];
        }

        MemberCall3Instruction.prototype.eval = function (scope) {
            var result = this.callee.eval(scope);
            return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope), this.a2.eval(scope), this.a3.eval(scope));
        };
        MemberCall3Instruction.prototype.isConstant = function () {
            return isConstant([this.a1, this.a2, this.a3]);
        };
        return MemberCall3Instruction;
    }());
    exports.MemberCall3Instruction = MemberCall3Instruction;
    var ScopeCallInstruction = (function () {
        function ScopeCallInstruction(callee, args) {
            this.callee = callee;
            this.args = args;
        }

        ScopeCallInstruction.prototype.eval = function (scope) {
            return this.callee.eval(scope).apply(emptyScope, evaluateAll(scope, this.args));
        };
        ScopeCallInstruction.prototype.isConstant = function () {
            return isConstant(this.args);
        };
        return ScopeCallInstruction;
    }());
    exports.ScopeCallInstruction = ScopeCallInstruction;
    var ScopeCall0Instruction = (function () {
        function ScopeCall0Instruction(callee) {
            this.callee = callee;
        }

        ScopeCall0Instruction.prototype.eval = function (scope) {
            return this.callee.eval(scope).call(emptyScope);
        };
        ScopeCall0Instruction.prototype.isConstant = function () {
            return true;
        };
        return ScopeCall0Instruction;
    }());
    exports.ScopeCall0Instruction = ScopeCall0Instruction;
    var ScopeCall1Instruction = (function () {
        function ScopeCall1Instruction(callee, args) {
            this.callee = callee;
            this.a1 = args[0];
        }

        ScopeCall1Instruction.prototype.eval = function (scope) {
            return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope));
        };
        ScopeCall1Instruction.prototype.isConstant = function () {
            return this.a1.isConstant();
        };
        return ScopeCall1Instruction;
    }());
    exports.ScopeCall1Instruction = ScopeCall1Instruction;
    var ScopeCall2Instruction = (function () {
        function ScopeCall2Instruction(callee, args) {
            this.callee = callee;
            this.a1 = args[0];
            this.a2 = args[1];
        }

        ScopeCall2Instruction.prototype.eval = function (scope) {
            return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope), this.a2.eval(scope));
        };
        ScopeCall2Instruction.prototype.isConstant = function () {
            return isConstant([this.a1, this.a2]);
        };
        return ScopeCall2Instruction;
    }());
    exports.ScopeCall2Instruction = ScopeCall2Instruction;
    var ScopeCall3Instruction = (function () {
        function ScopeCall3Instruction(callee, args) {
            this.callee = callee;
            this.a1 = args[0];
            this.a2 = args[1];
            this.a3 = args[2];
        }

        ScopeCall3Instruction.prototype.eval = function (scope) {
            return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope), this.a2.eval(scope), this.a3.eval(scope));
        };
        ScopeCall3Instruction.prototype.isConstant = function () {
            return isConstant([this.a1, this.a2, this.a3]);
        };
        return ScopeCall3Instruction;
    }());
    exports.ScopeCall3Instruction = ScopeCall3Instruction;
    var ObjectInstruction = (function () {
        function ObjectInstruction(propertyNames, instructions) {
            this.propertyNames = propertyNames;
            this.instructions = instructions;
        }

        ObjectInstruction.prototype.eval = function (scope) {
            var obj = {};
            for (var i = 0; i < this.propertyNames.length; i++) {
                obj[this.propertyNames[i]] = this.instructions[i].eval(scope);
            }
            return obj;
        };
        ObjectInstruction.prototype.isConstant = function () {
            return isConstant(this.instructions);
        };
        return ObjectInstruction;
    }());
    exports.ObjectInstruction = ObjectInstruction;
    var ArrayInstruction = (function () {
        function ArrayInstruction(elements) {
            this.elements = elements;
        }

        ArrayInstruction.prototype.eval = function (scope) {
            return evaluateAll(scope, this.elements);
        };
        ArrayInstruction.prototype.isConstant = function () {
            return true;
        };
        return ArrayInstruction;
    }());
    exports.ArrayInstruction = ArrayInstruction;
    var LogicalOrInstruction = (function (_super) {
        __extends(LogicalOrInstruction, _super);
        function LogicalOrInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        LogicalOrInstruction.prototype.eval = function (scope) {
            return this.left.eval(scope) || this.right.eval(scope);
        };
        return LogicalOrInstruction;
    }(BinaryBase));
    exports.LogicalOrInstruction = LogicalOrInstruction;
    var LogicalAndInstruction = (function (_super) {
        __extends(LogicalAndInstruction, _super);
        function LogicalAndInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        LogicalAndInstruction.prototype.eval = function (scope) {
            return this.left.eval(scope) && this.right.eval(scope);
        };
        return LogicalAndInstruction;
    }(BinaryBase));
    exports.LogicalAndInstruction = LogicalAndInstruction;
    var BinaryEqualInstruction = (function (_super) {
        __extends(BinaryEqualInstruction, _super);
        function BinaryEqualInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinaryEqualInstruction.prototype.eval = function (scope) {
            // tslint:disable-next-line
            return this.left.eval(scope) == this.right.eval(scope);
        };
        return BinaryEqualInstruction;
    }(BinaryBase));
    exports.BinaryEqualInstruction = BinaryEqualInstruction;
    var BinaryNotEqualInstruction = (function (_super) {
        __extends(BinaryNotEqualInstruction, _super);
        function BinaryNotEqualInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinaryNotEqualInstruction.prototype.eval = function (scope) {
            // tslint:disable-next-line
            return this.left.eval(scope) != this.right.eval(scope);
        };
        return BinaryNotEqualInstruction;
    }(BinaryBase));
    exports.BinaryNotEqualInstruction = BinaryNotEqualInstruction;
    var BinaryAbsNotEqualInstruction = (function (_super) {
        __extends(BinaryAbsNotEqualInstruction, _super);
        function BinaryAbsNotEqualInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinaryAbsNotEqualInstruction.prototype.eval = function (scope) {
            return this.left.eval(scope) !== this.right.eval(scope);
        };
        return BinaryAbsNotEqualInstruction;
    }(BinaryBase));
    exports.BinaryAbsNotEqualInstruction = BinaryAbsNotEqualInstruction;
    var BinaryAbsEqualInstruction = (function (_super) {
        __extends(BinaryAbsEqualInstruction, _super);
        function BinaryAbsEqualInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinaryAbsEqualInstruction.prototype.eval = function (scope) {
            return this.left.eval(scope) === this.right.eval(scope);
        };
        return BinaryAbsEqualInstruction;
    }(BinaryBase));
    exports.BinaryAbsEqualInstruction = BinaryAbsEqualInstruction;
    var BinaryGreaterThanInstruction = (function (_super) {
        __extends(BinaryGreaterThanInstruction, _super);
        function BinaryGreaterThanInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinaryGreaterThanInstruction.prototype.eval = function (scope) {
            return this.left.eval(scope) > this.right.eval(scope);
        };
        return BinaryGreaterThanInstruction;
    }(BinaryBase));
    exports.BinaryGreaterThanInstruction = BinaryGreaterThanInstruction;
    var BinaryLessThanInstruction = (function (_super) {
        __extends(BinaryLessThanInstruction, _super);
        function BinaryLessThanInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinaryLessThanInstruction.prototype.eval = function (scope) {
            return this.left.eval(scope) < this.right.eval(scope);
        };
        return BinaryLessThanInstruction;
    }(BinaryBase));
    exports.BinaryLessThanInstruction = BinaryLessThanInstruction;
    var BinaryGreaterEqualThanInstruction = (function (_super) {
        __extends(BinaryGreaterEqualThanInstruction, _super);
        function BinaryGreaterEqualThanInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinaryGreaterEqualThanInstruction.prototype.eval = function (scope) {
            return this.left.eval(scope) >= this.right.eval(scope);
        };
        return BinaryGreaterEqualThanInstruction;
    }(BinaryBase));
    exports.BinaryGreaterEqualThanInstruction = BinaryGreaterEqualThanInstruction;
    var BinaryLessEqualThanInstruction = (function (_super) {
        __extends(BinaryLessEqualThanInstruction, _super);
        function BinaryLessEqualThanInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinaryLessEqualThanInstruction.prototype.eval = function (scope) {
            return this.left.eval(scope) <= this.right.eval(scope);
        };
        return BinaryLessEqualThanInstruction;
    }(BinaryBase));
    exports.BinaryLessEqualThanInstruction = BinaryLessEqualThanInstruction;
    var BinaryAddInstruction = (function (_super) {
        __extends(BinaryAddInstruction, _super);
        function BinaryAddInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinaryAddInstruction.prototype.eval = function (scope) {
            return this.left.eval(scope) + this.right.eval(scope);
        };
        return BinaryAddInstruction;
    }(BinaryBase));
    exports.BinaryAddInstruction = BinaryAddInstruction;
    var BinarySubtractInstruction = (function (_super) {
        __extends(BinarySubtractInstruction, _super);
        function BinarySubtractInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinarySubtractInstruction.prototype.eval = function (scope) {
            return this.left.eval(scope) - this.right.eval(scope);
        };
        return BinarySubtractInstruction;
    }(BinaryBase));
    exports.BinarySubtractInstruction = BinarySubtractInstruction;
    var BinaryMultiplyInstruction = (function (_super) {
        __extends(BinaryMultiplyInstruction, _super);
        function BinaryMultiplyInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinaryMultiplyInstruction.prototype.eval = function (scope) {
            return this.left.eval(scope) * this.right.eval(scope);
        };
        return BinaryMultiplyInstruction;
    }(BinaryBase));
    exports.BinaryMultiplyInstruction = BinaryMultiplyInstruction;
    var BinaryDivideInstruction = (function (_super) {
        __extends(BinaryDivideInstruction, _super);
        function BinaryDivideInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinaryDivideInstruction.prototype.eval = function (scope) {
            return this.left.eval(scope) / this.right.eval(scope);
        };
        return BinaryDivideInstruction;
    }(BinaryBase));
    exports.BinaryDivideInstruction = BinaryDivideInstruction;
    var BinaryModulusInstruction = (function (_super) {
        __extends(BinaryModulusInstruction, _super);
        function BinaryModulusInstruction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        BinaryModulusInstruction.prototype.eval = function (scope) {
            return this.left.eval(scope) % this.right.eval(scope);
        };
        return BinaryModulusInstruction;
    }(BinaryBase));
    exports.BinaryModulusInstruction = BinaryModulusInstruction;
});
//# sourceMappingURL=instructions.js.map