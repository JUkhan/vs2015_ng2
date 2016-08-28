(function (global) {
    var map = {
        'app': 'app',
        '@angular': 'scripts/angular2',
        'rxjs': 'scripts/rxjs',
        'lodash': 'scripts/lodash'
    };
    var packages = {
        'app': { main: 'main.js', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
        'lodash': { main: 'lodash.min.js', defaultExtension: 'js' }
    };
    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'forms',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'router',
        'router-deprecated',
        'upgrade',
    ];
    function packIndex(pkgName) {
        packages['@angular/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }
    function packUmd(pkgName) {
        packages['@angular/' + pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
    }
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
    ngPackageNames.forEach(setPackageConfig);
    packages['@angular/router'] = { main: 'index.js', defaultExtension: 'js' };
    var config = {
        map: map,
        packages: packages
    };
    System.config(config);
})(this);
//# sourceMappingURL=systemjs.config.js.map