export interface ExpressionNode {
  index: number;
  leftChild?: ExpressionNode;
  rightChild?: ExpressionNode;
  getValue(): number;
}
