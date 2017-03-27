<?php

namespace App\Models;

define('LONG_DESCRIPTION_COUNT', 65);

class Video implements \JsonSerializable
{

	protected $nid;
	protected $title;
	protected $description;
	protected $url;
	protected $thumbnail;
	protected $duration;
	protected $categories;
	protected $channel;
	protected $tags = array();
	protected $parent_channel;
	protected $parent_channel_landing_page;
	protected $parent_channel_id;

	public function __construct($nid, $title, $description, $url, $thumbnail, $duration, $categories, $tags, $channel, $parent_channel = "", $parent_channel_landing_page = false, $parent_channel_id = "")
	{
		$this->nid = $nid;
		$this->title = $title;
		$this->description = $description;
		$this->url = $url;
		$this->thumbnail = $thumbnail;
		$this->duration = $duration;
		$this->categories = $categories;
		$this->tags = $tags;
		$this->channel = $channel;
		$this->parent_channel = $parent_channel;
		$this->parent_channel_landing_page = $parent_channel_landing_page;
		$this->parent_channel_id = $parent_channel_id;
	}

	public function getId()
	{
		return $this->nid;
	}

	public function getTitle()
	{
		return $this->title;
	}

	public function getDescription()
	{
		return $this->description;
	}

	public function hasLongDescription()
	{
		return str_word_count($this->description) > LONG_DESCRIPTION_COUNT;
	}

	public function getTrimmedDescription()
	{
		$numberOfWords = str_word_count($this->description);

		if ($numberOfWords > LONG_DESCRIPTION_COUNT) {
			$words = preg_split("/\s+/", $this->description);
			$words = array_slice($words, 0, LONG_DESCRIPTION_COUNT);
			return implode(" ", $words) . '...';
		}
		else {
			return $this->description;
		}
	}

	public function getThumbnail()
	{
		return $this->thumbnail;
	}

	public function getDuration()
	{
		return $this->duration;
	}

	public function getUrl()
	{
		return $this->url;
	}

	public function getTags()
	{
		return $this->tags;
	}

	public function getCategories()
	{
		return $this->categories;
	}

	public function getChannel()
	{
		return $this->channel;
	}

	public function getParentChannel()
	{
		return $this->parent_channel;
	}
	
	public function getParentChannelExistsValue()
	{
		return $this->parent_channel_landing_page;
	}
	
	public function getParentChannelId()
	{
		return $this->parent_channel_id;
	}
	
	public function jsonSerialize()
	{
		return array(
			'nid' => $this->nid,
			'title' => $this->title,
			'description' => $this->description,
			'duration' => $this->duration,
			'url' => $this->url,
			'tags' => $this->tags,
			'categories' => $this->categories,
			'channel' => $this->channel
		);
	}

}
