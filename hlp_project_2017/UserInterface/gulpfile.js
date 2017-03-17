const gulp = require("gulp");
const clean = require("gulp-clean");
const shell = require("gulp-shell");
const path = require("path");
const workflow = ["clean", "build", "test"];

gulp.task("default", () => {
    gulp.start("run");
});

gulp.task("run", () => {
    gulp.start(workflow);
})

gulp.task("clean", () => {
    return gulp.src([
        "./*.js",
        "!./gulpfile.js"
    ]).pipe(clean())
})

gulp.task("build", ["clean"], shell.task([
    "fable"
]));

gulp.task("test", ["build"], () => {

});

gulp.watch("./**/*.fs", ["run"]).on("change", (event) => {
    console.log(`File <${path.basename(event.path)}> was ${event.type}`);
});