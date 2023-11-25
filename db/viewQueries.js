// VIEW ALL DEPARTMENTS
const viewDepts = function (db) {
    db.query('SELECT * FROM departments');
    // insert function to return to home directory
};

// VIEW ALL ROLES
const viewRoles = function (db) {
    db.query('SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id');
    // insert function to return to home directory
};

// VIEW ALL EMPLOYEES
const viewEmployees = function (db) {
    db.query(
        'SELECT employees.id, employees.first_name, employees.last_name, roles.salary AS salary, roles.title AS title, departments.name AS department, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM roles JOIN employees manager ON manager.id = employees.manager_id JOIN employees ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id'
        );
    // insert function to return to home directory
};
