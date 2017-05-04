"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var scanner_1 = require("./scanner");
var LexerReader = (function () {
    function LexerReader(value) {
        this.reader = new scanner_1.Scanner(value);
    }

    LexerReader.prototype.setPos = function (pos) {
        this.reader.setPos(pos);
    };
    LexerReader.prototype.next = function () {
        return this.reader.next();
    };
    return LexerReader;
}());
exports.default = LexerReader;
