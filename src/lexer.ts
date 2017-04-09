import {Scanner} from "./scanner";

export default class LexerReader {
  reader: Scanner;

  constructor(value: string) {
    this.reader = new Scanner(value);
  }

  next(): LexerToken {
    return this.reader.next();
  }
}