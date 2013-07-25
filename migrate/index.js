var generator = require('abc-generator');
var util = require('util');
var Path = require('path');
var FS = require( 'fs-extra' );

var Generator = module.exports = function Generator() {
    generator.UIBase.apply(this, arguments);

    this.on('end', function () {
        console.log( '\n' );
        this.log.ok( '迁移成功！' );
        console.log( '\n\033[1;32m-----------------------------------------------------------------------\033[0m\n');
        console.log( '\t从旧目录: \033[0;36m' + this.srcDir + '\033[0m');
        console.log( '\t到新目录: \033[0;36m' + this.newDir + '\033[0m');
        console.log( '\n\t\033[0;35m下一步 >>\033[0m 进行 KISSY-Cake 初始化:\n' );
        console.log( '\t\t> \033[1;33mcd ' + this.newDir + '\033[0m' );
        console.log( '\t\t> \033[1;33myo kissy-cake\033[0m' );
        console.log( '\n\033[1;32m-----------------------------------------------------------------------\033[0m');
    });
};

util.inherits(Generator, generator.UIBase);

Generator.prototype.welcome = function () {
    this.log(this.abcLogo);
    this.log( '\033[1;33m!注意\033[0m：由于KISSY-Cake中去掉了page的\033[0;36m原码版本\033[0m，因此会自动抓取\033[0;36m最新\033[0m的版本进行迁移!\n' )
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
            default: process.cwd(),
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
    console.log( '   \033[1;32mcreate\033[0m ' + Path.resolve( this.newDir, 'src/widget' ));
    console.log( '   \033[1;32mcreate\033[0m ' + Path.resolve( this.newDir, 'src/pages' ));
    console.log( '   \033[1;32mcreate\033[0m ' + Path.resolve( this.newDir, 'build' ));

    // 开始复制文件
    FS.copy( Path.resolve( self.srcDir, 'common' ), Path.resolve( self.newDir, 'src/common' ), function( err ){

        if( err ){
            self.log.error( err );
            done( err );
        }
        else {
            console.log( '   \033[1;32mcreate\033[0m ' + Path.resolve( self.newDir, 'src/common' ));

            FS.copy( Path.resolve( self.srcDir, 'utils' ), Path.resolve( self.newDir, 'src/utils' ), function( err ){
                if( err ){
                    self.log.error( err );
                    done( err );
                }
                else {
                    console.log( '   \033[1;32mcreate\033[0m ' + Path.resolve( self.newDir, 'src/utils' ));

                    var dirCount = 0;
                    var copyCount = 0;
                    var ifForEachOver = false;

                    FS.readdirSync( self.srcDir).forEach(function( path ){
                        var pathBase = path;
                        path = Path.resolve( self.srcDir, path );
                        var stat = FS.statSync( path );

                        if( stat.isDirectory() ){

                            // 若不为utils和common，则为page
                            if( !/(?:utils|common|node_modules|tools|docs)/.test( path ) ){

                                var latest = null;
                                var latestVersion = null;

                                FS.readdirSync( path).forEach(function( subPath ){
                                    var subPathBase = subPath;
                                    subPath = Path.resolve( path, subPath );

                                    // 由于KISSY-Pie目录的打包目录和1.0等原码目录在一个层级，因此需要过滤掉这些目录
                                    if( FS.statSync( subPath ).isDirectory() && ( /^\d*\.\d*$/.test( subPathBase ) || /^v/.test( subPathBase ) ) ){

                                        if( latestVersion === null ){
                                            latestVersion = subPathBase;
                                            latest = subPath;
                                        }
                                        else {
                                            if( parseFloat( subPathBase ) > latestVersion ){
                                                latestVersion = subPathBase;
                                                latest = subPath;
                                            }
                                        }
                                    }
                                });

                                if( latest != null ){

                                    dirCount++;

                                    FS.copy( latest, Path.join( Path.resolve( self.newDir, 'src/pages' ), pathBase ), function( err ){
                                        if( err ){
                                            self.log.error( err );
                                            done( err );
                                        }
                                        else {
                                            console.log( '   \033[1;32mcreate\033[0m ' + Path.join( Path.resolve( self.newDir, 'src/pages' ), pathBase ));
                                            copyCount++;
                                            if( ifForEachOver && copyCount == dirCount ){
                                                done();
                                            }
                                        }
                                    });
                                }
                            }
                        }
                        else {
                            if( !/(?:fb\.json|abc\.json|Gruntfile\.js|package\.json|README\.md)/.test( path ) ){
                                self.copy( path, Path.join( Path.resolve( self.newDir, 'src' ), Path.basename( path ) ) );
                            }
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

