import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._

class BrowseAndListenSimulation extends Simulation {

  val frontendUrl = "https://cookhamwood-prisoner-content-hub-production.apps.live-1.cloud-platform.service.justice.gov.uk"
  val backendUrl = "https://cms-prisoner-content-hub-production.apps.live-1.cloud-platform.service.justice.gov.uk"

  val httpProtocol = http
    .baseUrl(frontendUrl)
    .doNotTrackHeader("1")
    .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8") // Here are the common headers
    .acceptLanguageHeader("en-US,en;q=0.5")
    .acceptEncodingHeader("gzip, deflate")
    .userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0")
    .inferHtmlResources()

  val scn = scenario("Scenario Name")
    .exec(
      http("Visit the home page")
        .get("/")
        .check(status.is(200)) 
    )
    .pause(4)
    .exec(
      http("Go to a audio page")
        .get("/content/5920")
        .check(status.is(200))    
    )
    .pause(2)
    .exec(
      http("Play the audio")
        .get(s"${backendUrl}/_flysystem/s3/audio/2020-06/FREE05%20Free%20Flow%20200608.mp3")
        // .header("Range", "bytes=0-1023") 
    )
    .pause(5)
    .exec(
      http("Return to the homepage")
        .get("/")
        .check(status.is(200))
    )
    .pause(2)
    .exec(
      http("Browse all topics")
        .get("/topics")
        .check(status.is(200))
    )


  setUp(
    scn.inject(atOnceUsers(1))
    // scn.inject(rampUsers(10) during(5 seconds))
  ).protocols(httpProtocol)
  
}
