// Week 2 – Session 3 (No AI): Promise.all
// Run: node week-02/07-promise-all.js
//
// promiseAll(items) works like Promise.all (do not use Promise.all itself).
// It gets an array and returns a NEW promise.
// - When all items succeed, it resolves with an array of their values,
//   in the same order as the input array.
// - When one item fails, it rejects right away, with that error.
// - An empty array resolves with [].
// - Items that are not promises count as values that already succeeded.

function promiseAll(items) {
  let successCount = 0;
  const results = [];

  return new Promise((resolve, reject) => {
    if (items.length === 0) return resolve([]);
    items.forEach((item, index) => {
      Promise.resolve(item)
        .then((res) => {
          results[index] = res;
          successCount += 1;
          if (successCount === items.length) resolve(results);
        })
        .catch(reject)
    });
  });
}

// ---------------------------------------------------------------
// Checks – no need to change anything below this line
// ---------------------------------------------------------------

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A promise that succeeds with `value` after `ms`
const later = (value, ms) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

// A promise that fails with `error` after `ms`
const failLater = (error, ms) =>
  new Promise((resolve, reject) => setTimeout(() => reject(error), ms));

// Waits for the result, but not forever.
// Returns { status: 'fulfilled', value }, { status: 'rejected', error },
// { status: 'still pending' } or { status: 'not a promise' }
function settle(result, ms = 500) {
  if (!result || typeof result.then !== 'function') {
    return { status: 'not a promise' };
  }
  const outcome = result.then(
    (value) => ({ status: 'fulfilled', value }),
    (error) => ({ status: 'rejected', error }),
  );
  const timeout = wait(ms).then(() => ({ status: 'still pending' }));
  return Promise.race([outcome, timeout]);
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// An error in the checked code should not stop the checks
process.on('uncaughtException', (err) => {
  console.log(`  error: ${err.message}`);
});
process.on('unhandledRejection', (err) => {
  console.log(`  unhandled rejection: ${err && err.message ? err.message : err}`);
});

const checks = [
  {
    name: 'returns a promise',
    async run() {
      const result = promiseAll([later(1, 10)]);
      return result instanceof Promise;
    },
  },
  {
    name: 'resolves with all the values',
    async run() {
      const r = await settle(promiseAll([later(1, 10), later(2, 10), later(3, 10)]));
      return r.status === 'fulfilled' && same(r.value, [1, 2, 3]);
    },
  },
  {
    name: 'keeps the input order when items finish out of order',
    async run() {
      const r = await settle(promiseAll([later('a', 60), later('b', 10), later('c', 30)]));
      return r.status === 'fulfilled' && same(r.value, ['a', 'b', 'c']);
    },
  },
  {
    name: 'waits for the slowest item',
    async run() {
      const result = promiseAll([later('fast', 10), later('slow', 100)]);
      const early = await settle(result, 50);
      const final = await settle(result);
      return early.status === 'still pending'
        && final.status === 'fulfilled'
        && same(final.value, ['fast', 'slow']);
    },
  },
  {
    name: 'rejects with the error of the item that failed',
    async run() {
      const error = new Error('boom');
      const r = await settle(promiseAll([later(1, 10), failLater(error, 20), later(3, 30)]));
      return r.status === 'rejected' && r.error === error;
    },
  },
  {
    name: 'rejects right away, without waiting for the others',
    async run() {
      const error = new Error('fast fail');
      const r = await settle(promiseAll([later('slow', 300), failLater(error, 20)]), 100);
      return r.status === 'rejected' && r.error === error;
    },
  },
  {
    name: 'empty array resolves with []',
    async run() {
      const r = await settle(promiseAll([]));
      return r.status === 'fulfilled' && same(r.value, []);
    },
  },
  {
    name: 'accepts values that are not promises',
    async run() {
      const r = await settle(promiseAll([1, later('two', 20), 'three']));
      return r.status === 'fulfilled' && same(r.value, [1, 'two', 'three']);
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
