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
                return valid || "Enter in a number value.";
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

