var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

require('laravel-elixir-spritesmith');

elixir( function (mix) {

    mix.copy(
        'node_modules/chessboardjs/www/js/chessboard.js',
        'public/js'
    ).copy(
        'node_modules/chessboardjs/www/css/chessboard.css',
        'public/css'
    ).copy(
        'node_modules/chess.js/chess.js',
        'public/js'
    ).copy(
        'node_modules/stockfish/src/stockfish.js',
        'public/js'
    ).copy(
        'node_modules/epubjs/build/epub.js',
        'public/js'
    ).copy(
        'node_modules/epubjs/build/libs/zip.min.js',
        'public/js'
    ).copy(
        'node_modules/draughts/draughts.js',
        'public/js'
    ).copy(
        'node_modules/draughtsboard/draughtsboard.js',
        'public/js'
    ).copy(
        'node_modules/draughtsboard/draughtsboard.css',
        'public/css'
    ).copy(
        'node_modules/neontroids/sound-fx.js',
        'public/js'
    ).copy(
        'node_modules/neontroids/keyboard-io.js',
        'public/js'
    ).copy(
        'node_modules/neontroids/collisions.js',
        'public/js'
    ).copy(
        'node_modules/neontroids/asteroids-sprites.js',
        'public/js'
    ).copy(
        'node_modules/neontroids/asteroids-polygon.js',
        'public/js'
    ).copy(
        'node_modules/neontroids/display-text.js',
        'public/js'
    ).copy(
        'node_modules/neontroids/asteroids.js',
        'public/js'
    ).copy(
        'node_modules/neontroids/res/explosion1.mp3',
        'public/js/res'
    ).copy(
        'node_modules/neontroids/res/explosion2.mp3',
        'public/js/res'
    ).copy(
        'node_modules/neontroids/res/explosion3.mp3',
        'public/js/res'
    ).copy(
        'node_modules/neontroids/res/large-saucer.mp3',
        'public/js/res'
    ).copy(
        'node_modules/neontroids/res/saucer-missile.mp3',
        'public/js/res'
    ).copy(
        'node_modules/neontroids/res/ship-missile.mp3',
        'public/js/res'
    ).copy(
        'node_modules/neontroids/res/small-saucer.mp3',
        'public/js/res'
    ).copy(
        'node_modules/neontroids/res/thump-high.mp3',
        'public/js/res'
    ).copy(
        'node_modules/neontroids/res/thump-low.mp3',
        'public/js/res'
    ).copy(
        'node_modules/jplayer/dist/jplayer/jquery.jplayer.min.js',
        'public/js'
    ).copy(
        'node_modules/jplayer/dist/skin/blue.monday/image/jplayer.blue.monday.jpg',
        'public/image/'
    ).copy(
        'node_modules/jplayer/dist/skin/blue.monday/image/jplayer.blue.monday.seeking.gif',
        'public/image/'
    ).copy(
        'node_modules/jplayer/dist/skin/blue.monday/image/jplayer.blue.monday.video.play.png',
        'public/image/'
    ).copy(
        'node_modules/jplayer/dist/skin/blue.monday/css/jplayer.blue.monday.min.css',
        'public/css/jplayer.css'
    ).copy(
        'node_modules/jplayer/dist/jplayer/jquery.jplayer.swf',
        'public/js/res'
    );
    mix.sass([
        'app.scss',
        'global.scss'
    ]).version('css/app.css').spritesmith(
            null, {
                imgOutput: 'public/img',
                cssOutput: 'public/css'
            });    
});
