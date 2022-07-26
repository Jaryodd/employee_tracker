const ctable = require("console.table")


const inquirer = require('inquirer');


const userPrompt = () => {
    inquirer

        
        .prompt({
            type: 'list',
            name: 'choices',
            message: 'What would you like to do? (Select on of the following)',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Update Employee Role', 'View Departments', 'Add Department', 'View Roles', 'Add Role', 'View totalized budget', 'I am finished']
        })
        
        .then((data) => {
            switch (data['begin choices']) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'View All Employees By Department':
                    viewEmployeeDepartment();
                    break;
                case 'View All Employees By Manager':
                    viewEmployeeManagement();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployee();
                    break;
                case 'View Departments':
                    Department();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'View Roles':
                    showRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View totalized budget':
                    addTotal();
                    break;
                case 'I am finished':
                    break;
            }
        })
};


module.exports = { userPrompt }
const { viewAllEmployees, viewEmployeeDepartment, viewEmployeeManagement, addEmployee, updateEmployee } = require('./employee');
const { Department, addDepartment } = require('./department');
const { showRoles, addRole } = require('./role');
const { addTotal } = require('./equations')

userPrompt()