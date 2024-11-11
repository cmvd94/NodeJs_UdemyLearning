const fs = require('fs');
const rootPath = require('./rootPath');

exports.deletePath = (filePath) => {
   // filePath = rootPath+filePath
    if(!filePath){
        throw new Error('file not found');
    }
    fs.unlink(filePath, err => {
        if(err){
            throw new Error('File not deleted')
        }
    });
}