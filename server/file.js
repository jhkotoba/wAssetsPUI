const fs = require("fs");

const wFs = {
    readFile: path => {        
        return new Promise((resolve, reject) => {
            fs.readFile(path, "UTF-8", (err, text) => {
                if(err) reject(err);
                else resolve(text);
            });
        });
    }
}

module.exports = wFs;