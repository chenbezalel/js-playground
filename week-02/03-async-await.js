// Week 2 – Session 2, part 2: async / await
// Run one example: node week-02/03-async-await.js 1
//
// async / await = a nicer way to write the SAME promises.
//   async function → always returns a promise
//   await promise  → pauses THIS function until the promise settles,
//                    then gives you the value (or throws the error)
// While the function is paused, the rest of the program keeps running.

// The same fake server from 02-promises.js
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
  // Example 1 – the chain from 02-promises.js example 3, with await
  async 1() {
    const meals = await getMeals('monday');
    const calories = meals.map((meal) => meal.calories);
    const total = calories.reduce((sum, c) => sum + c, 0);
    console.log('Total:', total);
  },
  // Output: Total: 750
  // Reads top to bottom, like sync code. No then, no chain.

  // Example 2 – await does not block the whole program
  async 2() {
    console.log('A');
    const load = async () => {
      console.log('B');
      const meals = await getMeals('monday'); // pauses only load()
      console.log('C', meals.length);
    };
    load();
    console.log('D');
  },
  // Output: A, B, D, C 2

  // Example 3 – an async function ALWAYS returns a promise
  async 3() {
    const getTotal = async () => {
      return 750;
    };
    const result = getTotal();
    console.log(result); // Promise { 750 } – not 750!
    console.log(await result); // 750
  },
  // Output: Promise { 750 }, 750

  // Example 4 – error handling with try / catch / finally
  async 4() {
    try {
      const meals = await getMeals('sunday'); // rejects → throws here
      console.log('Got', meals.length, 'meals'); // skipped
    } catch (error) {
      console.log('Error:', error.message);
    } finally {
      console.log('Done');
    }
  },
  // Output: Error: No meals for sunday, Done

  // Example 5 – await that rejects WITHOUT try/catch
  async 5() {
    const meals = await getMeals('sunday'); // throws, nobody catches it
    console.log('Got', meals.length, 'meals'); // never runs
  },
  // Output: Node crashes with "Error: No meals for sunday"
  // (an "unhandled rejection"). In the browser: a red error in the console.
};

const n = process.argv[2];
if (!examples[n]) {
  console.log('Usage: node week-02/03-async-await.js <1-5>');
} else {
  examples[n]();
}
