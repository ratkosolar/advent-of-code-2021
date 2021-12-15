const fs = require("fs");

const caveConnectionsMap = fs
  .readFileSync("./input", "utf8")
  .split(/\r?\n/)
  .map((line) => line.split("-"))
  .reduce(
    (acc, [a, b]) => ({
      ...acc,
      [a]: [...(acc[a] || []), b],
      [b]: [...(acc[b] || []), a],
    }),
    {}
  );

const isBigCave = (name) => /^[A-Z]+$/.test(name);

const buildCavePaths = (
  start = "start",
  end = "end",
  visitedCavesCount = new Map(),
  smallCaveVisitedTwice = true
) => {
  if (start === end) {
    return [end];
  }

  const visitedCount = (visitedCavesCount.get(start) || 0) + 1;
  visitedCavesCount.set(start, visitedCount);
  if (visitedCount >= 2 && !isBigCave(start)) {
    smallCaveVisitedTwice = true;
  }

  const nextCaves = caveConnectionsMap[start].filter(
    (cave) =>
      cave !== "start" &&
      (isBigCave(cave) ||
        !visitedCavesCount.get(cave) ||
        !smallCaveVisitedTwice)
  );
  const paths = nextCaves
    .flatMap((nextCave) =>
      buildCavePaths(nextCave, end, visitedCavesCount, smallCaveVisitedTwice)
    )
    .map((path) => `${start}->${path}`);

  visitedCavesCount.set(start, visitedCavesCount.get(start) - 1);

  return paths;
};

console.log(
  `How many paths through this cave system are there that visit small caves at most once? Result is: ${
    buildCavePaths().length
  }`
);

console.log(
  `How many paths through this cave system are there that visit one small cave at most twice? Result is: ${
    buildCavePaths("start", "end", new Map(), false).length
  }`
);
