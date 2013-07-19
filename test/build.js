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

    beforeEach(function( done ){
        helpers.testDirectory( TestTargetDir, function (err) {
            if (err) {
                done(err);
            }
            KISSYPie = helpers.createGenerator('kissy-cake:app', [
                '../../app'
            ]);

            done();
        });
    });

    it('基本build：page/common[html/js]', function (done) {

        helpers.mockPrompt( KISSYPie, {
            projectName: "my_project",
            author: 'neekey',
            email: 'ni184775761@gmail.com',
            styleEngine: 'css'
        });

        KISSYPie.run({}, function () {

            BuildMock.mocks( TestTargetDir, [ 'common' ], function( err ){
                if( err ){
                    done( err );
                }
                else {
                    // build page & widget
                    Grunt.exec( TestTargetDir, [ 'build' ], function( err ){

                        if( err ){
                            done( err );
                        }
                        else {

                            // build common
                            Grunt.exec( TestTargetDir, [ 'common' ], function( err ){

                                // 检查文件
                                helpers.assertFiles([
                                    // page: KMC
                                    'build/pages/home/v1/page/init.js',
                                    // page: uglify
                                    'build/pages/home/v1/page/init-min.js',
                                    // page: ktpl
                                    'src/pages/home/v1/page/mods/page-tpl.js',
                                    // widget: KMC
                                    'build/widget/tooltip/index.js',
                                    // widget: uglify
                                    'build/widget/tooltip/index-min.js',
                                    // widget: ktpl
                                    'src/widget/tooltip/mods/widget-tpl.js',
                                    // common: KMC
                                    'build/common/out.js',
                                    'build/common/tooltip/in.js',
                                    'build/common/package-config.js',
                                    // common: uglify
                                    'build/common/out-min.js',
                                    'build/common/tooltip/in-min.js',
                                    'build/common/package-config-min.js',
                                    // common: ktpl
                                    'src/common/mods/popup-tpl.js',
                                    // utils: ktpl
                                    'src/utils/utils-tpl.js'
                                ]);

                                done();
                            });
                        }
                    }, true );
                }
            });
        });
    });

    it('使用CSS-Combo：page/common/', function (done) {

        helpers.mockPrompt( KISSYPie, {
            projectName: "my_project",
            author: 'neekey',
            email: 'ni184775761@gmail.com',
            styleEngine: 'css'
        });

        KISSYPie.run({}, function () {

            BuildMock.mocks( TestTargetDir, [ 'css_combo' ], function( err ){
                if( err ){
                    done( err );
                }
                else {
                    // build page & widget
                    Grunt.exec( TestTargetDir, [ 'build' ], function( err ){

                        if( err ){
                            done( err );
                        }
                        else {

                            // build common
                            Grunt.exec( TestTargetDir, [ 'common' ], function( err ){

                                // 检查文件
                                helpers.assertFiles([
                                    'build/pages/home/1.0/page/index.css',
                                    'build/pages/home/1.0/page/index-min.css',
                                    'build/common/out.css',
                                    'build/common/out-min.css',
                                    'build/common/sub/in.css',
                                    'build/common/sub/in-min.css',
                                    'build/widget/tooltip/index.css',
                                    'build/widget/tooltip/index-min.css'
                                ]);

                                done();
                            });
                        }
                    }, true );
                }
            });
        });
    });

    it('使用LESS：page/common/widget', function (done) {

        helpers.mockPrompt( KISSYPie, {
            projectName: "my_project",
            author: 'neekey',
            email: 'ni184775761@gmail.com',
            styleEngine: 'less'
        });

        KISSYPie.run({}, function () {

            BuildMock.mocks( TestTargetDir, [ 'less' ], function( err ){
                if( err ){
                    done( err );
                }
                else {
                    // build page & widget
                    Grunt.exec( TestTargetDir, [ 'build' ], function( err ){

                        if( err ){
                            done( err );
                        }
                        else {

                            // build common
                            Grunt.exec( TestTargetDir, [ 'common' ], function( err ){

                                // 检查文件
                                helpers.assertFiles([
                                    'build/pages/home/1.0/page/index.css',
                                    'build/pages/home/1.0/page/index-min.css',
                                    'build/common/out.css',
                                    'build/common/out-min.css',
                                    'build/common/sub/in.css',
                                    'build/common/sub/in-min.css',
                                    'build/widget/tooltip/index.css',
                                    'build/widget/tooltip/index-min.css'
                                ]);

                                done();
                            });
                        }
                    }, true );
                }
            });
        });
    });

    it('使用SASS：page/common/widget', function (done) {

        helpers.mockPrompt( KISSYPie, {
            projectName: "my_project",
            author: 'neekey',
            email: 'ni184775761@gmail.com',
            styleEngine: 'sass'
        });

        KISSYPie.run({}, function () {

            BuildMock.mocks( TestTargetDir, [ 'sass' ], function( err ){
                if( err ){
                    done( err );
                }
                else {
                    // build page & widget
                    Grunt.exec( TestTargetDir, [ 'build' ], function( err ){

                        if( err ){
                            done( err );
                        }
                        else {

                            // build common
                            Grunt.exec( TestTargetDir, [ 'common' ], function( err ){

                                // 检查文件
                                helpers.assertFiles([
                                    'src/pages/home/1.0/page/images/i-sdcfa0aaa5c.png',
                                    'build/pages/home/1.0/page/index.css',
                                    'build/pages/home/1.0/page/index-min.css',
                                    'src/common/images/i-sdcfa0aaa5c.png',
                                    'build/common/out.css',
                                    'build/common/out-min.css',
                                    'build/common/sub/in.css',
                                    'build/common/sub/in-min.css',
                                    'build/widget/tooltip/index.css',
                                    'src/widget/tooltip/images/i-sdcfa0aaa5c.png',
                                    'build/widget/tooltip/index-min.css'
                                ]);

                                done();
                            });
                        }
                    }, true );
                }
            });
        });
    });

    var gruntAllExpect = [
        'build/pages/home/1.0/page/index.css',
        'build/pages/home/1.0/page/index-min.css',
        'build/pages/home/v1/page/index.css',
        'build/pages/home/v1/page/index-min.css',
        'build/common/out.css',
        'build/common/out-min.css',
        'build/common/sub/in.css',
        'build/common/sub/in-min.css',
        'build/widget/tooltip/index.css',
        'build/widget/tooltip/index-min.css',
        'build/widget/slide/index.css',
        'build/widget/slide/index-min.css',

        // page: KMC
        'build/pages/home/v1/page/init.js',
        'build/pages/home/1.0/page/init.js',
        // page: uglify
        'build/pages/home/v1/page/init-min.js',
        'build/pages/home/1.0/page/init-min.js',
        // page: ktpl
        'src/pages/home/v1/page/mods/page-tpl.js',
        'src/pages/home/1.0/page/mods/page-tpl.js',
        // widget: KMC
        'build/widget/tooltip/index.js',
        'build/widget/slide/index.js',
        // widget: uglify
        'build/widget/tooltip/index-min.js',
        'build/widget/slide/index-min.js',
        // widget: ktpl
        'src/widget/tooltip/mods/widget-tpl.js',
        'src/widget/slide/mods/widget-tpl.js',
        // common: KMC
        'build/common/out.js',
        'build/common/tooltip/in.js',
        'build/common/package-config.js',
        // common: uglify
        'build/common/out-min.js',
        'build/common/tooltip/in-min.js',
        'build/common/package-config-min.js',
        // common: ktpl
        'src/common/mods/popup-tpl.js',
        // utils: ktpl
        'src/utils/utils-tpl.js'
    ];

    it('测试 `grunt all`', function (done) {

        helpers.mockPrompt( KISSYPie, {
            projectName: "my_project",
            author: 'neekey',
            email: 'ni184775761@gmail.com',
            styleEngine: 'css'
        });

        KISSYPie.run({}, function () {

            BuildMock.mocks( TestTargetDir, [ 'all' ], function( err ){
                if( err ){
                    done( err );
                }
                else {
                    // build page & widget
                    Grunt.exec( TestTargetDir, [ 'all' ], function( err ){

                        if( err ){
                            done( err );
                        }
                        else {

                            // 检查文件
                            helpers.assertFiles( gruntAllExpect );

                            done();
                        }
                    }, true );
                }
            });
        });
    });

    it('测试 `grunt` 默认任务执行`all`', function (done) {

        helpers.mockPrompt( KISSYPie, {
            projectName: "my_project",
            author: 'neekey',
            email: 'ni184775761@gmail.com',
            styleEngine: 'css'
        });

        KISSYPie.run({}, function () {

            BuildMock.mocks( TestTargetDir, [ 'all' ], function( err ){
                if( err ){
                    done( err );
                }
                else {
                    // build page & widget
                    Grunt.exec( TestTargetDir, [], function( err ){

                        if( err ){
                            done( err );
                        }
                        else {

                            // 检查文件
                            helpers.assertFiles( gruntAllExpect );

                            done();
                        }
                    }, true );
                }
            });
        });
    });
});