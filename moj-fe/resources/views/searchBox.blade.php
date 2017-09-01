<div class="searchBox form-group">
    <form method="GET" action="{{ $searchpath }}" accept-charset="UTF-8" search="contact_store" class="form">
        <input type="text" placeholder="{{ trans('hub.search') }}.." class="searchInput" name="q">
        <button type="submit" class="searchButton">
            <img src="/img/search.svg" class="searchIcon" alt="Search button">
        </button>
    </form>
</div>
