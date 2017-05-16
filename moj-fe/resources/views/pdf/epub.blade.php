@extends('layouts.epub')

@section('title', 'ePub Reader')

@section('top_content')



@endsection

@section('content')
        <a href="#" id="prev" class="control btn left">< Prev</a>
        <div id="area" class="area"></div>
        <a href="#" id="next" class="control btn right">Next ></a>
        <a href="#" id="home" title="Go to start of book" class="btn home">Home</a>
@endsection
