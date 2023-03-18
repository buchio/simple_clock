const buildNumber = (Date.now() / 1000).toFixed()

const gulp = require("gulp");

const gulpBabel = require("gulp-babel");
const gulpClean = require("gulp-clean");
const gulpCleanCSS = require("gulp-clean-css");
const gulpConcat = require("gulp-concat");
const gulpCSSlint = require("gulp-csslint");
const gulpEslint = require("gulp-eslint");
const gulpRename = require("gulp-rename");
const gulpReplace = require("gulp-replace");
const gulpStripImportExport = require("gulp-strip-import-export");
const gulpUglify = require("gulp-uglify");
const browserify = require("browserify");
const vinylSourceStream     = require("vinyl-source-stream");
const vinylBuffer     = require("vinyl-buffer");

const jsSources = "src/js/*.js";
const cssSources = "src/css/*.css";

const analogCleanTask = () => {
  return gulp.src("dist/AnalogClock", {allowEmpty:true})
    .pipe(gulpClean());
};

const digitalCleanTask = () => {
  return gulp.src("dist/DigitalClock", {allowEmpty:true})
    .pipe(gulpClean());
};

const jsLintTask = () => {
  return gulp.src("src/js/*.js")
    .pipe(gulpEslint({useEslintrc: true}))
    .pipe(gulpEslint.format())
    .pipe(gulpEslint.failAfterError())
    .pipe(gulpStripImportExport());
}

const jsBase = ( source, dest ) => {
  return browserify(source)
    .bundle()
    .pipe(vinylSourceStream(source.split('/').pop()))
    .pipe(vinylBuffer())
    .pipe(gulpBabel({presets: ["@babel/env"]}))
    .pipe(gulpReplace("XXX_BUILD_NUMBER_XXX", buildNumber))
    .pipe(gulpUglify())
    .pipe(gulpRename({extname: ".min.js"}))
    .pipe(gulp.dest(`${dest}/`));
}

const jsAnalogTask = () => {
  return jsBase("src/js/analog.js", "dist/AnalogClock");
};

const jsDigitalTask = () => {
  return jsBase("src/js/digital.js", "dist/DigitalClock");
};

const cssLintTask = () => {
  return gulp.src("src/css/*.css")
    .pipe(gulpCSSlint(".csslintrc.json"))
}

const cssAnalogTask = () => {
  return gulp.src("src/css/*.css")
    .pipe(gulpConcat("clock.css"))
    .pipe(gulpCleanCSS())
    .pipe(gulpRename({extname: ".min.css"}))
    .pipe(gulp.dest("dist/AnalogClock/"));
};

const cssDigitalTask = () => {
  return gulp.src("src/css/*.css")
    .pipe(gulpConcat("clock.css"))
    .pipe(gulpCleanCSS())
    .pipe(gulpRename({extname: ".min.css"}))
    .pipe(gulp.dest("dist/DigitalClock/"));
};

const htmlAnalogTask = () => {
  return gulp.src("src/html/clock.html")
    .pipe(gulpReplace("CSSNAME", "./clock.min.css"))
    .pipe(gulpReplace("JSNAME", "./analog.min.js"))
    .pipe(gulpReplace("NAME", "Analog Clock"))
    .pipe(gulpRename("index.html"))
    .pipe(gulp.dest("dist/AnalogClock/"));
};

const htmlDigitalTask = () => {
  return gulp.src("src/html/clock.html")
    .pipe(gulpReplace("CSSNAME", "./clock.min.css"))
    .pipe(gulpReplace("JSNAME", "./digital.min.js"))
    .pipe(gulpReplace("NAME", "Digital Clock"))
    .pipe(gulpRename("index.html"))
    .pipe(gulp.dest("dist/DigitalClock/"));
};

const cleanTasks = gulp.parallel(
  analogCleanTask,
  digitalCleanTask);

const lintTasks = gulp.parallel(
  jsLintTask,
  cssLintTask);

const analogTasks = gulp.parallel(
  jsAnalogTask,
  htmlAnalogTask,
  cssAnalogTask);

const digitalTasks = gulp.parallel(
  jsDigitalTask,
  htmlDigitalTask,
  cssDigitalTask);

exports.lint = lintTasks;
exports.clean = cleanTasks;
exports.analog = analogTasks;
exports.digital = digitalTasks;
  
exports.default = gulp.series(
  lintTasks,
  cleanTasks,
  gulp.parallel(analogTasks,
                digitalTasks));
