<div class="card programme-card video-card episode-card">
	<div class="shadow">
		<a href="{{ action('VideosController@show', $episode->getId()) }}" id="programme-{{ $episode->getId() }}">
			<div class="card-thumbnail">
				<img src="{{ $episode->getThumbnail() }}" alt="{{ $episode->getTitle() }}">
				<span class="icon icon-play-button-white" aria-hidden="true"></span>
				@if($episode->getDuration())
					<span class="duration"><span class="icon icon-icon-clock" aria-hidden="true"></span>{{ $episode->getDuration() }}</span>
				@endif
			</div>
			<div class="programme-title">
				<h6>{{ $episode->getTitle() }}</h6>
			</div>
		</a>
	</div>
</div>
