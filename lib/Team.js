const Employee = require ('./Employee');
const Manager = require ('./Manager');
const Engineer = require ('./Engineer');
const Intern = require ('./Intern');

class Team {
    constructor (name) {
        this.name = name;
        this.employees = [];
        this.manager = [];
        this.engineers = [];
        this.interns = [];
    }

    addManager (employee) {
        if (employee instanceof Manager) {
            this.addEmployee(employee);
            this.manager.push(employee);
        } else {
            console.log('Not a manager!')
        }
    }

    addEngineer (employee) {
        if (employee instanceof Engineer) {
            this.addEmployee(employee);
            this.engineers.push(employee);
        } else {
            console.log('Not an engineer!')
        }
    }

    addIntern (employee) {
        if (employee instanceof Intern) {
            this.addEmployee(employee);
            this.interns.push(employee);
        } else {
            console.log('Not an intern!')
        }
    }

    addEmployee (employee) {
        if (employee instanceof Employee) {
            this.employees.push(employee);
        } else {
            console.log('Not an Employee!')
        }
    }

    findEngineer (employeeName) {
        return this.engineers.find(engineer => engineer.getName() === employeeName)
    }

    findIntern (employeeName) {
        return this.interns.find(intern => intern.getName() === employeeName)
    }

    findEmployee (employeeName) {
        return this.employees.find(employee => employee.getName() === employeeName)
    }

    removeManager (name) {
        if (this.manager[0].getName() === name) {
            this.removeEmployee(name);
            this.manager.splice(0,1);
        } else {
            console.log('Employee not found');
        }
    }

    removeEngineer (name) {
        const engineer = this.findEngineer(name);
        if (engineer) {
            this.removeEmployee(name);
            this.engineers = this.engineers.filter(eng => eng != engineer)
        } else {
            console.log('Employee not found');
        }
    }

    removeIntern (name) {
        const intern = this.findIntern(name);
        if (intern) {
            this.removeEmployee(name);
            this.interns = this.interns.filter(int => int != intern)
        } else {
            console.log('Employee not found');
        }
    }

    removeEmployee (name) {
        const employee = this.findEmployee(name);
        if (employee) {
            this.employees = this.employees.filter(emp => emp != employee)
        } else {
            console.log('Employee not found');
        }
    }

    deleteTeam () {
        this.employees = [];
        this.manager = [];
        this.engineers = [];
        this.interns = [];
    }

    getName () {
        return this.name;
    }

    getTeam () {
        return this.employees;
    }

    getManager () {
        return this.manager;
    }

    getEngineers () {
        return this.engineers;
    }

    getInterns () {
        return this.interns;
    }

}

module.exports = Team;