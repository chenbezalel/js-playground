// Week 2 – Session 2, part 1: Promises
// Run one example: node week-02/02-promises.js 1
//
// A promise = an object for a value that will arrive LATER.
// It has 3 states:
//   pending   → still waiting
//   fulfilled → finished with a value   (resolve)
//   rejected  → finished with an error  (reject)
// Once fulfilled or rejected, it never changes again ("settled").

// A fake server: returns the meals after 500 ms, or fails.
function getMeals(day) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (day === 'monday') {
        resolve([{ name: 'Oatmeal', calories: 300 }, { name: 'Salad', calories: 450 }]);
      } else {
        reject(new Error(`No meals for ${day}`));
      }
    }, 500);
  });
}

const examples = {
  // Example 1 – then gets the value, catch gets the error
  1() {
    const promise = getMeals('monday');
    console.log(promise); // Promise { <pending> } – the value is not here yet

    promise
      .then((meals) => console.log('Got', meals.length, 'meals'))
      .catch((error) => console.log('Error:', error.message))
      .finally(() => console.log('Done (runs in both cases)'));
  },
  // Output: Promise { <pending> }, Got 2 meals, Done (runs in both cases)

  // Example 2 – the same, but it fails
  2() {
    getMeals('sunday')
      .then((meals) => console.log('Got', meals.length, 'meals')) // skipped
      .catch((error) => console.log('Error:', error.message))
      .finally(() => console.log('Done'));
  },
  // Output: Error: No meals for sunday, Done

  // Example 3 – a chain: what you RETURN goes to the next then
  3() {
    getMeals('monday')
      .then((meals) => meals.map((meal) => meal.calories)) // returns [300, 450]
      .then((calories) => calories.reduce((sum, c) => sum + c, 0)) // returns 750
      .then((total) => console.log('Total:', total));
  },
  // Output: Total: 750

  // Example 4 – forgot to return → the next then gets undefined
  4() {
    getMeals('monday')
      .then((meals) => {
        meals.map((meal) => meal.calories); // no return!
      })
      .then((calories) => console.log('Calories:', calories));
  },
  // Output: Calories: undefined
  // With { } in an arrow function you must write return yourself.

  // Example 5 – an error in the middle skips all thens until catch
  5() {
    getMeals('monday')
      .then((meals) => {
        throw new Error('Something broke');
      })
      .then(() => console.log('Step 2')) // skipped
      .then(() => console.log('Step 3')) // skipped
      .catch((error) => console.log('Caught:', error.message))
      .then(() => console.log('After catch – the chain continues'));
  },
  // Output: Caught: Something broke, After catch – the chain continues
};

const n = process.argv[2];
if (!examples[n]) {
  console.log('Usage: node week-02/02-promises.js <1-5>');
} else {
  examples[n]();
}
