const path = require('path');
const TeamBuilder = require(path.join(__dirname, 'lib', 'TeamBuilder.js'));

const teamBuilder = new TeamBuilder();

teamBuilder.init();