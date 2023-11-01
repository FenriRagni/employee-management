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
                case 'update employee role': updateEmployee();
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
    db.query('SELECT a.id, a.first_name, a.last_name, role.title, department.department_name, role.salary, IFNULL(CONCAT(b.first_name," ", b.last_name),"null") AS manager FROM employee a INNER JOIN role ON a.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee b ON a.manager_id = b.id', function (err, res) {
        if(res){
            let table = new Table({
                head: ["Employee ID", "First Name", "Last Name", "Role", "Department", "Salary", "Manager"],
                colWidths: [15, 15, 15, 15, 15, 15, 15]
            });
            for(let i = 0; i < res.length; i++){
                table.push([res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].department_name, res[i].salary, res[i].manager]);
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
        console.log(res);
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
            [results.title, parseFloat(results.salary), parseInt(res[dept.indexOf(results.department_id)].id)], function (err, res){
                if(res){
                    console.log(`Added ${results.title} role to database`)
                    return init();  
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
    let dept =[];
    let employees = ['null'];
    db.query('SELECT role.id, CONCAT(department.department_name, " ", role.title) AS title FROM role INNER JOIN department ON role.department_id = department.id', function(err, res){
        for(let x = 0; x < res.length; x++){
            dept.push(res[x].title);
        }
        db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', function(err,res2){
            for(let x = 0; x < res2.length; x++){
                employees.push(res2[x].name);
            }
            inquirer.prompt(
                [
                    {name: "first", message: "Employee's first name: "},
                    {name: "last", message: "Employee's last name: "},
                    {type: "list", name: "role", message: "What is the employee's role?", choices: dept},
                    {type: "list", name: "manager", message: "Who is the employee's Manager?", choices: employees}
                ]
            )
            .then((results) => {
                console.log(results.manager);
                if(results.manager === "null"){
                    db.query('INSERT INTO employee(first_name, last_name, role_id) VALUES (?, ? , ?)',
                         [results.first, results.last, parseInt(res[dept.indexOf(results.role)].id)] , function(err, res3){
                    if(res3){
                        console.log(`Added ${results.first} ${results.last} to the database`);
                        return init();
                    }
                    else{
                        console.log("Unable to add employee");
                        return init();
                    }
                })
                }
                else{
                    db.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ? , ?, ?)',
                         [results.first, results.last, parseInt(res[dept.indexOf(results.role)].id), parseInt(res2[employees.indexOf(results.manager)-1].id)] , function(err, res3){
                    if(res3){
                        console.log(`Added ${results.first} ${results.last} to the database`);
                        return init();
                    }
                    else{
                        console.log("Unable to add employee");
                        return init();
                    }
                    })
                }
            })
        })
    })
    
}

function updateEmployee() {
    let roles = [];
    let employees = [];
    db.query("SELECT id, title FROM role", function(err, res){
        for(let x = 0; x < res.length; x++){
            roles.push(res[x].title);
        }
        db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', function(err,res2){
            for(let x = 0; x < res2.length; x++){
                employees.push(res2[x].name);
            }
            inquirer.prompt(
                [
                    {type: "list", name: "name", message: "Which employee's role do you want to update?", choices: employees},
                    {type: "list", name: "role", message: "What role would you like to assign?", choices: roles}
                ]
            )
            .then((results) => {
                db.query('UPDATE employee SET role_id = ? WHERE id = ?', 
                [res[roles.indexOf(results.role)].id, res2[employees.indexOf(results.name)].id], function(err, res3){
                    if(res3){
                        console.log(`Updated ${res2.name}'s role`);
                        return init();
                    }
                })
            })
        })
    })
}