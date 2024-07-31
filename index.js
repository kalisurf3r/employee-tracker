const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool({
      user: 'postgres',
      password: 'kali',
      host: 'localhost',
      database: 'movie_db'
    });
  
  pool.connect()
  .then(() => console.log(`Connected to the movie_db database.`))
  .catch(err => console.log(err));

  const mainMenu = () => {
    inquirer
    .prompt([
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View all Departments', 'View all Roles', 'View all Employees', 
            'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role'],
    },
    ])
    .then ((answers) => {
        switch (answers.action) {
            case 'View all Departments':
                viewDepartments();
                break;
            case 'View all Roles':
                viewRoles();
                break;
            case 'View all Employees':
                viewEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployeeRole();
                break;
            default:
                console.log('Invalid action');
                mainMenu();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
      });
    };

    function viewDepartments() {
        pool.query('SELECT * FROM department', (err, res) => {
            if (err) {
                console.log(err);
            } else {
            console.table(res.rows);
            mainMenu();
            }
        });
    }

    function viewRoles() {
        pool.query('SELECT * FROM role', (err, res) => {
            if (err) {
                console.log(err);
            } else {
            console.table(res.rows);
            mainMenu();
            }
        });
    }

    function viewEmployees() {
        pool.query('SELECT * FROM employee', (err, res) => {
            if (err) {
                console.log(err);
            } else {
            console.table(res.rows);
            mainMenu();
            }
        });
    }

    const addDepartment = () => {
        inquirer
        .prompt ([
            {
                type: 'input',
                name: 'department',
                message: 'Enter the name of the department you would like to add.',
            },
        ])
        .then ((answer) => {
            pool.query('INSERT INTO department (name) VALUES ($1)', [answer.department], (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Department ${answer.departmentName} added successfully.`);
                    mainMenu();
                }
            });
        });
    }

    function addRole() {
        inquirer
        .prompt ([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role you would like to add.'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary of the role you would like to add.'
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'Enter the department ID of the role you would like to add.'
            }
        ])
        .then ((answers) => {
            pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id], (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Role ${answers.roleTitle} added successfully.`);
                    mainMenu();
                }
            });
        });
    }

    function addEmployee() {
        inquirer
        .prompt ([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter the first name of the employee you would like to add.'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter the last name of the employee you would like to add.'
            },
            {
                type: 'input',
                name: 'role_id',
                message: 'Enter the role ID of the employee you would like to add.'
            },
            {
                type: 'input',
                name: 'manager_id',
                message: 'Enter the manager ID of the employee you would like to add.'
            }
        ])
        .then ((answers) => {
            const managerId = answers.manager_id ? answers.manager_id : null;
            pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Employee ${answers.firstName} ${answers.lastName} added successfully.`);
                    mainMenu();
                }
            });
        });
    }

    function updateEmployeeRole() {
        inquirer
        .prompt ([
            {
                type: 'input',
                name: 'employee_id',
                message: 'Enter the ID of the employee whose role you would like to update.'
            },
            {
                type: 'input',
                name: 'role_id',
                message: 'Enter the new role ID of the employee.'
            }
        ])
        .then ((answers) => {
            pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id], (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Employee ID ${answers.employeeId} role updated to ${answers.newRoleId}.`);
                    mainMenu();
                }
            });
        });
    }

    mainMenu();