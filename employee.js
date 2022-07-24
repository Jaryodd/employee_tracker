const { promptUser } = require('../index')
const inquirer = require('inquirer');
const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee'
});


const viewEmployees = () => {

    connection.query(
        
        `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS role, roles.salary AS salary, manager.first_name AS manager,
        department.name AS department 
        FROM employee
        LEFT JOIN roles
        ON employee.role_id = roles.id
        LEFT JOIN department
        ON roles.department_id = department.id
        LEFT JOIN manager
        ON employee.manager_id = manager.id`,

        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.table(results);

            promptUser();
        }
    );
};


const viewDepartment = () => {

    connection.query(

        `SELECT * FROM department`,

        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            depArr = [];
           
            results.forEach(item => {
                depArr.push(item.name)
            });
            inquirer
                .prompt({
                    type: 'list',
                    name: 'filter-emp-dep',
                    message: 'Choose a department to filter from:',
                    choices: depArr
                })
                .then((data) => {

                    connection.query(
                        `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department 
                            FROM employee
                            LEFT JOIN roles
                            ON employee.role_id = roles.id
                            LEFT JOIN department
                            ON roles.department_id = department.id
                            WHERE department.name = ?`,
                        [data['filter-emp-dep']],
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.message);
                                return;
                            }

                            console.table(results);
                            promptUser();
                        }
                    )
                });
        }
    );
};
