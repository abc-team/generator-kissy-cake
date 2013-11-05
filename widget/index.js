var generator = require('abc-generator');
var util = require('util');
var path = require('path');
var Log = require( '../lib/log' );

var Generator = module.exports = function Generator() {
    generator.UIBase.apply(this, arguments);

    this.on('end', function () {
        this.log();
        this.log.ok('Widget %s 创建完毕!', this.widgetName );
        console.log( Log.curOff );
        this.log( Log.helpTip );
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
            name: 'widgetName',
            message: 'widget名称',
            default: '',
            warning: ''
        }
    ];

    this.prompt(prompts, function (props) {
        this.widgetName = props.widgetName;
        this.widgetName && ( this.widgetName = props.widgetName.trim() );

        if( this.widgetName ){
            this.widgetPath = path.join( 'src/widget', this.widgetName );
            cb();
        }
        else {
            console.log( '\033[1;31mwidget名称不能为空!\033[0m' )
        }


    }.bind(this));
};

/**
 * 创建用户文件
 */
Generator.prototype.initFile = function app() {

    var widgetPath = this.widgetPath;
    this.copy('index.js', path.join(widgetPath, 'index.js'));

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
            this.copy('index.less', path.join(widgetPath, 'index.less'));
            break;
        case "stylus":
            this.copy('index.styl', path.join(pagePath, 'index.styl'));
            break;
        case 'sass':
            this.mkdir(path.join(widgetPath, 'images', 'i'));
            this.copy('sass_sprites/attention.png', path.join(widgetPath, 'images', 'i', 'attention.png'));
            this.copy('sass_sprites/question.png', path.join(widgetPath, 'images', 'i', 'question.png'));
            this.copy('_sprites.scss', path.join(widgetPath, 'mods', '_sprites.scss'));
            this.copy('index.scss', path.join(widgetPath, 'index.scss'));
            break;
        default:
            this.copy('index.less', path.join(widgetPath, 'index.css'));
            break;
    }
};

