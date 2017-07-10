<!DOCTYPE html>
<html lang="{{ LaravelLocalization::getCurrentLocale() }}">
    <head>
        <script src="/js/jquery-1.12.4.min.js"></script>
        <script src="/js/bxslider/jquery.bxslider.min.js"></script>
        <script src="/js/global.js" type="text/javascript"></script>
        <script src="/js/news.js" type="text/javascript"></script>
        <script src="/js/jquery.modal.min.js" type="text/javascript" charset="utf-8"></script>
        <script src="/js/bootstrap.js" type="text/javascript"></script>
        <!-- Draughts -->
        <script src="/js/draughts.js" type="text/javascript"></script>
        <script src="/js/draughtsboard.js" type="text/javascript"></script>

        @if (Request::is('/') || Request::is('hub/*'))
        <title>Digital Hub</title>
        @else
        <title>Digital Hub - @yield('title')</title>
        @endif

        <link href="{{ elixir('css/app.css') }}" rel="stylesheet" type="text/css" />
        <link href="/js/bxslider/jquery.bxslider.css" rel="stylesheet" />
        <link href="/css/sprite.css" rel="stylesheet" type="text/css" />
        <link href="/css/draughtsboard.css" rel="stylesheet" type="text/css" />
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

            $(function() {
                console.log( "ready!" );



                var game = new Draughts();

                // Draughtsboard start

                var boardEl = $('#board');
                var squareToHighlight;
                var orientation;
                var gameStatus = 'stopped';

                var removeHighlights = function (color) {
                    boardEl.find('.square-55d63').removeClass('highlight-' + color);
                };

                var unHighlightMoves = function () {
                    $('#board .square-55d63').css('background', '');
                };

                var highlightMoves = function (square) {
                    var squareEl = $('#board .square-' + square);

                    var background = '#a9a9a9';
                    if (squareEl.hasClass('black-3c85d')) {
                        background = '#696969';
                    }
                    squareEl.css('background', background);
                };

                var onDragStart = function (source, piece, position) {
                    console.log(game.gameOver());
                    if (gameStatus == 'stopped' || game.turn() != orientation) {
                        return false;
                    }
                    if (game.gameOver() == true || (game.turn() == 'w' && piece.search('/^b/') !== -1) || game.turn() === 'b' && piece.search('/^w/') !== -1) {
                        return false;
                    }
                };

                var onDrop = function(source, target) {
                    unHighlightMoves();
                    var move = game.move({
                        from: source,
                        to: target
                    });

                    if (move === null) {
                        return 'snapback';
                    }

                    // remove black highlights
                    removeHighlights('black');
                    boardEl.find('.square-' + move.from).addClass('highlight-black');
                    squareToHighlight = move.to;

                    // remove white highlights
                    // highlight white's move
                    removeHighlights('white');
                    boardEl.find('.square-' + source).addClass('highlight-white');
                    boardEl.find('.square-' + target).addClass('highlight-white');
                };

                var onSnapEnd = function () {
                    board.position(game.fen());
                }

                var onMouseoverSquare = function (square, piece) {
                    if (!piece) {
                        return false;
                    }
                    var moves = game.moves({
                        square: square,
                        verbose: true
                    });

                    if (moves.length === 0) {
                        return false;
                    }

                    highlightMoves(square);

                    moves.forEach(function(move) {
                        highlightMoves(move.to);
                    });
                };

                var onMouseoutSquare = function (square, piece) {
                    unHighlightMoves();
                }

                var updateStatus = function(move) {
                    var status = '';

                    var moveColor = 'White';
                    if (game.turn() === 'b') {
                        moveColor = 'Black';
                    }

                    if (game.gameOver() === true) {
                        status = 'Game over, ' + moveColor + ' is in checkmate.';
                    }

                }

                var onMoveEnd = function() {
                    boardEl.find('.square-' + squareToHighlight).addClass('highlight-black');
                };
                var board;

                var initialConfig = {
                    showNotation: true,
                    position: 'start',
                    draggable: true,
                    pieceTheme: 'unicode',
                    showErrors: 'console',
                    ondragstart: onDragStart,
                    onDrop: onDrop,
                    onSnapEnd: onSnapEnd,
                    onMouseoutSquare: onMouseoutSquare,
                    onMouseoverSquare: onMouseoverSquare,
                    onMoveEnd: onMoveEnd
                };

                board = DraughtsBoard('board', initialConfig);

            })

        </script>
    </body>
</html>
