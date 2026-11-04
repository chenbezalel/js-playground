// Week 2 – Session 3 (No AI): throttle
// Run: node week-02/06-throttle.js
//
// throttle(fn, delay) returns a NEW function.
// The first call runs fn right away, with its arguments.
// For `delay` ms after a run, new calls are ignored.
// After `delay` ms have passed since the last run,
// the next call runs fn right away again.

function throttle(fn, delay) {
  let isWaiting   = false;

  return (...args) => {
    if (isWaiting) return;
    fn(...args);
    isWaiting = true;
    setTimeout(() => {
      isWaiting = false;
    }, delay);
  };
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

// Calls the throttled function only if it is really a function
function safe(throttled) {
  return (...args) => {
    if (typeof throttled === 'function') throttled(...args);
  };
}

// An error inside a timer should not stop the checks
process.on('uncaughtException', (err) => {
  console.log(`  error inside a timer: ${err.message}`);
});

const checks = [
  {
    name: 'returns a function',
    async run() {
      const { fn } = spy();
      return typeof throttle(fn, 100) === 'function';
    },
  },
  {
    name: 'first call runs right away',
    async run() {
      const { fn, calls } = spy();
      const t = safe(throttle(fn, 100));
      t();
      return calls.length === 1;
    },
  },
  {
    name: "uses the first call's arguments",
    async run() {
      const { fn, calls } = spy();
      const t = safe(throttle(fn, 100));
      t('a', 1); t('b', 2); t('c', 3);
      return calls.length === 1 && calls[0][0] === 'a' && calls[0][1] === 1;
    },
  },
  {
    name: 'ignores calls inside the window',
    async run() {
      const { fn, calls } = spy();
      const t = safe(throttle(fn, 100));
      t(); t(); t();
      await wait(50);
      t();
      return calls.length === 1;
    },
  },
  {
    name: 'does not run later by itself',
    async run() {
      const { fn, calls } = spy();
      const t = safe(throttle(fn, 100));
      t('a'); t('b'); t('c');
      await wait(200);
      return calls.length === 1 && calls[0][0] === 'a';
    },
  },
  {
    name: 'runs again after the window',
    async run() {
      const { fn, calls } = spy();
      const t = safe(throttle(fn, 100));
      t('a');
      await wait(150);
      t('b');
      return calls.length === 2 && calls[0][0] === 'a' && calls[1][0] === 'b';
    },
  },
  {
    name: 'steady rate while calls keep coming',
    async run() {
      const { fn, calls } = spy();
      const t = safe(throttle(fn, 100));
      for (let i = 1; i <= 7; i++) {
        t(i);
        if (i < 7) await wait(40);
      }
      const values = calls.map((c) => c[0]).join(',');
      return values === '1,4,7';
    },
  },
  {
    name: 'two throttled functions do not share state',
    async run() {
      const first = spy();
      const second = spy();
      const t1 = safe(throttle(first.fn, 100));
      const t2 = safe(throttle(second.fn, 100));
      t1();
      t2();
      return first.calls.length === 1 && second.calls.length === 1;
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
