import { CharsForestFabric } from './chars-forests/chars-forest-fabric';
import { ExpressionTokensForestFabric } from './chars-forests/expression-tokens-forest-fabric';
import { OperatorsManagement } from './operators/operators-management';
import { buildInOperators } from './operators/build-in-operators';
import { ExpressionTreeFabric } from './expression-tree/expression-tree-fabric';



export function calc(expression: string): number|undefined {
  const charsForestFabric = new CharsForestFabric();
  const expressionTokensForestFabric = new ExpressionTokensForestFabric();
  const chars = charsForestFabric.create(expression);
  const tokens = expressionTokensForestFabric.create(chars);
  const operators = new OperatorsManagement(buildInOperators);
  const fabric = new ExpressionTreeFabric(operators);
  const result = fabric.create(tokens)?.getValue();
  if (result === (Infinity || -Infinity || NaN)) {
    throw new CalcError();
  }
  return result;
}

class CalcError extends Error {}
