const express = require('express')
const bodyParse = require('body-parser');
const mongoose = require('mongoose')
const path = require('path');
const multer = require('multer');
const {v4: uuid} = require('uuid')
const cors = require('cors')
/*graphql-http*/
const grapqlHttp = require("graphql-http/lib/use/express")
const graphiql = require('express-graphiql-explorer');

const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers');
const isAuth = require('./middleware/auth');

const {deletePath} = require('./util/fileHelper');


const MONGODB_URI = 'mongodb+srv://Nodejs:Nodejspassword@cluster0.rj3wp52.mongodb.net/GRAPHQL?retryWrites=true&w=majority&appName=Cluster0'

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        callback(null, uuid() + '-' + file.originalname)
        //callback(null, uuid());
    }
});

const fileFilter = (req, file, callback) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        callback(null, true);
    }else{
        callback(null, false);
    }
}

app.use((req, res, next) => {
    console.log(req.url,req.method)
    next()
})

//app.use(bodyParse.urlencoded())// for x-ww-form-urlencoded
app.use(bodyParse.json()); //for application/json
app.use(multer( {storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images',express.static(path.join(__dirname,'images')));

/* //windows cors pblm so directly download cors package.if not below header is set
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');//access to all client
    res.setHeader('Access-Control-Allow-Method', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE');//we can allow whatever we want too
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');//we can alose set wildcard '*'
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next()
})
 */
app.use(cors())

/*set authentication true or false*/ 

app.use(isAuth);

/*graphql(can hanlde only json) can not handle image, so adding endpoint for image*/
//REST API. now this image path handled in frontend and new req is sent to create post with image path which is created now
app.put('/post-image', (req, res, next) => {
    if(!req.isAuth){
        throw new Error('not authenticated')
    }
    if(!req.file){
        return res.status(200).json({ message: 'no file provided'})
        //sending status(200)bcz in update/edit if same image then file is not set
    }
    if(req.body.oldpath){
        deletePath(req.body.oldpath);
    }
    return res.status(201).json( {message: 'file stored', filePath: req.file.path.replace('\\','/')})
})

/** EXPRESS-GRAPHIQL-EXPLORER PACKAGE */
/** note: /graphiql endpoint */
app.use(
    '/graphiql',
    graphiql({
        defaultQuery: `query MyQuery {}`,
         graphQlEndpoint: '/graphql',
    })
);
/* 
app.all('/graphql', (req, res) =>
     createHandler({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    context: { req, res },
    formatError(err){//original error is set by graphql,by me and third party package. technical error ie missing character in query then wil not have original error.
        if(!err.originalError){
            //console.log('not an original error')
            return err
        }
        const data = err.originalError.data;
        const message = err.message || 'an error occured';
        const code =  err.originalError.code || 500;
        return { message: message, status: code, data: data}
    }
})(req, res)
) */

/** GRAPHQL-HTTP CONFIGURATION */
app.all('/graphql', (req, res) =>
    grapqlHttp.createHandler({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        context: { req, res },
        formatError(err) {
            if (!err.originalError) {
                return err;
            }
            const data = err.originalError.data;
            const message = err.message || 'An error occurred.';
            const code = err.originalError.code || 500;
            return {
                message: message,
                status: code,
                data: data,
            };
        },
    })(req, res)
);

/*error handling*/
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json( {
        message: message,
       // data: data//optional
    });

})

mongoose.connect( MONGODB_URI)
.then( () => {
    console.log('CONNECTED TO MONGODB via MONGOOSE')
    app.listen(8080,console.log("api server running on PORT 8080"));
})
.catch(err => console.log(err));