import { CharsForestFabric } from './chars-forest-fabric';
import { ExpressionTokensForestFabric } from './expression-tokens-forest-fabric';
import { OperatorsManagement } from './operators/operators-management';
import { buildInOperators } from './operators/build-in-operators';
import { ExpressionTreeFabric } from './expression-tree';

export function calc(expression: string): number|undefined {
  const bracketsTreesFabric = new CharsForestFabric();
  const expressionTrees = new ExpressionTokensForestFabric();
  const chars = bracketsTreesFabric.create(expression);
  const tokens = expressionTrees.create(chars);
  const manager = new OperatorsManagement(buildInOperators);
  const fabric = new ExpressionTreeFabric(tokens, manager);
  return fabric.create()?.getValue();
}
