<div class="card programme-card radio-card">
	<div class="shadow">
		<img src="{{ $radio->thumbnail }}" alt="{{ $radio->title }}">
		<div class="programme-title">
			<h6>{{ $radio->title }}</h6>
		</div>

		<div class="overlay">
			<a href="radio/{{ $radio->episode_nid }}" id="programme-{{ $radio->tid }}">
				<div class="programme-name">
					{{ $radio->title }}
				</div>
				<div class="programme-description">
					{!! $radio->description !!}
				</div>

				<div class="programme-text">
					<h4>{{ trans('radio.view') }}</h4>
				</div>
			</a>
		</div>
	</div>
</div>