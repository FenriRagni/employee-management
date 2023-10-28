const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
)

db.query(`INSERT INTO department(name) VALUES ("Grocery");`, function(err, results){
    console.log(results);
});
db.query(`SELECT * FROM department;`, function (err, results){
    console.log(results);
});

