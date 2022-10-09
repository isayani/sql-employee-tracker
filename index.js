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
    } catch (err) {
        console.log(err)
    }

};

