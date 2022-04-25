const path = require('path');
const Employee = require(path.join(__dirname, 'Employee.js'));

class Manager extends Employee {

    constructor (name, id, email, officeNumber) {
        super(name, id, email);
        this.role = 'Manager';
        this.office = officeNumber;
    }

}

module.exports = Manager;