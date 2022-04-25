const inq = require('inquirer');
const fs = require('fs');
const path = require('path');
const Manager = require(path.join(__dirname, 'Manager.js'));
const Intern = require(path.join(__dirname, 'Intern.js'));
const Engineer = require(path.join(__dirname, 'Engineer.js'));
const Team = require(path.join(__dirname, 'Team.js'));

class TeamBuilder {

    constructor () {
        this.teamMembers = 0;
        this.team;
    }

    static saveDir = path.join(__dirname, '..', 'save');

    static startMenuChoices = [`Start TeamBuilder`, `Load Saved Team`, `Quit TeamBuilder`];

    static startMenu = [
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'menu',
            choices: TeamBuilder.startMenuChoices
        }
    ];

    static employeeMenuChoices = [`Engineer`, `Intern`, `Save Team`, `I'm finished`,`Discard and return to start`, `Quit TeamBuilder`];
    
    static employeeMenu = [
        {
            type: 'list',
            message: 'Would you like to add another member?',
            name: 'menu',
            choices: TeamBuilder.employeeMenuChoices
        }
    ];

    static confirmChoices = [`Yes, build html (team will be saved)`,`No, rebuild team`, 'Save team', 'Quit TeamBuilder'];

    static confirmMenu = [
        {
            type: 'list',
            message: 'Is this correct?',
            name: 'confirm',
            choices: TeamBuilder.confirmChoices
        }
    ];

    static saveBeforeQuitPrompt = [
        {
            type: 'confirm',
            message: `Save before quitting?`,
            name: 'save'
        }
    ];

    async displayStartMenu () {
        const response = await inq.prompt(TeamBuilder.startMenu);
        const [start, load, quit] = [...TeamBuilder.startMenuChoices];

        switch(response.menu) {
            case start:
                this.ask('manager');
                break;
            case load:
                const savedTeams = this.getSavedTeams();
                this.displayLoadMenu(savedTeams);
                break;
            case quit:
                this.saveBeforeQuit();
                break;
        }
    }

    getSavedTeams () {
        return new Promise((resolve, reject) => {
            fs.readdir(TeamBuilder.saveDir, (err, files) => {
                
                if (err) {
                    reject(err);
                }

                resolve(files);
            });
        });
    } 

    async displayLoadMenu () {
        try {
            const files = await this.getSavedTeams();

            if (files.length === 0) {
                console.log('\n\n\tThere are no saved teams\n\n');
                this.displayStartMenu();
                return;
            }

            const back = 'Back';
            
            files.push(back);

            const loadMenu = [
                {
                    type: 'list',
                    message: 'Load file',
                    name: 'file',
                    choices: files
                }
            ];

            const response = await inq.prompt(loadMenu);
            
            if (response.file === back){
                this.displayStartMenu();
            } else {
                this.renderTeamFromFile(response.file);
            }

        } catch (err) {
            return console.log(`\n\n\tUnable to retrieve data: ${err}\n\n`);
        }
    }

    load (file) {
        const filepath = path.join(__dirname,'..', 'save', file);

        return new Promise((resolve, reject) => {
            fs.readFile(filepath, (err, data) => {

                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        });
    }

    async renderTeamFromFile (file) {
        try {
            const loadedTeam = await this.load(file);

            const { name, manager, engineers, interns } = JSON.parse(loadedTeam);

            this.team = new Team(name);

            this.renderEmployee(manager[0]);
            engineers.forEach(engineer=> this.renderEmployee(engineer));
            interns.forEach(intern => this.renderEmployee(intern));

            this.displayEmployeeMenu();
        } catch (err) {
            return console.log(`\n\n\tUnable to load file: ${err}`);
        }
    }

    save () {

        if (!this.team) {
            return;
        }

        const filepath = path.join(__dirname, '..', 'save', `${this.team.getName()}.json`);

        return new Promise((resolve, reject) => {
            fs.writeFile(filepath, JSON.stringify(this.team), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(console.log('\n\n\tTeam saved!\n\n'));
                }
            });
        });
    }

    async saveBeforeQuit () {
        try {

            if (!this.team) {
                this.quit();
            } else {
                const response = await inq.prompt(TeamBuilder.saveBeforeQuitPrompt)

                if (response.save) {
                    await this.save();
                    this.quit();
                } else {
                    this.quit();
                }
            }

        } catch (err) {
            console.log(`/n/n/tFile not written: ${err}`)
        }
    }

    async ask (jobTitle) {
        const questions = this.renderPrompts(jobTitle);
        const answers = await inq.prompt(questions);

        this.renderEmployee(answers);
        this.displayEmployeeMenu();
    }

    renderPrompts (jobTitle) {
        
        jobTitle = jobTitle.toLowerCase()

        const questions = [
            {
                type: 'input',
                message:`What is the ${jobTitle}'s name?`,
                name: 'name'
            },
            {
                type: 'input',
                message: 'What is their employee ID?',
                name: 'id',
                validate: val => /^\d+$/.test(val) 
            },
            {
                type: 'input',
                message: 'What is their e-mail address?',
                name: 'email',
                validate: val => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(val) 
            },
        ];
        
        switch (jobTitle) {
            case 'manager':
                questions.unshift({
                    type: 'input',
                    message: 'What is the name of the team?',
                    name: 'team',
                    validate: val => val.trim().length > 0               
                })
                questions.push({
                    type: 'input',
                    message: 'What is their office number?',
                    name: 'office',
                    validate: val => /^\d+$/.test(val)
                });
                break;
            case 'engineer':
                questions.push({
                    type: 'input',
                    message: 'What is their github username?',
                    name: 'github'
                });
                break;
            case 'intern':
                questions.push({
                    type: 'input',
                    message: 'What school are they attending?',
                    name: 'school'
                });
                break;
            default:
                return questions;
        }

        return questions;
    }

    renderEmployee ({name, id, email, office, team, github, school}) {
        this.teamMembers++;

        if (office) {
            if (team) {
                this.team = new Team(team);
            }

            this.team.addManager(new Manager(name, id, email, office));
        }

        if (github) {
            this.team.addEngineer(new Engineer(name, id, email, github));
        }

        if (school) {
            this.team.addIntern(new Intern(name, id, email, school));
        }
    }

    async displayEmployeeMenu () {
        
        this.displayTeam();
        
        const response = await inq.prompt(TeamBuilder.employeeMenu);

        const save = TeamBuilder.employeeMenuChoices.length-4;
        const finished = TeamBuilder.employeeMenuChoices.length-3;
        const start = TeamBuilder.employeeMenuChoices.length-2;
        const quit = TeamBuilder.employeeMenuChoices.length-1;
        
        switch (response.menu) {
            case TeamBuilder.employeeMenuChoices[save]:
                this.save();
                this.displayEmployeeMenu();
                break;
            case TeamBuilder.employeeMenuChoices[finished]:
                this.displayTeam();
                this.displayConfirmMenu();
                break;
            case TeamBuilder.employeeMenuChoices[start]:
                this.init();
                break;
            case TeamBuilder.employeeMenuChoices[quit]:
                this.saveBeforeQuit();
                break;
            default:
                this.ask(response.menu);
                break;
        }

    }

    async displayConfirmMenu () {

        const response = await inq.prompt(TeamBuilder.confirmMenu)
    
        const [build, rebuild, save, quit] = [...TeamBuilder.confirmChoices]
        
        switch (response.confirm) {
            case build:
                this.build();
                break;
            case rebuild:
                this.init();
                break;
            case save:
                this.save();
                this.displayConfirmMenu();
                break;
            case quit:
                this.saveBeforeQuit();
                break;
        }
    } 

    renderPadding (separator, string) {
        return ' '.repeat(separator.length-string.length)
    }

    displayTeam () {
        const heading = `-----------------Team-----------------`
        const sep = '-'.repeat(heading.length-2)
        const teamMembers = `${this.team.getName()} has ${this.teamMembers} member(s).`
        const manager = `Team Manager:`
        const managerName = `${this.team.getManager()[0].getName()}`
        const engineers = `Engineers:`
        const interns = `Interns:`

        console.log(`\n\t${heading}`);
        console.log(`\t|${teamMembers}${this.renderPadding(sep, teamMembers)}|`)
        console.log(`\t|${sep}|`)
        console.log(`\t|${manager}${this.renderPadding(sep, manager)}|`)
        console.log(`\t|${managerName}${this.renderPadding(sep, managerName)}|`)
        
        if(this.team.getEngineers().length > 0){
            console.log(`\t|${this.renderPadding(sep, '')}|`)
            console.log(`\t|${engineers}${this.renderPadding(sep, engineers)}|`);

            this.team.getEngineers().forEach(engineer => {
                const engName = `${engineer.getName()}`
                console.log(`\t|${engName}${this.renderPadding(sep, engName)}|`);
            });
        }

        if(this.team.getInterns().length > 0){
            console.log(`\t|${this.renderPadding(sep, '')}|`)
            console.log(`\t|${interns}${this.renderPadding(sep, interns)}|`)


            this.team.getInterns().forEach(intern => {
                const intName = `${intern.getName()}`
                console.log(`\t|${intName}${this.renderPadding(sep, intName)}|`);
            });
        }

        console.log(`\t-${sep}-\n`)
    }

    async build () {
        console.log("\n\n\tBuilding HTML...\n\n");
        await this.save();
        this.displayStartMenu();
    }

    quit () {
        console.log('\n\n\tQuitting...\n\n');
        process.exit(0);
    }

    init () {
        if (!fs.existsSync(TeamBuilder.saveDir)){
            fs.mkdirSync(TeamBuilder.saveDir);
        }

        this.team = null;
        this.teamMembers = 0;

        const welcome = ` Welcome to TeamBuilder! TeamBuilder creates a Team page using the responses to the following prompts. `
        const dashes = '-'.repeat(welcome.length+2)
        console.log(`\n${dashes}`)
        console.log(`|${welcome}|`)
        console.log(`${dashes}\n`)
        this.displayStartMenu();
    }
}

module.exports = TeamBuilder;