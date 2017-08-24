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
            <div class="col-md-6" id="playerColSize">
                <div id="jp_container_1" class="jp-video" role="application" aria-label="media player">
                    <div class="jp-type-single">
                        <div id="jquery_jplayer_1" class="jp-jplayer" style="">
                            <img id="jp_poster_0" style="display: inline;" src="{{ $data->thumbnail_url }}">
                            <video id="jp_video_0" preload="metadata" src="{{ $data->video_url }}" title="{{ $data->title }}" style="width: 0px; height: 0px;"></video>
                        </div>
                        <div class="jp-gui">
                            <div class="jp-video-play" style="display: block;">
                                <button class="jp-video-play-icon" role="button" tabindex="0">play</button>
                            </div>
                            <div class="jp-interface">
                                <div class="jp-progress">
                                    <div class="jp-seek-bar" style="width: 100%;">
                                        <div class="jp-play-bar" style="width: 0%;"></div>
                                    </div>
                                </div>
                                <div class="jp-current-time" role="timer" aria-label="time">00:00</div>

                                <div class="jp-controls-holder">
                                    <div class="jp-volume-controls">
                                        <button class="jp-mute" role="button" tabindex="0">mute</button>
                                        <button class="jp-volume-max" role="button" tabindex="0">max volume</button>
                                        <div class="jp-volume-bar">
                                            <div class="jp-volume-bar-value" style="width: 80%;"></div>
                                        </div>
                                    </div>
                                    <div class="jp-controls">
                                        <button class="jp-play" role="button" tabindex="0">play</button>
                                        <button class="jp-stop" role="button" tabindex="0">stop</button>
                                    </div>
                                    <div class="jp-toggles">
                                        <button class="jp-repeat" role="button" tabindex="0">repeat</button>
                                        <button class="jp-full-screen" role="button" tabindex="0">full screen</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="jp-no-solution" style="display: none;">
                            <span>Update Required</span>
                            To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6 video-details" id="textColSize">
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

<script type="text/javascript">
    $(document).ready(function(){
        $("#jquery_jplayer_1").jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    title: "{{ $data->title }}",
                    m4v: "{{ $data->video_url }}",
                    poster: "{{ $data->thumbnail_url }}"
                });
            },
            cssSelectorAncestor: "#jp_container_1",
            swfPath: "/js/res",
            supplied: "m4v",
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true
        });
    });
</script>

@endsection
