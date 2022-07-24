const ctable = require("console.table")


const chooseRequest = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'request'
        }


    ])
}