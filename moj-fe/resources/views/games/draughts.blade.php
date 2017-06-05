@extends('layouts.draughts')

@section('title', 'Games: Draughts')

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
                        Draughts
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
                <div id="board" style="width: 400px; height: 400px;"></div>
            </div>
            <div class="col-md-6 col-xs-12">

                <p>How to play draughs</p>
            </div>
        </div>
    </div>

@endsection
