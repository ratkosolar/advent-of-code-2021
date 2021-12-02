const fs = require('fs');

const inputData = fs.readFileSync('./input', 'utf8');

const calculateNumberOfIncreases = arr => {
  return arr.reduce((acc, value, index) => {
    return (index > 0 && value > arr[index - 1]) ? acc + 1 : acc;
  }, 0)
}

// 1. How many measurements are larger than the previous measurement?

const depthMeasurements = inputData
  .split(/\r?\n/)
  .reduce((acc, line) => [...acc, Number(line)], []);

console.log(`Number of measurements that are larger than the previous measurement: ${calculateNumberOfIncreases(depthMeasurements)}`);

// 2. Consider sums of a three-measurement sliding window. How many sums are larger than the previous sum?

const threeMeasurementSums = depthMeasurements.reduce((acc, depth, index) => {
  if (index > 0 && index < depthMeasurements.length - 1) {
    const prevDepth = depthMeasurements[index - 1];
    const nextDepth = depthMeasurements[index + 1];
    return [...acc, prevDepth + depth + nextDepth];
  }
  return acc;
}, []);

console.log(`Number of sums of three measurements that are larger than the previous sum: ${calculateNumberOfIncreases(threeMeasurementSums)}`);
