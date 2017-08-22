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
                            <li><a href="{{ $books->pdf_url }}" target="_blank"
                                   title="{{ $books->title }}">{{ $books->title }}</a></li>
                        @endforeach
                    </ul>
                </section>
            @endif
            @if($page->videos)
                <section class="content videos">

                    <h3>Videos</h3>
                    @foreach($page->videos as $key => $value)
                        <h4>{{ $key }}</h4>
                        <ul>
                        @foreach($value as $videos)
                            <li>
                                <a href="video/{{ $videos->nid }}" target="_blank" title="{{ $videos->title }}">{{ $videos->title }}</a>
                            </li>
                        @endforeach
                        </ul>
                    @endforeach
                </section>
            @endif
            @if($page->audio)
                <section class="content radio">
                    <h3>Radio</h3>
                    <ul>
                    @foreach($page->audio as $audio)
                        <li><a href="radio/{{ $audio->nid }}" target="_blank" title="{{ $audio->title }}">{{ $audio->title }}</a></li>
                    @endforeach
                    </ul>
                </section>
            @endif
        </div>
    </div>
@endsection
