import { Operator } from './operator';



export class OperatorsManagement {
  public constructor(private readonly list: Operator[]) {}
  private static deleteRepeats<T>(arr: T[]): T[] {
    const output: T[] = [];
    for (const checking of arr) {
      if (output.find(elem => elem === checking) === undefined) {
        output.push(checking);
      }
    }
    return output;
  }
  public getOperatorsPriorityLevels(): number[] {
    const allLevels = this.list.map(({ priority }) => priority);
    const allLevelsWithoutRepeats = OperatorsManagement.deleteRepeats(allLevels);
    return allLevelsWithoutRepeats.sort();
  }
  public defineOperator(name: string, operandsAmount: number): Operator {
    const result = this.list.find(elem => elem.name === name && elem.arity === operandsAmount);
    if (result === undefined) {
      throw new Error();
    }
    return result;
  }
}
