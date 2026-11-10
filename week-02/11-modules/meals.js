// Week 2 – Session 4 (b): ES modules – the module that exports
// Variables here are private to this file, unless we export them.

console.log('meals.js loaded');

const secret = 'only inside meals.js';

export const DAILY_GOAL = 2000; // named export

export function totalCalories(meals) { // named export
  return meals.reduce((acc, meal) => acc + meal.calories, 0);
}

export default function formatMeal(meal) { // default export (only one per file)
  return `${meal.name}: ${meal.calories} kcal`;
}
