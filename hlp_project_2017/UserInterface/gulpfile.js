const gulp = require("gulp");
const clean = require("gulp-clean");
const shell = require("gulp-shell");
const path = require("path");
const workflow = ["build"];

gulp.task("default", () => {
    gulp.start("run");
});

gulp.task("run", () => {
    gulp.start("monitor");

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

gulp.task("monitor",["build"],()=>{
    console.log("Started monitoring *.fs file changes...");
    gulp.watch("../**/*.fs").on("change", (event) => {
        console.log(`File <${path.basename(event.path)}> was ${event.type}`);
    });
})

gulp.task("package", ["build"], shell.task([
    "electron-packager . --appname=ARMEmulator --asar=true --out=electron --overwrite"
]));

