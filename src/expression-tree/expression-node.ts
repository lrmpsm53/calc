import { SearchOfDeepestExpressionNodeByOffset } from './expression-node-search';



export abstract class ExpressionNode {
  public leftChild?: ExpressionNode;
  public rightChild?: ExpressionNode;
  public abstract index: number;
  public setChildInNode(child: ExpressionNode): void {
    if (this.index < child.index) {
      this.rightChild = child;
    } else {
      this.leftChild = child;
    }
  }
  public findDeepestExpressionNodeWithOffset(params: SearchByOffsetRangeParams): ExpressionNode|null {
    for (let offset = params.minOffset; offset <= params.maxOffset; offset += 2) {
      const search = new SearchOfDeepestExpressionNodeByOffset({ offset, startIndex: params.startIndex });
      const result = search.search(this);
      if (result) {
        return result;
      }
    }
    return null;
  }
  public abstract getValue(): number;
}

export interface SearchByOffsetRangeParams {
  readonly minOffset: number;
  readonly maxOffset: number;
  readonly startIndex: number
}
