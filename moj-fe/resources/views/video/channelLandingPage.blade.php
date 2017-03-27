@extends('layouts.master'   )

@section('title', 'Video')

@section('header')

@include('stickyNavigation', ['title' => trans('navigation.video'), 'icon' => 'icon-icon-video', 'titleLink' => action('VideosController@showVideoLandingPage'), 'colour' => 'red' ])

<div class="video-player-wrap dark" id="channel-landing-page">
    <div class="container">
        <div class="row">
            <div class="col-xs-12">
                <a href="{{ action('VideosController@showVideoLandingPage') }}" id="back-to-landing"><span class="arrow" aria-hidden="true"></span>{{ trans('video.back') }}</a>	
                <h2 class="video-title">{{ $data->title }}</h2>
            </div>
        </div>

        <div class="row">
            <div class="col-md-5" id="playerColSize">
                <video id="video_player" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" data-setup='{}' controls poster="{{ $data->thumbnail_url }}">
                    <source src="{{ $data->video_url }}">
                    <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
                </video>
            </div>

            <div class="col-md-7 video-details" id="textColSize">				
                {!! $data->description !!}
            </div>
        </div>
    </div>
</div>

@endsection

@section('content')

<div class="row">
    <div class="col-xs-12">
        <div class="episodes-menu channel-landing-tabs">			
            <a href="#" id="EpisodeLink" class="active">{{ $data->left_tab_label }}</a>
            @if( $data->info != null )
                <a href="#" id="AboutLink" class="">{{ $data->right_tab_label }}</a>			
            @endif
        </div>
    </div>
</div>

<!-- Lists the episodes of the programme -->
<div id="EpisodeInfo">
    <div class="row">
        <div class="col-xs-12">
            @if($data->programmes != null)
            <div class="channel-programmes channel-episodes">
                @foreach($data->programmes as $programme)
                @include('video.programmeCard', ['programme' => $programme])
                @endforeach
            </div>
            @endif
        </div>
    </div>
</div>

<!-- Information about the programme-->
<div id="AboutInfo">
    <div class="row">
        <div class="col-xs-9 col-centered">
            <div class="channel-programmes channel-episodes">
                {!! $data->info !!}
            </div>
        </div>
    </div>
</div>

@endsection
