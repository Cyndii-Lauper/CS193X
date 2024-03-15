/* Replace the TODO in the next line with your sunetid */
import checkAnswer from "./debugme.js";

import DATA from "./data.js";

/* Call this function from the console and use the debugger to find the secret code. */
const debugExercise = () => {
  checkAnswer("yuxintao");
  /* Strategy: TODO */
};
window.debugExercise = debugExercise;

/* Return an array of the SUNetIDs of the first N students in the data. */
const firstNSunets = (n) => {
  //TODO
  let res = [];
  if (DATA.students.length <= n) {
    console.error("n is too big");
    return res;
  }
  let students = DATA.students;
  for (let i = 0; i < n; ++i) {
    res.push(students[i].sunetid);
  }
  return res;
};

/* Return an Object mapping department names to codes of all departments with two-character codes. */
const shortDeptCodes = () => {
  //TODO
  let res = {};
  let depts = DATA.depts;
  for (let i of depts) {
    if (i.code.length == 2) {
      res[i.name] = i.code;
    }
  }
  return res;
};

/* Return the average number of units completed by the students in the data */
const averageUnits = () => {
  //TODO
  let res = 0;
  let units = Object.values(DATA.units);
  const n = units.length;
  for (var unit of units) {
    res += unit;
  }
  res = res / n;
  return res;
};

/* Test the warmup functions */
const testWarmups = () => {
  debugExercise();

  /* These checks work by converting the return value into a string for comparison. We will talk more about JSON later in the course. */
  console.assert(JSON.stringify(firstNSunets(3)) === `["mchang91","neelk","jahchuen"]`,
    "firstNSunets() returned incorrect answer");
  console.assert(JSON.stringify(shortDeptCodes()) === `{"Computer Science":"CS","Electrical Engineering":"EE"}`,
    "shortDeptCodes() returned incorrect answer");
  console.assert(averageUnits().toFixed(3) === "176.000", "averageUnits() returned incorrect answer");

  console.log("Tests completed");
};
window.testWarmups = testWarmups;
