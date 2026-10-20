// Week 2 – Session 1: The event loop
// Run one example: node week-02/01-event-loop.js 1
//
// JS has ONE call stack: it runs one thing at a time.
// Async callbacks wait in queues until the stack is empty:
//   - Microtask queue: promise callbacks (.then, await), queueMicrotask
//   - Task queue (macrotasks): setTimeout, setInterval, I/O, events
//
// The event loop, again and again:
//   1. Run the synchronous code until the call stack is empty
//   2. Run ALL microtasks (also new ones added on the way)
//   3. Take ONE task from the task queue, then back to step 2

const examples = {
  // Example 1 – your preview question
  1() {
    console.log('A'); // sync → runs now

    setTimeout(() => console.log('B'), 0); // → task queue (even with 0 ms)

    Promise.resolve().then(() => console.log('C')); // → microtask queue

    console.log('D'); // sync → runs now
  },
  // Output: A D C B
  // Stack empty after A, D → microtasks first (C) → then one task (B)

  // Example 2 – all microtasks run before the next task
  2() {
    setTimeout(() => console.log('task 1'), 0);
    setTimeout(() => console.log('task 2'), 0);

    Promise.resolve()
      .then(() => console.log('micro 1'))
      .then(() => console.log('micro 2')); // added while microtasks run → still runs now

    console.log('sync');
  },
  // Output: sync, micro 1, micro 2, task 1, task 2

  // Example 3 – a microtask created INSIDE a task
  3() {
    setTimeout(() => {
      console.log('task 1');
      Promise.resolve().then(() => console.log('micro inside task 1'));
    }, 0);

    setTimeout(() => console.log('task 2'), 0);
  },
  // Output: task 1, micro inside task 1, task 2
  // After each task, the loop runs ALL microtasks before the next task.
};

const n = process.argv[2];
if (!examples[n]) {
  console.log('Usage: node week-02/01-event-loop.js <1-3>');
} else {
  examples[n]();
}
