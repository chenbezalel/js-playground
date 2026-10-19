// Practice: code review of AI-generated code.
// Step 1: read the code and write your review (do NOT run it yet).
// Step 2: run it and compare: node week-01/05-ai-code-review.js

/*
  The prompt we gave the AI:

  Goal: Write summarizeDay(meals) for the nutrition diary.
        Return the total calories and the name of the meal with the most calories.

  Context: meals is an array of { name, calories }.
           Some meals have no calories (the user didn't fill it in).
           Plain JavaScript, Node.

  Constraints: No libraries. Do not change the meals array
               (it is also shown on the screen in its original order).

  Done when:
  - total is a number
  - meals without calories are ignored
  - an empty day returns { total: 0, top: null }
  - the original order of meals stays the same
*/

// ---- The AI's answer: "Here is a clean solution that handles all cases." ----

function summarizeDay(meals) {
  
  const mealsWithCalories = meals.filter(meals => !!meals.calories);

  if (!mealsWithCalories.length) return;

  mealsWithCalories.sort((a, b) => b.calories - a.calories);

  let total = 0;
  for (const meal of mealsWithCalories) {
    total += meal.calories;
  }

  return { total, top: mealsWithCalories[0].name };
}

// ---- Try it ----

const monday = [
  { name: 'Oatmeal', calories: 300 },
  { name: 'Salad', calories: 450 },
  { name: 'Yogurt', calories: 150 },
];
console.log('Monday:', summarizeDay(monday));
console.log('Monday order after:', monday.map(m => m.name));

const tuesday = [
  { name: 'Eggs', calories: 200 },
  { name: 'Coffee' },
  { name: 'Pasta', calories: 600 },
];
console.log('Tuesday:', summarizeDay(tuesday));

const wednesday = [];
console.log('Wednesday:', summarizeDay(wednesday));

const thursday = [{ name: 'Water' }, { name: 'Tea' }];
console.log('Thursday:', summarizeDay(thursday));
