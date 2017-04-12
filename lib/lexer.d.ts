import {LexerToken, Scanner} from "./scanner";
export default class LexerReader {
    reader: Scanner;
    constructor(value: string);
    next(): LexerToken;
}
