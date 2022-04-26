const path = require('path');
const Manager = require(path.join(__dirname, '..', 'lib', 'Manager.js'));


describe('Manager class', () => {
    it('Creates an Manager object with name, id, email, and office number string arguments', () => {
        const manager = new Manager('Name', 'ID', 'Email', 'Office number');

        expect(manager.name).toEqual('Name');
        expect(manager.id).toEqual('ID');
        expect(manager.email).toEqual('Email');
        expect(manager.office).toEqual('Office number');
        expect(manager).toBeInstanceOf(Manager);
    });

    describe('getRole', () => {
        it('returns Manager', () => {
            expect(new Manager('Name', 'ID', 'Email', 'Office number').getRole()).toEqual('Manager');
        });
    });
});