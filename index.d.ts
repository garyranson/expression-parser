declare class LexerToken {
  public readonly value: string;
  public readonly type: string;

  constructor(type: string, value: string, start: number, end: number);
}

interface Expression {
  visit<T>(visit: Visitor<T>): T;
}

interface Visitor<T> {
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