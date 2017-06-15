<!DOCTYPE html>
<html lang="{{ LaravelLocalization::getCurrentLocale() }}" class="neontroids">
    <head>
        <link href="{{ elixir('css/app.css') }}" rel="stylesheet" type="text/css" />
        <link href="/js/bxslider/jquery.bxslider.css" rel="stylesheet" />
        <link href="/css/sprite.css" rel="stylesheet" type="text/css" />
        <title>Digital Hub - Neontroids</title>
        {!! App\Helpers\Piwik::trackingCode() !!}
    </head>
    <body class="neontroids">
    @if ( Route::currentRouteName() == 'hub.sub' || Route::currentRouteName() == 'hub.landing' )
        <div class="top-navigation hub-top-navigation">
            <div class="row">
                <div class="col-xs-12">
                    @include('languageDropdown', ['path' => $path])
                </div>
            </div>
        </div>

    @else
        @yield('header')
    @endif

    @yield('top_content')

    @yield('content')

    </body>
    <script src="/js/sound-fx.js"></script>
    <script src="/js/keyboard-io.js"></script>
    <script src="/js/collisions.js"></script>
    <script src="/js/asteroids-sprites.js"></script>
    <script src="/js/asteroids-polygon.js"></script>
    <script src="/js/display-text.js"></script>
    <script src="/js/asteroids.js"></script>
</html>
