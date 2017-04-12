export interface Expression {
    visit<T>(visit: Visitor<T>): T;
}
export interface Visitor<T> {
    visitBinary(operator: string, left: Expression, right: Expression): T;
    visitLogical(operator: string, left: Expression, right: Expression): T;
    visitLiteral(value: any, raw: string): T;
    visitScopedAccessor(name: string): T;
    visitMember(object: Expression, property: Expression, computed: boolean): T;
    visitMemberCall(object: Expression, expression: Expression, args: Expression[]): T;
    visitCall(callee: Expression, args: Expression[]): T;
    visitConditional(test: Expression, consequent: Expression, alternate: Expression): T;
    visitUnary(operator: string, argument: Expression): T;
    visitArray(elements: Expression[]): T;
    visitObject(propertyNames: Array<string>, expressions: Expression[]): T;
}
export interface ObjectProperties {
    names: string[];
    expressions: Array<Expression>;
}
export declare class Literal implements Expression {
    private raw;
    private value;
    constructor(raw: string, value: any);
    visit<T>(visitor: Visitor<T>): T;
}
export declare class LiteralString implements Expression {
    private raw;
    constructor(raw: string);
    visit<T>(visitor: Visitor<T>): T;
}
export declare class LiteralNumber implements Expression {
    private value;
    constructor(value: number);
    visit<T>(visitor: Visitor<T>): T;
}
export declare class ScopedAccessorExpression implements Expression {
    private name;
    constructor(name: string);
    visit<T>(visitor: Visitor<T>): T;
}
export declare class MemberAccessorExpression implements Expression {
    private object;
    private property;
    private computed;
    constructor(object: Expression, property: Expression, computed: boolean);
    visit<T>(visitor: Visitor<T>): T;
}
export declare class MemberCallExpression implements Expression {
    private object;
    private member;
    private args;
    constructor(object: Expression, member: Expression, args: Expression[]);
    visit<T>(visitor: Visitor<T>): T;
}
export declare class ConditionalExpression implements Expression {
    private test;
    private consequent;
    private alternate;
    constructor(test: Expression, consequent: Expression, alternate: Expression);
    visit<T>(visitor: Visitor<T>): T;
}
export declare class UnaryExpression implements Expression {
    private unaryType;
    private argument;
    constructor(unaryType: string, argument: Expression);
    visit<T>(visitor: Visitor<T>): T;
}
export declare class CallExpression implements Expression {
    private callee;
    private args;
    constructor(callee: Expression, args: Array<Expression>);
    visit<T>(visitor: Visitor<T>): T;
}
export declare class ArrayExpression implements Expression {
    private elements;
    constructor(elements: Array<Expression>);
    visit<T>(visitor: Visitor<T>): T;
}
export declare class ObjectExpression implements Expression {
    private propertyNames;
    private expressions;
    constructor(propertyNames: Array<string>, expressions: Array<Expression>);
    visit<T>(visitor: Visitor<T>): T;
}
export declare class BinaryExpression implements Expression {
    private operator;
    private left;
    private right;
    constructor(operator: string, left: Expression, right: Expression);
    visit<T>(visitor: Visitor<T>): T;
}
export declare class LogicalExpression implements Expression {
    private operator;
    private left;
    private right;
    constructor(operator: string, left: Expression, right: Expression);
    visit<T>(visitor: Visitor<T>): T;
}
