const path = require('path');

// Next.js standalone mode puts the entry point here:
const standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js');

console.log('Attempting to start Next.js from:', standaloneServer);

// This line executes the pre-built server
require(standaloneServer);