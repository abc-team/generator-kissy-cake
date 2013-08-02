var generator = require('abc-generator');
var util = require('util');
var path = require('path');

var Generator = module.exports = function Generator() {
    generator.UIBase.apply(this, arguments);

    this.on('end', function () {
        this.log.ok('Page %s 创建完毕!', this.pageName);
    });
};

util.inherits(Generator, generator.UIBase);

Generator.prototype.welcome = function () {
    this.log(this.abcLogo);
};

Generator.prototype.askfor = function () {
    var cb = this.async();

    var prompts = [
        {
            name: 'pageName',
            message: 'Name of your page:',
            default: '',
            warning: ''
        }
    ];

    this.prompt(prompts, function (props) {
        this.pageName = props.pageName;
        this.pageName && ( this.pageName = this.pageName.trim() );

        if( this.pageName ){
            this.pagePath = path.join( 'src/pages', this.pageName, 'page' );
            cb();
        }
        else {
            console.log( '\033[1;31mpage名称不能为空!\033[0m' )
        }

    }.bind(this));
};

/**
 * 创建用户文件
 */
Generator.prototype.initFile = function app() {

    this.log.writeln('创建 Page. %s', this.pagePath);

    var pagePath = this.pagePath;
    this.mkdir(path.join(pagePath, 'mods'));
    this.copy('init.js', path.join(pagePath, 'init.js'));

    /**
     * 读取用户目录中的abc.json文件，防止在这个未知的原因
     *  1、在进行单元测试时，使用require的方式引入的话，就只会使用第一次require的文件状态，所以使用读取文件的方式
     *  2、若放在文件全局，其内容也是创建generator的状态
     */
    var pkgInfo = JSON.parse(this.readFileAsString(path.resolve(process.cwd(), 'abc.json')));
    // 读取使用的样式引擎
    var styleEngine = pkgInfo._kissy_cake.styleEngine;

    switch (styleEngine) {
        case "less":
            this.copy('index.less', path.join(pagePath, 'index.less'));
            break;
        case 'sass':
            this.mkdir(path.join(pagePath, 'images', 'i'));
            this.copy('sass_sprites/attention.png', path.join(pagePath, 'images', 'i', 'attention.png'));
            this.copy('sass_sprites/question.png', path.join(pagePath, 'images', 'i', 'question.png'));
            this.copy('_sprites.scss', path.join(pagePath, 'mods', '_sprites.scss'));
            this.copy('index.scss', path.join(pagePath, 'index.scss'));
            break;
        default:
            this.copy('index.less', path.join(pagePath, 'index.css'));
            break;
    }
};

