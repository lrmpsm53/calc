import { OperatorsManagement } from '../operators/operators-management';
import { Operator } from '../operators/operator';
import { AbstractExpressionToken, OperandToken, OperatorToken } from '../chars-forests/expression-tokens-forest-fabric';



export class ExpressionTokens {
  public readonly operators: OperatorTokenAndIndex[];
  public readonly operands: OperandTokenAndIndex[];
  public readonly operatorsPriorityLevels: number[];
  public constructor(
    private readonly values: AbstractExpressionToken[],
    private readonly operatorsManagement: OperatorsManagement
  ) {
    this.operators = this.extractTokens<OperatorToken>(token => token instanceof OperatorToken);
    this.operands = this.extractTokens<OperandToken>(token => token instanceof OperandToken);
    this.operatorsPriorityLevels = this.operatorsManagement.getOperatorsPriorityLevels();
  }
  public getOperandMaxId(): number {
    const length = this.operands.length;
    return length > 1 ? length - 1 : length;
  }
  public defineOperator({token, index}: OperatorTokenAndIndex): Operator {
    const operandsAmount = this.getOperandsAmount(index);
    return this.operatorsManagement.defineOperator(token.value, operandsAmount);
  }
  public findNeighborOnTheRight(currentIndex: number, priority: number): OperatorAndIndex {
    for (let i = currentIndex + 1; i < this.operators.length; i++) {
      const operatorAndIndex = this.operators[i] as OperatorTokenAndIndex;
      const operatorMeta = this.defineOperator(operatorAndIndex);
      if (operatorMeta.priority === priority) {
        return {operator: operatorMeta, index: operatorAndIndex.index};
      }
    }
    throw new ExpressionTreeError('Neighbor not found');
  }

  public getOperatorTokenById(id: number): OperatorTokenAndIndex {
    return this.operators[id] as OperatorTokenAndIndex;
  }
  private extractTokens<T extends AbstractExpressionToken>(cb: (token: AbstractExpressionToken) => boolean): AbstractTokenAndIndex<T>[] {
    const extracted: AbstractTokenAndIndex<T>[] = [];
    for (const token of this.values) {
      if (cb(token)) {
        const index = this.values.indexOf(token);
        extracted.push({ token: token as T, index });
      }
    }
    return extracted;
  }
  private getOperandsAmount(operatorIndex: number): number {
    const firstOperand = this.values[operatorIndex - 1];
    const secondOperand = this.values[operatorIndex + 1];
    return Number(Boolean(firstOperand)) + Number(Boolean(secondOperand));
  }
}


export type OperatorTokenAndIndex = { token: OperatorToken, index: number };
export type OperandTokenAndIndex = { token: OperandToken, index: number };
export type OperatorAndIndex = { operator: Operator, index: number };
export type AbstractTokenAndIndex<T extends AbstractExpressionToken> = { token: T, index: number };

class ExpressionTreeError extends Error {}
