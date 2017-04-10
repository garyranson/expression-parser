import { Expression, Literal } from "./expressions";
export default class Parser {
    parseExpression(input: string): Expression;
}
export declare const Constants: {
    literalNull: Literal;
    literalTrue: Literal;
    literalFalse: Literal;
    literalUndefined: Literal;
};
