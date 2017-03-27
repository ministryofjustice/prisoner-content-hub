<?php

namespace App\Models;

define('LONG_DESCRIPTION_COUNT', 87);

class News implements \JsonSerializable
{

	protected $nid;
	protected $title;
	protected $description;
	protected $timestamp;
	protected $sticky;

	public function __construct($nid, $title, $description, $timestamp, $sticky)
	{
		$this->nid = $nid;
		$this->title = $title;
		$this->description = $description;
		$this->timestamp = $timestamp;
		$this->sticky = $sticky;
	}

	public function postAge()
	{
		$oneDay = 60*60*24;
		$today = floor(time() / $oneDay);
		$postDay = floor($this->timestamp / $oneDay);

		$daysAgo = $today - $postDay;

		return $daysAgo;
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

	public function getDate()
	{
		return date('j/m/Y', $this->timestamp);
	}

	public function getTime()
	{
		return date('H:i', $this->timestamp);
	}

	public function isSticky()
	{
		return $this->sticky;
	}

	public function jsonSerialize()
	{
		return array(
			'nid' => $this->nid,
			'title' => $this->title,
			'description' => $this->description,
			'date' => $this->date,
			'postAge' => $dif,
		);
	}
}
