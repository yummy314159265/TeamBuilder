const fs = require('fs');
const path = require('path');
const Manager = require(path.join(__dirname, '..', 'lib', 'Manager.js'));
const Intern = require(path.join(__dirname, '..', 'lib', 'Intern.js'));
const Engineer = require(path.join(__dirname, '..', 'lib', 'Engineer.js'));

// left TODO: email links, tests
class HTMLRenderer {
    constructor (team) {
        if (team) {
            this.team = team;
            this.manager = this.team.getManager()[0];
            this.engineers = this.team.getEngineers();
            this.interns = this.team.getInterns();
        } else {
            throw 'Cannot render - no team found';
        }
    }

    renderEmployeeHTML (employee) {
        
        let tag;
        let thirdLiEl;

        if (employee instanceof Manager) {
            tag = `<span class="tag is-danger">Manager</span></p>`;
            thirdLiEl = `<li>
                                    Office number: ${employee.office}
                                </li>`
        }

        if (employee instanceof Engineer) {
            tag = `<span class="tag is-link">Engineer</span></p>`
            thirdLiEl = `<li>
                                    Github: <a href='https://github.com/${employee.getGithub()}'>${employee.getGithub()}</a>
                                </li>`;
        }

        if (employee instanceof Intern) {
            tag = `<span class="tag is-success">Intern</span></p>`
            thirdLiEl = `<li>
                                    School: ${employee.getSchool()}
                                </li>`;
        }

        return `

        <div class="columns">

            <div class="column is-one-quarter">
                <div class="card">
                    <div class="card-content">
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-4">${employee.getName()} ${tag}
                            </div>
                        </div>
                  
                        <div>
                            <ul>
                                <li>
                                    ID: ${employee.getId()}
                                </li>
                                <li>
                                    Email: ${employee.getEmail()}
                                </li>
                                ${thirdLiEl}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>   
`
    }

    renderManagerHTML () {
        return this.renderEmployeeHTML(this.manager);
    }

    renderEngineerHTML () {

        let engineerHTML = '';

        this.engineers.forEach(engineer => engineerHTML += this.renderEmployeeHTML(engineer))
    
        return engineerHTML;
    }

    renderInternHTML () {

        let internHTML = '';

        this.interns.forEach(intern => internHTML += this.renderEmployeeHTML(intern))
    
        return internHTML;
    }

    renderHTML () {
        let cl = '';

        if (this.engineers.length + this.interns.length < 10) {
            cl = 'is-clipped';    
        }

        return `<!DOCTYPE html>
<html class='${cl}' lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

    <link rel="stylesheet" type="text/css" href="./assets/css/style.css" />

    <title>${this.team.getName()}'s Team Page</title>
</head>

<body>

    <header class="container">
        <section class="hero is-small">
            <div class="hero-body">
                <p class="title">
                    Team ${this.team.getName()}
                </p>
            </div>
        </section>
    </header>

    <section class="container mt-5">

    ${this.renderManagerHTML()}

    ${this.renderEngineerHTML()}

    ${this.renderInternHTML()}

    </section>

</body>

</html>`
    }

    writeHTMLFile () {

        if (!this.team) {
            return;
        }

        const filepath = path.join(__dirname, '..', 'dist', `index.html`);

        const html = this.renderHTML();

        return new Promise((resolve, reject) => {
            fs.writeFile(filepath, html, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(console.log(`\n\n\tHTML for ${this.team.getName()} built.\n\n`));
                }
            });
        });
    }
}

module.exports = HTMLRenderer