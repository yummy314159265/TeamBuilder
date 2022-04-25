const path = require('path');
const Employee = require(path.join(__dirname, 'Employee.js'));

class Intern extends Employee {

    constructor (name, id, email, school) {
        super(name, id, email);
        this.role = 'Intern';
        this.school = school;
    }

    getSchool() {
        return this.school;
    }
}

module.exports = Intern;