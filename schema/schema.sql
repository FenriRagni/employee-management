DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
id INT AUTO_INCREMENT NOT NULL,
department_name VARCHAR(100) NOT NULL UNIQUE,
PRIMARY KEY (id)
);

CREATE TABLE role (
id INT AUTO_INCREMENT NOT NULL,
title VARCHAR(100),
salary DECIMAL,
department_id INT ,
FOREIGN KEY(department_id)
REFERENCES department(id)
ON DELETE SET NULL,
PRIMARY KEY(id)
);

CREATE TABLE employee (
id INT AUTO_INCREMENT NOT NULL,
first_name VARCHAR(100),
last_name VARCHAR(100),
role_id INT,
manager_id INT,
FOREIGN KEY(role_id)
REFERENCES role(id),
FOREIGN KEY (manager_id)
REFERENCES employee(id),
PRIMARY KEY(id)
);