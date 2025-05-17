var mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'app',
    password: '',
    
})


connection.getConnection((err, result) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("DB Connection Done....")
    }
})


module.exports = connection;
