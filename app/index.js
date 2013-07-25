var generator = require('abc-generator');
var util = require('util');
var path = require('path');

// Documentation: https://github.com/yeoman/generator/wiki/base

var Generator = module.exports = function Generator() {
    generator.UIBase.apply(this, arguments);

    try {
        this.abcJSON = require(path.resolve('abc.json'));
    } catch (e) {
        this.isFirstTime = true;
        this.abcJSON = {};
    }

    if (!this.abcJSON.author) {
        this.abcJSON.author = {
            name: '',
            email: ''
        }
    }

    // 设置generator的version
    this.generatorVersion = require( path.resolve( __dirname, '../package.json' ) ).version;

    this.on('end', function () {
        this.log();
        this.log.ok('KISSY-Cake初始化完毕!');
    });
};

util.inherits(Generator, generator.UIBase);

Generator.prototype.welcome = function welcome() {
    this.log.writeln(this.abcLogo);
};

Generator.prototype.questions = function () {
    var cb = this.async();
    var abcJSON = this.abcJSON || {};
    var cakeConfig = this.abcJSON['_kissy_cake'] || {};

    var prompts = [
        {
            name: 'projectName',
            message: '项目名称',
            default: abcJSON.name || path.basename(process.cwd()),
            warning: ''
        },
        {
            name: 'author',
            message: '作者',
            default: abcJSON.author.name || '',
            warning: ''
        },
        {
            name: 'email',
            message: '邮箱地址',
            default: abcJSON.author.email || '',
            warning: ''
        },
        {
            name: 'styleEngine',
            message: '使用样式引擎[less|sass]? 只使用CSS请回车',
            default: cakeConfig.styleEngine || '',
            warning: ''
        }
    ];

    this.prompt(prompts, function (props) {
        // manually deal with the response, get back and store the results.
        // we change a bit this way of doing to automatically do this in the self.prompt() method.
        this.projectName = props.projectName;
        this.author = props.author;
        this.email = props.email;
        this.styleEngine = props.styleEngine || 'css';
        this.enableLess = (/less/i).test(this.styleEngine);
        this.enableSass = (/sass/i).test(this.styleEngine);

        cb();
    }.bind(this));
};

// Copies the entire template directory (with `.`, meaning the
// templates/ root) to the specified location
Generator.prototype.scaffold = function scaffold() {

    this.mkdir('src/pages');
    this.mkdir('src/common');
    this.mkdir('src/widget');
    this.mkdir('src/utils');

    this.mkdir('build/common');
    this.mkdir('build/widget');
    this.mkdir('build/pages');
};


Generator.prototype.dotFiles = function gitFiles() {
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    this.copy('jshintrc', '.jshintrc');
    this.copy('editorconfig', '.editorconfig');
};

Generator.prototype.projectFiles = function projectFiles() {
    this.template('abc.json');
    this.template('package-config.js', 'src/common/package-config.js');
};


Generator.prototype.gruntFiles = function gruntFiles() {
    this.template('_package.json', 'package.json');
    this.template('Gruntfile.js');
};


Generator.prototype.sampleFiles = function endRun() {
    if (!this.isFirstTime) {
        return;
    }

    this.copy('sample-util.js', 'src/utils/sample.js');
};

Generator.prototype.install = function install() {
    var cb = this.async();
    var self = this;

    if (this.options[ 'skip-install' ]) {
        cb();
    }
    else {
        this.npmInstall('', {}, function (err) {

            if (err) {
                cb(err);
                return;
            }

            self.log.writeln('\n\nnpm was installed successful. \n\n');
            cb();
        });
    }
};

Generator.prototype.installSubTip = function installSub() {

    this.log.writeln('\n****************************************************');
    this.log.writeln('\n  【下一步】使用 yo kissy-cake:page 命令来创建子页面');
    this.log.writeln('\n****************************************************\n');
};

/**
 * Scan Project
 */
Generator.prototype._scan = function _scan() {
    // fix windows path
    var pageMatch = path.join('src/pages/*/v*/');
    var pages = this.expand(pageMatch);

    pages = pages.map(function (pathname) {

        var version = path.basename(pathname).replace(/[\\/]$/, '');
        var pageName = path.basename(path.dirname(pathname))

        return {
            id: pageName + '/' + version,
            name: pageName,
            version: version
        }
    });
    var widgetMatch = path.join('src/widget/*/');
    var widgets = this.expand(widgetMatch);

    widgets = widgets.map(function (pathname) {
        return {
            name: path.basename(pathname).replace(/[\\/]$/, '')
        };
    });

    return {
        pages: pages,
        widgets: widgets
    };
};
