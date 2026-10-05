// Hoisting: declarations are registered before the code runs.
// var  -> registered and initialized to undefined
// let / const -> registered but NOT initialized (Temporal Dead Zone)

console.log(city); // undefined
var city = "Haifa";
console.log(city); // "Haifa"

try {
  console.log(country); // ReferenceError: Cannot access 'country' before initialization
} catch (err) {
  console.log("Error:", err.message);
}
const country = "Israel";
