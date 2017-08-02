@extends('layouts.search')

@section('title', 'Hub')

@section('content')

    <div class="container notifaction">
        <div class="col-xs-12">
            @include('searchBox', ['path' => $path])
        </div>

        <div class="col-xs-12">

            <header>
                <h2>Search Results for: {{ $keywords }}</h2>
            </header>

            @if(!$results)
                <section class="content books">
                    <h3>No reults were found for: {{ $keywords }}</h3>
                </section>
            @endif
            @if($results)
                <section class="content books">
                    <ul>
                        @foreach($results as $result)
                            <li>
                                <a href="{{ $result->link }}" title="{{ $result->title }}">{{ $result->title }}</a>
                            </li>
                        @endforeach
                    </ul>
                </section>
            @endif
        </div>
    </div>
@endsection
