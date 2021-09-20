import { Operator } from './operator';

export const buildInOperators: Operator[] = [
  {
    name: '+',
    arity: 2,
    priority: 1,
    calculate: (a, b) => a + b
  },
  {
    name: '-',
    arity: 2,
    priority: 1,
    calculate: (a, b) => a - b
  },
  {
    name: '-',
    arity: 1,
    priority: 2,
    calculate: (a) => -a
  },
  {
    name: '*',
    arity: 2,
    priority: 2,
    calculate: (a, b) => a * b
  },
  {
    name: '/',
    priority: 2,
    arity: 2,

    calculate: (a, b) => a / b
  },
  {
    name: '^',
    arity: 2,
    priority: 3,
    calculate: (a, b) => Math.pow(a, b)
  },
  {
    name: 'sin',
    arity: 1,
    priority: 4,
    calculate: (a) => Math.sin(a)
  },
  {
    name: 'cos',
    arity: 1,
    priority: 4,
    calculate: (a) => Math.sin(a)
  },
  {
    name: 'or',
    arity: 2,
    priority: 1,
    calculate: (a, b) => a || b
  },
  {
    name: 'and',
    arity: 2,
    priority: 2,
    calculate: (a, b) => a && b
  },
  {
    name: 'not',
    arity: 1,
    priority: 2,
    calculate: (a) => Number(!a)
  },
];
