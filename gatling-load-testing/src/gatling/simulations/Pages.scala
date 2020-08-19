package supports

import scala.concurrent.duration._
import io.gatling.core.Predef._
import io.gatling.http.Predef._

object Pages {

  object Home {
    def visit() =
      exec(
        http("Visit the Home Page")
          .get("/")
          .check(status.is(200))
      )
  }

  object Page {
    def visit(description: String, url: String) =
      exec(
        http(description)
          .get(url)
          .check(status.is(200))
      )
  }

  object Search {
    def forTerm(query: String) =
      exec(
        http(s"Search for '${query}'")
          .get(s"/search?query=${query}")
          .check(status.is(200))
      )
  }

  object Video {
    def watch(contentId: String) =
      exec(
        http(s"Go to a video page (${contentId})")
          .get(s"/content/${contentId}")
          .check(css("video source", "src").saveAs("videoUrl"))
          .check(status.is(200))
      )
        .pause(2 seconds)
        .exec(
          http(s"Play the video (${contentId})")
            .get("${videoUrl}")
        )
  }

  object Audio {
    def listen(contentId: String) =
      exec(
        http(s"Go to a audio page (${contentId})")
          .get(s"/content/${contentId}")
          .check(status.is(200))
          .check(css("audio source", "src").saveAs("audioUrl"))
      )
        .pause(2 seconds)
        .exec(
          http(s"Play the audio (${contentId})")
            .get("${audioUrl}")
        )
  }

}
