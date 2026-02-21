/* 
main endpoint.
package : 1. express
          2. nodemon (dev)
          3. mssql
          4. dotenv
*/
require('dotenv').config({ path: './config.env' });
const { main } = require('./server');
main();