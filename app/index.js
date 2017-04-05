const Generator = require('yeoman-generator');
const _ = require('lodash');
const devDeps = require('./dev-deps');
const deps = require('./deps');

module.exports = class extends Generator {
  installingNpmDeps() {
    // install dev deps
    // this.npmInstall(devDeps, { 'save-dev': true });
    // install deps
    // this.npmInstall(deps, { 'save': true });
  }

  prompting() {
    return this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Your project name',
    default : this.appname // Default to current folder name
    }
    ]).then((answers) => {
      this.props = answers;
      this.log('app name', answers.name);
    });
  }

  writePackageJson() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'), {
        name: this.props.name
      }
    );
  }

  copyResources() {
    const dest = this.destinationPath();
    const resources = [
      { uri: 'app/**', dest: 'app' },
      { uri: 'public/**', dest: 'public' },
      { uri: 'spec/**', dest: 'spec' },
      { uri: 'views/**', dest: 'views' },
      { uri: 'app.js', dest: '' },
      { uri: 'run.js', dest: '' },
      { uri: 'gulpfile.js', dest: '' },
    ];
    _.forEach(resources, resource => {
      this.fs.copy(
        this.templatePath(`${resource.uri}`),
        this.destinationPath(resource.dest)
      );
    });
  }
};
