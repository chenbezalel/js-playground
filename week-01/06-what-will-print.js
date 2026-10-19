// "What will print?" – week 1 review + event loop preview.
// Run one question at a time:  node week-01/06-what-will-print.js 2
// Guess first, then run. The answer is in the comment under each question.

const questions = {
  // Q1 – Hoisting: function expression vs function declaration
  1() {
    console.log(typeof greet);
    console.log(typeof hello);

    var greet = function () {};
    function hello() {}
  },
  // Answer: undefined, function
  // var greet is hoisted as undefined. The function is assigned only when that line runs.
  // function hello is hoisted fully (with its body).

  // Q2 – Loop: where is i declared?
  2() {
    let i;
    for (i = 0; i < 3; i++) {
      setTimeout(() => console.log(i));
    }
  },
  // Answer: 3 3 3
  // let gives a new i each round ONLY when declared inside for ( ... ).
  // Here there is ONE i, outside the loop. Callbacks run after the loop ends.

  // Q3 – Closure + reference
  3() {
    function makeCounter() {
      let count = 0;
      return {
        inc: () => ++count,
        get: () => count,
      };
    }

    const a = makeCounter();
    const b = a;
    a.inc();
    b.inc();
    console.log(a.get());
  },
  // Answer: 2
  // makeCounter() ran once → one closure, one count.
  // b = a copies the reference: same object.

  // Q4 – this inside a regular callback
  4() {
    const timer = {
      label: 'Lunch',
      start() {
        setTimeout(function () {
          console.log(this.label);
        });
      },
    };

    timer.start();
  },
  // Answer: undefined
  // setTimeout calls the regular function, not timer → it has its own this.
  // Fix: use an arrow function, it takes this from start().

  // Q5 – const: mutation vs reassignment
  5() {
    const meals = ['Eggs'];
    meals.push('Pasta');
    console.log(meals.length);

    meals = [];
    console.log(meals.length);
  },
  // Answer: 2, then TypeError: Assignment to constant variable.
  // const blocks reassignment, not changes to the content.

  // Q6 – Preview of week 2: the event loop
  6() {
    console.log('A');

    setTimeout(() => console.log('B'), 0);

    Promise.resolve().then(() => console.log('C'));

    console.log('D');
  },
  // Answer: A D C B
  // 1. Synchronous code first: A, D
  // 2. Then ALL microtasks (promises): C
  // 3. Then one task from the task queue (setTimeout): B
};

const n = process.argv[2];
if (!questions[n]) {
  console.log('Usage: node week-01/06-what-will-print.js <1-6>');
} else {
  questions[n]();
}
