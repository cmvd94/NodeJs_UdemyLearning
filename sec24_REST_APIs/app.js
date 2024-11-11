const express = require('express')
const bodyParse = require('body-parser');

const feedRoutes = require('./route/feed');

const app = express();

//app.use(bodyParse.urlencoded())// for x-ww-form-urlencoded
app.use(bodyParse.json()) //for application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');//access to all client
    res.setHeader('Access-Control-Allow-Method', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE');//we can allow whatever we want too
    //res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');//we can alose set wildcard '*'
    next()
})

app.use('/feed',feedRoutes);

app.listen(8080,console.log("api server running on PORT 8080"));