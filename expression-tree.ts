import { Operator } from './operators/operator';
import { AbstractExpressionToken, OperandToken, OperatorToken } from './expression-tokens-forest-fabric';
import { ExpressionNode } from './expression-node/expression-node';
import { OperatorNode } from './expression-node/operator-node';
import { OperatorsManagement } from './operators/operators-management';
import { SearchExpressionNodeByIndex, SearchOfDeepestExpressionNodeByOffset } from './expression-node/expression-node-search';
import { OperandNode } from './expression-node/operand-node';



export class ExpressionTreeFabric {
  private rootNode?: ExpressionNode;
  public constructor(
    private readonly expressionTokens: AbstractExpressionToken[],
    private readonly operatorsManagement: OperatorsManagement
  ) {}
  private static findOperatorNodeByIndex(rootNode: ExpressionNode, index: number): ExpressionNode {
    const search = new SearchExpressionNodeByIndex(index);
    const result = search.search(rootNode);
    if (result) {
      return result;
    }
    throw new ExpressionTreeError(`Operator with index ${index} not found`);
  }
  private static setChildInNode(node: ExpressionNode, child: ExpressionNode): void {
    if (node.index < child.index) {
      node.rightChild = child;
    } else {
      node.leftChild = child;
    }
  }
  public create(): ExpressionNode|undefined {
    this.createOperatorsHierarchy();
    this.setOperands();
    return this.rootNode;
  }
  private createOperatorsHierarchy(): void {
    const operatorsPriorityLevels = this.operatorsManagement.getOperatorsPriorityLevels();
    const operatorsAndTokens = this.extractTokens<OperatorToken>(token => token instanceof OperatorToken);
    for (const priorityLevel of operatorsPriorityLevels) {
      for (let j = operatorsAndTokens.length - 1; j >= 0; j--) {
        const tokenAndIndex = operatorsAndTokens[j] as OperatorTokenAndIndex;
        const operatorMeta = this.defineOperatorInExpression(tokenAndIndex);
        if (this.rootNode && operatorMeta.priority === priorityLevel) {
          const maxOffset = operatorsAndTokens[operatorsAndTokens.length - 1]?.index as number;
          const node = this.findDeepestOperatorNodeWithOffset(tokenAndIndex.index, maxOffset);
          if (node) {
            const newNode = new OperatorNode(tokenAndIndex.index, operatorMeta);
            ExpressionTreeFabric.setChildInNode(node, newNode);
          } else {
            const neighbor = this.findNeighborOnTheRight(j, priorityLevel, operatorsAndTokens);
            const node = ExpressionTreeFabric.findOperatorNodeByIndex(this.rootNode, neighbor.index);
            node.leftChild = new OperatorNode(tokenAndIndex.index, operatorMeta);
          }
        }
        if (!this.rootNode && operatorMeta.priority === priorityLevel) {
          this.rootNode = new OperatorNode(tokenAndIndex.index, operatorMeta);
        }
      }
    }
  }
  private defineOperatorInExpression({ token, index }: OperatorTokenAndIndex) {
    const operandsAmount = this.getOperandsAmount(index);
    return this.operatorsManagement.defineOperator(token.value, operandsAmount);
  }
  private getOperandsAmount(operatorIndex: number): number {
    const firstOperand = this.expressionTokens[operatorIndex - 1];
    const secondOperand = this.expressionTokens[operatorIndex + 1];
    return Number(Boolean(firstOperand)) + Number(Boolean(secondOperand));
  }
  private findDeepestOperatorNodeWithOffset(startIndex: number, maxOffset: number): ExpressionNode|null {
    return this.findDeepestExpressionNodeWithOffset({ minOffset: 2, maxOffset, startIndex });
  }
  private findNeighborOnTheRight(currentIndex: number, priority: number, operatorsWithIndexes: OperatorTokenAndIndex[]): OperatorAndIndex {
    for (let i = currentIndex + 1; i < operatorsWithIndexes.length; i++) {
      const operatorAndIndex = operatorsWithIndexes[i] as OperatorTokenAndIndex;
      const operatorMeta = this.defineOperatorInExpression(operatorAndIndex);
      if (operatorMeta.priority === priority) {
        return { operator: operatorMeta, index: operatorAndIndex.index };
      }
    }
    throw new ExpressionTreeError('Neighbor not found');
  }
  private setOperands(): void {
    const operandsAndIndexes = this.extractTokens<OperandToken>(token => token instanceof OperandToken);
    const maxIndex = operandsAndIndexes[operandsAndIndexes.length - 1]?.index as number;
    for (const operandWithIndex of operandsAndIndexes) {
      const newNode = this.createOperandNode(operandWithIndex);
      const node = this.findDeepestOperandNodeWithOffset(operandWithIndex.index, maxIndex);
      if (node) {
        newNode.index = operandWithIndex.index;
        ExpressionTreeFabric.setChildInNode(node, newNode);
      } else {
        this.rootNode = newNode;
      }
    }
  }
  private createOperandNode(operandWithIndex: OperandTokenAndIndex): ExpressionNode {
    const value = operandWithIndex.token.value;
    if (typeof value === 'number') {
      return new OperandNode(operandWithIndex.index, value);
    } else {
      return this.createNestFabric(value).create() as ExpressionNode;
    }
  }
  private extractTokens<T extends AbstractExpressionToken>(cb: (token: AbstractExpressionToken) => boolean): AbstractTokenAndIndex<T>[] {
    const extracted: AbstractTokenAndIndex<T>[] = [];
    for (const token of this.expressionTokens) {
      if (cb(token)) {
        const index = this.expressionTokens.indexOf(token);
        extracted.push({ token: token as T, index });
      }
    }
    return extracted;
  }
  private createNestFabric(expressionTokens: AbstractExpressionToken[]): ExpressionTreeFabric {
    return new ExpressionTreeFabric(expressionTokens, this.operatorsManagement);
  }
  private findDeepestOperandNodeWithOffset(startIndex: number, maxOffset: number): ExpressionNode|null {
    return this.findDeepestExpressionNodeWithOffset({ minOffset: 1, maxOffset, startIndex });
  }
  private findDeepestExpressionNodeWithOffset(params: SearchByOffsetParams): ExpressionNode|null {
    if (!this.rootNode) {
      return null;
    }
    for (let offset = params.minOffset; offset <= params.maxOffset; offset += 2) {
      const search = new SearchOfDeepestExpressionNodeByOffset({ offset, startIndex: params.startIndex });
      const result = search.search(this.rootNode);
      if (result) {
        return result;
      }
    }
    return null;
  }
}

interface SearchByOffsetParams {
  readonly minOffset: number;
  readonly maxOffset: number;
  readonly startIndex: number
}

type OperatorTokenAndIndex = { token: OperatorToken, index: number };
type OperandTokenAndIndex = { token: OperandToken, index: number };
type OperatorAndIndex = { operator: Operator, index: number };
type AbstractTokenAndIndex<T extends AbstractExpressionToken> = { token: T, index: number };

class ExpressionTreeError extends Error {}
