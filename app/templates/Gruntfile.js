var PATH = require('path');
var FS = require( 'fs' );

module.exports = function (grunt) {

    var ABCConfig = grunt.file.readJSON('abc.json');

    /**
     *  分析用户给定的参数
     *  @example
     *      打包common：    `grunt common`
     *      单个：
     *          打包page：  `grunt build --page home --widget tooltip`
     *          watch：    `grunt watch --page home--widget tooltip
     *      多个：
     *          打包：     `grunt build --page home,intro --widget tooltip,scroll`
     *          watch:    `grunt watch --page home,intro --widget tooltip,scroll`
     */

    /**
     * 对每个具体任务进行配置
     */
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        repoVersion: ABCConfig.version,
        buildBase: 'build',
        srcBase: 'src',
        // 包名
        packageName: 'page',
        // 页面名称
        pageName: ABCConfig._kissy_cake.defaults.pages[0],
        // Widget名称
        widgetName: ABCConfig._kissy_cake.defaults.widgets[0],

        // 用于页面打包路径
        pageSrcBase: '<%%= srcBase %>/pages/<%%= pageName %>/<%%= packageName %>',
        widgetSrcBase: '<%%= srcBase %>/widget/<%%= widgetName %>',
        commonSrcBase: '<%%= srcBase %>/common',
        utilsSrcBase: '<%%= srcBase %>/utils',
        componentsSrcBase: '<%%= srcBase %>/components',

        // 打包输出目录
        pageBuildBase: '<%%= buildBase %>/pages/<%%= pageName %>/<%%= packageName %>',
        widgetBuildBase: '<%%= buildBase %>/widget/<%%= widgetName %>',
        commonBuildBase: '<%%= buildBase %>/common',

        // 线上引用地址
        publishBase: ABCConfig.repository.publish + '/' + ABCConfig.version,

        /**
         * 命令数据统计
         */
        keen: {
            projectId: "5243b86373f4bb052d00000b",
            writeKey: "a3738c3ed18ecc950a1f029dd45b0e0af900fcc6ab7dd7cb20f7fc0c5e4819030a575609ae3d1d4366e6ba8fce0a33f9d5f714aec6cd2d71247cf3650ece5f44a51a09d91a97e9d020e2acd47f0ad42d33fde9ffa34544024ee24a7e35619e7d34e6921f8a6d84109198ac5b38754f12",
            data: {
                repoInfo: {
                    URL: ABCConfig.repository.url,
                    author: ABCConfig.author.name,
                    email: ABCConfig.author.email
                },
                other: {
                    KISSY: ABCConfig.KISSY,
                    styleEngine: ABCConfig._kissy_cake.styleEngine
                }
            },
            forbid: function(){
                var COMMAND = process.argv[ 2 ];
                if( COMMAND && ( COMMAND == 'multi' || COMMAND.indexOf( 'multi:' ) >= 0 || COMMAND.indexOf( '_' ) >= 0 ) ) {
                    return true;
                }
                else return grunt.option('multi-single') || grunt.option( 'disable-keen' );
            },
            eventName: 'grunt'
        },

        /**
         * 定义Multi任务
         */
        multi: {
            // 打包abc.json中指定的page
            page: {
                options: {
                    logBegin: function( vars ){
                        return '开始打包 Page: ' + vars.page + ' ...';
                    },
                    logEnd: function( vars ){
                        return 'Page: ' + vars.page + ' 打包成功!';
                    },
                    vars: {
                        page: ABCConfig._kissy_cake.defaults.pages
                    },
                    config: {
                        pageName: '<%%= page %>'
                    },
                    tasks: [ '_page' ]
                }
            },
            // 打包abc.json中指定的widget
            widget: {
                options: {
                    logBegin: function( vars ){
                        return '开始打包 Widget: ' + vars.widget + ' ...';
                    },
                    logEnd: function( vars ){
                        return 'Widget: ' + vars.widget + ' 打包成功!';
                    },
                    vars: {
                        widget: ABCConfig._kissy_cake.defaults.widgets
                    },
                    config: {
                        widgetName: '<%%= widget %>'
                    },
                    tasks: [ '_widget' ]
                }
            },
            // 打包所有的page
            all_page: {
                options: {
                    logBegin: function( vars ){
                        return '开始打包 Page: ' + vars.page;
                    },
                    logEnd: function( vars ){
                        return 'Page: ' + vars.page + '打包成功!' + ' ...';
                    },
                    vars: {
                        page: { patterns: '*', options: { cwd: 'src/pages', filter: 'isDirectory' } }
                    },
                    config: {
                        pageName: '<%%= page %>'
                    },
                    tasks: [ '_page' ]
                }
            },
            // 打包所有的widget
            all_widget: {
                options: {
                    logBegin: function( vars ){
                        return '开始打包 Widget: ' + vars.widget + ' ...';
                    },
                    logEnd: function( vars ){
                        return 'Widget: ' + vars.widget + '打包成功!';
                    },
                    vars: {
                        widget: { patterns: '*', options: { cwd: 'src/widget', filter: 'isDirectory' } }
                    },
                    config: {
                        widgetName: '<%%= widget %>'
                    },
                    tasks: [ '_widget' ]
                }
            },
            // 监控abc.json中指定的page
            watch_page: {
                options: {
                    continued: true,
                    vars: {
                        page: ABCConfig._kissy_cake.defaults.pages
                    },
                    config: {
                        pageName: '<%%= page %>',
                        watch: function( vars, rawConfig ){
                            var rawWatch = grunt.util._.clone( rawConfig.watch );
                            grunt.util._.each( rawWatch, function( value , key ){
                                if( !(/.*(_page|options)$/.test(key)) ){
                                    delete rawWatch[ key ];
                                }
                            });
                            return rawWatch;
                        }
                    },
                    tasks: [ 'watch' ]
                }
            },
            // 监控abc.json中指定的widget
            watch_widget: {
                options: {
                    continued: true,
                    vars: {
                        widget: ABCConfig._kissy_cake.defaults.widgets
                    },
                    config: {
                        widgetName: '<%%= widget %>',
                        watch: function( vars, rawConfig ){
                            var rawWatch = grunt.util._.clone( rawConfig.watch );
                            grunt.util._.each( rawWatch, function( value , key ){
                                if( !(/.*(_widget|options)$/.test(key)) ){
                                    delete rawWatch[ key ];
                                }
                            });
                            return rawWatch;
                        }
                    },
                    tasks: [ 'watch' ]
                }
            },
            // 监控 common
            watch_common: {
                options: {
                    continued: true,
                    config: {
                        watch: function( vars, rawConfig ){
                            var rawWatch = grunt.util._.clone( rawConfig.watch );
                            grunt.util._.each( rawWatch, function( value , key ){
                                if( !(/.*(_common|options)$/.test(key)) ){
                                    delete rawWatch[ key ];
                                }
                            });
                            return rawWatch;
                        }
                    },
                    tasks: [ 'watch' ]
                }
            },
            // 监控所有的page
            watch_all_page: {
                options: {
                    continued: true,
                    vars: {
                        page: { patterns: '*', options: { cwd: 'src/pages', filter: 'isDirectory' } }
                    },
                    config: {
                        pageName: '<%%= page %>',
                        watch: function( vars, rawConfig ){
                            var rawWatch = grunt.util._.clone( rawConfig.watch );
                            grunt.util._.each( rawWatch, function( value , key ){
                                if( !(/.*(_page|options)$/.test(key)) ){
                                    delete rawWatch[ key ];
                                }
                            });
                            return rawWatch;
                        }
                    },
                    tasks: [ 'watch' ]
                }
            },
            // 监控所有的widget
            watch_all_widget: {
                options: {
                    continued: true,
                    vars: {
                        widget: { patterns: '*', options: { cwd: 'src/widget', filter: 'isDirectory' } }
                    },
                    config: {
                        widgetName: '<%%= widget %>',
                        watch: function( vars, rawConfig ){
                            var rawWatch = grunt.util._.clone( rawConfig.watch );
                            grunt.util._.each( rawWatch, function( value , key ){
                                if( !(/.*(_widget|options)$/.test(key)) ){
                                    delete rawWatch[ key ];
                                }
                            });
                            return rawWatch;
                        }
                    },
                    tasks: [ 'watch' ]
                }
            }
        },

        copy: {
            font_widget: {
                files: [
                    // widget中的字体
                    {
                        expand: true,
                        cwd: '<%%= widgetSrcBase %>/font',
                        src: [ '**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff' ],
                        dest: '<%%= widgetBuildBase %>/font'
                    }
                ]
            },
            font_page: {
                files: [
                    // page中的字体
                    {
                        expand: true,
                        cwd: '<%%= pageSrcBase %>/font',
                        src: [ '**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff' ],
                        dest: '<%%= pageBuildBase %>/font'
                    }
                ]
            },
            font_common: {
                files: [
                    // common中的字体
                    {
                        expand: true,
                        cwd: '<%%= commonSrcBase %>/font',
                        src: [ '**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff' ],
                        dest: '<%%= commonBuildBase %>/font'
                    }
                ]
            },
            image_page: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= pageSrcBase %>/images',
                        src: [ '*.png', '*.jpg', '*.jpeg', '*.gif' ],
                        dest: '<%= pageBuildBase %>/images'
                    }
                ]
            },
            image_common: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= commonSrcBase %>/images',
                        src: [ '*.png', '*.jpg', '*.jpeg', '*.gif' ],
                        dest: '<%= commonBuildBase %>/images'
                    }
                ]
            }
        },

        /**
         * 进行KISSY 打包
         * @link https://github.com/daxingplay/grunt-kmc
         */
        kmc: {
            options: {
                packages: [
                    {
                        name: '<%%= packageName %>',
                        path: '<%%= srcBase %>/pages/<%%= pageName %>'
                    },
                    {
                        name: 'widget',
                        path: './<%%= srcBase %>'
                    },
                    {
                        name: 'utils',
                        path: './<%%= srcBase %>'
                    },
                    {
                        name: 'components',
                        path: './<%%= srcBase %>'
                    },
                    {
                        name: 'common',
                        path: './<%%= srcBase %>'
                    }
                ]
            },
            page: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= pageSrcBase %>',
                        src: [ '*.js', '!*.combo.js', '!*-min.js', '!*-tpl.js' ],
                        dest: '<%%= pageBuildBase %>/'
                    }
                ]
            },
            widget: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= widgetSrcBase %>',
                        src: [ '*.js', '!*.combo.js', '!*-min.js', '!*-tpl.js' ],
                        dest: '<%%= widgetBuildBase %>/'
                    }
                ]
            },
            common: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= commonSrcBase %>',
                        src: [ '**/*.js', '!**/*.combo.js', '!**/_*.js', '!**/*-min.js', '!**/*-tpl.js' ],
                        dest: '<%%= commonBuildBase %>'
                    }
                ]
            }
        },

        /**
         * 将HTML编译为KISSY 模块
         * @link https://github.com/maxbbn/grunt-kissy-template
         */
        ktpl: {
            page: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= pageSrcBase %>',
                        dest: '<%%= pageSrcBase %>',
                        src: '**/*-tpl.html',
                        ext: '.js'
                    }
                ]
            },
            widget: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= widgetSrcBase %>',
                        dest: '<%%= widgetSrcBase %>',
                        src: '**/*-tpl.html',
                        ext: '.js'
                    }
                ]
            },
            utils: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= utilsSrcBase %>',
                        dest: '<%%= utilsSrcBase %>',
                        src: '**/*-tpl.html',
                        ext: '.js'
                    }
                ]
            },
            common: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= commonSrcBase %>',
                        dest: '<%%= commonSrcBase %>',
                        src: '**/*-tpl.html',
                        ext: '.js'
                    }
                ]
            }
        },
        /**
         * CSS Combo
         * @link https://github.com/daxingplay/grunt-css-combo
         */
        css_combo: {
            options: {
                paths: [ '<%%= srcBase %>' ],
                outputEncoding: 'utf8'
            },
            page: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= pageSrcBase %>',
                        src: '*.css',
                        dest: '<%%= pageBuildBase %>'
                    }
                ]
            },
            widget: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= widgetSrcBase %>',
                        src: '*.css',
                        dest: '<%%= widgetBuildBase %>'
                    }
                ]
            },
            common: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= commonSrcBase %>',
                        src: [ '**/*.css', '!**/_*.css' ],
                        dest: '<%%= commonBuildBase %>'
                    }
                ]
            }
        }<% if(enableLess) { %>,

        /**
         * 将LESS编译为CSS
         * @link https://github.com/gruntjs/grunt-contrib-less
         */
        less: {
            options: {
                paths: [ '<%%= srcBase %>', '<%%= pageSrcBase %>', '<%%= widgetSrcBase %>', '<%%= utilsSrcBase %>', '<%%= componentsSrcBase %>', '<%%= commonSrcBase %>' ]
            },
            page: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= pageSrcBase %>',
                        src: '*.less',
                        dest: '<%%= pageBuildBase %>',
                        ext: '.css'
                    }
                ]
            },
            widget: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= widgetSrcBase %>',
                        src: '*.less',
                        dest: '<%%= widgetBuildBase %>',
                        ext: '.css'
                    }
                ]
            },
            common: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= commonSrcBase %>',
                        src: [ '**/*.less', '!**/_*.less' ],
                        dest: '<%%= commonBuildBase %>',
                        ext: '.css'
                    }
                ]
            }
        }<% } if(enableSass) { %>,

        /**
         * 编译Compass & SASS
         * @link https://github.com/gruntjs/grunt-contrib-compass
         */
        compass: {
            options: {
                outputStyle: 'nested',
                noLineComments: true,
                importPath: [ '<%%= srcBase %>' ],
                trace: true
            },
            page: {
                options: {
                    sassDir: '<%%= pageSrcBase %>',
                    cssDir: '<%%= pageBuildBase %>',
                    imagesDir: '<%%= pageSrcBase %>/images',
                    generatedImagesDir: '<%%= pageBuildBase %>/images',
                    httpGeneratedImagesPath: '<%%= publishBase %>/pages/<%%= pageName %>/<%%= packageName %>/images/'
                }
            },
            widget: {
                options: {
                    sassDir: '<%%= widgetSrcBase %>',
                    cssDir: '<%%= widgetBuildBase %>',
                    imagesDir: '<%%= widgetSrcBase %>/images',
                    generatedImagesDir: '<%%= widgetBuildBase %>/images',
                    httpGeneratedImagesPath: '<%%= publishBase %>/widget/<%%= widgetName %>/images/'
                }
            },
            common: {
                options: {
                    sassDir: '<%%= commonSrcBase %>',
                    cssDir: '<%%= commonBuildBase %>',
                    imagesDir: '<%%= commonSrcBase %>/images',
                    generatedImagesDir: '<%%= commonBuildBase %>/images',
                    httpGeneratedImagesPath: '<%%= publishBase %>/common/images/'
                }
            }
        }<% } %>,

        /**
         * 对JS文件进行压缩
         * @link https://github.com/gruntjs/grunt-contrib-uglify
         */
        uglify: {
            options: {
                beautify: {
                    ascii_only: true
                }
            },
            page: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= pageBuildBase %>',
                        src: ['**/*.js', '!**/*-min.js'],
                        dest: '<%%= pageBuildBase %>',
                        ext: '-min.js'
                    }
                ]
            },
            widget: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= widgetBuildBase %>',
                        src: ['**/*.js', '!**/*-min.js'],
                        dest: '<%%= widgetBuildBase %>',
                        ext: '-min.js'
                    }
                ]
            },
            common: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= commonBuildBase %>',
                        src: ['**/*.js', '!**/*-min.js'],
                        ext: ['-min.js'],
                        dest: '<%%= commonBuildBase %>'
                    }
                ]
            }
        },

        /**
         * 对CSS 文件进行压缩
         * @link https://github.com/gruntjs/grunt-contrib-cssmin
         */
        cssmin: {
            page: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= pageBuildBase %>',
                        src: ['**/*.css', '!**/*-min.css'],
                        dest: '<%%= pageBuildBase %>',
                        ext: '-min.css'
                    }
                ]
            },
            widget: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= widgetBuildBase %>',
                        src: ['**/*.css', '!**/*-min.css'],
                        dest: '<%%= widgetBuildBase %>',
                        ext: '-min.css'
                    }
                ]
            },
            common: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%= commonBuildBase %>',
                        src: ['**/*.css', '!**/*-min.css'],
                        dest: '<%%= commonBuildBase %>',
                        ext: '-min.css'
                    }
                ]
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    hostname: '*',
                    base: '.',
                    keepalive: true
                }
            }
        },

        /**
         * 对文件进行监控
         * watch的一个trick是，如果两个定义的files一样，那么只会执行最后一个的task
         * watch这块的定义比较复杂，简要说明：
         *      命名：
         *          资源类型 位置 针对目标: 如 JS_utils_widget
         *          JS代表是JS文件，utils说明是uitls文件夹中的js文件，widget说明这个位置的js文件变更只进行widget的打包
         *      动态配置：
         *          根据执行的任务不同，脚本中会动态去设置下面的配置，如只watch widget，就会将非_widget的配置项都删除
         */
        watch: {
            options: {
                spawn: false
            },
            // 所有在utils中的js文件变更将重新build widget
            'js_utils_widget': {
                files: [ '<%%= utilsSrcBase %>/**/*.js' ],
                tasks: [ 'kmc:widget', 'uglify:widget' ]
            },
            // 所有在utils中的js文件变更将重新build page
            'js_utils_page': {
                files: [ '<%%= utilsSrcBase %>/**/*.js' ],
                tasks: [ 'kmc:page', 'uglify:page' ]
            },
            // 所有在utils中的js文件变更将重新build common
            'js_utils_common': {
                files: [ '<%%= utilsSrcBase %>/**/*.js' ],
                tasks: [ 'kmc:common', 'uglify:common' ]
            },
            // 所有在某个widget中的js文件变更将重新build对应的 widget
            'js_widget_widget': {
                files: [ '<%%= widgetSrcBase %>/**/*.js' ],
                tasks: [ 'kmc:widget', 'uglify:widget' ]
            },
            // 任意widget中的js文件变更将重新build page
            'js_widget_page': {
                files: [ '<%%= srcBase %>/widget/**/*.js' ],
                tasks: [ 'kmc:page', 'uglify:page' ]
            },
            // 所有在某个page中的js文件变更将重新build对应的 page
            'js_page': {
                files: [ '<%%= pageSrcBase %>/**/*.js' ],
                tasks: [ 'kmc:page', 'uglify:page' ]
            },
            // 所有在某个common中的js文件变更将重新build common
            'js_common': {
                files: [ '<%%= commonSrcBase %>/**/*.js' ],
                tasks: [ 'kmc:common', 'uglify:common' ]
            },
            // 所有位置的tpl变更，都只需要重新编译自己就可以了，因为tpl的编译会触发js的变更
            'tpl_utils_widget': {
                files: [ '<%%= utilsSrcBase %>/**/*-tpl.html' ],
                tasks: [ 'ktpl:utils' ]
            },
            'tpl_utils_page': {
                files: [ '<%%= utilsSrcBase %>/**/*-tpl.html' ],
                tasks: [ 'ktpl:utils' ]
            },
            'tpl_utils_common': {
                files: [ '<%%= utilsSrcBase %>/**/*-tpl.html' ],
                tasks: [ 'ktpl:utils' ]
            },
            'tpl_widget_widget': {
                files: [ '<%%= widgetSrcBase %>/**/*-tpl.html' ],
                tasks: [ 'ktpl:widget' ]
            },
            'tpl_widget_page': {
                files: [ '<%%= srcBase %>/widget/**/*-tpl.html' ],
                tasks: [ 'ktpl:widget' ]
            },
            'tpl_page': {
                files: [ '<%%= pageSrcBase %>/**/*-tpl.html' ],
                tasks: [ 'ktpl:page' ]
            },
            'tpl_common': {
                files: [ '<%%= commonSrcBase %>/**/*-tpl.html' ],
                tasks: [ 'ktpl:common' ]
            },
            // utils目录中的CSS文件变更，就build widget
            'css_utils_widget': {
                files: [ '<%%= utilsSrcBase %>/**/*.css' ],
                tasks: [ 'css_combo:widget', 'cssmin:widget' ]
            },
            // utils目录中的CSS文件变更，就build page
            'css_utils_page': {
                files: [ '<%%= utilsSrcBase %>/**/*.css' ],
                tasks: [ 'css_combo:page', 'cssmin:page' ]
            },
            'css_utils_common': {
                files: [ '<%%= utilsSrcBase %>/**/*.css' ],
                tasks: [ 'css_combo:common', 'cssmin:common' ]
            },
            // 某个widget目录中的CSS文件变更，就build 对应的widget
            'css_widget_widget': {
                files: [ '<%%= widgetSrcBase %>/**/*.css' ],
                tasks: [ 'css_combo:widget', 'cssmin:widget' ]
            },
            // 任意widget目录中的CSS文件变更，就build page
            'css_widget_page': {
                files: [ '<%%= srcBase %>/widget/**/*.css' ],
                tasks: [ 'css_combo:page', 'cssmin:page' ]
            },
            // 某个page目录中的CSS文件变更，就build对应的page
            'css_page': {
                files: [ '<%%= pageSrcBase %>/**/*.css' ],
                tasks: [ 'css_combo:page', 'cssmin:page' ]
            },
            'css_common': {
                files: [ '<%%= commonSrcBase %>/**/*.css' ],
                tasks: [ 'css_combo:common', 'cssmin:common' ]
            }<% if(enableSass) { %>,
            // utils目录中的sass文件变更，就build widget
            'compass_utils_widget': {
                files: [ '<%%= utilsSrcBase %>/**/*.scss' ],
                tasks: [ 'compass:widget', 'cssmin:widget' ]
            },
            // utils目录中的sass文件变更，就build page
            'compass_utils_page': {
                files: [ '<%%= utilsSrcBase %>/**/*.scss' ],
                tasks: [ 'compass:page', 'cssmin:page' ]
            },
            'compass_utils_common': {
                files: [ '<%%= utilsSrcBase %>/**/*.scss' ],
                tasks: [ 'compass:common', 'cssmin:common' ]
            },
            // 某个widget目录中的sass文件变更，就build 对应的widget
            'compass_widget_widget': {
                files: [ '<%%= widgetSrcBase %>/**/*.scss', '<%%= widgetSrcBase %>/**/*.png' ],
                tasks: [ 'compass:widget', 'cssmin:widget' ]
            },
            // 任意widget目录中的sass文件变更，就build page
            'compass_widget_page': {
                files: [ '<%%= srcBase %>/widget/**/*.scss', '<%%= srcBase %>/widget/**/*.png' ],
                tasks: [ 'compass:page', 'cssmin:page' ]
            },
            'compass_common': {
                files: [ '<%%= commonSrcBase %>/**/*.scss', '<%%= commonSrcBase %>/**/*.png' ],
                tasks: [ 'compass:common', 'cssmin:common' ]
            },
            // 某个page目录中的sass文件变更，就build对应的page
            'compass_page': {
                files: [ '<%%= pageSrcBase %>/**/*.scss', '<%%= pageSrcBase %>/**/*.png' ],
                tasks: [ 'compass:page', 'cssmin:page' ]
            }<% } if(enableLess) { %>,
            // utils目录中的less文件变更，就build widget
            'less_utils_widget': {
                files: [ '<%%= utilsSrcBase %>/**/*.less' ],
                tasks: [ 'less:widget', 'cssmin:widget' ]
            },
            // utils目录中的less文件变更，就build page
            'less_utils_page': {
                files: [ '<%%= utilsSrcBase %>/**/*.less' ],
                tasks: [ 'less:page', 'cssmin:page' ]
            },
            'less_utils_common': {
                files: [ '<%%= utilsSrcBase %>/**/*.less' ],
                tasks: [ 'less:common', 'cssmin:common' ]
            },
            // 某个widget目录中的less文件变更，就build 对应的widget
            'less_widget_widget': {
                files: [ '<%%= widgetSrcBase %>/**/*.less' ],
                tasks: [ 'less:widget', 'cssmin:widget' ]
            },
            // 任意widget目录中的less文件变更，就build page
            'less_widget_page': {
                files: [ '<%%= srcBase %>/widget/**/*.less' ],
                tasks: [ 'less:page', 'cssmin:page' ]
            },
            // 某个page目录中的less文件变更，就build对应的page
            'less_page': {
                files: [ '<%%= pageSrcBase %>/**/*.less' ],
                tasks: [ 'less:page', 'cssmin:page' ]
            },
            'less_common': {
                files: [ '<%%= commonSrcBase %>/**/*.less' ],
                tasks: [ 'less:common', 'cssmin:common' ]
            }<% } %>
        },

        /**
         * git相关操作
         */
        exec: {
            /**
             * Component 安装
             */
            bower_install: {
                command: function(){
                    var deps = ABCConfig.dependencies;
                    var depsArr = [];
                    grunt.util._.each(deps, function( version, name ){
                        var depStr = name;
                        if( version != '*' ){
                            depStr += '#' + version;
                        }
                        depsArr.push( depStr );
                    });
                    return 'node ' + PATH.resolve( __dirname, 'node_modules/bower/bin/bower' ) + ' install ' + depsArr.join( ' ' ) + ' --color';
                }
            },
            /**
             * Component 搜索
             */
            bower_search: {
                command: function( keyword ){
                    return 'node ' + PATH.resolve( __dirname, 'node_modules/bower/bin/bower' ) + ' search ' + keyword + ' --color';
                }
            },
            tag: {
                command: 'git tag publish/<%%= repoVersion %>'
            },
            publish: {
                command: 'git push origin publish/<%%= repoVersion %>:publish/<%%= repoVersion %>'
            },
            prepub: {
                command: 'git push origin daily/<%%= repoVersion %>:daily/<%%= repoVersion %>'
            },
            new_version: {
                command: function(){
                var current = grunt.config( 'repoVersion' ) || '0.0.0';
                var EX = /(\d+)\.(\d+)\.(\d+)/;
                var ret = EX.exec( current );
                var newVersion = '';

                if( grunt.option( 'major' ) ){
                    newVersion = (++ret[1])+'.0.0';
                }
                else if( grunt.option( 'pitch' ) ){
                    newVersion = ret[1]+'.'+ret[2]+'.'+(++ret[3]);
                }
                else {
                    newVersion = ret[1]+'.'+(++ret[2])+'.0';
                }

                // 更新abc.json中的version字段
                FS.writeFileSync( 'abc.json', FS.readFileSync( 'abc.json' ).toString().replace( /"version"\s*:\s*"(\d+\.\d+\.\d+)"/, '"version": "' + newVersion + '"' ));

                    return 'git checkout -b ' + 'daily/' + newVersion;
                }
            },
            switch: {
                command: function( version ){
                    return 'git checkout ' + 'daily/' + version;
                }
            }
        },

        /**
         * 自动更新提示
         */
        update_notify: {
            generator: {
                options: {
                    name: 'generator-kissy-cake',
                    global: true,
                    changeLogURL: 'https://raw.github.com/abc-team/generator-kissy-cake/master/CHANGELOG.md',
                    changeLog: function( content, latest ){
                        // 对内容进行提取
                        var chunk = content.split( /#+\s*v?([\d\.]+)\s*\n/g );
                        var isVersion = true;
                        var lastVersion = null;
                        var changeLogs = {};
                        chunk.forEach(function( value ){
                            if( value = value.trim() ){
                                if( isVersion ){
                                    lastVersion = value;
                                }
                                else {
                                    changeLogs[ lastVersion ] = value;
                                }
                                isVersion = !isVersion;
                            }
                        });

                        return changeLogs[ latest ];
                    },
                    append: true,
                    // 两天检查一次更新
                    interval: 2,
                    block: true
                }
            }
        }
    });

    /**
     * 载入使用到的通过NPM安装的模块
     */
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    /**
     * 注册基本任务
     */
    grunt.registerTask('default', [ 'all' ]);

    /**
     * 对page进行打包
     *      html -> js, KISSY pkg, js compression, less/sass compile, css compression.
     */
    grunt.registerTask('_page', [ 'ktpl:utils', 'ktpl:page', 'kmc:page', 'uglify:page'<% if(enableLess) {%>, 'less:page'<% } if(enableSass) {%>, 'compass:page'<% } %>, 'css_combo:page', 'cssmin:page', 'copy:font_page' ]);
    grunt.registerTask( 'page', [ 'update_notify:generator', 'multi:page' ] );
    /**
     * 对widget进行打包
     *      html -> js, KISSY pkg, js compression, less/sass compile, css compression.
     */
    grunt.registerTask('_widget', [ 'ktpl:utils', 'ktpl:widget', 'kmc:widget', 'uglify:widget'<% if(enableLess) { %>, 'less:widget'<% } if(enableSass) { %>, 'compass:widget'<% } %>, 'css_combo:widget', 'cssmin:widget', 'copy:font_widget' ]);
    grunt.registerTask( 'widget', [ 'update_notify:generator', 'multi:widget' ] );
    /**
     * 对common进行打包
     *      html -> js, KISSY pkg, js compression, less/sass compile, css compression.
     */
    grunt.registerTask( '_common', [ 'ktpl:utils', 'ktpl:common', 'kmc:common', 'uglify:common'<% if(enableLess) { %>, 'less:common'<% } if(enableSass) { %>, 'compass:common'<% } %>, 'css_combo:common', 'cssmin:common', 'copy:font_common' ]);
    grunt.registerTask( 'common', [ 'update_notify:generator', '_common' ]);

    /**
     * 打包common, abc.json中指定的page和widget
     */
    grunt.registerTask( 'build', [ 'update_notify:generator', 'multi:page', 'multi:widget', '_common' ] );

    /**
     * 打包所有文件
     */
    grunt.registerTask( 'all', [ 'update_notify:generator', 'multi:all_page', 'multi:all_widget', '_common',  ] );
    grunt.registerTask( '_watchall', [ 'multi:watch_all_page', 'multi:watch_all_widget', 'multi:watch_common' ] );
    grunt.registerTask( '_watchbuild', [ 'multi:watch_page', 'multi:watch_widget', 'multi:watch_common' ] );

    /**
     * 只有当用户开启的进程才会去重写watch命令
     * 若用户添加参数 --few 则只watch abc.json中指定的page和widget
     */
    if( !grunt.option( 'multi-single' ) ){
        grunt.registerTask( 'watch', function(){
            this.async();

            var args = grunt.option( 'few' ) ? [ '_watchbuild' ] : [ '_watchall'];
            if( grunt.util._.indexOf( process.argv, '--debug' ) >= 0 ){
                args.push( '--debug' );
            }

            var child = grunt.util.spawn({
                grunt: true,
                args: args
            }, function(){});

            child.stdout.on('data', function (data) {
                console.log( data.toString( 'utf8') );
            });
        });
    }


    /**
     * Component 相关操作, 安装 & 搜索
     */
    grunt.registerTask( 'install', [ 'exec:bower_install'] );
    grunt.registerTask( 'search', function( keyword ){
        grunt.task.run( [ 'exec:bower_search:' + keyword ] );
    });

    /**
     * 检查用户当前分支状态和abc.json中是否一致
     */
    grunt.registerTask( '_check_version', function(){

        var done = this.async();

        EXEC( 'git branch', function(  error, stdout, stderr ){

            var reg = /\*\s+daily\/(\S+)/,
                match = stdout.match(reg);

            if (!match) {
                grunt.fail.fatal( '当前分支为 master 或者名字不合法(daily/x.y.z)，请切换到daily分支' );
            }
            else {
                var realBranch = match[1];

                if( grunt.config( 'repoVersion' ) != realBranch ){
                    grunt.fail.fatal( '当前分支为 ' + 'daily/' + realBranch + ' 与 abc.json 中设置的版本号不一致，请修改.' );
                }
            }

            done();
        });
    });

    /**
     * git相关操作
     */
    grunt.registerTask( 'prepub', [ '_check_version', 'exec:prepub' ] );
    grunt.registerTask( 'pub', [ '_check_version', 'exec:tag', 'exec:publish' ] );
    grunt.registerTask( 'newbranch', [ 'exec:new_version' ] );
    grunt.registerTask( 'switch', function( version ){ grunt.task.run( [ 'exec:switch:' + version ] )});

    /**
     * 记录总的打包时间
     */
    if( !grunt.option( 'multi-single' ) ){
        var GRUNT_BEGIN_TS = Date.now();
        process.on( 'exit', function(){
            grunt.log.ok( 'Total took ' + ( Date.now() - GRUNT_BEGIN_TS ) / 1000 + 's' );
        });
    }
    else {
        var GRUNT_BEGIN_TS = Date.now();
        process.on( 'exit', function(){
            grunt.log.ok( 'Total took ' + ( Date.now() - GRUNT_BEGIN_TS ) / 1000 + 's' );
        });
    }
};