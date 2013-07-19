(function () {
    var S = KISSY;

    window.FB = window.FB || {
        /**
         * Config Kissy 1.2 packages
         * of a FrontBuild Page
         * @param {Object} config
         * @param config.name     name of FrontBuild
         * @param config.version  version of you app
         * @param config.pub      timestamp of published directory
         * @param config.path     url of you fbapp root
         * @param config.charset
         * @param config.tag      timestamp appended
         * @param config.debug    debug mode switch
         */
        config: function (config) {
            if (!config.path) {
                config.path = '';
            }
            config.path = config.path.replace(/\/$/, '');

            var pkgs = [],
                packageConfig = {},
                pagePath = S.substitute('{path}/{name}/{version}/', config),
                //switch dev or production env
                debug = config.debug? true : KISSY.Config.debug,
                pagePathBuild = S.substitute('{path}/{name}/{pub}/', config);

            //package config
            S.mix(packageConfig, config, true, ['charset', 'tag']);

            //common package
            pkgs.push(S.merge(packageConfig, {
                name: 'common',
                path: config.path
            }));

            //utils package is only for dev mode
            if (debug) {
                pkgs.push(S.merge(packageConfig, {
                    name: 'utils',
                    path: config.path
                }));
            }

            //page packages
            pkgs.push(S.merge(packageConfig, {
                name: 'page',
                path: debug? pagePath : pagePathBuild
            }));

            S.config({
                packages: pkgs
            });
        }
    };
})();
