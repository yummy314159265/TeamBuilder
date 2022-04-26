const path = require('path');
const Employee = require(path.join(__dirname, '..', 'lib', 'Employee.js'));

describe('Employee class', () => {
    it('Creates an Employee object with name, id, and email string arguments', () => {
        const employee = new Employee('Name', 'ID', 'Email');

        expect(employee.name).toEqual('Name');
        expect(employee.id).toEqual('ID');
        expect(employee.email).toEqual('Email');
        expect(employee).toBeInstanceOf(Employee);
    });

    describe('getName', () => {
        it('returns the name of the employee', () => {
            expect(new Employee('Name', 'ID', 'Email').getName()).toEqual('Name');
        });
    });

    describe('getId', () => {
        it('returns the ID of the employee', () => {
            expect(new Employee('Name', 'ID', 'Email').getId()).toEqual('ID');
        });
    });

    describe('getEmail', () => {
        it('returns the email of the employee', () => {
            expect(new Employee('Name', 'ID', 'Email').getEmail()).toEqual('Email');
        });
    });

    describe('getRole', () => {
        it('returns Employee', () => {
            expect(new Employee('Name', 'ID', 'Email').getRole()).toEqual('Employee');
        });
    });
});