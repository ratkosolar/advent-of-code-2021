const fs = require('fs');

const inputLines = fs.readFileSync('./input', 'utf8').split(/\r?\n/);

const invertMatrix = (matrix) =>
  matrix.reduce((acc, row) => {
    row.forEach((item, index) => {
      if (!acc[index]) {
        acc[index] = [];
      }
      acc[index].push(item);
    })
    return acc;
  }, []);

const calculateWinningScore = (matrix, drawnNumbers, lastDrawnNumber) => {
  return matrix.reduce((score, row) =>
    row.reduce((acc, number) =>
      !drawnNumbers.has(number)
        ? acc + number
        : acc, score
    ), 0) * lastDrawnNumber;
}

const numbersToBeDrawn = inputLines[0].split(',').map(s => Number(s));
const matrixes = inputLines
  .slice(2)
  .filter(line => line !== "")
  .reduce((acc, line, index) => {
    const matrixRow = line.trim().split(/\s+/).map(s => Number(s));
    return (index % 5 ? acc[acc.length - 1].push(matrixRow) : acc.push([matrixRow])) && acc;
  }, []);

// #1 Figure out which board will win first. What will your final score be if you choose that board?
// #2 Figure out which board will win last. What will your final score be if you choose that board?

const drawnNumbers = new Set([]);
let firstWinningScore, lastWinningScore;
let numberOfWinners = 0;
let bingoBoards = [...matrixes];
const bingoBoardsCount = bingoBoards.length;

for (let i = 0; i < numbersToBeDrawn.length; i++) {
  drawnNumbers.add(numbersToBeDrawn[i]);
  const winningBoards = bingoBoards.filter(matrix =>
    [...matrix, ...invertMatrix(matrix)].some(row => row.every(number => drawnNumbers.has(number))
  ));

  if (winningBoards.length > 0) {
    if (numberOfWinners === 0) {
      firstWinningScore = calculateWinningScore(winningBoards[0], drawnNumbers, numbersToBeDrawn[i]);
    }
    if (numberOfWinners === bingoBoardsCount - 1) {
      lastWinningScore = calculateWinningScore(winningBoards[winningBoards.length - 1], drawnNumbers, numbersToBeDrawn[i]);
    }

    numberOfWinners += winningBoards.length;
    bingoBoards = bingoBoards.filter(matrix => !winningBoards.includes(matrix));
  }
}

console.log(`Winning score for first winning board is ${firstWinningScore}`);
console.log(`Winning score for last winning board is ${lastWinningScore}`);

