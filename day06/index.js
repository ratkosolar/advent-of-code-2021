const fs = require("fs");

const inputLines = fs.readFileSync("./input", "utf8");
const reproductionCalendar = inputLines
  .split(",")
  .reduce((acc, item) => (acc[parseInt(item)] += 1) && acc, Array(9).fill(0));

const countLanterfishReproduction = (reproductionCalendar, cycles) => {
  return Array.from({ length: cycles }, (_, i) => i)
    .reduce(
      (calendar) => {
        return [
          ...calendar.slice(1, 7),
          calendar[7] + calendar[0],
          calendar[8],
          calendar[0],
        ];
      },
      [...reproductionCalendar]
    )
    .reduce((acc, item) => acc + item, 0);
};

console.log(
  `How many lanternfish would there be after 80 days? Result is: ${countLanterfishReproduction(
    reproductionCalendar,
    80
  )}`
);

console.log(
  `How many lanternfish would there be after 256 days? Result is: ${countLanterfishReproduction(
    reproductionCalendar,
    256
  )}`
);
