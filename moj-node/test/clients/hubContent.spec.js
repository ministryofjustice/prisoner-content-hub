const { hubContentFor, hubFeaturedContent } = require('../../server/clients/hubContent');

describe('HubContent', () => {

    describe('#hubFeaturedContent', () => {
        const contentResponse = {
            "3546": {
                "nid": [
                    {
                        "value": 1
                    }
                ],
                "type": [
                    {
                        "target_id": "page",
                    }
                ],
                "title": [
                    {
                        "value": "foo title"
                    }
                ],
                "field_moj_description": [
                    {
                        "value": "<p>foo description<p>\r\n",
                        "processed": "<p>foo description<p>",
                    }
                ],
                "field_moj_thumbnail_image": [
                    {
                        "alt": "Foo image alt text",
                        "url": "image.url.com"
                    }
                ],
    
            }
        };

        it('return featured content', async () => {
            const expectedResult = {
                newsAndEvents: contentFor("page"),
                games: contentFor("page"),
                radioShowsAndPodcasts: contentFor("page"),
                healthyMindAndBody: contentFor("page"),
                inspiration: contentFor("page"),
                scienceAndNature: contentFor("page"),
                artAndCulture: contentFor("page"),
                history: contentFor("page"),
            }
            const stub = sinon.stub().returns(contentResponse);
            const response = await hubFeaturedContent(featuredContentClient(stub));

            expect(response).to.eql(expectedResult);
        });

        context("when some feature content are missing", () => {
            it("returns an empty null for the missing fields", async () => {
                const expectedResult = {
                    newsAndEvents: {},
                    games: {},
                    radioShowsAndPodcasts: contentFor("page"),
                    healthyMindAndBody: contentFor("page"),
                    inspiration: contentFor("page"),
                    scienceAndNature: contentFor("page"),
                    artAndCulture: contentFor("page"),
                    history: contentFor("page"),
                }

                const stub = sinon.stub();

                stub.onFirstCall().throws();
                stub.onSecondCall().throws();
                stub.returns(contentResponse);
        
                const response = await hubFeaturedContent(featuredContentClient(stub));
    
                expect(response).to.eql(expectedResult);

            });
        })
    });

    describe('#hubContentFor', () => {
        it('returns a radio featured content', async () => {
            const content = await hubContentFor(generateFeatureContentClientFor("moj_radio_item"));
    
            expect(content).to.eql(contentFor("radio"));
        });
    
        it('returns a video featured content', async () => {
            const content = await hubContentFor(generateFeatureContentClientFor("moj_video_item"));
    
            expect(content).to.eql(contentFor("video"));
        });
    
        it('returns a pdf featured content', async () => {
            const content = await hubContentFor(generateFeatureContentClientFor("moj_pdf_item"));
    
            expect(content).to.eql(contentFor("pdf"));
        });
        it('returns a page featured content', async () => {
            const content = await hubContentFor(generateFeatureContentClientFor("page"));
    
            expect(content).to.eql(contentFor("page"));
        });
    });
});



function generateFeatureContentClientFor(contentType, stubResponse) {
    const httpClient = {
        get: sinon.stub().returns({
            "3546": {
                "nid": [
                    {
                        "value": 1
                    }
                ],
                "type": [
                    {
                        "target_id": contentType,
                    }
                ],
                "title": [
                    {
                        "value": "foo title"
                    }
                ],
                "field_moj_description": [
                    {
                        "value": "<p>foo description<p>\r\n",
                        "processed": "<p>foo description<p>",
                    }
                ],
                "field_moj_thumbnail_image": [
                    {
                        "alt": "Foo image alt text",
                        "url": "image.url.com"
                    }
                ],
    
            }
        })
    }

    return httpClient;
}



function featuredContentClient(response) {
    const httpClient = {
        get: () => httpClient,
        query: () => httpClient,
        then: () => new Promise((resolve, reject) => { 
            try {
                response();
                resolve(response())
            } catch (e) {
                reject(null)
            }
        }),
    }

    return httpClient;
}

function contentFor(contentType) {
    return [{
        id: 1,
        title: 'foo title',
        contentType: contentType,
        description: {
            raw: '<p>foo description<p>\r\n',
            sanitized:  '<p>foo description<p>'
        },
        image: {
            alt: 'Foo image alt text',
            url: 'image.url.com'
        }
    }]
}
