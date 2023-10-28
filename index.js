const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
)

db.query(`SELECT *`, function (err, results){
    if(results){
        console.log(results);
    }
    else{
        console.log("no response returned");
    }
})