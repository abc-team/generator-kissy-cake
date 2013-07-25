/**
 * 针对 初始化 任务的文件以及内容检查
 */

'use strict';

var fs = require('fs');
var Path = require('path');
var helpers = require('abc-generator').test;

describe('ABC - KISSY-PIE generator', function () {

    it('基本文件检查', function (done) {

        helpers.testDirectory(Path.join(__dirname, 'temp'), function (err) {
            if (err) {
                done(err);
            }
            var KISSYPieMigrate = helpers.createGenerator( 'kissy-cake:migrate', [
                '../../migrate'
            ]);

            helpers.mockPrompt( KISSYPieMigrate, {
                newDir: Path.join(__dirname, 'temp'),
                srcDir: Path.resolve( __dirname, 'migrate_test' )
            });

            KISSYPieMigrate.run({}, function(){
                helpers.assertFiles([
                    'src/pages/home/page/init2.js',
                    'src/pages/home/page/index2.css',
                    'src/pages/index/page/init5.js',
                    'src/pages/index/page/index5.css',
                    'src/common/package-config.js',
                    'src/utils/index.js',
                    'src/.editorconfig',
                    'src/.gitattributes',
                    'src/.gitignore',
                    'src/.jshintrc',
                    'build'
                ]);

                done();
            });
        });
    });
});