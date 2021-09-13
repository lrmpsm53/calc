export class CharsForestFabric {
  public create(expression: string): CharsForest {
    const recursiveParser = new ExpressionParser(expression);
    return recursiveParser.parse().trees;
  }
}

export type CharsForest = (string|CharsForest)[];

class ExpressionParser {
  protected levelIsOpen = true;
  private readonly bracketsTrees: CharsForest = [];
  private charsBuffer: string[] = [];
  private charIndex = 0;
  public constructor(private readonly expression: string) {}

  public parse(): BracketsForestWithParsingStopIndex {
    while (this.charIndex < this.expression.length && this.levelIsOpen) {
      const char = this.expression[this.charIndex] as string;
      this.processChar(char);
    }
    this.pushChartsBuffer();
    return this.createBracketsTreesWithParsingStopIndex();
  }
  private processChar(char: string): void {
    const charIsBracket = char === Brackets.left || char === Brackets.right;
    if (!charIsBracket) {
      this.charsBuffer.push(char);
    }
    if (charIsBracket && this.charsBuffer.length > 0) {
      this.pushChartsBuffer();
    }
    if (char === Brackets.left) {
      this.createNewTreeLevel();
    }
    if (char === Brackets.right) {
      this.levelIsOpen = false;
    }
    if (this.levelIsOpen) {
      this.charIndex++;
    }
  }
  private createNewTreeLevel(): void {
    const subExpression = this.expression.substring(this.charIndex + 1);
    const nestedFabric = new NestedExpressionParser(subExpression);
    const { trees, stopIndex } = nestedFabric.parse();
    this.charIndex += stopIndex + 1;
    this.bracketsTrees.push(trees);
  }
  private createBracketsTreesWithParsingStopIndex(): BracketsForestWithParsingStopIndex {
    return {
      trees: this.bracketsTrees,
      stopIndex: this.charIndex
    };
  }
  private pushChartsBuffer(): void {
    this.bracketsTrees.push(...this.charsBuffer);
    this.charsBuffer = [];
  }
}

interface BracketsForestWithParsingStopIndex {
  trees: CharsForest;
  stopIndex: number;
}

enum Brackets {
  left = '(',
  right = ')'
}

class NestedExpressionParser extends ExpressionParser {
  public override parse(): BracketsForestWithParsingStopIndex {
    const result = super.parse();
    if (this.levelIsOpen) {
      throw new NotFoundPairForBracketError();
    }
    return result;
  }
}

class NotFoundPairForBracketError extends Error {}
