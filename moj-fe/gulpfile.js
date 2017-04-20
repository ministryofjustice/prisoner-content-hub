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
