var KISSYPie = require( 'abc-gruntfile-helper').kissypie;

module.exports = function (grunt) {

  /**
   * 下列命令执行下面命令若不给定参数，则默认添加下面配置
   *      `grunt watch`
   *      `grunt page`
   *      `grunt common`
   * 可用配置：
   *      timestamp: {String} 时间戳目录,
   *      buildPage: {String|Array} pageName/version/pkgName
   */
  var DEFAULTS = {
    timestamp: '201279879',
    buildPages: [ 'home/1.0']
  };

  /**
   *  分析用户给定的参数
   *  @example
   *      单个页面：
   *          打包：     `grunt page --target home/1.0 --ts 20130412`
   *          watch：    `grunt watch --target home/1.0 --ts 20130412`
   *      多个页面：
   *          打包：     `grunt page --target home/1.0,intro/2.0 --ts 20130506`
   *          watch:    `grunt watch --target home/1.0,intro/2.0 --ts 20130506`
   */
  var options = KISSYPie.parse( grunt, DEFAULTS );

  /**
   * 对每个具体任务进行配置
   */
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    // 页面名称
    pageName: options.pageName,
    // 页面源码版本
    version: options.version,
    // 需要打包到的时间戳
    timestamp: options.timestamp,
    // 包名
    packageName: options.pkgName,

    // 用于页面打包路径
    pageBase: '<%%= pageName %>/<%%= version %>/<%%= packageName %>',
    // 用于common打包路径
    commonBase: 'common',
    // 打包输出目录
    pageBuildBase: '<%%= pageName %>/<%%= timestamp %>/<%%= packageName %>',

    /**
     * 进行KISSY 打包
     * @link https://github.com/daxingplay/grunt-kmc
     */
    kmc: {
      options: {
        packages: [
          {
            name: '<%%= packageName %>',
            path: '<%%= pageName %>/<%%= version %>'
          },
          {
            name: 'utils',
            path: './'
          },
          {
            name: 'common',
            path: './'
          }
        ]
      },

      page: {
        files: [
          {
            expand: true,
            cwd: '<%%= pageBase %>',
            src: [ '*.js', '!*.combo.js', '!*-min.js' ],
            dest: '<%%= pageName%>/<%%=timestamp %>/<%%= packageName %>/'
          }
        ]
      },

      common: {
        files: [
          {
            expand: true,
            cwd: '<%%= commonBase %>',
            src: [ '*.js', '!*.combo.js', '!*-min.js' ],
            dest: '<%%= commonBase %>',
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
            cwd: '<%%= pageBase %>',
            dest: '<%%= pageBase %>',
            src: '**/*-tpl.html',
            ext: '.js'
          }
        ]
      },

      utils: {
        files: [
          {
            expand: true,
            cwd: 'utils',
            dest: 'utils',
            src: '**/*-tpl.html',
            ext: '.js'
          }
        ]
      },

      common: {
        files: [
          {
            expand: true,
            cwd: '<%%= commonBase %>',
            dest: '<%%= commonBase %>',
            src: '**/*-tpl.html',
            ext: '.js'
          }
        ]
      }
    }<% if(enableCSSCombo) { %>,
  /**
   * CSS-Combo
   */
    'css-combo': {
    options: {
    paths: ['.', '<%%= pageBase %>']
    },

  page: {
    files: [
    {
    expand: true,
    cwd: '<%%= pageBase %>',
    src: '*.less',
    dest: '<%%= pageBuildBase %>',
    ext: '.css'
    }
  ]
  },

  common: {
    files: [
    {
    expand: true,
    cwd: '<%%= commonBase %>',
    src: '*.less',
    dest: '<%%= commonBase %>',
    ext: '.css'
    }
  ]
  }
  }<% } %><% if(enableLess) { %>,

    /**
     * 将LESS编译为CSS
     * @link https://github.com/gruntjs/grunt-contrib-less
     */
      less: {
      options: {
      paths: ['.', '<%%= pageBase %>']
      },

    page: {
      files: [
      {
      expand: true,
      cwd: '<%%= pageBase %>',
      src: '*.less',
      dest: '<%%= pageBuildBase %>',
      ext: '.css'
      }
    ]
    },

    common: {
      files: [
      {
      expand: true,
      cwd: '<%%= commonBase %>',
      src: '*.less',
      dest: '<%%= commonBase %>',
      ext: '.css'
      }
    ]
    }
    }<% } %><% if(enableSass) { %>,

      /**
       * 编译Compass & SASS
       * @link https://github.com/gruntjs/grunt-contrib-compass
       */
        compass: {
        options: {
        outputStyle: 'nested',
        noLineComments: true,
        importPath: [ './' ],
        trace: true
        },

      page: {
        options: {
        sassDir: '<%%= pageBase %>',
        cssDir: '<%%= pageBuildBase %>',
        imagesDir: '<%%= pageBase %>/images'
        }
      },

      common: {
        options: {
        sassDir: '<%%= commonBase %>',
        cssDir: '<%%= commonBase %>',
        imagesDir: '<%%= commonBase %>/images'
        }
      }
      }<% } %>,

        /**
        * 对JS文件进行压缩
        * @link https://github.com/gruntjs/grunt-contrib-uglify
        */
        uglify: {
          options: {
          banner: '/*! <%%= pkg.name %> <%%= grunt.template.today("yyyy-mm-dd") %> */\n',
          beautify: {
          ascii_only: true
          }
        },
        page: {
          files: [
          {
          expand: true,
          cwd: '<%%= pageBuildBase %>',
          src: ['*.js', '!*-min.js'],
          dest: '<%%= pageBuildBase %>',
          ext: '-min.js'
          }
        ]
        },

        common: {
          files: [
          {
          expand: true,
          cwd: '<%%= commonBase %>',
          src: ['*-min.js'],
          dest: '<%%= commonBase %>'
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
          src: ['*.css', '!*-min.css'],
          dest: '<%%= pageBuildBase %>',
          ext: '-min.css'
          }
        ]
        },
        common: {
          files: [
          {
          expand: true,
          cwd: '<%%= commonBase %>',
          src: ['*.css', '!*-min.css'],
          dest: '<%%= commonBase %>',
          ext: '-min.css'
          }
        ]
        }
        },

        watch: {
          'js': {
          files: [ '<%%= pageBase %>/**/*.js', './utils/**/*.js' ],
          tasks: [ 'kmc:page', 'uglify:page' ]
          },
        'tpl': {
                files: ['<%%= pageBase %>/**/*-tpl.html', './utils/**/*-tpl.html' ],
                tasks: ['ktpl']
            }<% if(enableLess) { %>,
            'less': {
                files: [ '<%%= pageBase %>/**/*.less', './utils/**/*.less' ],
                tasks: ['less', 'cssmin:page']
            }<% } %><% if(enableSass) { %>,
            'compass': {
                files: [ '<%%= pageBase %>/**/*.scss', './utils/**/*.scss', '<%%= pageBase %>/**/*.png' ],
                tasks: ['compass', 'cssmin:page']
            }<% } %>
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
    grunt.loadNpmTasks('grunt-contrib-uglify');<% if(enableCSSCombo) { %>
    grunt.loadNpmTasks('grunt-css-combo');<% } %> <% if(enableLess) { %>
    grunt.loadNpmTasks('grunt-contrib-less');<% } %> <% if(enableSass) { %>
    grunt.loadNpmTasks('grunt-contrib-compass');<% } %>
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
    grunt.registerTask('page', ['ktpl:page','kmc:page', 'uglify:page'<% if(enableCSSCombo) { %>, 'css-combo:page'<% } %> <% if(enableLess) { %> ,'less:page'<% } %> <% if(enableSass) { %>, 'compass:page'<% } %>, 'cssmin:page']);
    // 对common进行打包
    grunt.registerTask('common', ['ktpl:common', 'kmc:common', 'uglify:common'<% if(enableCSSCombo) { %>, 'css-combo:page'<% } %><% if(enableLess) { %>, 'less:common'<% } %> <% if(enableSass) { %>, 'compass:common'<% } %>, 'cssmin:common']);
    // 静态资源代理 + watch
    grunt.registerTask('server', ['connect:server', 'watch']);

    /**
     * 初始化KISSY-Pie的任务注册
     */
    KISSYPie.taskInit( grunt );
};
