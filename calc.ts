import { CharsForestFabric } from './fabrics/chars-forest-fabric';
import { ExpressionTokensForestFabric } from './fabrics/expression-tokens-forest-fabric';
import { OperatorsManagement } from './operators/operators-management';
import { buildInOperators } from './operators/build-in-operators';
import { ExpressionTreeFabric } from './fabrics/expression-tree-fabric';

export function calc(expression: string): number|undefined {
  const bracketsTreesFabric = new CharsForestFabric();
  const expressionTrees = new ExpressionTokensForestFabric();
  const chars = bracketsTreesFabric.create(expression);
  const tokens = expressionTrees.create(chars);
  const manager = new OperatorsManagement(buildInOperators);
  const fabric = new ExpressionTreeFabric(tokens, manager);
  const result = fabric.create()?.getValue();
  if (result === (Infinity || -Infinity || NaN)) {
    throw new CalcError();
  }
  return result;
}

class CalcError extends Error {}
