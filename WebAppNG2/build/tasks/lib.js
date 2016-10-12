var gulp = require('gulp');
var del = require('del');
var vinylPaths = require('vinyl-paths');

var paths = {
    npmSrc: "node_modules",
    libTargetAngular2: "scripts/angular2/",
    libTargetRxjs: "scripts/rxjs/",
    libTargetLodash: "scripts/lodash/"
};
var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router'
    //'router-deprecated',
    //'upgrade',
];
var angularLibsToMove = [
    paths.npmSrc + '/core-js/client/shim.min.js',
    paths.npmSrc + '/zone.js/dist/zone.js',
    paths.npmSrc + '/systemjs/dist/system.src.js',
    paths.npmSrc + '/reflect-metadata/Reflect.js'
    //paths.npmSrc + '/@angular/**/*.js'
];

gulp.task('copy-libs', function () {
    gulp.src(angularLibsToMove).pipe(gulp.dest(paths.libTargetAngular2));
    gulp.src("node_modules/rxjs/**/*.js").pipe(gulp.dest(paths.libTargetRxjs));
    //gulp.src("node_modules/lodash/**/*.js").pipe(gulp.dest(paths.libTargetLodash));
    gulp.src("node_modules/lodash/lodash.min.js").pipe(gulp.dest(paths.libTargetLodash));
    ngPackageNames.forEach(_ => {
        gulp.src(`${paths.npmSrc}/@angular/${_}/bundles/*.min.js`).pipe(gulp.dest(`${paths.libTargetAngular2}/${_}/bundles/`));
    });
    //gulp.src(`${paths.npmSrc}/@angular/router/**/*.js`).pipe(gulp.dest(`${paths.libTargetAngular2}/router/`));
    return true;
});

gulp.task('remove-libs', function () {
    return gulp.src([paths.libTargetAngular2, paths.libTargetRxjs, paths.libTargetLodash])
         .pipe(vinylPaths(del));
});




