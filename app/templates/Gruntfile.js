var KISSYCake= require( 'abc-gruntfile-helper').kissycake;

module.exports = function (grunt) {

    var ABCConfig = grunt.file.readJSON('abc.json');

    /**
     *  分析用户给定的参数
     *  @example
     *      打包common：    `grunt common`
     *      单个：
     *          打包page：  `grunt build --page home/1.0 --widget tooltip`
     *          watch：    `grunt watch --page home/1.0 --widget tooltip
     *      多个：
     *          打包：     `grunt build --page home/1.0,intro/2.0 --widget tooltip,scroll`
     *          watch:    `grunt watch --page home/1.0,intro/2.0 --widget tooltip,scroll`
     */
    var options = KISSYCake.parse( grunt, ABCConfig._kissy_cake.defaults );

    /**
     * 对每个具体任务进行配置
     */
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        buildBase: 'build',
        srcBase: 'src',
        // 包名
        packageName: 'page',

        // 页面名称
        pageName: options.pageName,
        // 页面源码版本
        pageVersion: options.version,
        // Widget名称
        widgetName: options.widgetName,

        // 用于页面打包路径
        pageSrcBase: '<%%= srcBase %>/pages/<%%= pageName %>/<%%= pageVersion %>/<%%= packageName %>',
        widgetSrcBase: '<%%= srcBase %>/widget/<%%= widgetName %>',
        commonSrcBase: '<%%= srcBase %>/common',
        utilsSrcBase: '<%%= srcBase %>/utils',

        // 打包输出目录
        pageBuildBase: '<%%= buildBase %>/pages/<%%= pageName %>/<%%= pageVersion %>/<%%= packageName %>',
        widgetBuildBase: '<%%= buildBase %>/widget/<%%= widgetName %>',
        commonBuildBase: '<%%= buildBase %>/common',

        /**
         * 进行KISSY 打包
         * @link https://github.com/daxingplay/grunt-kmc
         */
        kmc: {
            options: {
                packages: [
                    {
                        name: '<%%= packageName %>',
                        path: '<%%= srcBase %>/pages/<%%= pageName %>/<%%= pageVersion %>'
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
        }<% if(enableCSSCombo) { %>,
        /**
         * CSS Combo
         * @link https://github.com/daxingplay/grunt-css-combo
         */
        css_combo: {
            options: {
                paths: [ '<%%= srcBase %>' ]
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
        }<% } if(enableLess) { %>,

        /**
         * 将LESS编译为CSS
         * @link https://github.com/gruntjs/grunt-contrib-less
         */
        less: {
            options: {
                paths: [ '<%%= srcBase %>', '<%%= pageSrcBase %>', '<%%= widgetSrcBase %>', '<%%= utilsSrcBase %>', '<%%= commonSrcBase %>' ]
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
                    imagesDir: '<%%= pageSrcBase %>/images'
                }
            },

            widget: {
                options: {
                    sassDir: '<%%= widgetSrcBase %>',
                    cssDir: '<%%= widgetBuildBase %>',
                    imagesDir: '<%%= widgetSrcBase %>/images'
                }
            },

            common: {
                options: {
                    sassDir: '<%%= commonSrcBase %>',
                    cssDir: '<%%= commonBuildBase %>',
                    imagesDir: '<%%= commonSrcBase %>/images'
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
            }<% } if(enableCSSCombo) { %>,
            // utils目录中的less文件变更，就build widget
            'css_utils_widget': {
                files: [ '<%%= utilsSrcBase %>/**/*.css' ],
                tasks: [ 'css_combo:widget', 'cssmin:widget' ]
            },
            // utils目录中的less文件变更，就build page
            'css_utils_page': {
                files: [ '<%%= utilsSrcBase %>/**/*.css' ],
                tasks: [ 'css_combo:page', 'cssmin:page' ]
            },
            'css_utils_common': {
                files: [ '<%%= utilsSrcBase %>/**/*.css' ],
                tasks: [ 'css_combo:common', 'cssmin:common' ]
            },
            // 某个widget目录中的less文件变更，就build 对应的widget
            'css_widget_widget': {
                files: [ '<%%= widgetSrcBase %>/**/*.css' ],
                tasks: [ 'css_combo:widget', 'cssmin:widget' ]
            },
            // 任意widget目录中的less文件变更，就build page
            'css_widget_page': {
                files: [ '<%%= srcBase %>/widget/**/*.css' ],
                tasks: [ 'css_combo:page', 'cssmin:page' ]
            },
            // 某个page目录中的less文件变更，就build对应的page
            'css_page': {
                files: [ '<%%= pageSrcBase %>/**/*.css' ],
                tasks: [ 'css_combo:page', 'cssmin:page' ]
            },
            'css_common': {
                files: [ '<%%= commonSrcBase %>/**/*.css' ],
                tasks: [ 'css_combo:common', 'cssmin:common' ]
            }<% } %>
        }
    });

    /**
     * 载入使用到的通过NPM安装的模块
     */
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    /**
     * 注册基本任务
     */
    grunt.registerTask('default', [ 'page' ]);

    /**
     * 对page进行打包
     *      html -> js, KISSY pkg, js compression, less/sass compile, css compression.
     */
    grunt.registerTask('page', [ 'ktpl:utils', 'ktpl:page', 'kmc:page', 'uglify:page'<% if(enableCSSCombo) { %>, 'css_combo:page'<% } if(enableLess) {%>, 'less:page'<% } if(enableSass) {%>, 'compass:page'<% } %>, 'cssmin:page']);
    /**
     * 对widget进行打包
     *      html -> js, KISSY pkg, js compression, less/sass compile, css compression.
     */
    grunt.registerTask('widget', [ 'ktpl:utils', 'ktpl:widget', 'kmc:widget', 'uglify:widget'<% if(enableCSSCombo) { %>, 'css_combo:widget'<% } if(enableLess) { %>, 'less:widget'<% } if(enableSass) { %>, 'compass:widget'<% } %>, 'cssmin:widget']);
    /**
     * 对common进行打包
     *      html -> js, KISSY pkg, js compression, less/sass compile, css compression.
     */
    grunt.registerTask('common', [ 'ktpl:utils', 'ktpl:common', 'kmc:common', 'uglify:common'<% if(enableCSSCombo) { %>, 'css_combo:common'<% } if(enableLess) { %>, 'less:common'<% } if(enableSass) { %>, 'compass:common'<% } %>, 'cssmin:common']);

    /**
     * 初始化KISSY-Cake的任务注册
     */
    KISSYCake.taskInit();
};