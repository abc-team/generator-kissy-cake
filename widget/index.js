var generator = require('abc-generator');
var util      = require('util');
var path = require('path');

var Generator = module.exports = function Generator() {
  generator.UIBase.apply(this, arguments);
  // this.option('flag', { desc: 'Desc for flag', ...})
  // this.argument('filename', { desc: 'Desc for filename argument', ...})
  try {
    this.abcJSON = require(path.resolve('abc.json'));
  } catch (e) {
    this.abcJSON = {};
  }

  this.on('end', function() {
    this.log()
    this.log.ok('widget %s was created!', this.widgetName);
  });

};

util.inherits(Generator, generator.UIBase);

Generator.prototype.welcome = function () {
    this.log(this.abcLogo);
};

Generator.prototype.askfor = function() {
  var cb = this.async();

  var prompts = [
    {
      name: 'widgetName',
      message: 'Name of widget:',
      default: '',
      warning: ''
    }
  ];

  this.prompt(prompts, function (props) {
    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.widgetName = props.widgetName;
    cb();
  }.bind(this));
};


Generator.prototype.initFile = function() {
  var root = path.join('src/widget', this.widgetName);
  this.template('index.js', path.join(root, 'index.js'));
  this.template('index.css', path.join(root, 'index.css'));
  this.mkdir(path.join(root, 'mods'));
};
