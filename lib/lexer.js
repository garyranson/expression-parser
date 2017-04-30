System.register(["./scanner"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var scanner_1, LexerReader;
    return {
        setters: [
            function (scanner_1_1) {
                scanner_1 = scanner_1_1;
            }
        ],
        execute: function () {
            LexerReader = (function () {
                function LexerReader(value) {
                    this.reader = new scanner_1.Scanner(value);
                }

                LexerReader.prototype.next = function () {
                    return this.reader.next();
                };
                return LexerReader;
            }());
            exports_1("default", LexerReader);
        }
    };
});
