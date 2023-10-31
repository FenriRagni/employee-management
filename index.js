const inquirer = require('inquirer');
const mysql = require('mysql2');
const Table = require('cli-table');
const {addDepartment, displayDepartment}= require('./lib/department.js');

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

function init(){
    inquirer
        .prompt([{
            type: 'list',
            name: 'choice',
            message: 'Choose an option',
            choices: ['view all departments','view all roles', 'view all employees',
            'add a department', 'add a role', 'add an employee',
            'update employee role'],
            loop: 'true'
        }])
        .then((results) => {
            switch(results.choice){
                case 'view all departments': console.log(displayDepartment(db).toString());
                    init();
                break;
                case 'view all roles':
                break;
                case 'view all employees':
                break;
                case 'add a department': 
                break;
                case 'add a role':
                break;
                case 'add an employee':
                break;
                case 'update employee role':
                break;
            }
        });
}

init();