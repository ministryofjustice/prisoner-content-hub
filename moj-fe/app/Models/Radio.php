<?php

namespace App\Models;

class Radio implements \JsonSerializable
{

	protected $nid;
	protected $title;
	protected $description;
	protected $thumbnail;
	protected $programme;

	public function __construct($nid, $title, $description, $thumbnail, $programme)
	{
		$this->nid = $nid;
		$this->title = $title;
		$this->description = $description;
		$this->thumbnail = $thumbnail;
		$this->programme = $programme;
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

	public function getThumbnail()
	{
		return $this->thumbnail;
	}

	public function getProgramme()
	{
		return $this->programme;
	}

	public function jsonSerialize()
	{
		return array(
			'nid' => $this->nid,
			'title' => $this->title,
			'description' => $this->description,
			'programme' => $this->programme
		);
	}

}
