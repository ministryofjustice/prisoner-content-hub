<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\Models\News as NewsItem;
use App\Facades\News;

class NewsPageTest extends TestCase
{
    protected $landingPageMockData = '{"21":{"title":"Planned C Wing Lockdown Today at 12:30","nid":"21","description":"\u003Cp\u003EPlease be aware that there is a planned lockdown for the C wing today at 12:30. Lockdown is due to general\u0026nbsp;maintenance for the wing and security checks. More updates will be posted and we apologies for any inconvenience\u0026nbsp;this may cause.\u003C\/p\u003E\r\n\r\n\u003Cp\u003EThank you.\u003C\/p\u003E\r\n","date":"1471424877"},"19":{"title":"Changes to Canteen Menu","nid":"19","description":"\u003Cp\u003EAs of 28th July we\u0027ll be adding a few new items to the canteen menu. We\u0027ve added a new chicken burger and several pasta dishes to the menu. You\u0027ll see them on your meal order forms starting next week.\u003C\/p\u003E\r\n","date":"1471341526"},"17":{"title":"D Wing Lockdown 27\/07\/15 at 14:00","nid":"17","description":"\u003Cp\u003ED Wing will be locked down on the 27\/07\/16 at 14:00 due to an offender climbing onto the roof of one of the workshops. The wing needs to be locked down so the offender can be safely removed from the incident contained. We apologies for any inconvenience this may cause.\u003C\/p\u003E\r\n\r\n\u003Cp\u003ERegards\u003Cbr \/\u003E\r\nAndy Wright\u003C\/p\u003E\r\n","date":"1471341384"},"20":{"title":"Summer Football Tournament","nid":"20","description":"\u003Cp\u003EWe are pleased to announce that a summer football tournament is being arranged for the 10th and 11th August. The games will follow 5-a-side format and each time will be allowed substitutes. Players can register their interest in the tournament by putting an App in to their wing.\u003C\/p\u003E\r\n\r\n\u003Cp\u003EPlayers will be able to register as a team or individually. Individual players will be grouped into teams once all application are in. The tournament will run over both days with the final match being played on the afternoon of the 11th.\u003C\/p\u003E\r\n\r\n\u003Cp\u003EThe format of the tournament will be decided once we know how many teams are entering. More details will be posted closer to the time of the tournament but in the mean time, get those Apps in and we\u0027ll see you on the football pitch.\u003C\/p\u003E\r\n","date":"1470836053"},"18":{"title":"B Wing Lockdown 18\/07\/16 at 14:00","nid":"18","description":"\u003Cp\u003EB Wing is currently in lockdown due to an incident. An update will be posted once we have more details.\u003C\/p\u003E\r\n","date":"1468157653"}}';
    protected $mockNews;
    protected $mockOtherNews = array();
    protected $twoDaysAgo;
    protected $threeDaysAgo;

    protected $newsRepository;

    public function __construct() {

      $this->twoDaysAgo = time() - 2*24*60*60;
      $this->threeDaysAgo = time() - 3*24*60*60;

      $this->mockVideo = new NewsItem(
          1,
          "Planned C Wing Lockdown Today at 12:30",
          "Please be aware that there is a planned lockdown for the C wing today at 12:30. Lockdown is due to general maintenance for the wing and security checks. More updates will be posted and we apologies for any inconvenience this may cause. Thank you.",
          $this->twoDaysAgo
      );

		$this->mockOtherNews = array(
			new NewsItem(
        1,
        "Planned C Wing Lockdown Today at 12:30",
        "Please be aware that there is a planned lockdown for the C wing today at 12:30. Lockdown is due to general maintenance for the wing and security checks. More updates will be posted and we apologies for any inconvenience this may cause. Thank you.",
        $this->twoDaysAgo
			),
			new NewsItem(
        2,
        "Changes to Canteen Menu",
        "As of 28th July we'll be adding a few new items to the canteen menu. We've added a new chicken burger and several pasta dishes to the menu. You'll see them on your meal order forms starting next week.",
        $this->threeDaysAgo
			),
      new NewsItem(
        3,
        "Summer Football Tournament",
        "We are pleased to announce that a summer football tournament is being arranged for the 10th and 11th August. The games will follow 5-a-side format and each time will be allowed substitutes. Players can register their interest in the tournament by putting an App in to their wing. Players will be able to register as a team or individually. Individual players will be grouped into teams once all application are in. The tournament will run over both days with the final match being played on the afternoon of the 11th. The format of the tournament will be decided once we know how many teams are entering. More details will be posted closer to the time of the tournament but in the mean time, get those Apps in and we'll see you on the football pitch.",
        $this->threeDaysAgo
			)
      );
    }

    /**
     * Tests content displays on the news page.
     *
     * @return void
     */
    public function testNewsContent()
    {
        News::shouldReceive('landingPageNews')
          ->once()
          ->andReturn($this->mockOtherNews);

        $this->visit('/news')
             ->seeInElement('h3', 'Planned C Wing Lockdown Today at 12:30')
             ->see('Please be aware that there is a planned lockdown for the C wing today at 12:30. Lockdown is due to general maintenance for the wing and security checks. More updates will be posted and we apologies for any inconvenience this may cause. Thank you.')
             ->see('Posted: ' . date('j/m/Y', $this->twoDaysAgo) . ' at ' . date('H:i', $this->twoDaysAgo))
             ->seeInElement('h3', 'Changes to Canteen Menu')
             ->see("As of 28th July we'll be adding a few new items to the canteen menu. We've added a new chicken burger and several pasta dishes to the menu. You'll see them on your meal order forms starting next week.")
             ->see('Posted: ' . date('j/m/Y', $this->threeDaysAgo) . ' at ' . date('H:i', $this->threeDaysAgo))
             ->see('2 days ago')
             ->see('3 days ago');
    }

    public function testHeader()
    {
        News::shouldReceive('landingPageNews')
          ->once()
          ->andReturn($this->mockOtherNews);

        $this->visit('/news')
             ->see('Wayland News')
             ->see('News and Announcements')
             ->see('The place to go if you want to find the latest news and accouncements about your prison.');
    }

    public function testJumpTo()
    {
        News::shouldReceive('landingPageNews')
          ->once()
          ->andReturn($this->mockOtherNews);

        $this->visit('/news')
             ->see('Jump to:')
             ->seeInElement('a', '2 days ago (1)')
             ->seeInElement('a', '3 days ago (2)');
    }

    public function testReturnToHub()
    {
        News::shouldReceive('landingPageNews')
          ->once()
          ->andReturn($this->mockOtherNews);

          $this->visit('/news')
     			 ->click('Return to The Hub')
     			 ->seePageIs('/');
    }

    public function testCheckTruncatedDescription()
    {
        News::shouldReceive('landingPageNews')
          ->once()
          ->andReturn($this->mockOtherNews);

        $this->visit('/news')
           ->seeElement("a[href='#news-modal-3']")
           ->dontSeeElement("a[href='#news-modal-1']")
           ->dontSeeElement("a[href='#news-modal-2']");
    }
}
