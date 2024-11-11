const express = require('express')

const app = express();

const bodyParser = require('body-parser')

const PORT = process.env.PORT | 3000;

//data for site should be parsed. express has inbuild for that
//app.use(express.urlencoded({extended: false}))
//npm for parsing data also available
app.use(bodyParser.urlencoded({extended : false}));//parse sent through form,text

app.use((req, res, next) => {
    console.log("inside middleware");
    next()
})


app.use('/add-product',(req, res, next) => {
   // console.log(req.body);
   res.send('<form action="/product" method="POST"><input type="text" name="userInput"><button type="submit">SUBMIT</button></form>');
    
})

app.use('/product',(req, res, next) => {
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

