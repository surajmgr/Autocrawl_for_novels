const Pool = require('pg').Pool;
require('dotenv').config()

const pool = new Pool({
    user: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: 'autocrawl'
});

const q = `SELECT NOW() AS now;`
pool.query(q, (err, data) => {
    if (err) return console.log(err);
    console.log('Database connected at... ' + data.rows[0].now);
})

module.exports = {
    pool
}
