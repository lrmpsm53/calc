import { CharsForest } from './chars-forest-fabric';


export class ExpressionTokensForestFabric {
  public create(charsForest: CharsForest): AbstractExpressionToken[] {
    const fabric = new CharsForestParser();
    return fabric.parse(charsForest);
  }
}

class CharsForestParser {
  private operatorBuffer = '';
  private numberBuffer = '';
  private readonly output: AbstractExpressionToken[] = [];
  public parse(charsForest: CharsForest): AbstractExpressionToken[] {
    for (const elem of charsForest) {
      if (elem instanceof Array) {
        this.createNestForest(elem);
      } else {
        this.pushCharToBuffer(elem);
      }
    }
    this.pushNumberBuffer();
    return this.output;
  }
  private createNestForest(elem: CharsForest): void {
    this.pushOperatorBuffer();
    const nestForest = new CharsForestParser();
    this.output.push(new OperandToken(nestForest.parse(elem)));
  }
  private pushCharToBuffer(char: string): void {
    const elemIsOperatorChar = isNaN(Number(char)) && char !== '.';
    if (elemIsOperatorChar) {
      this.operatorBuffer += char;
      this.pushNumberBuffer();
    } else {
      this.numberBuffer += char;
      this.pushOperatorBuffer();
    }
  }
  private pushOperatorBuffer(): void {
    if (this.operatorBuffer) {
      this.output.push(new OperatorToken(this.operatorBuffer));
      this.operatorBuffer = '';
    }
  }
  private pushNumberBuffer(): void {
    if (this.numberBuffer) {
      this.output.push(new OperandToken(Number(this.numberBuffer)));
      this.numberBuffer = '';
    }
  }
}

export interface AbstractExpressionToken {
  readonly type: ExpressionTokenTypes;
  readonly value: unknown;
}

export enum ExpressionTokenTypes {
  operand = 'operand',
  operator = 'operator'
}

export class OperatorToken implements AbstractExpressionToken {
  public readonly type = ExpressionTokenTypes.operator;
  public constructor(public readonly value: string) {}
}

export class OperandToken implements AbstractExpressionToken {
  public readonly type = ExpressionTokenTypes.operand;
  public constructor(public readonly value: number|AbstractExpressionToken[]) {}
}
