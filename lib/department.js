const mysql = require('mysql2');
const inquirer = require('inquirer');

class Department{
    constructor(db){
        this.db = db;
    }
    
    createDepartment(db, name){
        db.query(`INSERT INTO department(name) VALUE ("${name}");`)
    };

    
    deleteDepartment(db, id){
    db.query(`DELETE FROM department WHERE id = ${id};`)
    }
}
module.exports = Department;