export interface Operator {
  readonly name: string;
  readonly arity: number;
  readonly priority: number;
  readonly calculate: (a: number, ...b: number[]) => number;
}
