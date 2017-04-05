const Generator = require('yeoman-generator');
const devDeps = require('./dev-deps');
const deps = require('./deps');

module.exports = class extends Generator {
  installingNpmDeps() {
    // install dev deps
    this.npmInstall(devDeps, { 'save-dev': true });
    // install deps
    this.npmInstall(deps, { 'save': true });
  }

  copyResources() {
    this.fs.copy(
      this.templatePath('/*'),
      this.destinationPath()
    );
  }
};
