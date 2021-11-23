import { ExpressionNode } from './expression-node';
import { Operator } from '../operators/operator';
import { OperatorNode } from './operator-node';
import { SearchExpressionNodeByIndex } from './expression-node-search';

import { ExpressionTokens } from './expression-tokens';



export class OperatorsHierarchyFabric {
  private rootNode?: ExpressionNode;
  public constructor(private readonly expressionTokens: ExpressionTokens) {}
  public create(): ExpressionNode|undefined {
    for (const priorityLevel of this.expressionTokens.operatorsPriorityLevels) {
      for (let j = this.expressionTokens.operators.length - 1; j >= 0; j--) {
        const operatorMeta = this.getOperatorMeta(j);
        if (this.rootNode && operatorMeta.priority === priorityLevel) {
          this.setNode(j, priorityLevel);
        }
        if (!this.rootNode && operatorMeta.priority === priorityLevel) {
          this.rootNode = this.createOperatorNode(j);
        }
      }
    }
    return this.rootNode;
  }
  private findDeepestOperatorNodeWithOffset(startIndex: number, maxOffset: number): ExpressionNode|null {
    return this.rootNode?.findDeepestExpressionNodeWithOffset({ minOffset: 2, maxOffset, startIndex }) ?? null;
  }
  private getOperatorMeta(id: number): Operator {
    const tokenAndIndex = this.expressionTokens.getOperatorTokenById(id);
    return this.expressionTokens.defineOperator(tokenAndIndex);
  }
  private setNode(id: number, priorityLevel: number): void {
    const node = this.findOperatorNode(id);
    if (node) {
      const newNode = this.createOperatorNode(id);
      node.setChildInNode(newNode);
    } else {
      const neighbor = this.expressionTokens.findNeighborOnTheRight(id, priorityLevel);
      const node = this.findOperatorNodeByIndex(neighbor.index);
      node.leftChild = this.createOperatorNode(id);
    }
  }
  private findOperatorNode(id: number): ExpressionNode|null {
    const tokenIndex = this.expressionTokens.getOperatorTokenById(id).index;
    const operators = this.expressionTokens.operators;
    const maxOffset = operators[operators.length - 1]?.index as number;
    return this.findDeepestOperatorNodeWithOffset(tokenIndex, maxOffset);
  }
  private createOperatorNode(id: number): OperatorNode {
    const tokenAndIndex = this.expressionTokens.getOperatorTokenById(id);
    const operatorMeta = this.getOperatorMeta(id);
    return new OperatorNode(tokenAndIndex.index, operatorMeta);
  }
  private findOperatorNodeByIndex(index: number): ExpressionNode {
    if (!this.rootNode) {
      throw new OperatorsHierarchyError('No root');
    }
    const search = new SearchExpressionNodeByIndex(index);
    const result = search.search(this.rootNode);
    if (result) {
      return result;
    }
    throw new OperatorsHierarchyError(`Operator with index ${index} not found`);
  }
}

class OperatorsHierarchyError extends Error {}
