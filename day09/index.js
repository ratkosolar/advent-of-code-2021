const fs = require("fs");

const inputLines = fs.readFileSync("./input", "utf8").split(/\r?\n/);
const heightMatrix = inputLines.map((line, y) =>
  line.split("").map((item, x) => ({ value: parseInt(item), x, y }))
);

const getAdjacentFields = (matrix, y, x) => {
  return [
    { value: matrix[y][x - 1]?.value, x: x - 1, y },
    { value: matrix[y][x + 1]?.value, x: x + 1, y },
    { value: matrix[y - 1]?.[x]?.value, x, y: y - 1 },
    { value: matrix[y + 1]?.[x]?.value, x, y: y + 1 },
  ].filter((item) => item.value !== undefined);
};

const lowPoints = heightMatrix.reduce(
  (acc, row, y) => [
    ...acc,
    ...row.filter(({ value }, x) =>
      getAdjacentFields(heightMatrix, y, x).every((item) => value < item.value)
    ),
  ],
  []
);

const sumOfLowPointsRiskLevels = lowPoints.reduce(
  (acc, item) => acc + item.value + 1,
  0
);

console.log(
  `What is the sum of the risk levels of all low points on your heightmap? Result is: ${sumOfLowPointsRiskLevels}`
);

const basins = lowPoints
  .reduce((acc, lowPoint) => {
    let basinMap = {};
    let basinMapAdditions = { [`${lowPoint.y},${lowPoint.x}`]: lowPoint };

    while (Object.values(basinMapAdditions).length > 0) {
      basinMap = {
        ...basinMap,
        ...basinMapAdditions,
      };
      basinMapAdditions = {
        ...Object.values(basinMapAdditions).reduce(
          (acc, item) => ({
            ...acc,
            ...getAdjacentFields(heightMatrix, item.y, item.x)
              .filter((item2) => item2.value !== 9 && item2.value > item.value)
              .reduce(
                (acc2, item2) => ({
                  ...acc2,
                  [`${item2.y},${item2.x}`]: item2,
                }),
                {}
              ),
          }),
          {}
        ),
      };
    }

    return [...acc, Object.values(basinMap)];
  }, [])
  .sort((a, b) => b.length - a.length);

const sizeMultiplicationOfThreeLargestBasins =
  basins[0].length * basins[1].length * basins[2].length;

console.log(
  `What do you get if you multiply together the sizes of the three largest basins? Result is: ${sizeMultiplicationOfThreeLargestBasins}`
);
