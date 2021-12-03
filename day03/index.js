const fs = require('fs');

const inputData = fs.readFileSync('./input', 'utf8');

const binaryNumbers = inputData
  .split(/\r?\n/)
  .reduce((acc, line, index) => {
    if (!/[0-1]*/.test(line)) {
      throw new Error(`Invalid binary number on line ${index}`);
    }

    return [...acc, line];
  }, []);
const binaryLengthArray = Array(binaryNumbers[0]?.length).fill(0);

const countBits = (binaries, index) => {
  return binaries.reduce((acc, binary) => ({
    ...acc, [binary[index]]: acc[binary[index]] += 1
  }), { '1': 0, '0': 0 });
}

const calculateMostCommonBit = (binaries, index) => {
  const count = countBits(binaries, index);
  return count['1'] >= count['0'] ? '1' : '0';
};

const calculateLeastCommonBit = (binaries, index) => {
  const count = countBits(binaries, index);
  return count['1'] >= count['0'] ? '0' : '1';
};

// 1. What is the power consumption of submarine?

const mostCommonBitsBinary =  binaryLengthArray.reduce((acc, item, index) => `${acc}${calculateMostCommonBit(binaryNumbers, index)}`, '');
const leastCommonBitsBinary =  binaryLengthArray.reduce((acc, item, index) => `${acc}${calculateLeastCommonBit(binaryNumbers, index)}`, '');
const powerConsumption = parseInt(mostCommonBitsBinary, 2) * parseInt(leastCommonBitsBinary, 2);

console.log(`Power consumption of submarine is: ${powerConsumption}`);

// 2. Next, you should verify the life support rating, which can be determined by multiplying the oxygen generator rating by the CO2 scrubber rating.

const oxygenGeneratorRating = binaryLengthArray.reduce((acc, _, index) => {
  if (acc.length > 1) {
    const mostCommonBit = calculateMostCommonBit(acc, index);
    return acc.filter(binary => binary[index] === mostCommonBit);
  }
  return acc;
}, [...binaryNumbers])[0];

const co2ScrubberRating = binaryLengthArray.reduce((acc, _, index) => {
  if (acc.length > 1) {
    const leastCommonBit = calculateLeastCommonBit(acc, index);
    return acc.filter(binary => binary[index] === leastCommonBit);
  }
  return acc;
}, [...binaryNumbers])[0];

const lifeSupportRating = parseInt(oxygenGeneratorRating, 2) * parseInt(co2ScrubberRating, 2);

console.log(`Life support rating is: ${lifeSupportRating}`);