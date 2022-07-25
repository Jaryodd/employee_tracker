const {userPrompt} = require('./index');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db'
});



const Department = () => {
    connection.query(
        `SELECT * FROM department`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.table(results);
            userPrompt();
        }
    )
}

const addDepartment = () => {
    inquirer
        .prompt({
            type: 'text',
            name: 'dep_name',
            message: 'Enter the name of the department you would like to add: '
        })
        .then((data) => {
            connection.query(
                `INSERT INTO department (name)
                VALUES(?)`,
                [data.dep_name],
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    console.log('Department Added.');
                    userPrompt();
                }
            )
        })
}

module.exports = { Department, addDepartment }