export declare class Compiler {
  visitor: Visitor<Instruction>;

  compile(ast: Expression): Instruction;
}
