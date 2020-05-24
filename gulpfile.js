const gulp = require("gulp");
const playcanvas = require("gulp-playcanvas");
const pcOptions = require("./playcanvas.json");
const typescript = require("gulp-typescript");
const through2 = require('through2');

gulp.task("ts", () => {
  return gulp
    .src(["src/**/*.ts", "!src/**/_*.ts", "!./node_modules/**"])
    .pipe(typescript({target: "ES5", module: "commonjs", lib: ["ES5", "DOM", "ES6"]}))         //ES5
    //.pipe(typescript({target: "ES2015", module: "commonjs", lib: ["ES2015"]}))    //ES2015(ES6)
    .pipe(through2.obj((file, enc, callback) => {
      if (file.isBuffer()) {
        let contents = String(file.contents);
        contents = "var exports = {};\nvar require = function(mod){};\n" + contents;
        //contents = "/*jshint esversion: 6, asi: true, laxbreak: true*/\n" + contents;   //ES2015(ES6)
        file.contents = Buffer.from(contents);
      }
      callback(null, file);
    }))
    .pipe(gulp.dest("dist/"))
    .pipe(playcanvas(pcOptions));
});

gulp.task("js", () => {
  return gulp
    .src(["src/**/*.js", "!src/**/_*.js"])
    .pipe(gulp.dest("dist/"))
    .pipe(playcanvas(pcOptions));
});

gulp.task("watch", function() {
  gulp.watch(["src/**/*.ts", "!src/**/_*.ts"], gulp.task("ts"));
  gulp.watch(["src/**/*.js", "!src/**/_*.js"], gulp.task("js"));
});
 
gulp.task("default", gulp.parallel("watch"));