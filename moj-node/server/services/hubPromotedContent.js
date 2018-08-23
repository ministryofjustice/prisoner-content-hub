const { HubContentClient, HubFeaturedContentResponse } = require('../clients/hubContent');

module.exports = function createHubPromotedContentService() {

  async function hubContentPromotedFor(httpClient, opts = { query: {}}) {
    const response = await httpClient.get("/promoted", opts.query);
    if(response.message) return null
    return HubFeaturedContentResponse.parse(response);
  }
  
  async function hubPromotedContent(httpClient) {
    const client = new HubContentClient(httpClient);
    return hubContentPromotedFor(client) 
  }

  return {
    hubContentPromotedFor,
    hubPromotedContent
  }
}