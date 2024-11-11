const SequelizeClass = require('sequelize');

const sequelize = require('../util/database');

/*model.... product table is created*/
const Product = sequelize.define('product',{
    id: {
        type: SequelizeClass.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true//define primary key of the table.
        //for retriving the data and also for defining relations.
    },
    title: SequelizeClass.STRING, //if we're setting only type then this is shortcut method
    price: {
        type: SequelizeClass.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: SequelizeClass.STRING,
        allowNull:false
    },
    description: {
        type: SequelizeClass.STRING,
        allowNull: false
    }
});

module.exports = Product;