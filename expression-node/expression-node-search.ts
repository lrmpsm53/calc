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
    const node = results.find(elem => elem);
    return node ?? null;
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
    if (expressionNode.index > startIndex) {
      if (!expressionNode.leftChild && Math.abs(expressionNode.index - startIndex) === offset) {
        return expressionNode;
      }
    }
    if (expressionNode.index < startIndex) {
      if (!expressionNode.rightChild && Math.abs(expressionNode.index - startIndex) === offset) {
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
