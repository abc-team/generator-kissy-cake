var generator = require('abc-generator');
var util = require('util');
var Path = require('path');
var FS = require( 'fs-extra' );

var Generator = module.exports = function Generator() {
    generator.UIBase.apply(this, arguments);

    this.on('end', function () {
        console.log( '\n' )
        this.log.ok( '从旧目录: \033[1;32m' + this.srcDir + '\033[0m 到：');
        console.log( '新目录: \033[1;32m' + this.newDir + '\033[0m 迁移成功！');
        console.log( '请进入新目录，进行KISSY-Cake初始化: \033[1;32myo kissy-cake\033[0m' );
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
            name: 'srcDir',
            message: '请输入旧目录地址（绝对地址）',
            default: process.cwd(),
            warning: ''
        },
        {
            name: 'newDir',
            message: '请输入需要迁入的目录地址（绝对地址）',
            default: '',
            warning: ''
        }
    ];

    this.prompt(prompts, function (props) {

        this.newDir = props.newDir;
        this.srcDir = props.srcDir;

        if( FS.existsSync( this.newDir ) ){

            if( FS.existsSync( this.srcDir ) ){
                cb();
            }
            else {
                console.log( '旧项目地址：' + this.srcDir + ' 不存在!' );
                process.exit( 1 );
            }
        }
        else {
            console.log( '目录地址：' + this.newDir + ' 不存在!' );
            process.exit( 1 );
        }

    }.bind(this));
};

/**
 * 创建用户文件
 */
Generator.prototype.copyFiles = function app() {

    var self = this;
    var done = this.async();


    // 开始初始化目标目录
    this.mkdir( Path.resolve( this.newDir, 'src/widget' ) );
    this.mkdir( Path.resolve( this.newDir, 'src/pages' ) );
    this.mkdir( Path.resolve( this.newDir, 'build' ) );

    // 开始复制文件
    FS.copy( Path.resolve( self.srcDir, 'common' ), Path.resolve( self.newDir, 'src/common' ), function( err ){

        if( err ){
            done( err );
        }
        else {
            FS.copy( Path.resolve( self.srcDir, 'utils' ), Path.resolve( self.newDir, 'src/utils' ), function( err ){
                if( err ){
                    done( err );
                }
                else {

                    var dirCount = 0;
                    var copyCount = 0;
                    var ifForEachOver = false;


                    FS.readdirSync( self.srcDir).forEach(function( path ){
                        path = Path.resolve( self.srcDir, path );
                        var stat = FS.statSync( path );

                        if( stat.isDirectory() ){
                            // 若部位utils和common，则为page
                            if( !/(?:utils|common)/.test( path ) ){
                                dirCount++;
                                FS.copy( path, Path.join( Path.resolve( self.newDir, 'src/pages' ), Path.basename( path ) ), function( err ){
                                    if( err ){
                                        done( err );
                                    }
                                    else {
                                        copyCount++;
                                        if( ifForEachOver && copyCount == dirCount ){
                                            done();
                                        }
                                    }
                                });
                            }
                        }
                        else {
                            self.copy( path, Path.join( Path.resolve( self.newDir, 'src' ), Path.basename( path ) ) );
                        }
                    });

                    ifForEachOver = true;

                    if( dirCount == 0 ){
                        done();
                    }
                }
            });
        }
    });
};

