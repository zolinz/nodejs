console.log('Starting app.');

const fs = require('fs');
const os = require('os');

var user = os.userInfo();


var cpu = os.cpus();

console.log(cpu);
fs.appendFile('greetings.txt', `Hello ${user.username}!`);
