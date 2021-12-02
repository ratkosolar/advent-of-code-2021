const fs = require('fs');

const inputData = fs.readFileSync('./input', 'utf8');

// 1. What do you get if you multiply your final horizontal position by your final depth?

const commands = inputData
  .split(/\r?\n/)
  .reduce((acc, line, index) => {
    if (!/(forward|up|down)\s\d*/.test(line)) {
      throw new Error(`Invalid command on line ${index}`)
    }

    const lineChunks = line.split(' ');
    const name = lineChunks[0];
    const unit = Number(lineChunks[1]);

    return [...acc, { name, unit }];
  }, []);

const position = commands.reduce((acc, command) => {
  let { horizontal, depth } = acc;

  switch(command.name) {
    case 'forward':
      horizontal += command.unit;
      break;
    case 'up':
      depth -= command.unit;
      break;
    case 'down':
      depth += command.unit;
      break;
  }

  return { horizontal, depth };
}, { horizontal: 0, depth: 0 });

console.log(`Multiplication of horizontal position and depth is: ${position.horizontal * position.depth}`);

// 2. Opps, apparently up/down commands are supposed to update your aim not your depth

const position2 = commands.reduce((acc, command) => {
  let { horizontal, depth, aim } = acc;

  switch(command.name) {
    case 'forward':
      horizontal += command.unit;
      depth += aim * command.unit;
      break;
    case 'up':
      aim -= command.unit;
      break;
    case 'down':
      aim += command.unit;
      break;
  }

  return { horizontal, depth, aim };
}, { horizontal: 0, depth: 0, aim: 0 });

console.log(`Multiplication of updated horizontal position and depth is: ${position2.horizontal * position2.depth}`);
