const Sequelize = require('sequelize');
/*give class or constructor function*/
const sequelize = new Sequelize('nodejs', 'root', 'P@ssw0rd', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;