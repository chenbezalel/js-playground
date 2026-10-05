// var is function-scoped: ONE shared i for the whole loop.
// let is block-scoped: a NEW i for every iteration.
// setTimeout callbacks run only after the loop has finished.

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 0); // 3 3 3
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j), 0); // 0 1 2
}

const fns = [];
for (let k = 0; k < 3; k++) {
  fns.push(() => k);
}
console.log("fns:", fns[0](), fns[2]()); // 0 2
