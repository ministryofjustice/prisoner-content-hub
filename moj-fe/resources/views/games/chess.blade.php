@extends('layouts.master')

@section('title', 'Education')

@section('top_content')

    <div class="top-navigation">
        <div class="row">
            <div class="col-xs-12">
                <a href="#" class="back-to-hub">
                    <span class="icon icon-icon-hub" aria-hidden="true"></span>
                    <div class="back-to-the-hub-text">
                        {{ trans('navigation.title') }}
                    </div>
                </a>

                <div class="navigation-title purple">
                    <a href="#">
                        <span class="icon icon-icon-education" aria-hidden="true"></span>
                        Chess
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="header-nav-wrap education" >
        <div class="container" id="header">
            <div class="education-header">
                <div class="row">
                    <div class="col-xs-12">
                       Games description
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

            </div>
        </div>
    </div>

@endsection
