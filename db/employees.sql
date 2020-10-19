CREATE TABLE employee (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id VARCHAR(30),
    manager_id VARCHAR(30) DEFAULT '' NOT NULL
);

CREATE TABLE department (
    id INTEGER PRIMARY KEY,
    department_name VARCHAR(50) DEFAULT '' NOT NULL,
);

CREATE TABLE role (
  id INTEGER PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL default 0,
  department_id INTEGER NOT NULL
);

INSERT INTO department(department_name)
VALUES
('Front End Development'),
('Back End Development'),
('Full Stack Development'),
('HR'),
('Accounting');

INSERT INTO role(title, salary, department_id)
VALUES
('Regional Manager', 100000, 0),
('Front End', 90000, 1),
('Back End', 90000, 2),
('Full Stack', 95000, 3),
('HR Manager', 80000, 4),
('Asst to the Reg Mngr', 90001, 5);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('Jim', 'Halpert', 2, 1),
('Michael', 'Scott', 1, 0),
('Dwight', 'Schrute', 5, 0),
('Toby', 'Flenderson', 4, 0);