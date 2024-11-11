const http = require('http');
const fs = require('fs');
const reqResHandler = (req,res) => {
    const url = req.url;
    const method = req.method;
    console.log(url,method);
    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write(
          '<body><form action="/user-input" method="POST"><input type="text" name="userInput"><button type="submit">SUBMIT</button></form></body>');
        res.write('</html>');
        res.end();
    }else if(url === '/user-input' && method === 'POST'){
        const content = []
        req.on('data', (message) => {
            content.push(message);
        })
        req.on('end', () => {
            const parsedBody = Buffer.concat(content).toString();
            console.log(parsedBody.split('=')[1]);
          });
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end()
    }if (url === '/users') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Assignment 1</title></head>');
        res.write('<body><ul><li>User 1</li><li>User 2</li></ul></body>');
        res.write('</html>');
        res.end();       
    }/* else {
        res.statusCode = 404;
        res.write('404 not found');
        res.end();
    } */
}

module.exports = {
    reqResHandler
}