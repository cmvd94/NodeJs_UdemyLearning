// const fs = require('fs');
import fs from 'fs';
import path, {dirname} from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const resHandler = (req, res, next) => {
  // fs.readFile('my-page.html', 'utf8', (err, data) => {
  //   res.send(data);
  //});
  console.log(import.meta.url)
  console.log(fileURLToPath(import.meta.url))
  console.log(__dirname)
  console.log(path.join(__dirname, 'my-page.html'))
  res.sendFile(path.join(__dirname, 'my-page.html'));
  //res.sendFile(__dirname);
  
};

// module.exports = resHandler;
// export default resHandler;