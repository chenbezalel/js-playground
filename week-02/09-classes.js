// Week 2 – Session 4 (a): Classes
// Run one example: node week-02/09-classes.js 1
//
// `class` is syntactic sugar over prototypes:
//   - constructor      → the body of the old `function User(name)`
//   - regular methods  → go on User.prototype (the shared bag)
//   - extends          → links Dog.prototype to Animal.prototype
//   - super(...)       → calls the parent's constructor / method

const examples = {
  // Example 1 – a class is still prototypes
  1() {
    class User {
      constructor(name) {
        this.name = name;
      }
      hello() {
        return `Hi, I am ${this.name}`;
      }
    }

    const dana = new User('Dana');
    const noa = new User('Noa');

    console.log(typeof User);
    console.log(dana.hello === noa.hello);
    console.log(Object.keys(dana));
    console.log(dana.hasOwnProperty('hello'));
  },

  // Example 2 – extends and super
  2() {
    class Animal {
      constructor(name) {
        this.name = name;
      }
      speak() {
        return `${this.name} makes a sound`;
      }
    }

    class Dog extends Animal {
      constructor(name, breed) {
        super(name);
        this.breed = breed;
      }
      speak() {
        return `${super.speak()}: woof`;
      }
    }

    const rex = new Dog('Rex', 'poodle');

    console.log(rex.speak());
    console.log(Object.keys(rex));
    console.log(rex instanceof Dog, rex instanceof Animal);
  },

  // Example 3 – a method passed as a callback
  3() {
    class Counter {
      constructor() {
        this.count = 0;
      }
      increment() {
        this.count += 1;
        console.log('count:', this.count);
      }
    }

    const c = new Counter();
    c.increment();

    const onClick = c.increment;
    onClick();
  },

  // Example 4 – an arrow function as a class field
  4() {
    class Counter {
      count = 0;
      increment = () => {
        this.count += 1;
        console.log('count:', this.count);
      };
    }

    const a = new Counter();
    const b = new Counter();

    const onClick = a.increment;
    onClick();
    onClick();

    console.log(Object.keys(a));
    console.log(a.increment === b.increment);
  },
};

const n = process.argv[2];
if (!examples[n]) {
  console.log('Usage: node week-02/09-classes.js <1-4>');
} else {
  examples[n]();
}
