// Closure: a function remembers the variables of the place where it was created,
// even after that outer function has finished running.

function makeCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

const c1 = makeCounter();
const c2 = makeCounter();
console.log(c1(), c1(), c2()); // 1 2 1  (each counter has its own "box")

function createGreeting(greeting) {
  return function (name) {
    return greeting + ", " + name;
  };
}

const hi = createGreeting("Hi");
const hello = createGreeting("Hello");
console.log(hi("Dana")); // "Hi, Dana"
console.log(hello("Noa")); // "Hello, Noa"
