var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

gulp.task("default", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/index.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("dist"));
});


/*
var gulp = require("gulp");
 var ts = require("gulp-typescript");
 var tsProject = ts.createProject("tsconfig.json");

 gulp.task("default", function () {
 return gulp.src("src/!**!/!*.ts") //tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("dist2"));
});
*/
