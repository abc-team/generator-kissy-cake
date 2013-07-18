/**
 * 用于快速复制测试文件
 */
var fs = require('fs-extra');
var path = require('path');

var TestMocksDir =  path.join( __dirname, '../build_mocks' );

exports.mocks = function( target, mocks, done ){

    if( typeof mocks == 'string' ){
        mocks = [ mocks ];
    }

    var mockLen = mocks.length;
    var mockCount = 0;
    var ifError = false;

    mocks.forEach(function( m ){

        fs.copy( path.resolve( TestMocksDir, m ), target, function( err ){

            mockCount++;

            if( err ){
                !ifError && done && done( err );
            }
            else if( mockCount == mockLen && !ifError ){
                done( null );
            }
        });
    });
};