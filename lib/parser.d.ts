import { Expression } from "./expressions";
export declare class Parser {
    parseExpression(input: string): Expression;
    parseExpressions(input: string): Expression[];
    parseContent(input: string): Expression;
}
