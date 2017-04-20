<!DOCTYPE html>
<html lang="{{ LaravelLocalization::getCurrentLocale() }}">
    <head>
        <script src="/js/jquery-1.12.4.min.js"></script>
        <script src="/js/bxslider/jquery.bxslider.min.js"></script>
        <script src="/js/video.min.js"></script>
        <script src="/js/global.js" type="text/javascript"></script>
        <script src="/js/news.js" type="text/javascript"></script>
        <script src="/js/video.js" type="text/javascript"></script>
        <script src="/js/jquery.modal.min.js" type="text/javascript" charset="utf-8"></script>
        <script src="/js/bootstrap.js" type="text/javascript"></script>
        <!-- chess -->
        <script src="/js/json3.js" type="text/javascript"></script>
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
            &copy <?php echo date("Y"); ?> {{ trans('footer.message') }}
        </footer>
        @endif
        <script>

            var wait_for_script;
            var newGame = function (){};

            /// We can load Stockfish.js via Web Workers or directly via a <script> tag.
            /// Web Workers are better since they don't block the UI, but they are not always avaiable.
            (function fix_workers()
            {
                var script_tag;
                /// Does the environment support web workers?  If not, include stockfish.js directly.
                ///NOTE: Since web workers don't work when a page is loaded from the local system, we have to fake it there too. (Take that security measures!)
                if (!Worker || (location && location.protocol === "file:")) {
                    var script_tag  = document.createElement("script");
                    script_tag.type ="text/javascript";
                    script_tag.src  = "/js/stockfish.js";
                    script_tag.onload = init;
                    document.getElementsByTagName("head")[0].appendChild(script_tag);
                    wait_for_script = true;
                }
            }());

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
                   // game.setPlayerColor($('#color-white').hasClass('active') ? 'white' : 'black');
                    game.setDisplayScore($('#showScore').is(':checked'));
                    game.start();
                }

                game.setSkillLevel

                document.getElementById("skillLevel").addEventListener("change", function ()
                {
                    game.setSkillLevel(parseInt(this.value, 10));
                });

                newGame();
            }

            /// If we load Stockfish.js via a <script> tag, we need to wait until it loads.
            if (!wait_for_script) {
                document.addEventListener("DOMContentLoaded", init);
            }
        </script>
    </body>
</html>
