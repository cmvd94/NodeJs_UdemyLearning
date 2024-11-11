const db = require('./util/database');

/*select all from table that we create in mysql app*/
/*we have used promises */ 

/* db.execute('SELECT * FROM products')
  .then( result => console.log(result))//return nested array . stored data and some meta data
  .catch(err => console.log(err))
 */
//result will be of nested array, in which one is table which we created and other is meta data.

/* db.execute('SELECT * FROM products')
  .then( ([row, metadata]) => {
    console.log(Object.values(row[0]))
    console.log(Object.values(row[1]))
    
    console.log(Object.values(metadata[0]))

  })
  .catch(err => console.log(err)) */
/* 
  db.execute('SELECT * FROM products')
  .then( (result) => {
    console.log(Object.values(result))
    console.log(Object.values(result[0]))
    console.log(Object.values(result[0][0]))
  })
  .catch(err => console.log(err))
 */

  db.execute('SELECT * FROM products')
  .then( ([row]) => {
    console.log(row[0])
    console.log(Object.values(row[1]))
  

  })
  .catch(err => console.log(err))