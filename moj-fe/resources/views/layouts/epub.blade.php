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
        <script src="/js/epub.js" type="text/javascript"></script>
        <script src="/js/zip.min.js" type="text/javascript"></script>

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

    <body class="epub">
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

        <div class="main">
            @yield('content')
        </div>


        <script>

            (function ($) {
                $(function () {
                    var book = ePub('{!! $pdf !!}');
                    rendered = book.renderTo("area");
                    $("#prev").on("click", function (e) {
                        e.preventDefault();
                        book.prevPage();
                    });
                    $("#next").on("click", function (e) {
                        e.preventDefault();
                        book.nextPage();
                    });
                    $("#home").on("click", function (e) {
                        e.preventDefault();
                        console.log();
                        book.goto(book.spine[0].href);
                    });
                    rendered.then(function(){
                        var currentLocation = book.getCurrentLocationCfi();
                        var currentPage = book.pagination.pageFromCfi(currentLocation);
                        currentPage.value = currentPage;
                        console.log(currentPage);
                    });
                });
            }(jQuery));
        </script>
    </body>
</html>
