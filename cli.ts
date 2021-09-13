import { ListQuestion, prompt, Question } from 'inquirer';

import { calc } from './calc';



export async function main(): Promise<void> {
  let continueCalc = true;
  while (continueCalc) {
    console.clear();
    const {expression} = await prompt([ expressionQuestion ]);
    const result = calc(expression);
    console.log(`${expression}=${result}`);
    continueCalc = (await prompt([ continueQuestion ]))['continueCalc'];
  }
}

const expressionQuestion: Question = {
  type: 'input',
  name: 'expression',
  message: 'Введите выражение'
};

const continueQuestion: ListQuestion = {
  type: 'list',
  name: 'continueCalc',
  message: 'Продолжить?',
  choices: [
    { name: 'Да', value: true },
    { name: 'Нет', value: false }
  ]
};
