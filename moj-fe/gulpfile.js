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

elixir(function (mix) {   
    mix.sass([
        'app.scss',
        'global.scss'
    ]).version('css/app.css').spritesmith(
            null, {
                imgOutput: 'public/img',
                cssOutput: 'public/css'
            });    
});
