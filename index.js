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
async function dbConnection() {
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
            case 'View All Departments':
                returnedRowsFromDb = await db.query('SELECT * FROM department');
                console.table(returnedRowsFromDb); // needs to be part of array?
                break;


            case 'View All Roles':
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

            case 'View All Employees':
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
                `
                );
                    

        }
    } catch (err) {
        console.log(err)
    }

};

