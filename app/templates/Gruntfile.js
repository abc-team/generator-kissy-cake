module.exports = function (grunt) {

  /**
   * 下列命令执行下面命令若不给定参数，则默认添加下面配置
   *      `grunt page`
   *      `grunt widget`
   *      `grunt common`
   */

  // Page
  var target = 'home/v1';
  var packageName = 'page';

  target = grunt.option('target') || target;
  packageName = grunt.option('pkg') || packageName;

  // Widget
  var widget = 'sidebar';
  widget = grunt.option('name') || widget;

  /**
   *  分析用户给定的参数
   *  @example
   *      单个页面：
   *          打包：     `grunt page --target home/v1`
   *      单个Widget
   *          打包：     `grunt widget --name sidebar
   */

  /**
   * 对每个具体任务进行配置
   */
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    // 页面名称
    targetPage: target,
    // 包名
    packageName: packageName,
    pageBase: '<%= targetPage %>/<%= packageName %>',

    // 用于页面打包路径
    srcPageBase: 'src/pages/<%= pageBase %>',

    // 打包输出目录
    buildPageBase: 'build/pages/<%= pageBase %>',
    // 用于common打包路径
    srcCommonBase: 'src/common',
    // 用于common打包路径
    buildCommonBase: 'build/common',

    targetWidget: widget,
    srcWidgetBase: 'src/widget/<%= targetWidget %>',
    buildWidgetBase: 'build/widget/<%= targetWidget %>',

    /**
     * 进行KISSY 打包
     * @link https://github.com/daxingplay/grunt-kmc
     */
    kmc: {
      page: {
        options: {
          packages: [
            {
              name: '<%= packageName %>',
              path: 'src/pages/<%= targetPage %>'
            },
            {
              name: 'utils',
              path: 'src/'
            },
            {
              name: 'widget',
              path: 'src/'
            }
          ]
        },
        files: [
          {
            expand: true,
            cwd: '<%= srcPageBase %>',
            src: [ '*.js', '!*.combo.js', '!*-min.js' ],
            dest: '<%= buildPageBase %>'
          }
        ]
      },

      widget: {
        options: {
          packages: [
            {
              name: 'utils',
              path: 'src/'
            },
            {
              name: 'widget',
              path: 'src/'
            }
          ]
        },
        files: [
          {
            expand: true,
            cwd: 'src/widget/<%= targetWidget %>',
            src: [ '*.js', '!*.combo.js', '!*-min.js' ],
            dest: 'build/widget/<%= targetWidget %>'
          }
        ]
      },

      common: {
        options: {
          packages: [
            {
              name: 'utils',
              path: 'src/'
            }
          ]
        },
        files: [
          {
            expand: true,
            cwd: '<%= srcCommonBase %>',
            src: [ '*.js', '!*.combo.js', '!*-min.js' ],
            dest: '<%= buildCommonBase %>',
            ext: '-min.js'
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
            cwd: '<%= srcPageBase %>',
            dest: '<%= srcPageBase %>',
            src: '**/*-tpl.html',
            ext: '.js'
          }
        ]
      },

      utils: {
        files: [
          {
            expand: true,
            cwd: 'src/utils',
            dest: 'src/utils',
            src: '**/*-tpl.html',
            ext: '.js'
          }
        ]
      },

      common: {
        files: [
          {
            expand: true,
            cwd: '<%= srcCommonBase %>',
            dest: '<%= srcCommonBase %>',
            src: '**/*-tpl.html',
            ext: '.js'
          }
        ]
      },

      widget: {
        files: [
          {
            expand: true,
            cwd: '<%= srcWidgetBase %>',
            dest: '<%= srcWidgetBase %>',
            src: '**/*-tpl.html',
            ext: '.js'
          }
        ]
      }
    },

    /**
     * 将LESS编译为CSS
     * @link https://github.com/gruntjs/grunt-contrib-less
     */
    less: {

      page: {
        options: {
          paths: ['src', '<%= srcPageBase %>']
        },
        files: [
          {
            expand: true,
            cwd: '<%= srcPageBase %>',
            src: '*.less',
            dest: '<%= buildPageBase %>',
            ext: '.css'
          }
        ]
      },

      common: {
        options: {
          paths: ['src', '<%= srcCommonBase %>']
        },
        files: [
          {
            expand: true,
            cwd: '<%= srcCommonBase %>',
            src: '*.less',
            dest: '<%= buildCommonBase %>',
            ext: '.css'
          }
        ]
      },

      widget: {
        options: {
          paths: ['src', '<%= srcWidgetBase %>']
        },
        files: [
          {
            expand: true,
            cwd: '<%= srcWidgetBase %>',
            src: '*.less',
            dest: '<%= buildWidgetBase %>',
            ext: '.css'
          }
        ]
      }
    },

    /**
     * 对JS文件进行压缩
     * @link https://github.com/gruntjs/grunt-contrib-uglify
     */
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> */\n',
        beautify: {
          ascii_only: true
        }
      },

      page: {
        files: [
          {
            expand: true,
            cwd: '<%= buildPageBase %>',
            src: ['*.js', '!*-min.js'],
            dest: '<%= buildPageBase %>',
            ext: '-min.js'
          }
        ]
      },

      common: {
        files: [
          {
            expand: true,
            cwd: '<%= buildCommonBase %>',
            src: ['*.js', '!*-min.js'],
            dest: '<%= buildCommonBase %>'
          }
        ]
      },

      widget: {
        files: [
          {
            expand: true,
            cwd: '<%= buildWidgetBase %>',
            src: ['*.js', '!*-min.js'],
            dest: '<%= buildWidgetBase %>',
            ext: '-min.js'
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
            cwd: '<%= buildPageBase %>',
            src: ['*.css', '!*-min.css'],
            dest: '<%= buildPageBase %>',
            ext: '-min.css'
          }
        ]
      },

      widget: {
        files: [
          {
            expand: true,
            cwd: '<%= buildWidgetBase %>',
            src: ['*.css', '!*-min.css'],
            dest: '<%= buildWidgetBase %>',
            ext: '-min.css'
          }
        ]
      },


      common: {
        files: [
          {
            expand: true,
            cwd: '<%= buildCommonBase %>',
            src: ['*.css', '!*-min.css'],
            dest: '<%= buildCommonBase %>',
            ext: '-min.css'
          }
        ]
      }
    },

    watch: {
      'js': {
        files: [ '<%= pageBase %>/**/*.js', './utils/**/*.js' ],
        tasks: [ 'kmc:page', 'uglify:page' ]
      },
      'tpl': {
        files: ['<%= pageBase %>/**/*-tpl.html', './utils/**/*-tpl.html' ],
        tasks: ['ktpl']
      },
      'less': {
        files: [ '<%= pageBase %>/**/*.less', './utils/**/*.less' ],
        tasks: ['less', 'cssmin:page']
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      }
    }
  });

  /**
   * 载入使用到的通过NPM安装的模块
   */
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-kissy-template');
  grunt.loadNpmTasks('grunt-kmc');
  grunt.loadNpmTasks('grunt-contrib-connect');

  /**
   * 注册基本任务
   */
  grunt.registerTask('default', [ 'page' ]);

  // 对单个页面进行打包
  grunt.registerTask('page', ['ktpl:page', 'kmc:page', 'uglify:page'  , 'less:page' , 'cssmin:page']);
  // 对common进行打包
  grunt.registerTask('common', ['ktpl:common', 'kmc:common', 'uglify:common', 'less:common' , 'cssmin:common']);

  grunt.registerTask('widget', ['ktpl:widget', 'kmc:widget', 'uglify:widget', 'less:widget' , 'cssmin:widget']);
  // 静态资源代理 + watch
  grunt.registerTask('server', ['connect:server', 'watch']);

  /**
   * 初始化KISSY-Pie的任务注册
   */
};
