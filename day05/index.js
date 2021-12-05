const fs = require("fs");

const inputLines = fs.readFileSync("./input", "utf8").split(/\r?\n/);
const ventCoordinates = inputLines.reduce(
  (acc, line) => [
    ...acc,
    line.split(" -> ").map((s) => ({
      x: parseInt(s.split(",")[0]),
      y: parseInt(s.split(",")[1]),
    })),
  ],
  []
);

const buildOverlapsMap = (coordinates) =>
  coordinates.reduce((countersMap, [{ x: x1, y: y1 }, { x: x2, y: y2 }]) => {
    for (
      let delta = 0,
        maxDelta = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)),
        xModifier = Math.sign(x2 - x1),
        yModifier = Math.sign(y2 - y1);
      delta <= maxDelta;
      delta++
    ) {
      const coordinate = `${x1 + delta * xModifier},${y1 + delta * yModifier}`;
      if (countersMap[coordinate]) countersMap[coordinate] += 1;
      else countersMap[coordinate] = 1;
    }
    return countersMap;
  }, {});

const countNumberOfDoubleOrMoreOverlaps = (overlapsMap) =>
  Object.keys(overlapsMap).filter((key) => overlapsMap[key] >= 2).length;

// #1 For now, only consider horizontal and vertical lines. At how many points do at least two lines overlap?

const verticalAndHorizontalOverlapsMap = buildOverlapsMap(
  ventCoordinates.filter(
    (coordinates) =>
      coordinates[0].x === coordinates[1].x ||
      coordinates[0].y === coordinates[1].y
  )
);
console.log(
  `Number of double overlaps for horizontal and vertical lines is: ${countNumberOfDoubleOrMoreOverlaps(
    verticalAndHorizontalOverlapsMap
  )}`
);

// #2 Consider diagonal lines as well. At how many points do at least two lines overlap?

const allOverlapsMap = buildOverlapsMap(ventCoordinates);
console.log(
  `Number of double overlaps for all lines is: ${countNumberOfDoubleOrMoreOverlaps(
    allOverlapsMap
  )}`
);
