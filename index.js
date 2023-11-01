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
            'update employee role','quit'],
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
                case 'add a role': addRole();
                break;
                case 'add an employee': addEmployee();
                break;
                case 'update employee role':
                break;
                case'quit': process.exit();
            }
            
        });
}

init();

function displayDepartment() {
    db.query("SELECT * FROM department", function (err, res) {
        if(res){
            console.log(res);
            let table = new Table({
                head: ["Dept_id","Departments"],
                colWidths: [10, 20]
            });
            for(let i = 0; i < res.length; i++){
                table.push([res[i].id, res[i].department_name]);
            }
            console.log("\n" + table.toString());
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
            console.log("\n" + table.toString());
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
            console.log("\n" + table.toString());
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
                console.log(`Added ${results.dept} to database`);
                return init();
                
            }
            else{
                console.log("Unable to add department");
                return init();
            }
        })
    })
}

function addRole() {
    db.query("SELECT * FROM department", function (err, res){
        let dept = [];
        for(let x = 0; x < res.length; x++){
            dept.push(res[x].department_name);
        }
        inquirer.prompt(
            [
                {name: "title", message: "What is the role title?"}, 
                {name: "salary", message: "What is the role's salary?"},
                {type: "list", name: "department_id", message: "What department does this role belong to?", choices: dept}
            ])
        .then((results) => {
            db.query('INSERT INTO role(title, salary, department_id) VALUES (? , ? , ?)', 
            [results.title, parseFloat(results.salary), parseInt(res[dept.indexOf(results.department_id)+1].id)], function (err, res){
                if(res){
                    console.log(`Added ${results.title} role to database`)
                    return displayRole();  
                }
                else{
                    console.log("Unable to add role");
                    return init();
                }
            })
        })
    })
    
}

function addEmployee(){
    inquirer.prompt(
        [
            {name: "first", message: "Employee's first name: "},
            {name: "last", message: "Employee's last name: "},
            {name: "role", message: "Employee's role id: "},
            {name: "manager", message: "Employee's manager's id: "}
        ]
    )
    .then((results) => {
        db.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ? , ?, ?)',
        [results.first, results.last, parseInt(results.role), parseInt(results.manager)], function(err, res){
            if(res){
                return displayEmployees();
            }
            else{
                console.log("Unable to add employee");
                return init();
            }
        })
    })
}

function updateEmployee() {
    inquirer.prompt(
        [
            {name: "id", message: ""}
        ])
}