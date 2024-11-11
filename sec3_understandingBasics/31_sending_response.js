const http = require('http');
const server = http.createServer( (req,res) => {
    console.log(req.url,req.method,req.headers);

    res.setHeader('Content-Type','text/html');
    res.write('hi! hello');
    res.end();
})

server.listen(3500, (err) => {
    if(err){
        console.log(err);
    }else{
        console.log('server is running on 3500');
    }
})
//On both requests and responses, Http headers are added to transport metadata from A to B.