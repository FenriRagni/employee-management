const mysql = require('mysql2');
const Table = require('cli-table');

function displayDepartment(db){
    db.query("SELECT department_name FROM department", function (err, res) {
        if(!err){
            let table = new Table({
                head: ["Departments"],
                colWidths: [20]
            });
            for(let i = 0; i < res.length; i++){
                table.push([res[i].department_name]);
            }
        }
        else{
            return err;
        }
    });
    return table;
}

function addDepartment(db, name){
    db.query("INSERT INTO department(department_name) VALUE(?)", name, function(err, res){
        if(!err){
            return displayDepartment(db);
        }
    })
}

module.exports = {displayDepartment, addDepartment};