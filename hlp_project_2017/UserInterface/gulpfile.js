const gulp = require("gulp");
const clean = require("gulp-clean");
const shell = require("gulp-shell");
const path = require("path");
const workflow = ["clean", "build"];

gulp.task("default", () => {
    gulp.start("run");
});

gulp.task("run", () => {
    gulp.start(workflow);
    gulp.watch("../**/*.fs").on("change", (event) => {
        console.log(`File <${path.basename(event.path)}> was ${event.type}`);
    });
})

gulp.task("clean", () => {
    return gulp.src([
        "./*.js",
        "./*.js.map",
        "!./gulpfile.js",
        "!./main.js"
    ]).pipe(clean())
})

gulp.task("build", ["clean"], shell.task([
    "fable"
]));

gulp.task("test", ["build"], () => {

});

gulp.task("package", ["build"], shell.task([
    "electron-packager . --appname=ARMEmulator --asar=true --out=electron --overwrite"
]));

