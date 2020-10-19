const mysql2 = require('mysql2');
const inquirer = require('inquirer');

// Creates the connection
const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3001

});

connection.connect(function(err) {
    if(err) throw err;
    console.log('success');
    startMenu();
});

function startMenu() {
    inquirer.prompt({
        name: "Welcome",
        type: "list",
        message: "What would you like to do? [Add] an employee?, [View] an employee?, [Update] an employee?, or [Delete] an employee?",
        choices: ["Add", "View", "Update", "Delete", "Quit"]
    }).then(function(answer){
        switch(answer.Welcome){
            case "Add":
                addEmployee();
                break;
            case "View":
                viewEmployee();
                break;
            case "Update":
                updateEmployee();
                break;
            case "Delete":
                deleteEmployee();
                break;
            default:
                process.exit(1);
                break;
        }
    })
};