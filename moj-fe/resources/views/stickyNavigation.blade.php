<div class="top-navigation">
    <div class="row">
        <div class="col-xs-12">
            <a href="{{ action('HubLinksController@getItem') }}" class="back-to-hub">
                <span class="icon icon-icon-hub" aria-hidden="true"></span>
                <div class="back-to-the-hub-text">
                    {{ trans('navigation.title') }}
                </div>
            </a>

            <div class="navigation-title {{ $colour }}">
                <a href="{{ $titleLink }}">
                    <span class="icon {{ $icon }}" aria-hidden="true"></span>
                    {{ $title }}
                </a>
            </div>
        </div>
    </div>
</div>
