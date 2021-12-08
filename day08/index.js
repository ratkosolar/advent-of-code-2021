const fs = require("fs");

const inputLines = fs.readFileSync("./input", "utf8").split(/\r?\n/);
const { input, output } = inputLines.reduce(
  (acc, line) => {
    const [inputLine, outputLine] = line.split(" | ");
    acc.input.push(inputLine.split(" "));
    acc.output.push(outputLine.split(" "));
    return acc;
  },
  { input: [], output: [] }
);

const numberOfOnesFoursSevensOrEights = output.reduce(
  (acc, item) =>
    acc +
    item.filter(
      (s) =>
        s.length === 2 || s.length === 3 || s.length === 4 || s.length === 7
    ).length,
  0
);

console.log(
  `In the output values, how many times do digits 1, 4, 7, or 8 appear? Result is: ${numberOfOnesFoursSevensOrEights}`
);

const diff = (str1, str2) => str1.split("").filter((x) => !str2.includes(x));

const decodeSegments = (arr) => {
  const one = arr.find((x) => x.length === 2);
  const four = arr.find((x) => x.length === 4);
  const eight = arr.find((x) => x.length === 7);
  const seven = arr.find((x) => x.length === 3);
  const three = arr.find(
    (x) => x.length === 5 && one.split("").every((y) => x.includes(y))
  );
  const nine = arr.find(
    (x) => x.length === 6 && three.split("").every((y) => x.includes(y))
  );
  const zero = arr.find(
    (x) =>
      x.length === 6 && nine !== x && one.split("").every((y) => x.includes(y))
  );
  const six = arr.find((x) => x.length === 6 && nine !== x && zero !== x);

  const a = diff(seven, one)[0];
  const c = diff(eight, six)[0];
  const e = diff(eight, nine)[0];
  const d = diff(eight, zero)[0];

  const two = arr.find((x) => x.length === 5 && three !== x && x.includes(c));
  const five = arr.find((x) => x.length === 5 && three !== x && two !== x);

  const f = diff(one, two)[0];
  const b = diff(five, three)[0];
  const g = diff(three, four).find((x) => x !== a);

  return {
    [a]: "a",
    [b]: "b",
    [c]: "c",
    [d]: "d",
    [e]: "e",
    [f]: "f",
    [g]: "g",
  };
};

const numbersMap = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,
};
const parseDigits = (arr, segmentsMap) =>
  arr.map(
    (x) =>
      numbersMap[
        x
          .split("")
          .map((y) => segmentsMap[y])
          .sort()
          .join("")
      ]
  );

const sumOfOutput = output.reduce(
  (acc, x, index) =>
    acc + parseInt(parseDigits(x, decodeSegments(input[index])).join("")),
  0
);
console.log(
  `What do you get if you add up all of the output values? Result is: ${sumOfOutput}`
);
