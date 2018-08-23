const createHubPromotedContentService = require('../../server/services/hubPromotedContent');

const promotedContentService = createHubPromotedContentService();

describe('Hub promoted content', () => {

    describe('#hubPromotedContent', () => {
        
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
                "field_moj_duration": [
                    {
                        "value": "40:00"
                    }
                ],
            }
        };

        const noContentResponse = {
            "message": "No promoted content found"
        }

        it('return promoted content', async () => {
            const stub = sinon.stub().returns(contentResponse);
            const response = await promotedContentService.hubPromotedContent(promotedContentClient(stub));
            expect(response).to.eql(contentFor("page"));
        });

        context("when promoted content is missing", () => {
            it("returns an empty null for the missing content", async () => {
                const expectedResult = null
                const stub = sinon.stub().returns(noContentResponse);
                const response = await promotedContentService.hubPromotedContent(promotedContentClient(stub));

                expect(response).to.eql(expectedResult);

            });
        })
    });
    describe('#hubPromotedFor', () => {
        it('returns a radio promoted content', async () => {
            const content = await promotedContentService.hubContentPromotedFor(generateFeatureContentClientFor("moj_radio_item"));
    
            expect(content).to.eql(contentFor("radio"));
        });
    
        it('returns a video promoted content', async () => {
            const content = await promotedContentService.hubContentPromotedFor(generateFeatureContentClientFor("moj_video_item"));
    
            expect(content).to.eql(contentFor("video"));
        });
    
        it('returns a pdf promoted content', async () => {
            const content = await promotedContentService.hubContentPromotedFor(generateFeatureContentClientFor("moj_pdf_item"));
    
            expect(content).to.eql(contentFor("pdf"));
        });
        it('returns a page promoted content', async () => {
            const content = await promotedContentService.hubContentPromotedFor(generateFeatureContentClientFor("page"));
    
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
                "field_moj_duration": [
                    {
                        "value": "40:00"
                    }
                ],
            }
        })
    }

    return httpClient;
}

function promotedContentClient(response) {
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
            sanitized:  'foo description...'
        },
        image: {
            alt: 'Foo image alt text',
            url: 'image.url.com'
        },
        duration: '40:00'
    }]
}
