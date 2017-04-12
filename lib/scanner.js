"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scanner = (function () {
    function Scanner(str) {
        this.str = str || "";
        this.idx = 0;
        this.mark = 0;
        this.eof = !str;
    }
    Scanner.prototype.next = function () {
        var ch = this.readPastWhitespace();
        return ((ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122) || ch === 95 || ch === 36) /*A-Z$_*/
            ? this.readIdentifier()
            : ((ch >= 48 && ch <= 57) || (ch === 46 && this.peek1() >= 48 && this.peek1() <= 57)) /* [0-9] */
                ? this.readNumber()
                : ((ch === 34 /*"*/ || ch === 39 /*' */))
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
        this.consume(); // eat quote character
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
            // no slash or quote before slash
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
        return this.createToken("symbol", (ch === 60 /*<*/ || ch === 62 /*>*/)
            ? ((this.peek1() === 61 /*=*/) ? 2 : 1)
            : (ch === 38 /*&*/ || ch === 124 /*|*/)
                ? ((this.peek1() === ch /*=*/) ? 2 : 1)
                : ((ch === 61 /*=*/ || ch === 33 /*!*/) && this.peek1() === 61 /*=*/)
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
