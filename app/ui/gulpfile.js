var path = require('path'),

    gulp = require('gulp'),

    exec = require('child_process').exec,
    readdir = require('fs').readdirSync,
    extname = require('path').extname,

    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),

    config = require('./config');

gulp.task('css', () => {

    var cssInPath = path.join(config.css, 'pages'),
        cssOutPath = path.join(config.build, 'css'),

        fileList = readdir(cssInPath),
        fileName = '';

    fileList.map((file) => {
        if(extname(file) !== '.less') return;

        fileName = /\w+(?=\.less$)/gi.exec(file)[0];

        return exec('lessc --clean-css '+ cssInPath +'/'+ file +' --autoprefix="last 2 versions" '+ cssOutPath +'/'+ fileName +'.bundle.min.css');
    });

});

gulp.task('fonts', () => {

    var fontsInPath = path.join(config.fonts, '/**/*.*'),
        fontsOutPath = path.join(config.build, 'fonts');

    gulp.src(fontsInPath)
        .pipe(gulp.dest(fontsOutPath));

});

gulp.task('images', () => {

    var imagesInPath = path.join(config.images, '/**/*.*'),
        imagesOutPath = path.join(config.build, 'images');

    gulp.src(imagesInPath)
        .pipe(imagemin({
            optimizationLevel: 4,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(imagesOutPath));

});

gulp.task('watcher', () => {

    var cssWatchPath = path.join(config.css, '/**/*.less'),
        fontsWatchPath = path.join(config.fonts, '/**/*.*'),
        imagesWatchPath = path.join(config.images, '/**/*.*');

    gulp.watch(cssWatchPath, ['css']);
    gulp.watch(fontsWatchPath, ['fonts']);
    gulp.watch(imagesWatchPath, ['images']);

});

gulp.task('default', ['css', 'fonts', 'images']);
