const path = require('path');
const Engineer = require(path.join(__dirname, '..', 'lib', 'Engineer.js'));


describe('Engineer class', () => {
    it('Creates an Engineer object with name, id, email, and Github string arguments', () => {
        const engineer = new Engineer('Name', 'ID', 'Email', 'Github');

        expect(engineer.name).toEqual('Name');
        expect(engineer.id).toEqual('ID');
        expect(engineer.email).toEqual('Email');
        expect(engineer.github).toEqual('Github');
        expect(engineer).toBeInstanceOf(Engineer);
    });

    describe('getRole', () => {
        it('returns Engineer', () => {
            expect(new Engineer('Name', 'ID', 'Email', 'Github').getRole()).toEqual('Engineer');
        });
    });

    describe('getGithub', () => {
        it('returns the engineer\'s Github username', () => {
            expect(new Engineer('Name', 'ID', 'Email', 'Github').getGithub()).toEqual('Github');
        });
    });
});