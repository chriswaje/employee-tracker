const { prompt } = require('inquirer');
const db = require('./db/dbConnections');
const utils = require('util');
db.query = utils.promisify(db.query);

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
                addDepartment()
            } else if (home === 'Add a role') {
                addRole()
            } else if (home === 'Add an employee') {
                addEmployee()
            }
        })
};

function viewDepartments() {
    db.query('SELECT * FROM departments', (err, res) => {
        if (err) {
            console.log(err)
        };
        console.table(res);
        init()
    })
};

function viewRoles() {
    db.query('SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id', (err, res) => {
        if (err) {
            console.log(err)
        };
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

async function addDepartment() {
    const { department } = await prompt([
        {
            type: "input",
            name: "department",
            message: "What is the name of the department?"
        },
    ]);
    await db.query(`INSERT INTO departments(name) VALUES (?)`, [department], (err) => {
        if (err) {
            console.log(err)
        };
        console.log('New department added to database');
        init();
    });
};

async function addRole() {
    const depts = await db.query("SELECT id AS value, name AS name FROM departments");
    const { role_title, role_salary, role_department } = await prompt([
        {
            type: "input",
            name: "role_title",
            message: "Enter the title of the new role"
        },
        {
            type: "input",
            name: "role_salary",
            message: "Enter a salary for the new role"
        },
        {
            type: "list",
            name: "role_department",
            message: "Which department does role belong to?",
            choices: depts
        }
    ]);
    await db.query(`INSERT INTO roles (title, salary, department_id) values (?, ?, ?)`, [role_title, role_salary, role_department], (err) => {
        if (err) {
            console.log(err)
        };
        console.log('New role added to database');
        init();
    });
};

async function addEmployee() {
    const roles = await db.query("SELECT id AS value, title AS name FROM roles");
    const managers = await db.query("SELECT manager_id AS value, first_name last_name AS name FROM employees");
    const { first_name, last_name, employee_role, employee_manager } = await prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?"
        },
        {
            type: "list",
            name: "employee_role",
            message: "What is the employee's role?",
            choices: roles
        },
        {
            type: "list",
            name: "employee_manager",
            message: "Who is the employee's manager?",
            choices: managers || "Null"
        }
    ]);
    await db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [first_name, last_name, employee_role, employee_manager], (err) => {
        if (err) {
            console.log(err)
        };
        console.log('New employee added to database');
        init();
    });
 
};


init();