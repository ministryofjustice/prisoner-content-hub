<div class="card programme-card video-card">
	<div class="shadow">
		<a href="{{ action('VideosController@show', $programme->episodes->nid) }}" id="programme-{{ $programme->episodes->nid }}">
			<img src="{{ $programme->episodes->thumbnail }}" alt="{{ $programme->title }}">
			<div class="programme-title">
				<h6>{{ $programme->title }}</h6>
			</div>
		</a>
	</div>
</div>
