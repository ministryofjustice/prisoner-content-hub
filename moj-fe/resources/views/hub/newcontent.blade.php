@extends('layouts.newcontent')

@section('title', 'Hub')

@section('content')


<div class="container notifaction">
    <div class="col-xs-12">


        <header>
            <h2>12th Spetember 2017</h2>
        </header>

        <section class="content books">
            <h3>Books</h3>
            <ul>
                @foreach($page->links as $link)
                    <li><a href="{{ $link->pdf_url }}" title="{{ $link->title }}">{{ $link->title }}.</a></li>
                @endforeach
            </ul>
        </section>

        <section class="content videos">
            <h3>Videos</h3>
            <h4>Timewise > Seeing How it is</h4>
            <ul>
                <li><a href="#" title="Hello world">Nisl dictumst augue pulvinar libero.</a></li>
                <li><a href="#" title="Hello world">Quam senectus Praesent sit dignissim eu interdum</a></li>
            </ul>
            <h4>Timewise > Seeing How it is</h4>
            <ul>
                <li><a href="#" title="Hello world">Nisl dictumst augue pulvinar libero.</a></li>
                <li><a href="#" title="Hello world">Quam senectus Praesent sit dignissim eu interdum</a></li>
            </ul>
            <h4>TED Talks > All the time</h4>
            <ul>
                <li><a href="#" title="Hello world">Nisl dictumst augue pulvinar libero.</a></li>
                <li><a href="#" title="Hello world">Quam senectus Praesent sit dignissim eu interdum</a></li>
            </ul>
        </section>

        <section class="content radio">
            <h3>Radio</h3>
            <h4>Bob and Gone</h4>
            <ul>
                <li><a href="#" title="Hello world">Felis sociosqu praesent nascetur est habitasse</a></li>
                <li><a href="#" title="Hello world">Rutrum feugiat parturient.</a></li>
            </ul>
            <h4>Radio 7</h4>
            <ul>
                <li><a href="#" title="Hello world">Nisl dictumst augue pulvinar libero.</a></li>
                <li><a href="#" title="Hello world">Quam senectus Praesent sit dignissim eu interdum</a></li>
            </ul>
        </section>
    </div>
</div>
@endsection
