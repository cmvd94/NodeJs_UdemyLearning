const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pageUnmatched = require('./routes/404');

const sequelize = require('./util/database');
const ProductModel = require('./model/Product');
const UserModel = require('./model/user');
const CartModel = require('./model/cart')
const CartItemModel = require('./model/cart-item');
const OrderModel = require('./model/order')
const OrderItemModel = require('./model/order-item');

//adding middleware for UserModel
//defining for which user request is coming
//this code will run only for incoming req from user
app.use( (req, res, next) => {
    UserModel.findByPk(1)
    .then( user => {
        //console.log(`user --- ${user}`)
        //console.log(`user --- ${Object.values(user)}`)
        //console.log(`user --- ${user[0]}`)

        req.user = user;
        //adding new field in req obj
        //user not just storing an object. its a Sequelize Object in which we can execute our sequelize command
        next()
        //from now on all operation are done by dummy user
    })
    .catch(err => console.error(err));
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(pageUnmatched);

/*associaton*/
//User created this Product       
//{..condition..} is optional , how the relation should be, if user deleted then related product also deleted
ProductModel.belongsTo(UserModel, { constraints: true, onDelete: 'CASCADE'});
UserModel.hasMany(ProductModel);//one user has many product 
/*we already created Product table it will not overwrite new info. so we have force it by setting sync( force: true) */

UserModel.hasOne(CartModel);
CartModel.belongsTo(UserModel);//same
CartModel.belongsToMany(ProductModel, {through: CartItemModel});
ProductModel.belongsToMany(CartModel, {through: CartItemModel});
/*works only intermediate table that connect them, that store product id and cart id*/
OrderModel.belongsTo(UserModel);
UserModel.hasMany(OrderModel);
OrderModel.belongsToMany(ProductModel, {through: OrderItemModel});
ProductModel.belongsToMany(OrderModel, {through: OrderItemModel});

/*it sync model in database by creating the appropriate table*/
sequelize
//.sync( {force: true})
.sync()
.then( () => {
    return UserModel.findByPk(1);
})
.then( user => {
    if(!user){
        //creating dummy user
        return UserModel.create( { name: 'vishnu', email: 'vishnu@gmail.com'})
    }else{
        return user;
    }
})
.then( user => {
    return user.createCart()   
})
.then( () => {
    app.listen(3000);
})
.catch(err => {
    console.error(err);
})