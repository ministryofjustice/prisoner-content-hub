<?php

use App\Facades\Pdfs;
use Symfony\Component\HttpKernel\Exception\HttpException;

class PdfLandingPageTest extends TestCase
{

	/**
	 * Verify the number of dom elements
	 * @param  string   $selector the dom selector (jquery style)
	 * @param  int      $number   how many elements should be present in the dom
	 * @return $this
	 */
	public function countElements($selector, $number)
	{
		$this->assertCount($number, $this->crawler->filter($selector));
		return $this;
	}

	protected $landingPageMockData = '{
		"parent": {
			"cat_tagline_description": "NEC seeks to widen learning opportunities.",
			"cat_name": "National Extension College",
			"cat_description": "<p>We hope you find the Course Previews from the National Extension College useful. These sample course...</p>\r\n"
		},
		"children": [
			{
				"tid": "18",
				"name": "Art & Literature",
				"parent": null,
				"parent_description": null,
				"cat_description": null
			},
			{
				"tid": "19",
				"name": "Business & Economics",
				"parent": null,
				"parent_description": null,
				"cat_description": null
			}
		]
	}';
	protected $pdfPageMockData = '{
		"parent": {
			"parent_name": "Art & Literature",
			"parent_tid": "17",
			"cat_description": "NEC seeks to widen learning opportunities.",
			"cat_name": "National Extension College"
		},
		"pdfs": {
			"199": {
				"title": "How to read",
				"nid": "199",
				"description": "<p>This is a test pdf description.</p>\r\n",
				"pdf_url": "http://192.168.33.9/sites/default/files/2016-08/dummyPDF1467882498.pdf",
				"thumbnail": "http://192.168.33.9/sites/default/files/2016-08/thumb_0.png"
			},
			"200": {
				"title": "How to read good",
				"nid": "200",
				"description": "<p>Description</p>\r\n",
				"pdf_url": "http://192.168.33.9/sites/default/files/2016-08/dummyPDF_0.pdf",
				"thumbnail": ""
			}
		}
	}';

	/**
	 * Tests that page title is displayed correctly
	 */
	public function testPageTitle()
	{
		Pdfs::shouldReceive('landingPagePdfs')
			->once()
			->andReturn(json_decode($this->landingPageMockData));

		$this->visit('/education/17')
			->seeInElement('.education-header p', 'Educational Courses');
	}

	/**
	 * Tests that parent category name is displayed in H1 tag in header
	 */
	public function testParentCatTitle()
	{
		Pdfs::shouldReceive('landingPagePdfs')
			->once()
			->andReturn(json_decode($this->landingPageMockData));

		$this->visit('/education/17')
			->seeInElement('.education-header h1', 'National Extension College');
	}

	/**
	 * Tests that parent category tagline is displayed in p tag header
	 */
	public function testParentTagLine()
	{
		Pdfs::shouldReceive('landingPagePdfs')
			->once()
			->andReturn(json_decode($this->landingPageMockData));

		$this->visit('/education/17')
			->seeInElement('.education-header p', 'NEC seeks to widen learning opportunities.');
	}

	/**
	 * Tests that parent category description is displayed in body container
	 */
	public function testParentDescription()
	{
		Pdfs::shouldReceive('landingPagePdfs')
			->once()
			->andReturn(json_decode($this->landingPageMockData));

		$this->visit('/education/17')
			->seeInElement('.education-container p', 'We hope you find the Course Previews from the National Extension College useful. These sample course...');
	}

	/**
	 * Tests that 'Subjects' title is displayed correctly
	 */
	public function testSubjectTitle()
	{
		Pdfs::shouldReceive('landingPagePdfs')
			->once()
			->andReturn(json_decode($this->landingPageMockData));

		$this->visit('/education/17')
			->seeInElement('.education-container h3', 'Subjects');
	}

	/**
	 * Tests correct number of subject links are listed
	 */
	public function testNumberOfSubjectLinks()
	{
		Pdfs::shouldReceive('landingPagePdfs')
			->once()
			->andReturn(json_decode($this->landingPageMockData));

		$this->visit('/education/17')
			->countElements('.education-container ul li', 2);
	}

	/**
	 * Tests subject link titles are correct
	 */
	public function testLinkTitles()
	{
		Pdfs::shouldReceive('landingPagePdfs')
			->once()
			->andReturn(json_decode($this->landingPageMockData));

		$this->visit('/education/17')
			->seeInElement('.education-container ul li', 'Art & Literature')
			->seeInElement('.education-container ul li', 'Business & Economics');
	}

	/**
	 * Tests subject link paths are correct
	 */
	public function testLinkPaths()
	{
		Pdfs::shouldReceive('landingPagePdfs')
			->once()
			->andReturn(json_decode($this->landingPageMockData));

		Pdfs::shouldReceive('show')
			->once()
			->andReturn(json_decode($this->pdfPageMockData));

		$this->visit('/education/17')
			->click('course-18')
			->seePageIs('/education/course/18');
	}

	/**
	 * Tests 404 is thrown with invalid term id on PDF landing page
	 */
	public function testLandingPage404()
	{
		Pdfs::shouldReceive('landingPagePdfs')
			->once()
			->andThrow(new HttpException(404, "Not a valid pdf category term id"));

		$response = $this->call('GET', '/education/17');
		$this->assertEquals(404, $response->status());
		$this->assertContains('Page 404 error.', $response->content());
		$this->assertContains('Not a valid pdf category term id', $response->content());
	}

	/*	 * ********************************
	 *
	 * DETAIL PAGE TESTS
	 *
	 * ******************************** */

	/**
	 * Tests that page title is displayed correctly
	 */
	public function testDetailPageTitle()
	{
		Pdfs::shouldReceive('show')
			->once()
			->andReturn(json_decode($this->pdfPageMockData));

		$this->visit('/education/course/18')
			->seeInElement('.education-header p', 'Educational Courses');
	}

	/**
	 * Tests that parent category name is displayed in H1 tag in header
	 */
	public function testDetailPageParentCatTitle()
	{
		Pdfs::shouldReceive('show')
			->once()
			->andReturn(json_decode($this->pdfPageMockData));

		$this->visit('/education/course/18')
			->seeInElement('.education-header h1', 'National Extension College');
	}

	/**
	 * Tests that parent category tagline is displayed in p tag header
	 */
	public function testDetailPageParentTagLine()
	{
		Pdfs::shouldReceive('show')
			->once()
			->andReturn(json_decode($this->pdfPageMockData));

		$this->visit('/education/course/18')
			->seeInElement('.education-header p', 'NEC seeks to widen learning opportunities.');
	}

	/**
	 * Tests the back to category link text
	 */
	public function testBackToCatText()
	{
		Pdfs::shouldReceive('show')
			->once()
			->andReturn(json_decode($this->pdfPageMockData));

		$this->visit('/education/course/18')
			->seeInElement('#back-to-cat', 'Art & Literature');
	}

	/**
	 * Tests the back to category link path
	 */
	public function testBackToCatLinkPath()
	{
		Pdfs::shouldReceive('landingPagePdfs')
			->once()
			->andReturn(json_decode($this->landingPageMockData));

		Pdfs::shouldReceive('show')
			->once()
			->andReturn(json_decode($this->pdfPageMockData));

		$this->visit('/education/course/18')
			->click('back-to-cat')
			->seePageIs('/education/17');
	}

	/**
	 * Test number of PDF links
	 */
	public function testNumberOfPDFLinks()
	{
		Pdfs::shouldReceive('show')
			->once()
			->andReturn(json_decode($this->pdfPageMockData));

		$this->visit('/education/course/18')
			->countElements('.education-container ul li', 2);
	}

	/**
	 * Test titles of PDF links
	 */
	public function testTitlesOfPDFLinks()
	{
		Pdfs::shouldReceive('show')
			->once()
			->andReturn(json_decode($this->pdfPageMockData));

		$this->visit('/education/course/18')
			->seeInElement('.education-container ul li', 'How to read')
			->seeInElement('.education-container ul li', 'How to read good');
	}

	/**
	 * Test PDF link paths
	 */
	public function testPathsOfPDFLinks()
	{
		Pdfs::shouldReceive('show')
			->once()
			->andReturn(json_decode($this->pdfPageMockData));

		$this->visit('/education/course/18')
			->seeElement('a', ['href' => 'http://192.168.33.9/sites/default/files/2016-08/dummyPDF1467882498.pdf'])
			->seeElement('a', ['href' => 'http://192.168.33.9/sites/default/files/2016-08/dummyPDF_0.pdf']);
	}

}
