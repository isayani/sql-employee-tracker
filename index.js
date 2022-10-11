// importing package files
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Encryption for env file
require("dotenv").config();

// dotenv variables
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

// Connect to staff db
async function dbConnection(select) {
    try {
        const db = await mysql.createConnection (
            {
                host: 'localhost',
                user: dbUser,
                password: dbPassword,
                database: dbName,
            }
        );

        // empty variables for query returns and prompt responses
        let returnedRowsFromDb = [];
        let returnedOutputFromInq = {};

        // switch for all user input cases
        switch (select) {
            case 'View All Departments': // id, name
                returnedRowsFromDb = await db.query('SELECT * FROM department');
                console.table(returnedRowsFromDb); // needs to be part of array?
                break;


            case 'View All Roles': // role id, job title, department value, salary value
                returnedRowsFromDb = await db.query(`
                SELECT
                    role.id,
                    role.title,
                    role.salary,
                    department.name AS department
                FROM role
                JOIN department ON role.department_id = department.id
                `);
                console.table(returnedRowsFromDb); // needs to be part of array?
                break;

            case 'View All Employees': // employee id, first name, last name, job title, department, salary and manager
                returnedRowsFromDb = await db.query(`
                SELECT
                    employee.id,
                    employee.first_name,
                    employee.last_name,
                    role.title AS title,
                    department.name AS department,
                    role.salary AS salary,
                    CASE WHEN manager_id IS NOT NULL THEN CONCAT(manager_table.first_name,' ', manager_table.last_name) ELSE NULL END AS manager
                FROM employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                JOIN employee manager_table ON employee.manager_id = manager_table.id
                `);
                console.table(returnedRowsFromDb); // needs to be part of array?
                break;

            case 'Add a Department': // enter name; department added to db
                returnedOutputFromInq = await inquirer.prompt([
                    {
                        name: 'department',
                        message: 'Enter New Department Name:',
                        
                    }
                ]);
            case 'Add a Role': // enter name, salary, department; role added to db
                returnedOutputFromInq = await inquirer.prompt([
                    {
                        name: 'roleName',
                        message: 'Enter New Role Name:',
                        
                    },
                    {
                        name: 'roleSalary',
                        message: 'Enter New Role Salary:',
                        
                    },
                    {
                        name: 'roleDpt',
                        message: 'Enter New Role Department:',
                        
                    },
                ]);
            case 'Add an Employee': // enter employee fname, lname, role, manager; employee added to db
                returnedOutputFromInq = await inquirer.prompt([
                    {
                        name: 'empFname',
                        message: "Enter New Employee's First Name:",
                        
                    },
                    {
                        name: 'empLname',
                        message: "Enter New Employee's Last Name:",
                        
                    },
                    {
                        name: 'empRole',
                        message: "Enter New Employee's Role:",
                        
                    },
                    {
                        name: 'empMgr',
                        message: "Enter New Employee's Manager:",
                        
                    },
                ]);

            case 'Update an Employee Role': // select employee, update role; updated in db
                    

        }
    } catch (err) {
        console.log(err)
    }

};

function userPrompt(){
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'select',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    'Update an Employee',
                    new inquirer.Separator(),
                    'Quit',
                
                ]
            }
        ])
        .then(async(res) => {
            await dbConnection(res.select);
            res.select === 'Quit' 
            ? process.exit 
            : userPrompt()
        })
        .catch((err) => {
            if (error.isTtyError) {
                
            } else {
                err; // may have to add display
            }
        });
}

userPrompt();

