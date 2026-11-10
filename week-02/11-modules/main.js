// Week 2 – Session 4 (b): ES modules – the module that imports
// Run: node week-02/11-modules/main.js
//
// package.json in this folder has "type": "module",
// so Node reads these .js files as ES modules (import / export).

console.log('main.js start');

import myFormat, { totalCalories, DAILY_GOAL } from './meals.js';
import { totalCalories as sum } from './meals.js';

const meals = [
  { name: 'egg', calories: 150 },
  { name: 'pasta', calories: 600 },
];

console.log(myFormat(meals[0]));
console.log(totalCalories(meals), sum(meals), DAILY_GOAL);
console.log(typeof secret);
