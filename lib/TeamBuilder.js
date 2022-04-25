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

    static startMenuChoices = [`Start TeamBuilder`, `Load Saved Team`, `Quit TeamBuilder`];

    static startMenu = [
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'menu',
            choices: TeamBuilder.startMenuChoices
        }
    ];

    static employeeMenuChoices = [`Engineer`, `Intern`, `Save Team`, `I'm finished`,`Return to start`, `Quit TeamBuilder`];
    
    static employeeMenu = [
        {
            type: 'list',
            message: 'Would you like to add another member?',
            name: 'menu',
            choices: TeamBuilder.employeeMenuChoices
        }
    ];

    static confirmChoices = [`Yes, build html`,`No, rebuild team`, 'Quit TeamBuilder'];

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
            message: 'Save before quitting?',
            name: 'save'
        }
    ]

    displayStartMenu () {
        inq.prompt(TeamBuilder.startMenu)
            .then(response => {
                const [start, load, quit] = [...TeamBuilder.startMenuChoices];
                switch(response.menu) {
                    case start:
                        this.ask('manager');
                        break;
                    case load:
                        this.displaySavedTeams();
                        break;
                    case quit:
                        this.quit();
                        break;
                }
            })
    }

    displaySavedTeams () {

        const filepath = path.join(__dirname, '..', 'save')

        fs.readdir(filepath, (err, files) => {
            if (err) {
                return console.log(`Unable to scan directory: ${err}`);
            }

            if (files.length === 0) {
                console.log('No saved teams');
                this.displayStartMenu();
                return 
            }

            const loadMenu = [
                {
                    type: 'list',
                    message: 'Load file',
                    name: 'file',
                    choices: files
                }
            ]

            inq.prompt(loadMenu)
                .then(response => this.load(response.file))
        })
    } 

    load (file) {
        const filepath = path.join(__dirname,'..', 'save', file)

        fs.readFile(filepath, (err, data) => {
            if (err) {
                // throw err;
            }

            const { name, manager, engineers, interns } = JSON.parse(data);
            this.team = new Team(name);
            this.renderEmployee(manager[0]);
            engineers.forEach(engineer=> this.renderEmployee(engineer));
            interns.forEach(intern => this.renderEmployee(intern));
            this.displayEmployeeMenu();
        });
    }

    save (...functions) {

        if (!this.team) {
            return;
        }

        const filepath = path.join(__dirname, '..', 'save', `${this.team.getName()}.json`)

        fs.writeFile(filepath, JSON.stringify(this.team), (err) => {
            if (err) {
                console.error(err)
            } else {
                console.log('\t\nTeam saved!');
                functions.forEach(func => func());
                this.displayEmployeeMenu();
            }
        });
    }

    ask (jobTitle) {
        const questions = this.renderPrompts(jobTitle);
        inq.prompt(questions)
            .then(answers => {
                this.renderEmployee(answers);
                this.displayEmployeeMenu();
            })
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
                name: 'id'
            },
            {
                type: 'input',
                message: 'What is their e-mail address?',
                name: 'email'
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
                    name: 'office'
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

    displayEmployeeMenu () {
        this.displayTeam();
        inq.prompt(TeamBuilder.employeeMenu)
            .then(response => {
                const save = TeamBuilder.employeeMenuChoices.length-4;
                const finished = TeamBuilder.employeeMenuChoices.length-3;
                const start = TeamBuilder.employeeMenuChoices.length-2;
                const quit = TeamBuilder.employeeMenuChoices.length-1;
                
                switch (response.menu) {
                    case TeamBuilder.employeeMenuChoices[save]:
                        this.save();
                        break;
                    case TeamBuilder.employeeMenuChoices[finished]:
                        this.displayTeam();
                        this.confirm();
                        break;
                    case TeamBuilder.employeeMenuChoices[start]:
                        this.team.deleteTeam();
                        this.teamMembers = 0;
                        this.init();
                        break;
                    case TeamBuilder.employeeMenuChoices[quit]:
                        this.quit();
                        break;
                    default:
                        this.ask(response.menu);
                        break;
                }
            });
    }

    confirm () {
        inq.prompt(TeamBuilder.confirmMenu)
            .then(response => {                            
                switch (response.confirm) {
                    case TeamBuilder.confirmChoices[0]:
                        this.build();
                        break;
                    case TeamBuilder.confirmChoices[1]:
                        this.teamMembers = 0;
                        this.team.deleteTeam();
                        this.init();
                        break;
                    case TeamBuilder.confirmChoices[2]:
                        this.quit();
                }
            })
    } 

    renderPadding (separator, string) {
        return ' '.repeat(separator.length-string.length)
    }

    displayTeam () {
        const heading = `--------------Team--------------`
        const sep = '-'.repeat(heading.length-2)
        const teamMembers = `This team has ${this.teamMembers} member(s).`
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

    build () {
        console.log("\nBuilding HTML...");
        this.quit();
    }

    quit () {
        if (!this.team) {
            console.log('Quitting...');
            process.exit(0);
        } else {
            inq.prompt(TeamBuilder.saveBeforeQuitPrompt)
                .then(response => {
                    if (response.save) {
                        this.save(process.exit)
                    }
                })
        }
    }

    init () {
        const welcome = ` Welcome to TeamBuilder! TeamBuilder creates a Team page using the responses to the following prompts. `
        const dashes = '-'.repeat(welcome.length+2)
        console.log(`\n${dashes}`)
        console.log(`|${welcome}|`)
        console.log(`${dashes}\n`)
        this.displayStartMenu();
    }

}

module.exports = TeamBuilder;