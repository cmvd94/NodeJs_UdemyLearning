const express = require('express')

const app = express();

const bodyParser = require('body-parser')

const PORT = process.env.PORT | 3000;

//app.use(express.urlencoded({extended: false}))
app.use(bodyParser.urlencoded({extended : true}));

app.use((req, res, next) => {
    console.log("inside middleware");
    next()
})
// we can also use app.get instead of app.use
//app.get for trigger for get request
app.use('/add-product',(req, res, next) => {
   // console.log(req.body);
   res.send('<form action="/product" method="POST"><input type="text" name="userInput"><button type="submit">SUBMIT</button></form>');
    
})

//this should react only for post request so use ..app.post
app.post('/product',(req, res, next) => {
    console.log(req.body);
    res.redirect('/');
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

