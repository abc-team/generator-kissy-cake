/**
 * @fileOverview
 * @author
 */
KISSY.add(function (S) {
    console.log( 'out.js' );
    /**
     * 下面的方式将自动执行所有require过来的模块的init方法
     *      1、异步执行，各模块不会互相影响
     *      2、各模块都暴露init方法，模块的增删只需要修改requires就可以了
     * 这是一种模块的执行方式，您完全可以删掉这段代码，根据自己的习惯编写.
     */
    var args = S.makeArray(arguments);
    S.ready(function() {
        for (var i = 1; i < args.length; i++) {
            var module = args[i] || {};
            module.init && setTimeout((function( m ){
                return function(){ m.init() };
            })(module),0);
        }
    });

}, { requires: [
    './mods/_common_mod',
    './mods/popup-tpl',
    'utils/utils_mod',
    'utils/utils-tpl'
]});
