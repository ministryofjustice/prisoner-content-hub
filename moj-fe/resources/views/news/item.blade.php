<div class="news-item {{ $newsItem->isSticky() ? 'important' : '' }}">
	<h4 class="news-item--title">{{ $newsItem->getTitle() }}</h4>

	@if ($newsItem->isSticky())
    <span class="news-item--icon icon icon-news-reminder"></span>
    <span class="news-item--pinned icon icon-news-pinned"></span>
	@else
    <span class="news-item--icon icon icon-news-general"></span>
	@endif




	<!-- Show More Button -->
	<div class="news-item--trimmed" id="trimmed-{{ $newsItem->getId() }}">
		<div class="news-item--body">
			{!! $newsItem->getTrimmedDescription() !!}
		</div>

		<div class="news-item--posted">
			{{ trans('news.posted') }}: {{ $newsItem->getDate() }} {{ trans('news.at') }} {{ $newsItem->getTime() }}
		</div>

		@if ($newsItem->hasLongDescription())
			<a href="#" class="btn btn-showMore" data-show="#expanded-{{ $newsItem->getId() }}" data-hide="#trimmed-{{ $newsItem->getId() }}">
				{{ trans('news.showmore') }}
			</a>
		@endif
	</div>




	<!-- Show Less Button -->
	<div class="news-item--expanded btn-showLess" id="expanded-{{ $newsItem->getId() }}">
		<div class="news-item--body">
			{!! $newsItem->getDescription() !!}
		</div>

		<div class="news-item--posted">
			{{ trans('news.posted') }}: {{ $newsItem->getDate() }} {{ trans('news.at') }} {{ $newsItem->getTime() }}
		</div>

		<a href="#" class="btn" data-hide="#expanded-{{ $newsItem->getId() }}" data-show="#trimmed-{{ $newsItem->getId() }}" >
			{{ trans('news.showless') }}
		</a>		
	</div>

</div>