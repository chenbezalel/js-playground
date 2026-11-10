// Week 2 – Session 4 (a): Prototypes
// Run one example: node week-02/08-prototypes.js 1
//
// Every object has a hidden link to another object: its prototype.
// When you read a property:
//   1. JS looks on the object itself ("own property")
//   2. Not found → it looks on the prototype
//   3. Not found → the prototype's prototype ... until null → undefined
// This path is called the prototype chain.

const examples = {
  // Example 1 – reading through the chain
  1() {
    const animal = {
      eats: true,
      describe() {
        return `eats: ${this.eats}`;
      },
    };

    const rabbit = Object.create(animal); // rabbit's prototype = animal
    rabbit.jumps = true;

    console.log(rabbit.jumps);
    console.log(rabbit.eats);
    console.log(Object.keys(rabbit));
    console.log(rabbit.describe());
  },

  // Example 2 – writing to an object
  2() {
    const animal = { eats: true };
    const rabbit = Object.create(animal);

    rabbit.eats = false;

    console.log(rabbit.eats);
    console.log(animal.eats);

    const cat = Object.create(animal);
    console.log(cat.eats);
  },

  // Example 3 – shared methods (how JS worked before `class`)
  3() {
    function User(name) {
      this.name = name;
    }
    User.prototype.hello = function () {
      return `Hi, I am ${this.name}`;
    };

    const dana = new User('Dana');
    const noa = new User('Noa');

    console.log(dana.hello());
    console.log(dana.hello === noa.hello);
    console.log(Object.keys(dana));
    console.log(Object.getPrototypeOf(dana) === User.prototype);
  },

  // Example 4 – you already use prototypes every day
  4() {
    const nums = [3, 1, 2];

    console.log(Object.keys(nums));
    console.log(typeof nums.map);
    console.log(Object.getPrototypeOf(nums) === Array.prototype);
    console.log(nums.hasOwnProperty('map'));
  },
};

const n = process.argv[2];
if (!examples[n]) {
  console.log('Usage: node week-02/08-prototypes.js <1-4>');
} else {
  examples[n]();
}
