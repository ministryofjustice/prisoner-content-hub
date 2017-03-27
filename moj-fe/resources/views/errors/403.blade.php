@extends('layouts.errormaster')

@section('title', '403 Error')

@section('content')

<div class="error-container">
  <div class="col-xs-12">
    <div class="content">
      <div class="title">4</div>
      <img src="/img/icon-hub-medium.png">
      <div class="title">3</div>
      <div class ="error">{{ trans('error.403-title') }}</div>
      <p>{{ trans('error.403-message') }}</p>
      <a href="{{ trans('error.403-path') }}" id="back">{{ trans('navigation.title') }}</a>
    </div>
  </div>
</div>

@endsection
