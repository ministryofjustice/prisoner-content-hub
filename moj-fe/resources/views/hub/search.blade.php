@extends('layouts.search')

@section('title', 'Hub')

@section('content')

    <div class="container notifaction">
        <div class="col-xs-12">
            @include('searchBox', ['path' => $path, 'searchpath' => $searchpath])
        </div>

        <div class="col-xs-12">

            <header>
                <h2>{{ trans('hub.search_results_for') }}: {{ $keywords }}</h2>
            </header>

            @if(!$results)
                <section class="content books">
                    <h3>{{ trans('hub.no_results_found_for') }}: {{ $keywords }}</h3>
                </section>
            @endif
            @if($results)
                <section class="content books">
                    <ul>
                        @foreach($results as $result)
                            <li>
                                <a href="{{ $langTag }}{{ $result->link }}" target="_blank" title="{{ $result->title }}">{{ $result->title }}</a>
                            </li>
                        @endforeach
                    </ul>
                </section>
            @endif
        </div>
    </div>
@endsection
