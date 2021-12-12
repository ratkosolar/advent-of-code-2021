const fs = require("fs");

const input = fs
  .readFileSync("./input", "utf8")
  .split(/\r?\n/)
  .map((line) => line.split("").map((x) => parseInt(x)));

const getAdjacentFields = (matrix, y, x) =>
  [
    // horizontal
    { value: matrix[y][x - 1], x: x - 1, y },
    { value: matrix[y][x + 1], x: x + 1, y },
    // vertical
    { value: matrix[y - 1]?.[x], x, y: y - 1 },
    { value: matrix[y + 1]?.[x], x, y: y + 1 },
    // diagonal
    { value: matrix[y - 1]?.[x - 1], x: x - 1, y: y - 1 },
    { value: matrix[y - 1]?.[x + 1], x: x + 1, y: y - 1 },
    { value: matrix[y + 1]?.[x - 1], x: x - 1, y: y + 1 },
    { value: matrix[y + 1]?.[x + 1], x: x + 1, y: y + 1 },
  ].filter((item) => item.value !== undefined);

const getShouldFlashItems = (matrix, alreadyFlashed) =>
  matrix.reduce(
    (acc, row, y) => [
      ...acc,
      ...row.reduce(
        (acc2, value, x) =>
          !alreadyFlashed.has(`${y},${x}`) && value > 9
            ? [...acc2, { x, y, value }]
            : acc2,
        []
      ),
    ],
    []
  );

const cycleFlashes = (matrix) => {
  const newMatrix = matrix.map((row) => row.map((value) => value + 1));

  const alreadyFlashed = new Set([]);
  let shouldFlash = getShouldFlashItems(newMatrix, alreadyFlashed);

  while (shouldFlash.length > 0) {
    shouldFlash.forEach((item) => {
      alreadyFlashed.add(`${item.y},${item.x}`);
      getAdjacentFields(newMatrix, item.y, item.x).forEach(({ x, y }) => {
        newMatrix[y][x] += 1;
      });
    });
    shouldFlash = getShouldFlashItems(newMatrix, alreadyFlashed);
  }
  return {
    newMatrix: newMatrix.map((row) =>
      row.map((value) => (value > 9 ? 0 : value))
    ),
    numberOfFlashes: alreadyFlashed.size,
  };
};

const calculateTotalFlashes = (matrix, cycles = 100) => {
  let totalFlashes = 0;
  let matrixLocal = matrix;
  for (let i = 0; i < cycles; i++) {
    const { newMatrix, numberOfFlashes } = cycleFlashes(matrixLocal);
    matrixLocal = newMatrix;
    totalFlashes += numberOfFlashes;
  }
  return totalFlashes;
};

console.log(
  `How many total flashes are there after 100 steps? Result is: ${calculateTotalFlashes(
    input,
    100
  )}`
);

const calculateNumberOfCyclesUntilFullFlash = (matrix) => {
  const fullFlashSize = matrix.length * matrix[0].length;
  let matrixLocal = matrix;
  let currentCycleFlashSize = 0;
  let cycle = 0;

  while (currentCycleFlashSize !== fullFlashSize) {
    const { newMatrix, numberOfFlashes } = cycleFlashes(matrixLocal);
    matrixLocal = newMatrix;
    currentCycleFlashSize = numberOfFlashes;
    cycle++;
  }

  return cycle;
};

console.log(
  `What is the first step during which all octopuses flash? Result is: ${calculateNumberOfCyclesUntilFullFlash(
    input
  )}`
);
