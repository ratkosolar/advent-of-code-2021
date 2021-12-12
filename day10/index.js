const fs = require("fs");

const input = fs
  .readFileSync("./input", "utf8")
  .split(/\r?\n/)
  .map((line) => line.split(""));

const closingTagsMap = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

const validateLine = (line) => {
  try {
    return {
      unexpectedClosingTag: null,
      missingClosingTags: line.reduce((missingClosingTags, char) => {
        const isOpeningTag = ["(", "[", "{", "<"].includes(char);
        if (isOpeningTag) {
          missingClosingTags.unshift(closingTagsMap[char]);
        } else if (missingClosingTags.shift() !== char) {
          throw new Error(char);
        }
        return missingClosingTags;
      }, []),
    };
  } catch (error) {
    return { unexpectedClosingTag: error.message, missingClosingTags: [] };
  }
};

const syntaxErrorPointsMap = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const syntaxErrorScore = input.reduce((acc, line) => {
  const { unexpectedClosingTag } = validateLine(line);
  return unexpectedClosingTag
    ? acc + syntaxErrorPointsMap[unexpectedClosingTag]
    : acc;
}, 0);

console.log(
  `What is the total syntax error score for those errors? Result is ${syntaxErrorScore}`
);

const completionPointsMap = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

const completionScores = input
  .map(validateLine)
  .filter((item) => !item.unexpectedClosingTag)
  .map(({ missingClosingTags }) =>
    missingClosingTags.reduce(
      (score, tag) => score * 5 + completionPointsMap[tag],
      0
    )
  )
  .sort((a, b) => b - a);

console.log(
  `What is the middle score? Result is: ${
    completionScores[(completionScores.length - 1) / 2]
  }`
);
