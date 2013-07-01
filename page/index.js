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
    this.log.ok('page %s/%s was created!', this.pageName, this.pageVersion);
  });

};

util.inherits(Generator, generator.UIBase);

Generator.prototype.welcome = function () {
    this.log(this.abcLogo);
};

Generator.prototype.askfor = function() {
  var cb = this.async();
  var abcJSON = this.abcJSON;

  var prompts = [
    {
      name: 'pageName',
      message: 'Name of your page:',
      default: '',
      warning: ''
    },
    {
      name: 'version',
      message: 'Version of page:',
      default: 'v1',
      warning: ''
    }
  ];

  this.prompt(prompts, function (props) {
    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.pageName = props.pageName;
    this.pageVersion = props.version.trim();
    if (!/^v\d+$/.test(this.pageVersion)) {
      this.log.error('version is not valid!');
      cb(new Error('version is not valid!'));
    }
    cb();
  }.bind(this));
};



Generator.prototype.initFile = function() {
  var root = path.join('src/pages', this.pageName, this.pageVersion, 'page');
  this.copy('index.js', path.join(root, 'index.js'));
  this.copy('index.css', path.join(root, 'index.css'));
  this.mkdir(path.join(root, 'mods'));
};

