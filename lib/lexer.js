(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./scanner"], factory);
    }
})(function (require, exports) {
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
});
//# sourceMappingURL=lexer.js.map