/**
 * ABC.config({
 *   pageName: 'list',
 *   pageVersion: 'v1',
 *   pub: '1.1.1',
 *   path: 'http://g.tbcdn.cn/myGroup/myRepo/',
 *   charset: 'utf-8'
 * })
 *
 */
(function (S) {

  window.ABC = window.ABC || {
    /**
     * Config Kissy 1.2 packages
     * of a FrontBuild Page
     * @param {Object} config
     * @param config.pageName     name of FrontBuild
     * @param config.pageVersion  version of you app
     * @param config.pub      timestamp of published directory
     * @param config.path     url of you fbapp root
     * @param config.charset
     * @param config.debug    debug mode switch
     */
    config: function (config) {
      if (!config.path) {
        config.path = '';
      }

      var debugPagePath = S.unparam(location.search.replace(/^\?/, ''))['ks-debug'];

      if (debugPagePath) {
        config.path = debugPagePath;
        config.pub = "src/";
        config.debug = true;
      }

      config.path = config.path.replace(/\/$/, '');

      var pkgs = [],
        packageConfig = {},
        pagePath = S.substitute('{path}/{pub}/pages/{pageName}/{pageVersion}', config),
      //switch dev or production env
        debug = config.debug ? true : KISSY.Config.debug;

      //package config
      S.mix(packageConfig, config, true, ['charset', 'tag']);

      //common package
      pkgs.push(S.merge(packageConfig, {
        name: 'common',
        path: config.path
      }));

      //widget package
      pkgs.push(S.merge(packageConfig, {
        name: 'widget',
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
        path: pagePath
      }));

      S.config({
        packages: pkgs
      });
    }
  };
})(KISSY);
