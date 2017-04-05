// Imports
const debug = require('debug');
const gulp = require('gulp');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const livereload = require('gulp-livereload');
const cleanCss = require('gulp-clean-css');
const webpack = require('webpack-stream');

/**
 * TODO: Pull this out to somewhere where it can reside while
 * user decides what database to use.
 **/
//This is only  for  Bookshelf Dbs
gulp.task('migrate', function () {
  require('babel/register');
  require('./app/data/bookshelf/migrate')();
});

/**
 * Tasks *
 * default: Build & start server
 * dev: Build & start server. Start watching file changes and live reload browser if frontend has changed
 * debug: Run lint and tests, build and serve
 * lint: run JSHint on JS files
 **/

gulp.task('default', ['build', 'serve']);
gulp.task('build', ['scripts', 'styles']);
gulp.task('dev', ['lint', 'build', 'serve']);
gulp.task('debug', ['lint', 'runTests', 'build', 'serve']);
gulp.task('test', ['runTests']);
gulp.task('ci', ['lint', 'runTests', 'build']);

const paths = {
  server: 'run.js',
  tests: 'spec/**/*.spec.js',
  sources: ['app/**/*.js', 'app/**/*.jsx'],
  dest: './dest',
  client: {
    main: './app/render/client.js',
    build: './public/build/',
    basedir: './public/javascripts/',
    ignore: './app/services/serverMediator.js'
  }
};

//run app using nodemon
gulp.task('serve', function () {
  var client = ['scripts', 'styles'];
  gulp.watch(paths.sources, client);
  gulp.watch('public/stylesheets/**/*.css', client);
  gulp.watch('views/**/*.jsx', client);
  nodemon({
    script: paths.server,
    env: {
      'NODE_ENV': 'development'
    },
    watch: [paths.sources, paths.tests],
    ext: 'js, jsx',
    ignore: [paths.client.sources, 'public/build/**', '*.xml', 'node_modules/**']
  })
      .on('start', ['livereload'])
      .on('change', ['livereload'])
      .on('restart', function () {
        debug.log('restarted!');
      });
});

// Run Javascript linter
gulp.task('lint', function () {
  return gulp.src(['app/**/*.js', 'spec/**/*.js', 'app.js', '!spec/coverage/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

// Browserify frontend code and compile React JSX files.
gulp.task('scripts', function () {
  gulp.src(paths.sources)
  .pipe(babel({
    presets: ['es2015','react']
  }))
  .pipe(gulp.dest(`${paths.dest}/app`));
  gulp.src([`${paths.dest}/${paths.client.main}`])
  .pipe(webpack({
    watch: true,
    output: {
      filename: 'app.js'
    }
  }))
  .pipe(gulp.dest(paths.client.build))
  .pipe(livereload());

      // .pipe(plugins.sourcemaps.init({loadMaps: true}))
      // .pipe(plugins.uglify())
      // .pipe(plugins.sourcemaps.write('./'))
      // .pipe(plugins.livereload());
});

// Compile CSS file from less styles
gulp.task('styles', function () {
  gulp.src(['public/stylesheets/style.css'])
      .pipe(cleanCss())
      .pipe(gulp.dest(paths.client.build))
      .pipe(livereload());
});

// livereload browser on client app changes
gulp.task('livereload', function () {
  livereload.listen({auto: true});
});

// Run tests
gulp.task('runTests', function() {
  console.log();
});

gulp.task('coveralls', function () {
  return gulp.src('./spec/coverage/lcov.info')
      .pipe(plugins.coveralls());
});
