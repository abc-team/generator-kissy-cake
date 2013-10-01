/**
 * 针对 初始化 任务的文件以及内容检查
 */

'use strict';
var Grunt = require( './helper/grunt' );
var fs = require('fs-extra');
var path = require('path');
var BuildMock = require( './helper/build_mocks' );
var helpers = require('abc-generator').test;

describe('ABC - KISSY-PIE generator build', function () {

    var KISSYPie;
    var TestTargetDir = path.join(__dirname, 'build_test' );
//    process.chdir( TestTargetDir );

    beforeEach(function( done ){

        process.chdir( __dirname );

        helpers.testDirectory( TestTargetDir, function (err) {
            if (err) {
                done(err);
            }
            else {
                KISSYPie = helpers.createGenerator('kissy-cake:app', [
                    '../../app'
                ]);

                done();
            }
        });
    });

    it('Bower 安装', function (done) {

        helpers.mockPrompt( KISSYPie, {
            projectName: "my_project",
            author: 'neekey',
            email: 'ni184775761@gmail.com',
            styleEngine: 'css',
            repo: 'http://gitlab.taobao.ali.com/tb/jury',
            publish: 'http://g.tbcdn.cn/tb/jury'
        });

        KISSYPie.run({}, function () {

            BuildMock.mocks( TestTargetDir, [ 'bower' ], function( err ){
                if( err ){
                    done( err );
                }
                else {
                    // build page & widget
                    Grunt.exec( TestTargetDir, [ 'install' ], function( err ){

                        if( err ){
                            done( err );
                        }
                        else {
                            // 检查文件
                            helpers.assertFiles([
                                'src/components/abc-bower-test'
                            ]);

                            done();
                        }
                    }, true );
                }
            });
        });
    });
});