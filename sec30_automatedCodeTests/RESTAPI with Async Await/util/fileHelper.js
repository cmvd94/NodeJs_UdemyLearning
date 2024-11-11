const fs = require('fs');
const rootPath = require('./rootPath');

exports.deletePath = (filePath) => {
   // filePath = rootPath+filePath
    console.log(filePath)
    fs.unlink(filePath, err => {
        if(err){
            throw new Error('File not deleted')
        }
    });
}