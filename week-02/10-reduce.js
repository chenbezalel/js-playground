// Week 2 – Session 4 (b): reduce
// Run one example: node week-02/10-reduce.js 1
//
// arr.reduce((acc, item) => newAcc, initialValue)
//   - acc ("accumulator"): the result so far
//   - every round, the callback gets acc + the next item,
//     and what it RETURNS becomes the next acc
//   - after the last item, reduce returns the final acc

const examples = {
  // Example 1 – trace every round
  1() {
    const calories = [300, 500, 200];

    const total = calories.reduce((acc, cal) => {
      console.log('acc:', acc, 'cal:', cal);
      return acc + cal;
    }, 0);

    console.log('total:', total);
  },

  // Example 2 – a forgotten return
  2() {
    const calories = [300, 500, 200];

    const total = calories.reduce((acc, cal) => {
      acc + cal;
    }, 0);

    console.log('total:', total);
  },

  // Example 3 – no initial value
  3() {
    const calories = [300, 500, 200];
    console.log(calories.reduce((acc, cal) => acc + cal));

    const empty = [];
    console.log(empty.reduce((acc, cal) => acc + cal, 0));
    console.log(empty.reduce((acc, cal) => acc + cal));
  },

  // Example 4 – reduce into an object
  4() {
    const meals = [
      { day: 'sun', calories: 300 },
      { day: 'mon', calories: 200 },
      { day: 'sun', calories: 500 },
    ];

    const perDay = meals.reduce((acc, meal) => {
      acc[meal.day] = (acc[meal.day] ?? 0) + meal.calories;
      return acc;
    }, {});

    console.log(perDay);
  },
};

const n = process.argv[2];
if (!examples[n]) {
  console.log('Usage: node week-02/10-reduce.js <1-4>');
} else {
  examples[n]();
}
