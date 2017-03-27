@extends('layouts.master')

@section('title', $video->getTitle())

@section('top_content')

@include('stickyNavigation', ['title' => trans('navigation.video'), 'icon' => 'icon-icon-video', 'titleLink' => action('VideosController@showVideoLandingPage'), 'colour' => 'red' ])

<div class="video-player-wrap dark">
	<div class="container">
		<div class="row">
			@if($video->getParentChannelExistsValue())
				<a href="{{ action('VideosController@showChannelLandingPage', $video->getParentChannelId()) }}" id="back-to-landing"><span class="arrow" aria-hidden="true"></span>{{ trans('video.backTo') }} {{ $video->getParentChannel()}}</a>			
			@else
				<a href="{{ action('VideosController@showVideoLandingPage') }}" id="back-to-landing"><span class="arrow" aria-hidden="true"></span>{{ trans('video.back') }}</a>
			@endif				
		</div>
		<div class="row">
			<div class="col-md-5" id="playerColSize">
				<video id="video_player" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" data-setup='{}' controls poster="{{$video->getThumbnail()}}">
					<source src="{{ $video->getUrl() }}">
					<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
				</video>
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
