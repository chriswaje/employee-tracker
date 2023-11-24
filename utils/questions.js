const homeQuestions = function () {
    return [
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
    ]
};


module.exports = [ homeQuestions ]