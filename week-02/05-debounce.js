// Week 2 – Session 3 (No AI): debounce
// Run: node week-02/05-debounce.js
//
// debounce(fn, delay) returns a NEW function.
// Every call to the new function restarts the timer.
// fn runs once, after `delay` ms with no new calls,
// with the arguments of the LAST call.

function debounce(fn, delay) {

  let timerID;

  return (...args) => {
    clearTimeout(timerID);
    timerID = setTimeout(() => {
      fn(...args);
    }, delay);
  }


}

// ---------------------------------------------------------------
// Checks – no need to change anything below this line
// ---------------------------------------------------------------

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Creates a fake fn that remembers every call
function spy() {
  const calls = [];
  const fn = (...args) => calls.push(args);
  return { fn, calls };
}

// Calls the debounced function only if it is really a function
function safe(debounced) {
  return (...args) => {
    if (typeof debounced === 'function') debounced(...args);
  };
}

const checks = [
  {
    name: 'returns a function',
    async run() {
      const { fn } = spy();
      return typeof debounce(fn, 100) === 'function';
    },
  },
  {
    name: 'runs once after a burst of calls',
    async run() {
      const { fn, calls } = spy();
      const d = safe(debounce(fn, 100));
      d(); d(); d(); d(); d();
      await wait(150);
      return calls.length === 1;
    },
  },
  {
    name: "uses the last call's arguments",
    async run() {
      const { fn, calls } = spy();
      const d = safe(debounce(fn, 100));
      d('a'); d('b'); d('c', 42);
      await wait(150);
      return calls.length === 1 && calls[0][0] === 'c' && calls[0][1] === 42;
    },
  },
  {
    name: 'does not run before delay',
    async run() {
      const { fn, calls } = spy();
      const d = safe(debounce(fn, 100));
      d();
      await wait(50);
      const tooEarly = calls.length;
      await wait(100);
      return tooEarly === 0 && calls.length === 1;
    },
  },
  {
    name: 'every call restarts the timer',
    async run() {
      const { fn, calls } = spy();
      const d = safe(debounce(fn, 100));
      d();
      await wait(60);
      d();
      await wait(60);
      d();
      await wait(60);
      const tooEarly = calls.length;
      await wait(80);
      return tooEarly === 0 && calls.length === 1;
    },
  },
  {
    name: 'two separate bursts → two runs',
    async run() {
      const { fn, calls } = spy();
      const d = safe(debounce(fn, 100));
      d(1); d(2);
      await wait(150);
      d(3); d(4);
      await wait(150);
      return calls.length === 2 && calls[0][0] === 2 && calls[1][0] === 4;
    },
  },
];

async function main() {
  let passed = 0;
  for (const check of checks) {
    let ok = false;
    try {
      ok = await check.run();
    } catch (err) {
      console.log(`  error: ${err.message}`);
    }
    if (ok) passed++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${check.name}`);
  }
  console.log(`\n${passed}/${checks.length} checks passed`);
}

main();
