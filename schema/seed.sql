USE employee_db;

INSERT INTO department (department_name)
VALUES ("Grocery"),
("Bakery"),
("Produce"),
("Prepared Foods"),
("Floral"),
("Front End");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 41600.00, 2),
("Assistant Manager", 35587.50, 2),
("Clerk", 29250.00, 2),
("Sous Chef", 37050.00, 4);