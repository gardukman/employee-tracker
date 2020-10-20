const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const { exit } = require('process');

// Creates the connection
const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3001

});

connection.connect(function (err) {
    if (err) throw err;
    console.log('success');
    startPrompt();
});

function startPrompt() {
    inquirer.prompt({
        name: "Welcome",
        type: "list",
        message: "What would you like to do? [Add] an employee?, [View] the company?, [Update] an employee?, or [Delete] an employee?",
        choices: ["Add", "View", "Update", "Delete", "Quit"]
    }).then(function (answer) {
        switch (answer.Welcome) {
            case "Add":
                addMenuPrompt();
                break;
            case "View":
                viewCompanyPrompt();
                break;
            case "Update":
                updateEmployeePrompt();
                break;
            case "Delete":
                deleteEmployeePrompt();
                break;
            default:
                process.exit(1);
                break;
        }
    })
};

function addMenuPrompt() {
    inquirer.prompt({
        name: "AddMenu",
        type: "list",
        message: "What would you like to do? Add an [Employee]? Add a [Roll]? Add a [Department]? or go [Back]?",
        choices: ["Employee", "Role", "Department", "Back"],
    }).then(function (answer) {
        switch (answer.AddMenu) {
            case "Employee":
                addEmployee();
                break;
            case "Roll":
                addRoll();
                break;
            case "Department":
                addDepartment();
                break;
            default:
                startPrompt();
                break;
        }
    })
};

function viewCompanyPrompt() {
    inquirer.prompt({
        name: "View",
        type: "list",
        message: "What would you like to do? View [Employees]? View [Roles]? View [Departments]? Or [Exit]?",
        choices: ["Employees", "Roles", "Departments", "Exit"]
    }).then(function (answer) {
        switch (answer.View) {
            case "Employee":
                viewEmployee();
                break;
            case "Roles":
                viewRoles();
                break;
            case "Department":
                viewDepartment();
                break;
            default:
                startPrompt();
                break;
        }
    })
};

function addEmployee(){
    let empPromptQs = [
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "surname",
            message: "What is the employee's surname?"
        },
        {
            type: "input",
            name: "role",
            message: "What is the employee's role_id (enter a number)?",
            validate: function(value) {
                let valid = !isNaN(parseFloat(value));
                return valid || "Please enter a number.";
                filter: Number
            }
        },
        {
            type: "input",
            name: "manager",
            message: "What is the employee's manager_id?",
            validate: function(value) {
                let valid = !isNaN(parseFloat(value));
                return valid || "Please enter a number.";
                filter: Number
            }
        },
    ];
    inquirer.prompt(empPromptQs).then(function(employee){
        connection.query(`INSERT INTO employee SET ?`,
        {
            first_name: employee.firstName,
            surname: employee.surname,
            role_id: employee.role,
            manager_id: employee.manager
        },
        function (err) {
            if (err) throw err;
            console.log("Successfully added employee.");
            console.log('\n');
            addMenuPrompt();
        });
    });
};

function addRole(){
    roleQuestions = [
        {
            type: "input",
            message: "What is the title of the role you'd like to add?",
            name: "title"
        },
        {
            type: "input",
            message: "What is the salary for this role?",
            name: "salary",
            validate: function (value) {
                let valid = !isNaN(parseFloat(value));
                return valid || "Please enter a number.";
            },
            
        },
        {
            type: "input",
            message: "What is the department ID?",
            name: "departmentID",
            validate: function(value) {
                let valid = !isNaN(parseFloat(value));
                return valid || "Please enter an number.";
            }
        }
    ];
    inquirer.prompt(roleQuestions).then(function (addNewRole) {
        connection.query(`INSERT INTO role SET ?`,
        {
            title: addNewRole.title,
            salary: addNewRole.salary,
            department_id: addNewRole.deptID
        },
        function (err) {
            if (err) throw err;
            console.log('Successfully added department.');
            addMenuPrompt();
        });
    });
};

function addDepartment(){
    let departmentQuestions = [
        {
            type: "input",
            message: "What is the name of the department?",
            name: "departmentName"
        }
    ];
    inquirer.prompt(departmentQuestions).then(function(newDepartment) {
        connection.query(`INSERT INTO department SET ?`,
        {
            Dept_name: newDepartment.departmentName,
        },
        function(err){
            if(err)throw err;
            console.log("Successfully added department.");
            startPrompt();
        });
    });
};

function viewEmps(){
    connection.query(`SELECT employee.first_name, employee.surname, role.title, department.Dept_Name, role.salary, employee.manager_id FROM employee e INNER JOIN role r ON employee.role_id = role.id INNER JOIN department d ON role.department_id = department.id;`, function (err, res) {;
    if(err) throw err;
        console.table(res);
        view();
    });
};

function viewRoles() {
    connection.query(`SELECT * FROM role `, function(err, res){
        if (err) throw err;
        console.table(res);
        view();
    });
};

function viewDepts() {
    connection.query(`SELECT * FROM department `, function(err, res) {
        if(err) throw err;
        console.table(res);
        view();
    });
};

function update() {
    let getEmp = [
        {
            type: "input",
            message: "Enter the Employee ID you want to update.",
            name: "employeeID",
            validate: function(value) {
                let valid = !isNaN(parseFloat(value));
                filter: Number
            }
        },
        {
            type: "input",
            message: "Enter the Role ID you want to update.",
            name: "employeeRole",
            validate: function(value) {
                let valid = !isNaN(parseFloat(value));
                return valid || "Please enter a number.";
                filter: Number
            }
        }
    ];

    inquirer.prompt(getEmp).then(function(name){
        connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [name.employeeRole, name.employeeID], function(err, result) {
            if (err) { console.log("We can't find that ID or are running into another problem.") }else
            console.log("Successfully updated employee ID to " + name.employeeID);
            startPrompt();
        });
    });
};

function deleteEmployee() {
    let getEmp = [
        {
            type: "input",
            message: "Please enter the Employee ID you want to delete.",
            name: "employeeID",
            validate: function (value) {
                let valid = !isNaN(parseFloat(value));
                return valid || "Please enter a number.";
                filter: Number
            }
        }
    ];

    inquirer.prompt(getEmp).then(function (name) {
        connection.query(`DELETE FROM employee WHERE id = ?`, name.employeeID, function(err, result) {
            if(err){console.log("We can't find that ID or are running into another problem.")};
            console.log("Successfully deleted employee ID of " + name.employeeID);
            startPrompt();
        });
    });
};