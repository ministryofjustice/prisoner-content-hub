@extends('layouts.chess')

@section('title', 'Games: Chess')

@section('top_content')

    <div class="top-navigation">
        <div class="row">
            <div class="col-xs-12">
                <a href="{{ $backlink }}" class="back-to-hub">
                    <span class="icon icon-icon-hub" aria-hidden="true"></span>
                    <div class="back-to-the-hub-text">
                        {{ trans('navigation.title') }}
                    </div>
                </a>

                <div class="navigation-title game-yellow">
                    <a href="#">
                        <span class="icon icon-icon-games" aria-hidden="true"></span>
                        {{ trans('games.chess') }}
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="header-nav-wrap games" >
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
                {{--<span class="h3" id="time1">0:05:00</span>--}}
                <div id="board" style="width: 100%;"></div>
                {{--<span class="h3" id="time2">0:05:00</span>--}}

                <pre id=engineStatus></pre>

                <div class="moves">
                    <h3>Moves:</h3>
                    <p id="pgn"></p>
                </div>

                <div id="chess-alert" class="alert alert-info show" role="alert">
                    <h3>Chess skill settings</h3>
                    <p>Skill level: <span id="skillLevelDisplay">-100</span></p>
                    <p>Contempt level: <span id="contemptLevelDisplay">20</span></p>
                    <p>Pawns get promoted to: <span id="promoteLevelDisplay">Queen</span></p>
                    <!-- <p><a href="#"  class="new-game cta cta-success" title="Yes, start a new game">Yes, start a new game</a></p> -->
                </div>
            </div>
            <div class="col-md-4 col-xs-12">


                <form class="form-horizontal">





                    <div class="form-group">
                        <label for="contemptLevel" class="control-label">Contempt Level (-100 to 100)</label>
                        <input type="number" class="form-control" id="contemptLevel" value="-100" max="100" min="-100">
                        <small>Roughly equivalent to "optimism." Positive values of contempt favor more "risky" play, while negative values will favor draws. Zero is neutral.</small>

                    </div>
                    <div class="form-group">
                        <label for="skillLevel" class="control-label">Skill Level (0 to 20)</label>
                        <input type="number" class="form-control" id="skillLevel" value="20" max="20" min="0">
                    </div>
                    <div class="form-group">
                        <label for="color" class="control-label">Pawns get promoted to</label>
                        <select id=promote>
                            <option value=q selected>Queen</option>
                            <option value=r>Rook</option>
                            <option value=b>Bishop</option>
                            <option value=n>Knight</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <hidden type="number" class="form-control" id="timeInc" value="2">
                        <hidden type="number" class="form-control" id="timeBase" value="5">
                        <button type="button" class="btn btn-primary" onclick="init()">New Game</button>
                    </div>


                </form>
                <div class="info help">
                    <h3>Help</h3>
                    <p>If you need some help with the rules or how to play Chess you can use the link below</p>
                    <a href="/epub?pdf=/sites/default/files/2017-05/pg33870-images.epub" target="_blank" class="btn">Help wih Chess</a>
                </div>
                <!--
                <h5>Evaluation</h5>
                <pre id=evaluation></pre>
                -->
            </div>
        </div>

    </div>

@endsection
