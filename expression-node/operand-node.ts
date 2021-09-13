import { ExpressionNode } from './expression-node';



export class OperandNode implements ExpressionNode {
  public constructor(
    public readonly index: number,
    private readonly value: number
  ) {}
  public getValue(): number {
    return this.value;
  }

}
