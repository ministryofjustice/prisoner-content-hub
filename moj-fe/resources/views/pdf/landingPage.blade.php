@extends('layouts.master')

@section('title', 'Education')

@section('top_content')

<div class="top-navigation">
    <div class="row">
        <div class="col-xs-12">
            <a href="{{ $backlink }}{{ $categories->parent->back_link }}" class="back-to-hub">
                <span class="icon icon-icon-hub" aria-hidden="true"></span>
                <div class="back-to-the-hub-text">
                    {{ trans('navigation.title') }}
                </div>
            </a>

            <div class="navigation-title purple">
                <a href="{{ action('PdfsController@showPdfLandingPage', $categories->parent->cat_id) }}">
                    <span class="icon icon-icon-education" aria-hidden="true"></span>
                    {{ $categories->parent->cat_name }}
                </a>
            </div>
        </div>
    </div>
</div>

<div class="header-nav-wrap education" style="background-image: url({{ $categories->parent->cat_banner }})">
	<div class="container" id="header">
  		<div class="education-header">
			<div class="row">
				<div class="col-xs-12">
					@if($categories->parent->cat_description)
						{!! $categories->parent->cat_description !!}
					@endif
				</div>
			</div>
		</div>
	</div>
</div>

@endsection

@section('content')

<div class="container education-container">
	<div class="row">
		<div class="col-xs-8 col-xs-offset-2">
			{!! $categories->parent->additional_description !!}
			<h3>{{ trans('pdf.subjects') }}</h3>
			<ul>
				@foreach($categories->children as $category)
				<li>
					<a href="{{ action('PdfsController@show', $category->tid) }}" id="course-{{ $category->tid }}">
						<span class="icon icon-icon-folder-purple" aria-hidden="true"></span>
						{{ $category->name }}
					</a>
				</li>
				@endforeach
			</ul>
		</div>
	</div>
</div>

@endsection
