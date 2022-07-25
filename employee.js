const { userPrompt } = require('./index')
const inquirer = require('inquirer');
const mysql = require('mysql2');
const { replaceManager, assignManager, addManager } = require('./manager');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db'
});

const viewAllEmployees = () => {

    connection.query(

        `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS role, roles.salary AS salary, manager.first_name AS manager,
        department.name AS department 
        FROM employee
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

            userPrompt();
        }
    );
};

const viewEmployeeDepartment = () => {

    connection.query(

        `SELECT * FROM department`,

        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            depArray = [];

            results.forEach(item => {
                depArray.push(item.name)
            });
            inquirer
                .prompt({
                    type: 'list',
                    name: 'filter-emp-dep',
                    message: 'Choose a department:',

                    choices: depArray
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


const viewEmployeeManagement = () => {
    connection.query(
        
        `SELECT * FROM manager`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }
            
            manArray = [];
            
            results.forEach(item => {
                manArray.push(item.first_name)
            })

            inquirer
                .prompt({
                    type: 'list',
                    name: 'filter-emp-man',
                    message: 'Select a manager:',
                    
                    choices: manArray
                })
                .then((data) => {
                    connection.query(
                        `SELECT employee.id, employee.first_name, manager.first_name AS manager
                            FROM employee
                            LEFT JOIN manager
                            ON employee.manager_id = manager.id
                            WHERE manager.first_name = ?`,
                        
                        [data['filter-emp-man']],
                        function (err, results, fields) {
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
    );
};


const addEmployee = () => {

    
    connection.query(
        
        `SELECT * FROM roles`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            
            let roleArray = [];

            
            results.forEach(item => {
                roleArr.push(item.title)
            })
            
            connection.query(
                
                `SELECT * FROM manager`,
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    
                    let manArray = [];

                    
                    results.forEach(item => {
                        manArray.push(item.first_name)
                    });

                    
                    inquirer
                        .prompt([
                            {
                                type: 'text',
                                name: 'first_name',
                                message: 'What is the employees first name?'
                            },
                            {
                                type: 'text',
                                name: 'last_name',
                                message: 'What is the employees last name?'
                            },
                            {
                                type: 'list',
                                name: 'role_pick',
                                message: 'What will the employees role be?',
                                choices: roleArray
                            },
                            {
                                type: 'confirm',
                                name: 'mngt_confirm',
                                message: 'Is your employees role a manager?'
                            },
                            {
                                type: 'list',
                                name: 'mngt_pick',
                                message: 'Who will be your employees manager?',
                                
                                when: ({ mngt_confirm }) => {
                                    if (!mngt_confirm) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
                                
                                choices: manArray
                            }
                        ])
                        .then((data) => {

                            let role_id;
                            for (i = 0; i < roleArray.length; i++) {
                                if (data.role_pick === roleArray[i]) {
                                    role_id = i + 1
                                }
                            }

                            let manager_confirm;
                            if (data.mngt_confirm === true) {
                                manager_confirm = 1;
                            } else {
                                manager_confirm = 0
                            }

                            let manager_id;

                            
                            if (!data.mngt_pick) {
                                manager_id = null;
                                
                            } else {
                                for (i = 0; i < manArray.length; i++) {
                                    if (data.mngt_pick === manArray[i]) {
                                        manager_id = i + 1
                                    }
                                }
                            }
                            
                            connection.query(
                                
                                `INSERT INTO employee (first_name, last_name, role_id, manager_id, manager_confirm)
                                    VALUES (?, ?, ?, ?, ?)`,
                                [data.first_name, data.last_name, role_id, manager_id, manager_confirm],
                                function (err, results, fields) {
                                    if (err) {
                                        console.log(err.message);
                                        return;
                                    }
                                    
                                    replaceManager();
                                    
                                    updateManager();
                                    
                                    assignManager();
                                    console.log('Employee added.');
                                    
                                    userPrompt();
                                }
                            );
                        });
                }
            );
        }
    );
};

const updateEmployee = () => {
    
    connection.query(
        `SELECT * FROM roles`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            
            let roleArray = [];

            
            results.forEach(item => {
                roleArray.push(item.title)
            })
            connection.query(
                `SELECT first_name, last_name FROM employee`,
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }

                    let nameArray = [];
                    results.forEach(item => {
                        nameArray.push(item.first_name);
                        nameArray.push(item.last_name);
                    })
                    let combinedNameArray = [];
                    for (let i = 0; i < nameArray.length; i += 2) {
                        if (!nameArray[i + 1])
                            break
                        combinedNameArray.push(`${nameArray[i]} ${nameArray[i + 1]}`)
                    }
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'name_select',
                                message: 'Select the employee to update',
                                choices: combinedNameArray
                            },
                            {
                                type: 'list',
                                name: 'role_select',
                                message: 'Select the role you would like the employee to switch to:',
                                choices: roleArray
                            }
                        ])
                        .then((data) => {
                            let role_id;
                            for (let i = 0; i < roleArray.length; i++) {
                                if (data.role_select === roleArray[i]) {
                                    role_id = i + 1;
                                }
                            };
                            let selectedNameArray = data.name_select.split(" ");
                            let last_name = selectedNameArray.pop();
                            let first_name = selectedNameArray[0];

                            connection.query(
                                `UPDATE employee 
                                        SET role_id = ?
                                        WHERE first_name = ? AND last_name = ?`,
                                [role_id, first_name, last_name],
                                function (err, results, fields) {
                                    if (err) {
                                        console.log(err.message);
                                        return;
                                    }
                                    console.log('Employee updated!');
                                    userPrompt();
                                }
                            );
                        });
                }
            );

        }
    );
};

module.exports = { viewAllEmployees, viewEmployeeDepartment, viewEmployeeManagement, addEmployee, updateEmployee };
