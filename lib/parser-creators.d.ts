import {Expression, Literal, ObjectProperties} from "./expressions";

export declare const Constants: {
  literalNull: Literal;
  literalTrue: Literal;
  literalFalse: Literal;
  literalUndefined: Literal;
};
export declare const Creators: {
  createConcatenate: (set: Expression[]) => Expression;
  createLiteralString: (value: string) => Expression;
  createLiteralNumber: (value: string) => Expression;
  createMemberCallExpression: (lhs: Expression, expr: Expression, args: Expression[]) => Expression;
  createMemberAccessorExpression: (lhs: Expression, rhs: Expression, computed: boolean) => Expression;
  createCallExpression: (lhs: Expression, args: Expression[]) => Expression;
  createConstExpression: (keyword: string) => Expression;
  createUnaryExpression: (op: string, expr: Expression) => Expression;
  createObjectExpression: (properties: ObjectProperties) => Expression;
  createArrayExpression: (rc: Expression[]) => Expression;
  createConditionalExpression: (test: Expression, trueCondition: Expression, falseCondition: Expression) => Expression;
  createScopedAccessorExpression: (name: string) => Expression;
  getOperatorFactory: (name: string) => ExpressionFactory;
};
export interface ExpressionFactory {
  precedence: number;

  create(left: Expression, right: Expression): Expression;
}
