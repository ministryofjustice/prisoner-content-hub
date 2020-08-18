import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._

class BrowseAndListenSimulation extends Simulation {

  val frontendUrl = sys.env.getOrElse("FRONTEND_URL", "https://wayland-prisoner-content-hub-staging.apps.live-1.cloud-platform.service.justice.gov.uk")
  val backendUrl = sys.env.getOrElse("BACKEND_URL", "https://cms-prisoner-content-hub-staging.apps.live-1.cloud-platform.service.justice.gov.uk")
  val numberOfConcurrentUsers = sys.env.getOrElse("CONCURRENT_USERS", 5).asInstanceOf[Int]
  val rampUpOver = sys.env.getOrElse("RAMP_UP_OVER_SECONDS", 5).asInstanceOf[Int]

  val httpProtocol = http
    .baseUrl(frontendUrl)
    .doNotTrackHeader("1")
    .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .acceptEncodingHeader("gzip, deflate")
    .userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0")
    .inferHtmlResources()

  object Page {
    def visit(description: String, url: String) = exec(
      http(description)
        .get(url)
        .check(status.is(200)) 
    )
  }

  object VideoPage {
    def visit(url: String) = exec(
      http("Go to a video page")
        .get(url)
        .check(css("video source", "src").saveAs("videoUrl"))
        .check(status.is(200))
    )
    .pause(2)
    .exec(
      http("Play the video")
        .get("${videoUrl}")
    )
  }

  object AudioPage {
    def visit(url: String) = exec(
      http("Go to a audio page")
        .get(url)
        .check(status.is(200))
        .check(css("audio source", "src").saveAs("audioUrl"))
    )
    .pause(2)
    .exec(
      http("Play the audio")
        .get("${audioUrl}")
    )   
  }

  val scn = scenario("Scenario Name")
    .exec(Page.visit("Home Page", "/"))
    .pause(4)
    .exec(VideoPage.visit("/content/3949"))
    .pause(5)
    .exec(Page.visit("Home Page", "/"))
    .pause(2)
    .exec(Page.visit("Topics Page", "/topics"))
    .pause(2)
    .exec(Page.visit("Home Page", "/"))
    .pause(3)
    .exec(Page.visit("Search and look for 'bob'", "/search?query=bob"))
    .pause(3)
    .exec(AudioPage.visit("/content/5832"))
    .pause(3)
    .exec(Page.visit("Home Page", "/"))
    .pause(2)
    .exec(Page.visit("PSI/PSO Page", "/tags/796"))
    .pause(3)
    .exec(Page.visit("View a PDF", "/content/3857"))

  setUp(
    // scn.inject(atOnceUsers(1))
    scn.inject(rampUsers(numberOfConcurrentUsers) during(Duration(rampUpOver, SECONDS)))
  ).protocols(httpProtocol)

}
