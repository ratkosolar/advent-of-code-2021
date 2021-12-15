const fs = require("fs");

const [dotsInput, foldingInput] = fs
  .readFileSync("./input", "utf8")
  .split(/\r?\n\r?\n/);

const dots = dotsInput
  .split(/\r?\n/)
  .map((line) => line.split(",").map((s) => parseInt(s)));

const [maxX, maxY] = dots.reduce(
  ([maxX, maxY], [x, y]) => [x > maxX ? x : maxX, y > maxY ? y : maxY],
  [0, 0]
);

const dotsMatrix = dots.reduce(
  (matrix, [x, y]) => {
    if (!matrix[y]) matrix[y] = [];
    matrix[y][x] = true;
    return matrix;
  },
  Array.from({ length: maxY }, () => Array(maxX).fill(null))
);

const foldCommands = foldingInput.split(/\r?\n/).map((line) => {
  const [, axis, value] = line.match(/([xy])=(\d+)/);
  return { axis, value: parseInt(value) };
});

const foldX = (matrix, foldingX) => {
  return matrix.reduce(
    (acc, row) => [
      ...acc,
      row.reduce((newRow, value, x) => {
        if (x < foldingX) {
          newRow[x] = value;
        } else if (x > foldingX && value) {
          newRow[foldingX - (x - foldingX)] = value;
        }
        return newRow;
      }, []),
    ],
    []
  );
};

const foldY = (matrix, foldingY) => {
  return matrix.reduce((acc, row, y) => {
    if (y < foldingY) {
      acc[y] = matrix[y];
    } else if (y > foldingY) {
      row.forEach((value, x) => {
        if (value) acc[foldingY - (y - foldingY)][x] = value;
      });
    }
    return acc;
  }, []);
};

const fold = (matrix, foldCommands) => {
  return foldCommands.reduce(
    (acc, { axis, value }) =>
      axis === "x" ? foldX(acc, value) : foldY(acc, value),
    matrix
  );
};

const countDots = (matrix) =>
  matrix.reduce(
    (acc, row) =>
      acc + row.reduce((acc2, value) => (value ? acc2 + 1 : acc2), 0),
    0
  );

const printMatrix = (matrix) =>
  matrix.reduce(
    (secretCode, row) =>
      `${secretCode}${row.reduce(
        (line, dot) => `${line}${dot ? "#" : "."}`,
        ""
      )}\n`,
    ""
  );

const matrixAfterFirstFold = fold(dotsMatrix, [foldCommands[0]]);
console.log(
  `How many dots are visible after completing just the first fold instruction on your transparent paper? Result is ${countDots(
    matrixAfterFirstFold
  )}`
);

const matrixAfterAllFolds = fold(dotsMatrix, foldCommands);
console.log(
  `What code do you use to activate the infrared thermal imaging camera system? Result is:\n${printMatrix(
    matrixAfterAllFolds
  )}`
);
