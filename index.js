const inquirer = require('inquirer');
const mysql = require('mysql2');
const Table = require('cli-table');

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
                case 'view all departments': displayDepartment();
                break;
                case 'view all roles': displayRole();
                break;
                case 'view all employees' : displayEmployees();
                break;
                case 'add a department': addDepartment();
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

function displayDepartment() {
    db.query("SELECT * FROM department", function (err, res) {
        if(res){
            let table = new Table({
                head: ["Dept_id","Departments"],
                colWidths: [10, 20]
            });
            for(let i = 0; i < res.length; i++){
                table.push([res[i].id, res[i].department_name]);
            }
            console.log(table.toString());
            return init();
        }
        else{
            console.log("No departments found");
            return init();
        }
    });
}

function displayRole() {
    db.query("SELECT * FROM role", function (err, res) {
        if(res){
            let table = new Table({
                head: ["Role_id", "Title", "Salary", "Dept_id"],
                colWidths: [10, 20, 10, 10]
            });
            for(let i = 0; i < res.length; i++){
                table.push([res[i].id, res[i].title, res[i].salary, res[i].department_id]);
            }
            console.log(table.toString());
            return init();
        }
        else{
            console.log("No roles found");
            return init();
        }
    });
}

function displayEmployees() {
    db.query('SELECT a.id, a.first_name, a.last_name, role.title, department.department_name, role.salary, IFNULL(CONCAT(b.first_name," ", b.last_name),"null") AS supervisor FROM employee a INNER JOIN role ON a.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee b ON a.manager_id = b.id', function (err, res) {
        if(res){
            let table = new Table({
                head: ["Employee ID", "First Name", "Last Name", "Role", "Department", "Salary", "Manager"],
                colWidths: [15, 15, 15, 15, 15, 15, 15]
            });
            for(let i = 0; i < res.length; i++){
                table.push([res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].department_name, res[i].salary, res[i].supervisor]);
            }
            console.log(table.toString());
            return init();
        }
        else{
            console.log("No employees found");
            return init();
        }
    });
}

function addDepartment(){
    inquirer.prompt([{name: "dept", message: "What is the name of the Department?", }])
            .then((results) => {
                db.query('INSERT INTO department(department_name) VALUES (?)', results.dept, function (err, res){
                    if(res){
                        return displayDepartment();
                        
                    }
                    else{
                        console.log("Unable to add employee");
                        return init();
                    }
                })
            })
}