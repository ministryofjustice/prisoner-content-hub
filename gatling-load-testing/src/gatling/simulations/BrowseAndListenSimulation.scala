import scala.concurrent.duration._
import io.gatling.core.Predef._
import io.gatling.http.Predef._

import supports.Pages._

class BrowseAndListenSimulation extends Simulation {

  val frontendUrl = sys.env.getOrElse(
    "FRONTEND_URL",
    "https://wayland-prisoner-content-hub-staging.apps.live-1.cloud-platform.service.justice.gov.uk"
  )

  val httpProtocol = http
    .baseUrl(frontendUrl)
    .doNotTrackHeader("1")
    .acceptHeader(
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    )
    .acceptLanguageHeader("en-US,en;q=0.5")
    .acceptEncodingHeader("gzip, deflate")
    .userAgentHeader(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0"
    )
    .inferHtmlResources()

  val scn = scenario("Scenario Name")
    .exec(Home.visit())
    .pause(1 seconds, 3 seconds)
    .exec(Video.watch("3949"))
    .pause(1 seconds, 3 seconds)
    .exec(Home.visit())
    .pause(1 seconds, 3 seconds)
    .exec(Page.visit("Visit the 'All Topics' page", "/topics"))
    .pause(1 seconds, 3 seconds)
    .exec(Home.visit())
    .pause(1 seconds, 3 seconds)
    .exec(Search.forTerm("bob"))
    .pause(1 seconds, 3 seconds)
    .exec(Audio.listen("5832"))
    .pause(1 seconds, 3 seconds)
    .exec(Home.visit())
    .pause(1 seconds, 3 seconds)
    .exec(Page.visit("Visit the PSI/PSO page", "/tags/796"))
    .pause(1 seconds, 3 seconds)
    .exec(Page.visit("View a PDF", "/content/3857"))

  setUp(
    // scn.inject(atOnceUsers(1))
    scn.inject(
      rampUsers(50) during (5 minutes)
    ),
    scn.inject(
      rampUsers(100) during (5 minutes)
    ),
    scn.inject(
      rampUsers(200) during (5 minutes)
    ),
    scn.inject(
      rampUsers(300) during (5 minutes)
    ),
    scn.inject(
      rampUsers(400) during (5 minutes)
    ),
    scn.inject(
      rampUsers(500) during (5 minutes)
    ),
    scn.inject(
      rampUsers(600) during (5 minutes)
    ),
    scn.inject(
      rampUsers(700) during (5 minutes)
    )
  ).protocols(httpProtocol)
}
