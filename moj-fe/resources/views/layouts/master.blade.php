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

        @if (Request::is('/') || Request::is('hub/*'))
        <title>Digital Hub</title>
        @else
        <title>Digital Hub - @yield('title')</title>
        @endif

        <link href="{{ elixir('css/app.css') }}" rel="stylesheet" type="text/css" />
        <link href="/js/bxslider/jquery.bxslider.css" rel="stylesheet" />
        <link href="/css/sprite.css" rel="stylesheet" type="text/css" />
        {!! App\Helpers\Piwik::trackingCode() !!}
    </head>

    <body>
        @if ( Route::currentRouteName() == 'hub.sub' || Route::currentRouteName() == 'hub.landing' )
            <div class="top-navigation hub-top-navigation ">
                <div class="container">
                <div class="row">
                    <div class="col-xs-10 text-align-right">
                        <a href="#" title="New content" id="new-content-trigger" class="cta cta-success notifaction-cta"><img src="img/star.svg" alt="New content icon" class="star-icon"> New Content</a>
                    </div>
                    <div class="col-xs-2">
                        @include('languageDropdown', ['path' => $path])
                    </div>
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

        <div id="overlay" class="overlay"></div>

        <section id="notifaction" class="notifaction">

            <header>
                <a href="#" class="close-notifaction" id="close-notifaction">
                    <img src="img/close.svg" class="close-icon" alt="close button">
                    Close
                </a>
                <h2>New Content</h2>
                <p>12th Spetember 2017</p>
            </header>

            <section class="content books">
                <h3>Books</h3>
                <ul>
                    <li><a href="#" title="Hello world">Nisl dictumst augue pulvinar libero.</a></li>
                    <li><a href="#" title="Hello world">Quam senectus Praesent sit dignissim eu interdum</a></li>
                    <li><a href="#" title="Hello world">Tempor auctor mauris urna ipsum aenean in</a></li>
                    <li><a href="#" title="Hello world">Felis sociosqu praesent nascetur est habitasse</a></li>
                    <li><a href="#" title="Hello world">Rutrum feugiat parturient.</a></li>
                </ul>
            </section>

            <section class="content videos">
                <h3>Videos</h3>
                <h4>Timewise > Seeing How it is</h4>
                <ul>
                    <li><a href="#" title="Hello world">Nisl dictumst augue pulvinar libero.</a></li>
                    <li><a href="#" title="Hello world">Quam senectus Praesent sit dignissim eu interdum</a></li>
                </ul>
                <h4>Timewise > Seeing How it is</h4>
                <ul>
                    <li><a href="#" title="Hello world">Nisl dictumst augue pulvinar libero.</a></li>
                    <li><a href="#" title="Hello world">Quam senectus Praesent sit dignissim eu interdum</a></li>
                </ul>
                <h4>TED Talks > All the time</h4>
                <ul>
                    <li><a href="#" title="Hello world">Nisl dictumst augue pulvinar libero.</a></li>
                    <li><a href="#" title="Hello world">Quam senectus Praesent sit dignissim eu interdum</a></li>
                </ul>
            </section>

            <section class="content radio">
                <h3>Radio</h3>
                <h4>Bob and Gone</h4>
                <ul>
                    <li><a href="#" title="Hello world">Felis sociosqu praesent nascetur est habitasse</a></li>
                    <li><a href="#" title="Hello world">Rutrum feugiat parturient.</a></li>
                </ul>
                <h4>Radio 7</h4>
                <ul>
                    <li><a href="#" title="Hello world">Nisl dictumst augue pulvinar libero.</a></li>
                    <li><a href="#" title="Hello world">Quam senectus Praesent sit dignissim eu interdum</a></li>
                </ul>
            </section>

        </section>

    </body>
</html>


