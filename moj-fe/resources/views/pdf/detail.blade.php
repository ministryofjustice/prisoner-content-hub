@extends('layouts.master')

@section('title', 'Education')

@section('top_content')

<div class="top-navigation">
    <div class="row">
        <div class="col-xs-12">
            <a href="{{ $backlink }}{{ $pdfs->parent->back_link }}" class="back-to-hub">
                <span class="icon icon-icon-hub" aria-hidden="true"></span>
                <div class="back-to-the-hub-text">
                    {{ trans('navigation.title') }}
                </div>
            </a>

            <div class="navigation-title purple">
                <a href="{{ action('PdfsController@showPdfLandingPage', $pdfs->parent->parent_tid) }}">
                    <span class="icon icon-icon-education" aria-hidden="true"></span>
                    {{ $pdfs->parent->cat_name }}
                </a>
            </div>
        </div>
    </div>
</div>


<div class="header-nav-wrap education" style="background-image: url({{ $pdfs->parent->cat_banner }})">
    <div class="container" id="header">
        <div class="row">
            <div class="col-xs-12">
                {!! $pdfs->parent->cat_description !!}
            </div>
        </div>
    </div>
</div>

@endsection

@section('content')

<div class="container education-container">
    <div class="row">
        <div class="col-xs-8 col-xs-offset-2">
            {!! $pdfs->parent->additional_description !!}
            <div class="pdf-back">
                <a href="{{ action('PdfsController@showPdfLandingPage', $pdfs->parent->parent_tid) }}" id="back-to-cat">
                    <span class="icon icon-icon-back" aria-hidden="true"></span>
                    {{ trans('pdf.back') }}
                </a>
            </div>
            <h3>{{ $pdfs->parent->parent_name }}</h3>
            <ul>
                @foreach($pdfs->pdfs as $pdf)
                <li>
                    <a class="pdf-link" href="{{ $pdf->pdf_url}}" id="course-{{ $pdf->nid }}" target="_blank">
                        <span class="icon icon-icon-education" aria-hidden="true"></span>
                        {{ $pdf->title }}
                    </a>
                </li>
                @endforeach
            </ul>
        </div>
    </div>
</div>

@endsection
