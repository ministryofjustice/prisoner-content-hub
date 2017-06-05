@extends('layouts.sudoku')

@section('title', 'Games: Sudoku')

@section('top_content')

    <div class="top-navigation">
        <div class="row">
            <div class="col-xs-12">
                <a href="/hub" class="back-to-hub">
                    <span class="icon icon-icon-hub" aria-hidden="true"></span>
                    <div class="back-to-the-hub-text">
                        {{ trans('navigation.title') }}
                    </div>
                </a>

                <div class="navigation-title game-yellow">
                    <a href="#">
                        <span class="icon icon-icon-games" aria-hidden="true"></span>
                        Sudoku
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="header-nav-wrap games">
        <div class="container" id="header">
            <div class="education-header">
                <div class="row">
                    <div class="col-xs-12">
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

@section('content')

    <div class="container games-container">
        <div class="row">
            <div class="col-md-6 col-xs-12">
                <div id="sudoku" class="sudoku-board js-sudoku-board" data-board-size="9"></div>
            </div>
            <div class="col-md-6 col-xs-12">
                <div id="sudoku-alert" class="alert alert-success" role="alert">
                    <h3>Congratulations</h3>
                    <p>You have completed the puzzle, would like to play again?</p>
                    <p><a href="#"  class="new-game cta cta-success" title="Yes, start a new game">Yes, start a new game</a></p>
                </div>
                <p>Sudoku is a game that involves a grid of 81 squares, divided into nine blocks, each containing nine
                    squares.</p>

                <p>Each of the nine blocks has to contain the numbers 1-9, each number can only appear once in a row,
                    column or box. Each vertical nine-square column, or horizontal nine-square line across, within the
                    larger square, must also contain the numbers 1-9, without repetition or omission.</p>

                <p>Each sudoku puzzle has only one correct solution.</p>
                <p><a href="#"  class="new-game cta cta-success" title="Start a new game">Start a new game</a></p>

            </div>
        </div>
    </div>

@endsection
