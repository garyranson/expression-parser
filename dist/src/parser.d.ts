import { Literal, Expression } from "./expressions";
export declare class Parser {
    parseExpression(input: string): Expression;
}
export declare const Constants: {
    literalNull: Literal;
    literalTrue: Literal;
    literalFalse: Literal;
    literalUndefined: Literal;
};
