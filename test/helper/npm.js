/**
 * npm 操作相关
 */
var Path = require( 'path' );
var NPM = require( 'npm' );

exports.install = function( path, done ){

    // 先安装依赖
    NPM.load({},function(err){
        if( err ){
            done(err)
        }
        else {
            NPM.commands.install( path, [], function( err, data ){
                done( err, data );
            });
        }
    });
};