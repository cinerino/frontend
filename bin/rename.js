const fs = require('fs');
if (process.argv.length < 4) {
    throw new Error('invalid arguments');
}
fs.rename(process.argv[2], process.argv[3], function(error) { 
    if (error) {
        throw new Error('File successfully renamed!');
    }
});