/**
 * grunt任务相关
 * 其执行的cwd即为grunt任务根目录
 */
var ChildProcess = require( 'child_process' );
var Path = require( 'path' );

exports.exec = function( path, args, done, ifLog ){

    var child = ChildProcess.spawn( 'grunt', args, {
        cwd: path
    });
    var ifOver = false;

    child.on( 'error', function( err ){
        if( !ifOver ){
            ifOver = true;
            done && done( err );
        }
    });

    child.on( 'exit', function(){
        if( !ifOver ){
            ifOver = true;
            done && done( null );
        }
    });

    child.on( 'close', function(){
        if( !ifOver ){
            ifOver = true;
            done && done( null );
        }
    });

    child.stdout.on('data', function (data) {
        ifLog && console.log( data.toString() );
    });

    child.stderr.on('data', function (data) {
        ifLog && console.log( data.toString() );
    });
};
