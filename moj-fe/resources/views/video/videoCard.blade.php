<div class="card card-video">
    <h3><a href="/video/{{ $video->getId() }}">{{ $video->getTitle() }}</a></h3>
    <div class="card-video--description">
        {!! $video->getDescription() !!}
    </div>
</div>