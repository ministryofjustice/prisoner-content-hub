<!DOCTYPE html>
<html lang="{{ LaravelLocalization::getCurrentLocale() }}">
<head>


    @if (Request::is('/') || Request::is('hub/*'))
        <title>Digital Hub</title>
    @else
        <title>Digital Hub - @yield('title')</title>
    @endif

    <link href="{{ elixir('css/app.css') }}" rel="stylesheet" type="text/css"/>
    <link href="/js/bxslider/jquery.bxslider.css" rel="stylesheet"/>
    <link href="/css/sprite.css" rel="stylesheet" type="text/css"/>
    <link href="/css/chessboard.css" rel="stylesheet" type="text/css"/>
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
<script src="/js/jquery-1.12.4.min.js"></script>

<!-- chess -->
<script src="/js/enginegame.js" type="text/javascript"></script>
<script src="/js/chess.js" type="text/javascript"></script>
<script src="/js/chessboard.js" type="text/javascript"></script>

<script>
    var game = engineGame();
    var baseTime = parseFloat($('#timeBase').val()) * 60;
    var skillLevel = $('#skillLevel');
    var contemptLevel = $('#contemptLevel');
    var inc = parseFloat($('#timeInc').val());

    skillLevel.on("change", function () {
        game.setSkillLevel(parseInt(this.value, 10));
    });

    contemptLevel.on("change", function () {
        game.setContempt(parseInt(this.value));
    });

    function setDisplay(skill, contempt, promote) {
        $('#skillLevelDisplay').html(skill);
        $('#contemptLevelDisplay').html(contempt);
        $('#promoteLevelDisplay').html(promote);
    }

    function init() {
        game.reset();
        game.setTime(baseTime, inc);
        game.setSkillLevel(skillLevel.val());
        game.setContempt(contemptLevel.val());
        game.setThreads(2);
        // game.setMinimumThinkingTime(100);
        game.setDisplayScore();
        game.setPlayerColor($('#color-white').hasClass('active') ? 'white' : 'white');
        game.setDisplayScore($('#showScore').is(':checked'));
        setDisplay(skillLevel.val(), contemptLevel.val(), $('#promote :selected').text());
        game.start();
    }
    init();
</script>
</body>
</html>
