@extends('layouts.search')

@section('title', 'Hub')

@section('content')

    <div class="container notifaction">
        <div class="col-xs-12">

            <header>
                <h2>Search Results for: {{ $keywords }}</h2>
            </header>

            @if(!$page->books)
                <section class="content books">
                    <h3>No reults were found for: {{ $keywords }}</h3>
                </section>
            @endif

            @if($page->books)
                <section class="content books">
                    <ul>
                        @foreach($page->books as $books)
                            <li><a href="/epub?pdf={{ $books->pdf_url }}" target="_blank"
                                   title="{{ $books->title }}">{{ $books->title }}.</a></li>
                        @endforeach
                    </ul>
                </section>
            @endif
        </div>
    </div>
@endsection
