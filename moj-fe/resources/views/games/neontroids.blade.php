@extends('layouts.neontroids')

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
                        Neontroids
                    </a>
                </div>
            </div>
        </div>
    </div>



@endsection

@section('content')
    <canvas id='canvas' class="canvas"></canvas>
@endsection
