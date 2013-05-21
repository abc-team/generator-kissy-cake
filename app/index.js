var generator = require('abc-generator');
var util      = require('util');
var path = require('path');

// Documentation: https://github.com/yeoman/generator/wiki/base

var Generator = module.exports = function Generator() {
  generator.UIBase.apply(this, arguments);
  // this.option('flag', { desc: 'Desc for flag', ...})
  // this.argument('filename', { desc: 'Desc for filename argument', ...})

  this.abcJSON = {};
  try {
    this.abcJSON = require(path.resolve(process.cwd(), 'abc.json'));
  } catch (e) {
  }

  if (!this.abcJSON.author) {
    this.abcJSON.author = {
      name: '',
      email: ''
    }
  }
};

util.inherits(Generator, generator.UIBase);

Generator.prototype.welcome = function welcome () {
  var welcome = this.abcLogo;

  this.log.writeln(welcome);
};


Generator.prototype.questions = function() {
  var cb = this.async();

  var prompts = [
    {
      name: 'projectName',
      message: 'Name of Project?',
      default: path.basename(process.cwd()),
      warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
    }
  ];

  this.prompt(prompts, function (err, props) {

    if (err) {
      return this.emit('error', err);
    }

    console.log('props: ',props);

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.projectName = props.projectName;
//    this.author = props.author;
//    this.email = props.email;
    this.author = Math.random();
    this.email = Math.random();

    cb();
  }.bind(this));
}



// Copies the entire template directory (with `.`, meaning the
// templates/ root) to the specified location
Generator.prototype.scaffold = function scaffold() {
  this.mkdir('src/pages');
  this.mkdir('src/common');
  this.mkdir('src/utils');
  this.mkdir('src/widget');

  this.mkdir('build/common');
  this.mkdir('build/widget');
  this.mkdir('build/pages');
};


// Copies the entire template directory (with `.`, meaning the
// templates/ root) to the specified location
Generator.prototype.readme = function readme() {
  this.copy('README.md', 'README.md');
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
  this.copy('jshintrc', '.jshintrc');
  this.copy('editorconfig', '.editorconfig');

  this.template('_package.json', 'package.json');
  this.template('package-config.js', 'src/common/package-config.js');
  this.template('abc.json');
};
