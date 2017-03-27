@extends('layouts.master'   )

@section('title', 'Video')

@section('header')

@include('stickyNavigation', ['title' => trans('navigation.video'), 'icon' => 'icon-icon-video', 'titleLink' => action('VideosController@showVideoLandingPage'), 'colour' => 'red' ])

<div class="header-nav-wrap video">
    <div class="container" id="header">
        <div class="recent-video-wrap dark">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12">
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

@section('content')

@foreach($videos as $channel)
<div class="channel">
    <h2>{{ $channel->channel }}</h2>
    @if ($channel->landing_page)
    <a href="{{ action('VideosController@showChannelLandingPage', $channel->tid) }}" class="btn btn-toChannel">
        {{ trans('video.goToChannel') }}
    </a>
    @endif

    <div class="channel-programmes">
        @foreach($channel->programmes as $programme)
        @include('video.programmeCard', ['programme' => $programme])
        @endforeach
    </div>
</div>
@endforeach

@endsection
