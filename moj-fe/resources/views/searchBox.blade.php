<div class="searchBox form-group">
    {!! Form::open(array('action' => 'HubLinksController@searchContent', 'method' => 'get', 'search' => 'contact_store', 'class' => 'form')) !!}
        <input type="text" placeholder="Search.." class="searchInput" name="q">
        <button type="submit" class="searchButton">
            <img src="/img/search.svg" class="searchIcon" alt="Search button">
        </button>
    {!! Form::close() !!}
</div>
