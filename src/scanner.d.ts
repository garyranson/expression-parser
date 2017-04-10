export declare class Scanner {
    private str;
    private idx;
    private eof;
    private mark;
    constructor(str: string);
    next(): LexerToken;
    readPastWhitespace(): number;
    readString(quoteChar: string): LexerToken;
    readComplexString(q: string, quote: number, slash: number): LexerToken;
    readNumber(): LexerToken;
    readIdentifier(): LexerToken;
    readSymbol(ch: number): LexerToken;
    createToken(type: string, skip: number): LexerToken;
    createEofToken(): LexerToken;
    createStringToken(endPos: number, str?: string): LexerToken;
    raiseError(msg: string): void;
    peek1(): number;
    peek2(): number;
    consume(): number;
}
export declare class LexerToken {
    type: string;
    value: string;
    start: number;
    end: number;
    constructor(type: string, value: string, start: number, end: number);
}
