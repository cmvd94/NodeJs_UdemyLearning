const express = require('express')

const app = express();

const PORT = process.env.PORT | 3000;

app.use((req, res, next) => {
    console.log("inside middleware");
    next()
})

/* app.use((req, res, next) => {
    console.log("inside middleware");
    res.send("page opened")
}) */


app.use('/user',(req, res, next) => {

    res.send("/user");
})

app.use('^/$',(req, res, next) => {
    res.send("/index"); 
})

app.use('*',(req, res, next) => {
    res.send("no url");
})

app.listen(PORT, (err) => {
    if(err){
        console.log('listen error');
    }else{
        console.log(`server is listening on ${PORT}`);
    }
})

