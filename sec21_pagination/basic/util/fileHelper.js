const fs = require('fs');

exports.deletePath = (filePath) => {
    fs.unlink(filePath, err => {
        if(err){
            throw new Error('File not deleted')
        }
    });
}