import { ExpressionNode } from './expression-node';



export class OperandNode extends ExpressionNode {
  public constructor(
    public readonly index: number,
    private readonly value: number
  ) {
    super();
  }
  public getValue(): number {
    return this.value;
  }
}
