import {LexerToken, Scanner} from "./scanner";

export default class LexerReader {
  reader: Scanner;

  constructor(value: string) {
    this.reader = new Scanner(value);
  }

  setPos(pos: number): void {
    this.reader.setPos(pos);
  }

  next(): LexerToken {
    return this.reader.next();
  }
}