import { Operator } from '../operators/operator';

import { ExpressionNode } from './expression-node';



export class OperatorNode implements ExpressionNode {
  public leftChild?: ExpressionNode;
  public rightChild?: ExpressionNode;
  public constructor(
    public readonly index: number,
    public readonly operator: Operator
  ) {}
  public getValue(): number {
    const operandsValues = this.getOperandValues();
    return this.operator.calculate(...operandsValues);
  }
  private getOperandValues(): [number, ...number[]] {
    if (this.rightChild === undefined) {
      throw new Error();
    }
    const leftChildValue = this.leftChild?.getValue();
    const rightChildValue = this.rightChild.getValue();
    return leftChildValue === undefined ? [rightChildValue] : [leftChildValue, rightChildValue];
  }
}
