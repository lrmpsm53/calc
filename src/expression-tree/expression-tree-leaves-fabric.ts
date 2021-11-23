import { AbstractExpressionToken, OperandToken } from '../chars-forests/expression-tokens-forest-fabric';

import { ExpressionTokens } from './expression-tokens';
import { ExpressionNode } from './expression-node';
import { OperandNode } from './operand-node';
import { ExpressionTreeFabric } from './expression-tree-fabric';



export class ExpressionTreeLeavesFabric {
  public constructor(
    private readonly expressionTokens: ExpressionTokens,
    private readonly expressionTreeFabric: ExpressionTreeFabric,
    private readonly rootNode?: ExpressionNode
  ) {}
  public setLeaves(): ExpressionNode|undefined {
    const maxIndex = this.expressionTokens.getOperandMaxId();
    const operands = this.expressionTokens.operands;
    for (const operandWithIndex of operands) {
      const newNode = this.createOperandNode(operandWithIndex);
      const node = this.findDeepestOperandNodeWithOffset(operandWithIndex.index, maxIndex);
      if (node) {
        newNode.index = operandWithIndex.index;
        node.setChildInNode(newNode);
      } else {
        return newNode;
      }
    }
    return this.rootNode;
  }
  private createOperandNode(operandWithIndex: OperandTokenAndIndex): ExpressionNode {
    const value = operandWithIndex.token.value;

    if (typeof value === 'number') {
      return new OperandNode(operandWithIndex.index, value);
    } else {
      return this.createNestFabric(value) as ExpressionNode;
    }
  }
  private createNestFabric(values: AbstractExpressionToken[]): ExpressionNode {
    return this.expressionTreeFabric.create(values) as ExpressionNode;
  }
  private findDeepestOperandNodeWithOffset(startIndex: number, maxOffset: number): ExpressionNode|null {
    return this.rootNode?.findDeepestExpressionNodeWithOffset({ minOffset: 1, maxOffset, startIndex }) ?? null;
  }
}

type OperandTokenAndIndex = { token: OperandToken, index: number };
