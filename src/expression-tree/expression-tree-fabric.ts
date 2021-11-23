import { OperatorsManagement } from '../operators/operators-management';
import { AbstractExpressionToken } from '../chars-forests/expression-tokens-forest-fabric';

import { ExpressionNode } from './expression-node';
import { ExpressionTokens } from './expression-tokens';
import { OperatorsHierarchyFabric } from './operators-hierarchy-fabric';
import { ExpressionTreeLeavesFabric } from './expression-tree-leaves-fabric';



export class ExpressionTreeFabric {
  public constructor(private readonly operatorsManagement: OperatorsManagement) {}
  public create(values: AbstractExpressionToken[]): ExpressionNode|undefined {
    const expressionTokens = new ExpressionTokens(values, this.operatorsManagement);
    const operatorsHierarchy = new OperatorsHierarchyFabric(expressionTokens).create();
    return new ExpressionTreeLeavesFabric(expressionTokens, this, operatorsHierarchy).setLeaves();
  }
}
