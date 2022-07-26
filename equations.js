const { userPrompt } = require('./index');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee'
});

const addTotal = () => {
    connection.query(`SELECT * FROM department`,
        function (err, results) {
            if (err) {
                console.log(err.message);
                return;
            }

            depArray = [];
            results.forEach(item => {
                depArray.push(item.name);
            });

            inquirer
                .prompt({
                    type: 'list',
                    name: 'dep_choice',
                    message: 'Select department to see the total amount of money being used',
                    choices: depArray
                })
                .then((data) => {
                    let department_id;
                    for (let i = 0; i < depArray.length; i++) {
                        if (depArray[i] === data.dep_choice) {
                            department_id = i + 1;
                        };
                    };

                    connection.query(
                        `SELECT department.name AS department, SUM(roles.salary) AS total_salary
                        FROM employee
                        LEFT JOIN roles
                        ON employee.role_id = roles.id
                        LEFT JOIN department
                        ON roles.department_id = department.id
                        WHERE department_id = ?`,
                        [department_id],
                        function (err, results) {
                            if (err) {
                                console.log(err.message);
                                return;
                            }

                            console.table(results);
                            userPrompt();
                        }
                    );
                });
        }
    )
};

module.exports = { addTotal };