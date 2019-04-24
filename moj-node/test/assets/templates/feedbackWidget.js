module.exports = ({ category }) => `
<div ref="container" id="feedback-widget">
  <div>
    <div
      ref="thumbsUp"
      class=""
      data-item-feedback
      data-item-category="${category}"
      data-item-name="foo-name"
      data-item-action="LIKE"
      data-item-value="1"
      data-item-series="foo-series"
      data-item-establishment="foo-establishment"
    ></div>

    <div
      ref="thumbsDown"
      class=""
      data-item-feedback
      data-item-category="${category}"
      data-item-name="foo-name"
      data-item-action="DISLIKE"
      data-item-value="-1"
      data-item-series="foo-series"
      data-item-establishment="foo-establishment"
    ></div>
  </div>

  <div>
    <strong ref="feedbackActionText" data-item-feedback-text></strong>
  </div>
  <form class="govuk-u-hidden"
    ref="feedbackForm"
    data-item-comment=""
    data-item-category=""
    data-item-name=""
    data-item-action=""
    data-item-value=""
    data-item-series=""
    data-item-establishment="foo-establishment">
    <textarea
      data-item-comment-box=""
      id="more-detail"
      name="value"
    ></textarea>
    <div>
      <div><span data-item-counter="">240</span> characters left</div>
      <button type="submit">Send</button>
    </div>
  </form>
</div>
`;
