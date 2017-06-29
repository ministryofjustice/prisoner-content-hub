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
    <!-- Sudoku -->
    <script src="/js/sudokuJS.js" type="text/javascript"></script>

    @if (Request::is('/') || Request::is('hub/*'))
        <title>Digital Hub</title>
    @else
        <title>Digital Hub - @yield('title')</title>
    @endif

    <link href="{{ elixir('css/app.css') }}" rel="stylesheet" type="text/css"/>
    <link href="/js/bxslider/jquery.bxslider.css" rel="stylesheet"/>
    <link href="/css/sprite.css" rel="stylesheet" type="text/css"/>
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
    var mySudokuJS = $("#sudoku").sudokuJS({
        difficulty: "Easy",
        boardFinishedFn: function (data) {
            $("#sudoku-alert").addClass("show");
        }
    });
    /*window.setInterval(function(){
        mySudokuJS.solveStep();
    }, 100);*/

    $(".new-game").on("click", function() {
        $("#sudoku-alert").removeClass("show");
        mySudokuJS.generateBoard('easy');
    });
</script>
</body>
</html>
