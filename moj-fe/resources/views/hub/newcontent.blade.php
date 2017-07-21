@extends('layouts.newcontent')

@section('title', 'Hub')

@section('content')

    <div class="container notifaction">
        <div class="col-xs-12">

            <header>
                @if($page->todaysdate)
                    <h2>{{ $page->todaysdate }}</h2>
                @endif
            </header>

            @if(!$page->books && !$page->videos && !$page->audio)
                <section class="content books">
                    <h3>No new content has been added today</h3>
                </section>
            @endif

            @if($page->books)
                <section class="content books">
                    <h3>Books</h3>
                    <ul>
                        @foreach($page->books as $books)
                            <li><a href="/epub?pdf={{ $books->pdf_url }}" target="_blank"
                                   title="{{ $books->title }}">{{ $books->title }}.</a></li>
                        @endforeach
                    </ul>
                </section>
            @endif
            @if($page->videos)
                <section class="content videos">

                    <h3>Videos</h3>
                    @foreach($page->videos as $key => $value)
                        <h4>{{ $key }}</h4>
                        @foreach($value as $videos)
                            <li>
                                <a href="video/{{ $videos->nid }}" title="{{ $videos->title }}">{{ $videos->title }}
                                    .</a>
                            </li>
                        @endforeach
                    @endforeach
                </section>
            @endif
            @if($page->audio)
                <section class="content radio">
                    <h3>Radio</h3>

                    @foreach($page->audio as $audio)
                        <li><a href="radio/{{ $audio->nid }}" title="{{ $audio->title }}">{{ $audio->title }}.</a></li>
                    @endforeach

                </section>
            @endif
        </div>
    </div>
@endsection
