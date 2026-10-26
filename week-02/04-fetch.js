// Week 2 – Session 2, part 3: fetch and res.ok
// Run one example: node week-02/04-fetch.js 1
//
// fetch(url) → returns a promise of a Response.
//   It REJECTS only when there is no answer at all (network error).
//   A 404 or 500 is still an answer → fetch does NOT reject!
//   res.ok     → true only for status 200–299
//   res.json() → ALSO returns a promise (the body arrives in parts)

const http = require('http');

// A tiny local server, so the examples work without internet.
//   /meals   → 200 with meals
//   /missing → 404
//   /broken  → 500
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.url === '/meals') {
    res.statusCode = 200;
    res.end(JSON.stringify([{ name: 'Oatmeal', calories: 300 }, { name: 'Salad', calories: 450 }]));
  } else if (req.url === '/missing') {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Not found' }));
  } else {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Server error' }));
  }
});

const BASE = 'http://localhost:4000';

const examples = {
  // Example 1 – the happy path
  async 1() {
    const res = await fetch(`${BASE}/meals`);
    console.log('Status:', res.status, 'ok:', res.ok);
    const meals = await res.json();
    console.log('Got', meals.length, 'meals');
  },

  // Example 2 – a 404. Is this catch going to run?
  async 2() {
    try {
      const res = await fetch(`${BASE}/missing`);
      console.log('Status:', res.status, 'ok:', res.ok);
      const meals = await res.json();
      console.log('Got', meals.length, 'meals');
    } catch (error) {
      console.log('Caught:', error.message);
    }
  },

  // Example 3 – the right way: check res.ok and throw yourself
  async 3() {
    try {
      const res = await fetch(`${BASE}/broken`);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const meals = await res.json();
      console.log('Got', meals.length, 'meals');
    } catch (error) {
      console.log('Caught:', error.message);
    }
  },

  // Example 4 – a real network error: nothing listens on port 4999
  async 4() {
    try {
      await fetch('http://localhost:4999/meals');
    } catch (error) {
      console.log('Caught:', error.message);
    }
  },
};

const n = process.argv[2];
if (!examples[n]) {
  console.log('Usage: node week-02/04-fetch.js <1-4>');
} else {
  server.listen(4000, async () => {
    await examples[n]();
    server.close();
  });
}
