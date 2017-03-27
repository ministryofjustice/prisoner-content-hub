<ul class="bxslider">
	@foreach($recentVideos as $video)
	<li>
		<div class="carousel-wrap">
			<div class="row">
				<div class="col-xs-6">
					<a href="{{ action('VideosController@show', $video->getId()) }}">
						<div class="new-video">{{ trans('video.newvideo') }}</div>
						<span class="icon icon-play-button-white">Play</span>
						<img src="{{ $video->getThumbnail() }}" alt="{{ $video->getTitle() }}" />
					</a>
				</div>

				<div class="col-xs-6">
					<p>{{ $video->getChannel() }}</p>
					<h2>{{ $video->getTitle() }}</h2>
					<p>{!! $video->getDescription() !!}</p>
					@if($video->getDuration())
						<div class="video-duration">{{ $video->getDuration() }}</div>
					@endif
				</div>
			</div>
		</div>
	</li>
	@endforeach
</ul>
