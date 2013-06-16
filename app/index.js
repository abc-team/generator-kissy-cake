var generator = require('abc-generator');
var util      = require('util');
var path = require('path');

// Documentation: https://github.com/yeoman/generator/wiki/base

var Generator = module.exports = function Generator() {
  generator.UIBase.apply(this, arguments);
  // this.option('flag', { desc: 'Desc for flag', ...})
  // this.argument('filename', { desc: 'Desc for filename argument', ...})

  try {
    this.abcJSON = require(path.resolve('abc.json'));
  } catch (e) {
    this.abcJSON = {};
  }

  if (!this.abcJSON.author) {
    this.abcJSON.author = {
      name: '',
      email: ''
    }
  }

  this.on('end', function() {
  });
};

util.inherits(Generator, generator.UIBase);

Generator.prototype.welcome = function welcome () {
  var welcome = this.abcLogo;
  this.log.writeln(welcome);
};

Generator.prototype.questions = function() {
  var cb = this.async();
  var abcJSON = this.abcJSON;

  var prompts = [
    {
      name: 'projectName',
      message: 'Name of Project?',
      default: abcJSON.name || path.basename(process.cwd()),
      warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
    },
    {
      name: 'author',
      message: 'Author Name:',
      default: abcJSON.author.name,
      warning: ''
    },
    {
      name: 'email',
      message: 'Author Email:',
      default: abcJSON.author.email,
      warning: ''
    },
    {
      name: 'styleEngine',
      message: 'Whitch style engin do you use [css-combo|less|sass]?',
      default: abcJSON.styleEngine || '',
      warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
    }
  ];

  this.prompt(prompts, function (err, props) {

    if (err) {
      return this.emit('error', err);
    }

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.projectName = props.projectName;
    this.author = props.author;
    this.email = props.email;
    this.styleEngine = props.styleEngine;
    this.enableLess = (/less/i).test(this.styleEngine);
    this.enableSass = (/sass/i).test(this.styleEngine);
    this.enableCSSCombo = (/css-combo/i).test(this.styleEngine);

    cb();
  }.bind(this));
};

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


Generator.prototype.gitFiles = function gitFiles() {
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
};

// Copies the entire template directory (with `.`, meaning the
// templates/ root) to the specified location
Generator.prototype.readme = function readme() {
  this.copy('README.md', 'README.md');
  this.copy('jshintrc', '.jshintrc');
  this.copy('editorconfig', '.editorconfig');
};


Generator.prototype.projectFiles = function projectFiles() {
    this.template('abc.json');
    this.template('package-config.js', 'src/common/package-config.js');
};


Generator.prototype.gruntFiles = function gruntFiles() {
    this.template('_package.json', 'package.json');
    this.copy('Gruntfile.js', 'Gruntfile.js');
};


Generator.prototype.endRun = function endRun() {};


/**
 * Scan Project
 */
Generator.prototype._scan = function _scan() {

    var pages = this.expand('/src/pages/*/v*/', {
        nomount: true,
        root: '.',
        mark: true
    });

    pages = pages.map(function(pathname){

        var version = path.basename(pathname).replace(/[\\/]$/, '');
        var pageName = path.basename(path.dirname(pathname))

        return {
            name: pageName,
            version: version
        }
    });

    var widgets = this.expand('src/widget/*/');

    widgets = widgets.map(function(pathname) {
        return path.basename(pathname).replace(/[\\/]$/, '');
    });

    return {
        pages: pages,
        widgets: widgets
    };

};