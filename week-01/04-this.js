"use strict";
// Regular function: `this` depends on HOW it is called (what is left of the dot).
// Arrow function: no own `this`; it takes `this` from WHERE it was written.
// Object braces { } are NOT a scope.

const user = {
  name: "Noa",
  regular() {
    console.log("regular:", this?.name);
  },
  arrow: () => {
    console.log("arrow:", this?.name); // `this` comes from the module, not from user
  },
  greet() {
    setTimeout(function () {
      console.log("greet:", this?.name); // called by setTimeout -> `this` is lost
    }, 0);
  },
  greet2() {
    setTimeout(() => {
      console.log("greet2:", this.name); // arrow written inside greet2 -> this = user
    }, 0);
  },
};

user.regular(); // Noa
user.arrow(); // undefined
const fn = user.regular;
fn(); // undefined (nothing left of the dot)
user.greet(); // undefined
user.greet2(); // Noa
