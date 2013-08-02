/**
 * 针对 初始化 任务的文件以及内容检查
 */

'use strict';
var fs = require('fs');
var path = require('path');
var helpers = require('abc-generator').test;

describe('ABC - KISSY-PIE generator', function () {

    var KISSYPie;

    beforeEach(function( done ){
        helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
            if (err) {
                done(err);
            }
            KISSYPie = helpers.createGenerator('kissy-cake:app', [
                '../../app'
            ]);

            KISSYPie.options['skip-install'] = true;
            done();
        });
    });

    it('基本文件检查', function (done) {

        // 先初始化目录
        helpers.mockPrompt( KISSYPie, {
            projectName: "my_project",
            author: 'neekey',
            email: 'ni184775761@gmail.com',
            styleEngine: 'css'
        });

        KISSYPie.run({}, function () {
            var KISSYPiePage = helpers.createGenerator('kissy-cake:widget', [
                '../../widget'
            ]);

            helpers.mockPrompt( KISSYPiePage, {
                widgetName: 'tooltip   '
            });

            KISSYPiePage.run({}, function(){
                helpers.assertFiles([
                    'src/widget/tooltip/init.js'
                ]);

                done();
            });
        });
    });

    describe( '使用不同类型样式引擎来创建page', function(){

        it('SASS类型page', function (done) {

            // 先初始化目录
            helpers.mockPrompt( KISSYPie, {
                projectName: "my_project",
                author: 'neekey',
                email: 'ni184775761@gmail.com',
                styleEngine: 'sass'
            });

            KISSYPie.run({}, function () {

                helpers.assertFiles([
                    [ 'abc.json', /"styleEngine"\:\s*"sass"/ ]
                ]);

                var KISSYPiePage = helpers.createGenerator('kissy-cake:widget', [
                    '../../widget'
                ]);

                helpers.mockPrompt( KISSYPiePage, {
                    widgetName: 'tooltip'
                });

                KISSYPiePage.run({}, function(){
                    helpers.assertFiles([
                        'src/widget/tooltip/images/i/attention.png',
                        'src/widget/tooltip/images/i/question.png',
                        'src/widget/tooltip/mods/_sprites.scss',
                        'src/widget/tooltip/index.scss'
                    ]);

                    done();
                });
            });
        });

        it('LESS类型page', function (done) {

            // 先初始化目录
            helpers.mockPrompt( KISSYPie, {
                projectName: "my_project",
                author: 'neekey',
                email: 'ni184775761@gmail.com',
                styleEngine: 'less'
            });

            KISSYPie.run({}, function () {

                helpers.assertFiles([
                    [ 'abc.json', /"styleEngine"\:\s*"less"/ ]
                ]);

                var KISSYPiePage = helpers.createGenerator('kissy-cake:widget', [
                    '../../widget'
                ]);

                helpers.mockPrompt( KISSYPiePage, {
                    widgetName: 'tooltip'
                });

                KISSYPiePage.run({}, function(){

                    helpers.assertFiles([
                        'src/widget/tooltip/index.less'
                    ]);

                    done();
                });
            });
        });

        it('CSS类型page', function (done) {

            // 先初始化目录
            helpers.mockPrompt( KISSYPie, {
                projectName: "my_project",
                author: 'neekey',
                email: 'ni184775761@gmail.com',
                styleEngine: 'css'
            });

            KISSYPie.run({}, function () {

                helpers.assertFiles([
                    [ 'abc.json', /"styleEngine"\:\s*"css"/ ]
                ]);

                var KISSYPiePage = helpers.createGenerator('kissy-cake:widget', [
                    '../../widget'
                ]);

                helpers.mockPrompt( KISSYPiePage, {
                    widgetName: 'tooltip'
                });

                KISSYPiePage.run({}, function(){
                    helpers.assertFiles([
                        'src/widget/tooltip/index.css'
                    ]);

                    done();
                });
            });
        });
    });
});