const fs = require("fs");

const inputLines = fs.readFileSync("./input", "utf8");
const positions = inputLines.split(",").map((s) => parseInt(s));

const calculateAlignmentFuel = (positions) => {
  const min = Math.min(...positions);
  const max = Math.max(...positions);
  return Array.from({ length: max - min + 1 }, (_, i) => min + i).reduce(
    (acc, num) => {
      const fuel = positions.reduce((acc, pos) => acc + Math.abs(pos - num), 0);
      return fuel < acc ? fuel : acc;
    },
    Infinity
  );
};

console.log(
  `V1 -> How much fuel must they spend to align to that position? Fuel spent: ${calculateAlignmentFuel(
    positions
  )}`
);

const calculateAlignmentFuelV2 = (positions) => {
  const min = Math.min(...positions);
  const max = Math.max(...positions);
  return Array.from({ length: max - min + 1 }, (_, i) => min + i).reduce(
    (acc, num) => {
      const fuel = positions.reduce((acc, pos) => {
        const diff = Math.abs(pos - num);
        return acc + ((diff + 1) * diff) / 2;
      }, 0);
      return fuel < acc ? fuel : acc;
    },
    Infinity
  );
};

console.log(
  `V2 -> How much fuel must they spend to align to that position? Fuel spent: ${calculateAlignmentFuelV2(
    positions
  )}`
);
