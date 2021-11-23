import { ExpressionNode } from './expression-node';



class ExpressionNodeSearch {
  public search(expressionNode: ExpressionNode): ExpressionNode|null {
    const results: (ExpressionNode|null)[] = [];
    if (this.onIteration) {
      results.push(this.onIteration(expressionNode));
    }
    const { leftChild, rightChild } = expressionNode;
    if (leftChild) {
      results.push(this.search(leftChild));
    }
    if (rightChild) {
      results.push(this.search(rightChild));
    }
    return results.find(elem => elem) ?? null;
  }
  protected onIteration?(expressionNode: ExpressionNode): ExpressionNode|null;
}

export class SearchExpressionNodeByIndex extends ExpressionNodeSearch {
  public constructor(private readonly index: number) {
    super();
  }
  protected override onIteration(expressionNode: ExpressionNode): ExpressionNode|null {
    return expressionNode.index === this.index ? expressionNode : null;
  }
}

export class SearchOfDeepestExpressionNodeByOffset extends ExpressionNodeSearch {
  public constructor(private readonly params: SearchByOffsetParams) {
    super();
  }
  protected override onIteration(expressionNode: ExpressionNode): ExpressionNode|null {
    const { startIndex, offset } = this.params;
    const currentOffset = Math.abs(expressionNode.index - startIndex);
    if (currentOffset === offset) {
      if (expressionNode.index > startIndex && !expressionNode.leftChild) {
        return expressionNode;
      }
      if (expressionNode.index < startIndex && !expressionNode.rightChild) {
        return expressionNode;
      }
    }
    return null;
  }
}

export interface SearchByOffsetParams {
  readonly offset: number;
  readonly startIndex: number;
}
