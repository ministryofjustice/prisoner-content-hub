@extends('layouts.master'   )

@section('title', $video->getTitle())

@section('top_content')

@include('stickyNavigation', ['title' => trans('navigation.video'), 'icon' => 'icon-icon-video', 'titleLink' => action('VideosController@showVideoLandingPage'), 'colour' => 'red' ])

  <script type="text/javascript">
    $(document).ready(function(){
      $("#jquery_jplayer_1").jPlayer({
        ready: function () {
          $(this).jPlayer("setMedia", {
            title: "{{ $video->getTitle() }}",
            m4v: "{{ $video->getUrl() }}",
            poster: "{{ $video->getThumbnail() }}"
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

<div class="video-player-wrap dark">

    <div class="row">
        @if($video->getParentChannelExistsValue())
            <a href="{{ action('VideosController@showChannelLandingPage', $video->getParentChannelId()) }}" id="back-to-landing"><span class="arrow" aria-hidden="true"></span>{{ trans('video.backTo') }} {{ $video->getParentChannel()}}</a>
        @else
            <a href="{{ action('VideosController@showVideoLandingPage') }}" id="back-to-landing"><span class="arrow" aria-hidden="true"></span>{{ trans('video.back') }}</a>
        @endif
    </div>

    <div class="row">
    
        <div class="col-md-5" id="playerColSize">
            <div id="jp_container_1" class="jp-video" role="application" aria-label="media player">
                <div class="jp-type-single">
                    <div id="jquery_jplayer_1" class="jp-jplayer" style=""><img id="jp_poster_0" style="display: inline;" src="{{ $video->getThumbnail() }}"><video id="jp_video_0" preload="metadata" src="{{ $video->getUrl() }}" title="{{ $video->getTitle() }}" style="width: 0px; height: 0px;"></video></div>
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
                            @if($video->getDuration())
                            <div class="jp-duration" role="timer" aria-label="duration">{{ $video->getDuration() }}</div>
                            @endif
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
    
        <div class="col-md-7 video-details" id="textColSize">

            <span class="video-programme">{{ $video->getCategories()->name }}</span>
            <h2 class="video-title">{{ $video->getTitle() }}</h2>
            <div class="video-item">
                <!-- Show More Button -->
                <div class="video-item--trimmed" id="trimmed">
                    {!! $video->getTrimmedDescription() !!}
 
                    @if($video->getDuration())
                    <div class="video-duration">{{ $video->getDuration() }}</div>
                    @endif
 
                    @if ($video->hasLongDescription())
                    <a href="#" class="btn btn-videoShowMore">
                        Show More
                    </a>
                    @endif
                </div>
 
                <!-- Show Less Button -->
                <div class="video-item--expanded" id="expanded">
                    {!! $video->getDescription() !!}
 
                    @if($video->getDuration())
                    <div class="video-duration">{{ $video->getDuration() }}</div>
                    @endif
 
                    <a href="#" class="btn btn-videoShowLess" >
                        Show Less
                    </a>        
                </div>

            </div>
        </div>
    
    </div>

</div>



@endsection


@section('content')

<div class="row">
	<div class="col-xs-12">
		<div class="episodes-menu">
			@if(  count($categoryEpisodes) > 1 )
			<a href="#" id="EpisodeLink" class="active">{{ trans('video.episodes') }}</a>
			@endif
			@if( $video->getCategories()->description )
			<a href="#" id="AboutLink" class="{{count($categoryEpisodes) > 1 ? '' : 'active'}}">{{ trans('video.about') }}</a>
			@endif
		</div>
	</div>
</div>


@if(  count($categoryEpisodes) > 1 )
<!-- Lists the episodes of the programme -->
<div id="EpisodeInfo">
	<div class="row">
		<div class="col-xs-12">
			<div class="channel-programmes channel-episodes">
				@foreach($categoryEpisodes as $episode)
				@include('video.episodeCard', ['episode' => $episode])
				@endforeach
			</div>
		</div>
	</div>
</div>
@endif

@if( $video->getCategories()->description )
<!-- Information about the programme-->
<div id="AboutInfo">
	<div class="row">
		<div class="col-xs-9 col-centered">
			<div class="channel-programmes channel-episodes">
				<div>{!! $video->getCategories()->description !!}</div>
			</div>
		</div>
	</div>
</div>
@endif

@endsection
