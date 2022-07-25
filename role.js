const { promptUser } = require('./index');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db'
});

const showRoles = () => {
    connection.query(
        `SELECT roles.id, roles.title, roles.salary, department.name
            FROM roles
            JOIN department    
            ON roles.department_id = department.id `,
        function (err, results) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.table(results);
            promptUser();
        }
    );
};

const addRole = () => {
    connection.query(
        `SELECT * FROM department`,
        function (err, results) {
            if (err) {
                console.log(err);
                return;
            }

            let depArray = [];
            results.forEach(item => {
                depArray.push(item.name)
            })

            inquirer
                .prompt([
                    {
                        type: 'text',
                        name: 'role_title',
                        message: 'Enter the role you would like to add: '
                    },
                    {
                        type: 'number',
                        name: 'salary',
                        message: 'Enter the salary of this role:  Do not use commas or periods'
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Select the department this role will be in: ',
                        choices: depArray
                    }
                ])
                .then((data) => {
                    let department_id;

                    for (let i = 0; i < depArray.length; i++) {
                        if (depArray[i] === data.department) {
                            department_id = i + 1;
                        };
                    };

                    connection.query(
                        `INSERT INTO roles (title, salary, department_id)
                            VALUES(?,?,?)`,
                        [data.role_title, data.salary, department_id],
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.message);
                                return;
                            }

                            console.log('Role added!')
                            promptUser();
                        }
                    );
                });
        }
    );
};

module.exports = { showRoles, addRole };