@extends('layouts.chess')

@section('title', 'Education')

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
                        Chess
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
                       Games description
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

@section('content')

    <div class="container games-container">
        <div class="row">
            <div class="col-md-5 col-xs-12">
                <span class="h3" id="time1">0:05:00</span>
                <div id="board" style="width: 100%;"></div>
                <span class="h3" id="time2">0:05:00</span>
                <div class="moves">
                    <h3>Moves:</h3>
                    <p id="pgn"></p>
                </div>
            </div>
            <div class="col-md-5 col-xs-12">


                <form class="form-horizontal">
                    {{--<div class="form-group">--}}
                        {{--<label for="color" class="control-label">I play</label>--}}
                        {{--<div class="btn-group" data-toggle="buttons">--}}
                            {{--<button type="button" class="btn btn-primary active" id="color-white">White</button>--}}
                            {{--<button type="button" class="btn btn-primary" id="color-black">Black</button>--}}
                        {{--</div>--}}
                    {{--</div>--}}

                    <div class="form-group">
                        <label for="timeBase" class="control-label">Base time (min)</label>
                        <input type="number" class="form-control" id="timeBase" value="5">
                    </div>
                    <div class="form-group">
                        <label for="timeInc" class="control-label">Increment (sec)</label>
                        <input type="number" class="form-control" id="timeInc" value="2">
                    </div>
                    <div class="form-group">
                        <label for="skillLevel" class="control-label">Skill Level (0-20)</label>
                        <input type="number" class="form-control" id="skillLevel" value="10">
                    </div>
                    <div class="form-group">
                        <label for="color" class="control-label">Promote to</label>
                        <select id=promote>
                            <option value=q selected>Queen</option>
                            <option value=r>Rook</option>
                            <option value=b>Bishop</option>
                            <option value=n>Knight</option>
                        </select>
                    </div>


                    {{--<div class="form-group">--}}
                        {{--<label for="showScore" class="control-label">Show score</label>--}}
                        {{--<input type="checkbox" class="form-control" id="showScore" checked>--}}
                    {{--</div>--}}
                    <div class="form-group">
                        <button type="button" class="btn btn-primary" onclick="newGame()">New Game</button>
                    </div>


                </form>
                <!--
                <h5>Evaluation</h5>
                <pre id=evaluation></pre>
                -->
            </div>
        </div>

    </div>

@endsection
