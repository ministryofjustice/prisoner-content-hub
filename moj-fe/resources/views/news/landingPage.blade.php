@extends('layouts.master')

@section('title', trans('news.title'))

@section('header')

@include('stickyNavigation', ['title' => 'Wayland News', 'icon' => 'icon-icon-news', 'titleLink' => action('NewsController@showNewsLandingPage'), 'colour' => 'yellow' ])

<div class="header-nav-wrap news">
  <div class="container" id="header">
    <div class="row">
      <div class="col-xs-12">
        <p>{{ trans('news.description') }}</p>
      </div>
    </div>
  </div>
</div>

@endsection

@section('content')

<div class="col-xs-9">
  <div class="news-items">
    @if (count($promoted))
      <div id="posts-important">
        @foreach($promoted as $newsItem)
          @include('news.item', ['newsItem' => $newsItem])
        @endforeach
      </div>
    @endif

    @foreach($news as $daysAgo => $group)
      @if ($daysAgo == 0)
        <span class="posted-ago" id="posts-{{$daysAgo}}-ago"><span>{{ trans('news.today') }}</span></span>
      @elseif ($daysAgo == 1)
        <span class="posted-ago" id="posts-{{$daysAgo}}-ago"><span>{{ trans('news.yesterday') }}</span></span>
      @elseif ($daysAgo > 7)
        <span class="posted-ago" id="posts-{{$daysAgo}}-ago"><span>{{ trans('news.overoneweekago') }}</span></span>
      @else
        <span class="posted-ago" id="posts-{{$daysAgo}}-ago"><span>{{ $daysAgo }} {{ trans('news.daysago') }}</span></span>
      @endif

      @foreach($group as $newsItem)
        <hr/>
        @include('news.item', ['newsItem' => $newsItem])
      @endforeach
    @endforeach
  </div>
</div>

<div class="col-xs-3">
  <div class="news-jump-to">
    <h5>Jump to:</h5>
    <ul>
      @if (count($promoted))
        <li><a href="#posts-important">{{ trans('news.important') }} ({{ count($promoted) }})</a></li>
      @endif
      @foreach($news as $daysAgo => $group)
        @if ($daysAgo == 0)
          <li><a href="#posts-{{$daysAgo}}-ago">{{ trans('news.today') }} ({{ count($group) }})</a></li>
        @elseif ($daysAgo == 1)
          <li><a href="#posts-{{$daysAgo}}-ago">{{ trans('news.yesterday') }} ({{ count($group) }})</a></li>
        @elseif ($daysAgo > 7)
          <li><a href="#posts-{{$daysAgo}}-ago">{{ trans('news.overoneweekago') }} ({{ count($group) }})</a></li>
        @else
          <li><a href="#posts-{{$daysAgo}}-ago">{{ $daysAgo }} {{ trans('news.daysago') }} ({{ count($group) }})</a></li>
        @endif
      @endforeach
    </ul>
  </div>
</div>

@endsection
