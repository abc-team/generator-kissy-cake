var Path = require( 'path' );
var util = require('util');
var Log = require( '../lib/log' );
var generator = require('abc-generator');

var Generator = module.exports = function Generator() {
    generator.UIBase.apply(this, arguments);

    var PKGInfo = require( Path.resolve( __dirname, '../package.json' ) );

    this.on('end', function () {
        console.log( Log.curOff );
        this.log( Log.helpTip );
    });

    this.log(this.abcLogo);
    console.log( '当前版本: \033[0;36m' + PKGInfo.version + '\033[0m');
    console.log( '仓库主页: \033[0;36m' + PKGInfo.repository.url + '\033[0m');
    console.log( '问题反馈: \033[0;36m' + PKGInfo.bugs.url + '\033[0m');
    console.log( '常见问题: \033[0;36m' + PKGInfo.bugs.faq + '\033[0m');
    console.log( '维护人员: \033[0;36m' + PKGInfo.contributors[0].name + ' <' + PKGInfo.contributors[0].email +  '>\033[0m');
    PKGInfo.contributors.forEach(function( person, index ){
        if( index > 0 ){
            console.log( '          \033[0;36m' + person.name + ' <' + person.email + '>\033[0m');
        }
    });
    console.log( '\n  Yo命令列表:\n');
    console.log( '\t\033[1;33myo kissy-cake\033[0m: \t\t在当前目录执行初始化');
    console.log( '\t\033[1;33myo kissy-cake:page\033[0m: \t添加一个page');
    console.log( '\t\033[1;33myo kissy-cake:widget\033[0m: \t添加一个widget');
    console.log( '\t\033[1;33myo kissy-cake:migrate\033[0m: \t从KISSY-Pie到KISSY-Cake迁移');
    console.log( '\t\033[1;33myo kissy-cake:help\033[0m: \t显示使用帮助');
    console.log( '\n  Grunt命令列表:\n');
    console.log( '\t\033[1;33mgrunt page\033[0m: \t\t对abc.json中指定的page进行打包');
    console.log( '\t\033[1;33mgrunt widget\033[0m: \t\t对abc.json中指定的widget进行打包');
    console.log( '\t\033[1;33mgrunt common\033[0m: \t\t对common目录进行打包');
    console.log( '\t\033[1;33mgrunt build\033[0m: \t\t对abc.json中指定的page和widget以及common进行打包');
    console.log( '\t\033[1;33mgrunt all\033[0m: \t\t整站打包：所有的page，widget以及common');
    console.log( '\t\033[1;33mgrunt\033[0m: \t\t\t与grunt all相同');
};

util.inherits(Generator, generator.UIBase);
