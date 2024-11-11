const http = require('http');
const { reqResHandler } = require('./route');
const PORT = process.env.PORT | 3000;

const server = http.createServer(reqResHandler,(err) => {
    if(err){
        console.log('server err')
    } 
});

server.listen(PORT, (err) => {
    if(err){
        console.error(`server error ${err}` );
    }else{
        console.log(`server is running on PORT:${PORT}`);
    }
})