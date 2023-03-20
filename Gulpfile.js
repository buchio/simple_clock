const gulp = require("gulp");

const gulpBabel = require("gulp-babel");
const gulpClean = require("gulp-clean");
const gulpCleanCSS = require("gulp-clean-css");
const gulpConcat = require("gulp-concat");
const gulpCSSlint = require("gulp-csslint");
const gulpEslint = require("gulp-eslint");
const gulpPrettier = require("gulp-prettier");
const gulpRename = require("gulp-rename");
const gulpReplace = require("gulp-replace");
const gulpStripImportExport = require("gulp-strip-import-export");
const gulpUglify = require("gulp-uglify");
const browserify = require("browserify");
const vinylSourceStream = require("vinyl-source-stream");
const vinylBuffer = require("vinyl-buffer");

const jsSources = ["src/**/*.js"];
const cssSources = ["src/**/*.css"];
const htmlSources = ["src/**/*.html", "dist/index.html"];

const jsFormat = () => {
  return gulp
    .src(jsSources.concat(["Gulpfile.js"]))
    .pipe(gulpPrettier({ printWidth: 200 }))
    .pipe(gulp.dest((file) => file.base));
};

const cssFormat = () => {
  return gulp
    .src(cssSources)
    .pipe(gulpPrettier({ tabWidth: 4 }))
    .pipe(gulp.dest((file) => file.base));
};

const htmlFormat = () => {
  return gulp
    .src(htmlSources)
    .pipe(gulpPrettier())
    .pipe(gulp.dest((file) => file.base));
};

const analogCleanTask = () => {
  return gulp.src("dist/AnalogClock", { allowEmpty: true }).pipe(gulpClean());
};

const digitalCleanTask = () => {
  return gulp.src("dist/DigitalClock", { allowEmpty: true }).pipe(gulpClean());
};

const jsLintTask = () => {
  return gulp
    .src(jsSources)
    .pipe(gulpEslint({ useEslintrc: true }))
    .pipe(gulpEslint.format())
    .pipe(gulpEslint.failAfterError())
    .pipe(gulpStripImportExport());
};

const jsBase = (source, dest) => {
  const buildNumber = (Date.now() / 1000).toFixed();
  console.log(source, dest, buildNumber);
  return browserify(source)
    .bundle()
    .pipe(vinylSourceStream(source.split("/").pop()))
    .pipe(vinylBuffer())
    .pipe(gulpBabel({ presets: ["@babel/env"] }))
    .pipe(gulpReplace("XXX_BUILD_NUMBER_XXX", buildNumber))
    .pipe(gulpUglify())
    .pipe(gulpRename({ extname: ".min.js" }))
    .pipe(gulp.dest(`${dest}/`));
};

const jsAnalogTask = () => {
  return jsBase("src/js/analog.js", "dist/AnalogClock");
};

const jsDigitalTask = () => {
  return jsBase("src/js/digital.js", "dist/DigitalClock");
};

const jsClockTask = () => {
  return jsBase("src/js/clock.js", "dist/Clock");
};

const cssLintTask = () => {
  return gulp.src(cssSources).pipe(gulpCSSlint(".csslintrc.json"));
};

const cssAnalogTask = () => {
  return gulp.src(cssSources).pipe(gulpConcat("clock_base.css")).pipe(gulpCleanCSS()).pipe(gulpRename("clock.min.css")).pipe(gulp.dest("dist/AnalogClock/"));
};

const cssDigitalTask = () => {
  return gulp.src(cssSources).pipe(gulpConcat("clock_base.css")).pipe(gulpCleanCSS()).pipe(gulpRename("clock.min.css")).pipe(gulp.dest("dist/DigitalClock/"));
};

const cssClockTask = () => {
  return gulp.src(cssSources).pipe(gulpConcat("clock.css")).pipe(gulpCleanCSS()).pipe(gulpRename("clock.min.css")).pipe(gulp.dest("dist/Clock/"));
};

const htmlAnalogTask = () => {
  return gulp
    .src("src/html/clock_base.html")
    .pipe(gulpReplace("XXX_CSSNAME_XXX", "./clock.min.css"))
    .pipe(gulpReplace("XXX_JSNAME_XXX", "./analog.min.js"))
    .pipe(gulpReplace("XXX_NAME_XXX", "Analog Clock"))
    .pipe(gulpRename("index.html"))
    .pipe(gulp.dest("dist/AnalogClock/"));
};

const htmlDigitalTask = () => {
  return gulp
    .src("src/html/clock_base.html")
    .pipe(gulpReplace("XXX_CSSNAME_XXX", "./clock.min.css"))
    .pipe(gulpReplace("XXX_JSNAME_XXX", "./digital.min.js"))
    .pipe(gulpReplace("XXX_NAME_XXX", "Digital Clock"))
    .pipe(gulpRename("index.html"))
    .pipe(gulp.dest("dist/DigitalClock/"));
};

const htmlClockTask = () => {
  return gulp
    .src("src/html/clock.html")
    .pipe(gulpReplace("XXX_CSSNAME_XXX", "./clock.min.css"))
    .pipe(gulpReplace("XXX_JSNAME_XXX", "./clock.min.js"))
    .pipe(gulpReplace("XXX_NAME_XXX", "Clock"))
    .pipe(gulpRename("index.html"))
    .pipe(gulp.dest("dist/Clock/"));
};

const cleanTasks = gulp.parallel(analogCleanTask, digitalCleanTask);
const lintTasks = gulp.parallel(jsLintTask, cssLintTask);
const analogTasks = gulp.parallel(jsAnalogTask, htmlAnalogTask, cssAnalogTask);
const digitalTasks = gulp.parallel(jsDigitalTask, htmlDigitalTask, cssDigitalTask);
const clockTasks = gulp.parallel(jsClockTask, htmlClockTask, cssClockTask);
const defaultTask = gulp.series(lintTasks, cleanTasks, gulp.parallel(analogTasks, digitalTasks, clockTasks));

exports.format = gulp.parallel(jsFormat, cssFormat, htmlFormat);
exports.lint = lintTasks;
exports.clean = cleanTasks;
exports.analog = analogTasks;
exports.digital = digitalTasks;
exports.clock = clockTasks;
exports.default = defaultTask;

allSources = jsSources.concat(cssSources).concat(htmlSources);
exports.watch = () => gulp.watch(allSources, defaultTask);
