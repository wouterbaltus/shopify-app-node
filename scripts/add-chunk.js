const readline = require('readline');
const fs = require('fs');

const myInterface = readline.createInterface({
  input: fs.createReadStream('server/server.js')
});

let lineno = 0;
myInterface.on('line', function(line) {
  lineno++;
  console.log('Line number ' + lineno + ': ' + line);
});
