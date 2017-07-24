<!DOCTYPE html>
<html lang="{{ LaravelLocalization::getCurrentLocale() }}">
    <head>
        <script src="/js/jquery-1.12.4.min.js"></script>
        <script src="/js/bxslider/jquery.bxslider.min.js"></script>
        <script src="/js/global.js" type="text/javascript"></script>
        <script src="/js/news.js" type="text/javascript"></script>
        <script src="/js/jquery.modal.min.js" type="text/javascript" charset="utf-8"></script>
        <script src="/js/bootstrap.js" type="text/javascript"></script>
        <!-- chess -->
        <script src="/js/chessboard.js" type="text/javascript"></script>
        <script src="/js/chess.js" type="text/javascript"></script>
        <script src="/js/enginegame.js" type="text/javascript"></script>

        @if (Request::is('/') || Request::is('hub/*'))
        <title>Digital Hub</title>
        @else
        <title>Digital Hub - @yield('title')</title>
        @endif

        <link href="{{ elixir('css/app.css') }}" rel="stylesheet" type="text/css" />
        <link href="/js/bxslider/jquery.bxslider.css" rel="stylesheet" />
        <link href="/css/sprite.css" rel="stylesheet" type="text/css" />
        <link href="/css/chessboard.css" rel="stylesheet" type="text/css" />
        {!! App\Helpers\Piwik::trackingCode() !!}
    </head>

    <body>
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

        <div id="content" class="container">
            @yield('content')
        </div>

        @if ( Route::currentRouteName() == 'hub.sub' || Route::currentRouteName() == 'hub.landing' )
        @else
        <footer class="footer">
            &copy; <?php echo date("Y"); ?> {{ trans('footer.message') }}
        </footer>
        @endif
        <script>
            function init()
            {
                var game = engineGame();
                newGame = function newGame() {
                    var baseTime = parseFloat($('#timeBase').val()) * 60;
                    var inc = parseFloat($('#timeInc').val());
                    var skill = parseInt($('#skillLevel').val());
                    game.reset();
                    game.setTime(baseTime, inc);
                    game.setSkillLevel(skill);
                    game.setPlayerColor($('#color-white').hasClass('active') ? 'white' : 'white');
                    game.setDisplayScore($('#showScore').is(':checked'));
                    game.start();
                }

                game.setSkillLevel;

                document.getElementById("skillLevel").addEventListener("change", function ()
                {
                    game.setSkillLevel(parseInt(this.value, 10));
                });

                newGame();
            }
            init();
        </script>
    </body>
</html>
