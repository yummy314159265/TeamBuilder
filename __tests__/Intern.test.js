const path = require('path');
const Intern = require(path.join(__dirname, '..', 'lib', 'Intern.js'));


describe('Intern class', () => {
    it('Creates an Intern object with name, id, email, and school string arguments', () => {
        const intern = new Intern('Name', 'ID', 'Email', 'School');

        expect(intern.name).toEqual('Name');
        expect(intern.id).toEqual('ID');
        expect(intern.email).toEqual('Email');
        expect(intern.school).toEqual('School');
        expect(intern).toBeInstanceOf(Intern);
    });

    describe('getRole', () => {
        it('returns Intern', () => {
            expect(new Intern('Name', 'ID', 'Email', 'School').getRole()).toEqual('Intern');
        });
    });

    describe('getSchool', () => {
        it('returns the Intern\'s school', () => {
            expect(new Intern('Name', 'ID', 'Email', 'School').getSchool()).toEqual('School');
        });
    });
});