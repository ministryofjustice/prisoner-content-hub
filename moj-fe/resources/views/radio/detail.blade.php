@extends('layouts.master')

@section('title', 'Radio')

@section('header')

@include('stickyNavigation', ['title' => trans('navigation.radio'), 'icon' => 'icon-icon-radio', 'titleLink' => action('RadiosController@showRadioLandingPage'), 'colour' => 'blue' ])

<div class="radio-header" style="background-image: url({{ $radioShow->parent->channel_banner}})">
	<a href="{{ action('RadiosController@showRadioLandingPage') }}" id="back-to-landing"><span class="arrow" aria-hidden="true"></span>{{ trans('radio.back') }}</a>
	<div class="container" id="header">
		<div class="row">
			<div class="col-xs-12">
				<h1 id="radio-player-title">{{ $radioShow->episode->title}}</h1>
				{!! $radioShow->parent->channel_description !!}
			</div>
		</div>
	</div>

	<audio id="radio-player" class="video-js">
		<source src="{{ $radioShow->episode->radio_show_url}}" type="audio/mp3" />
	</audio>

	<a href="#" id="play-prev-show"><span class="icon icon-prev-small">{{ trans('radio.previousshow') }}</span></a>
	<a href="#" id="play-next-show"><span class="icon icon-next-small">{{ trans('radio.nextshow') }}</span></a>

	<div id="player-overlay"></div>
	<div id="equaliser"></div>
</div>

@endsection

@section('content')

<div class="container education-container radio-container">
	<div class="row">
		<div class="col-xs-8 col-xs-offset-2">
			<h2>{{ trans('radio.episodestitle') }}</h2>
			<ul>
			@foreach($shows as $show)
				<li>
					<a href="#" data-audio-src="{{ $show->radio_show_url }}" data-audio-title="{{ $show->title }}" class="play-radio-show" id="show-{{ $show->nid }}">
						<div class="episode-list-icon"><span class="icon icon-play-button play-show-button">{{ trans('radio.playshow') }}</span>
						{{ $show->title }}</div>
						<div class="duration">
							@if($show->duration)
								<span class="icon icon-clock play-show-icon-clock" aria-hidden="true"></span>
								{{ $show->duration }}
							@endif()
						</div>
						@if($show->added_today)
						<div class="added-today">
								{{ trans('radio.addedtoday') }}
						</div>
						@endif()
					</a>
				</li>
			@endforeach
			</ul>
		</div>
	</div>
</div>

@endsection
