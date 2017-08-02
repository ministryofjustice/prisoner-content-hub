<div class="dropdown">
    <button class="language-button" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        English
        <span class="icon icon-dropdown"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" id="language-menu_dropdown">
        <li><a href="{{ URL::to('/') }}{{ $path }}">English</a></li>
        <li><a href="{{ URL::to('/') }}/cy{{ $path }}">Welsh</a></li>
    </ul>
</div>
