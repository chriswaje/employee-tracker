const { prompt } = require('inquirer');
const db = require('./db/dbConnections');

const init = function () {
    prompt([
        {
            type: 'list',
            name: 'home',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update and employee role',
                'Quit',
            ],
        },
    ])
    .then(({ home }) => {
        if (home === 'View all departments') {
            viewDepartments()
        } else if (home === 'View all roles') {
            viewRoles()
        } else if (home === 'View all employees') {
            viewEmployees()
        } else if (home === 'Add a department') {

        }
    })
};

function viewDepartments() {
    db.query('SELECT * FROM departments', (err, res) => {
        console.table(res);
        init()
    })
};

function viewRoles() {
    db.query('SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id', (err, res) => {
        console.table(res);
        init();
    });
};

function viewEmployees() {
    db.query('SELECT employees.id, employees.first_name, employees.last_name, roles.salary AS salary, roles.title AS title, departments.name AS department, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees manager ON manager.id = employees.manager_id', (err, res) => {
        if (err) {
            console.log(err)
        };
        console.table(res);
        init();
    });
};



init();