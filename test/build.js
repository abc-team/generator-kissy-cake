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

    it('基本build：page/common/widget[html/js]', function (done) {

        helpers.mockPrompt( KISSYPie, {
            projectName: "my_project",
            author: 'neekey',
            email: 'ni184775761@gmail.com',
            styleEngine: 'css',
            repo: 'http://gitlab.taobao.ali.com/tb/jury',
            publish: 'http://g.tbcdn.cn/tb/jury'
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
                                    'build/pages/home/page/init.js',
                                    // page: uglify
                                    'build/pages/home/page/init-min.js',
                                    // page: ktpl
                                    'src/pages/home/page/mods/page-tpl.js',
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

    it.skip('使用CSS-Combo：page/common/', function (done) {

        helpers.mockPrompt( KISSYPie, {
            projectName: "my_project",
            author: 'neekey',
            email: 'ni184775761@gmail.com',
            styleEngine: 'css',
            repo: 'http://gitlab.taobao.ali.com/tb/jury',
            publish: 'http://g.tbcdn.cn/tb/jury'
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
                                    'build/pages/home/page/index.css',
                                    'build/pages/home/page/index-min.css',
                                    // 验证文件编码是否正常
                                    [ 'build/common/out.css', /"微软雅黑"/],
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

    it.only('使用LESS：page/common/widget', function (done) {

        helpers.mockPrompt( KISSYPie, {
            projectName: "my_project",
            author: 'neekey',
            email: 'ni184775761@gmail.com',
            styleEngine: 'less',
            repo: 'http://gitlab.taobao.ali.com/tb/jury',
            publish: 'http://g.tbcdn.cn/tb/jury'
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
                                    'build/pages/home/page/index.css',
                                    'build/pages/home/page/index-min.css',
                                    'build/pages/home/page/pure_css.css',
                                    'build/pages/home/page/pure_css-min.css',
                                    'build/common/out.css',
                                    'build/common/out-min.css',
                                    'build/common/sub/in.css',
                                    'build/common/sub/in-min.css',
                                    'build/common/pure_out.css',
                                    'build/common/pure_out-min.css',
                                    'build/common/sub/pure_in.css',
                                    'build/common/sub/pure_in-min.css',
                                    'build/widget/tooltip/index.css',
                                    'build/widget/tooltip/index-min.css',
                                    'build/widget/tooltip/pure_css.css',
                                    'build/widget/tooltip/pure_css-min.css'
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
            styleEngine: 'sass',
            repo: 'http://gitlab.taobao.ali.com/tb/jury',
            publish: 'http://g.tbcdn.cn/tb/jury'
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
                                    'build/pages/home/page/images/i-sdcfa0aaa5c.png',
                                    [ 'build/pages/home/page/index.css', /http:\/\/g.tbcdn.cn\/tb\/jury\/0.0.1\/pages\/home\/page\/images\/i-sdcfa0aaa5c.png/ ],
                                    'build/pages/home/page/index-min.css',
                                    'build/pages/home/page/pure_css.css',
                                    'build/pages/home/page/pure_css-min.css',
                                    'build/common/images/i-sdcfa0aaa5c.png',
                                    [ 'build/common/out.css', /http:\/\/g.tbcdn.cn\/tb\/jury\/0.0.1\/common\/images\/i-sdcfa0aaa5c.png/ ],
                                    'build/common/out-min.css',
                                    'build/common/sub/in.css',
                                    'build/common/sub/in-min.css',
                                    'build/common/pure_out.css',
                                    'build/common/pure_out-min.css',
                                    'build/common/sub/pure_in.css',
                                    'build/common/sub/pure_in-min.css',
                                    [ 'build/widget/tooltip/index.css', /http:\/\/g.tbcdn.cn\/tb\/jury\/0.0.1\/widget\/tooltip\/images\/i-sdcfa0aaa5c.png/ ],
                                    'build/widget/tooltip/index-min.css',
                                    'build/widget/tooltip/pure_css.css',
                                    'build/widget/tooltip/pure_css-min.css',
                                    'build/widget/tooltip/images/i-sdcfa0aaa5c.png'
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
        'build/pages/home/page/index.css',
        'build/pages/home/page/index-min.css',
        'build/pages/index/page/index.css',
        'build/pages/index/page/index-min.css',
        'build/common/out.css',
        'build/common/out-min.css',
        'build/common/sub/in.css',
        'build/common/sub/in-min.css',
        'build/widget/tooltip/index.css',
        'build/widget/tooltip/index-min.css',
        'build/widget/slide/index.css',
        'build/widget/slide/index-min.css',

        // page: KMC
        'build/pages/home/page/init.js',
        'build/pages/index/page/init.js',
        // page: uglify
        'build/pages/home/page/init-min.js',
        'build/pages/index/page/init-min.js',
        // page: ktpl
        'src/pages/home/page/mods/page-tpl.js',
        'src/pages/index/page/mods/page-tpl.js',
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

    it('字体文件复制 page/common/widget', function (done) {

        helpers.mockPrompt( KISSYPie, {
            projectName: "my_project",
            author: 'neekey',
            email: 'ni184775761@gmail.com',
            styleEngine: 'less',
            repo: 'http://gitlab.taobao.ali.com/tb/jury',
            publish: 'http://g.tbcdn.cn/tb/jury'
        });

        KISSYPie.run({}, function () {

            BuildMock.mocks( TestTargetDir, [ 'font' ], function( err ){
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
                            helpers.assertFiles([
                                'build/pages/home/page/font/page_font.eot',
                                'build/pages/home/page/font/page_font.svg',
                                'build/pages/home/page/font/page_font.ttf',
                                'build/pages/home/page/font/page_font.woff',
                                'build/pages/home/page/font/sub/page_sub_font.eot',
                                'build/pages/home/page/font/sub/page_sub_font.svg',
                                'build/pages/home/page/font/sub/page_sub_font.ttf',
                                'build/pages/home/page/font/sub/page_sub_font.woff',
                                'build/common/font/common_font.eot',
                                'build/common/font/common_font.svg',
                                'build/common/font/common_font.ttf',
                                'build/common/font/common_font.woff',
                                'build/common/font/sub/common_sub_font.eot',
                                'build/common/font/sub/common_sub_font.svg',
                                'build/common/font/sub/common_sub_font.ttf',
                                'build/common/font/sub/common_sub_font.woff',
                                'build/widget/tooltip/font/widget_font.eot',
                                'build/widget/tooltip/font/widget_font.svg',
                                'build/widget/tooltip/font/widget_font.ttf',
                                'build/widget/tooltip/font/widget_font.woff',
                                'build/widget/tooltip/font/sub/widget_sub_font.eot',
                                'build/widget/tooltip/font/sub/widget_sub_font.svg',
                                'build/widget/tooltip/font/sub/widget_sub_font.ttf',
                                'build/widget/tooltip/font/sub/widget_sub_font.woff'
                            ]);

                            done();
                        }
                    }, true );
                }
            });
        });
    });

    it('测试 `grunt all`', function (done) {

        helpers.mockPrompt( KISSYPie, {
            projectName: "my_project",
            author: 'neekey',
            email: 'ni184775761@gmail.com',
            styleEngine: 'css',
            repo: 'http://gitlab.taobao.ali.com/tb/jury',
            publish: 'http://g.tbcdn.cn/tb/jury'
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
            styleEngine: 'css',
            repo: 'http://gitlab.taobao.ali.com/tb/jury',
            publish: 'http://g.tbcdn.cn/tb/jury'
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