/**
 * 如何使用这个脚本
 * Step1. 引入 kissy/seed.js
 *
 * Step2. 引入 这个脚本(common/package-config.js)
 *
 * Step3. 使用下面代码 配置 ABC
 * <script>
 * ABC.config({
 *   pageName: 'list',
 *   pub: '1.1.1',
 *   path: 'http://g.tbcdn.cn/myGroup/myRepo/',
 *   charset: 'utf-8'
 * });
 * </script>
 */
(function (S) {

    window.ABC = window.ABC || {
        /**
         * @param {Object} config
         * @param config.pageName   页面名称
         * @param config.pub        Git Tag
         * @param config.path       仓库对应的线上引用地址
         * @param config.charset    编码，一般为utf-8
         */
        config: function (config) {
            if (!config.path) {
                config.path = '';
            }

            config.path = config.path.replace(/\/$/, '');

            var pkgs = [];
            var packageConfig = {};
            var pagePath = S.substitute('{path}/{pub}/pages/{pageName}', config);
            var widgetPath = S.substitute('{path}/{pub}', config);
            var commonPath = S.substitute('{path}/{pub}', config);

            //package config
            S.mix(packageConfig, config, true, [ 'charset' ]);

            //common package
            pkgs.push(S.merge(packageConfig, {
                name: 'common',
                path: commonPath
            }));

            //widget package
            pkgs.push(S.merge(packageConfig, {
                name: 'widget',
                path: widgetPath
            }));

            //page packages
            pkgs.push(S.merge(packageConfig, {
                name: 'page',
                path: pagePath
            }));

            S.config({
                packages: pkgs
            });
        }
    };
})(KISSY);
