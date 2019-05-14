const hubContentRepository = require('../../server/repositories/hubContent');

describe('hubContentRepository', () => {
  describe('#contentFor', () => {
    it('returns null if no id is passed', async () => {
      const client = generateClient({ response: 'data' });
      const repository = hubContentRepository(client);
      const result = await repository.contentFor();

      expect(client.get.callCount).to.equal(0);
      expect(result).to.equal(null);
    });

    it('returns content for a given id', async () => {
      const client = generateClient({ content_type: 'moj_video_item' });
      const repository = hubContentRepository(client);

      const result = await repository.contentFor('id');

      expect(client.get.callCount).to.equal(1);
      expect(client.get.lastCall.args[0]).to.include('id');

      const expectedKeys = [
        'id',
        'title',
        'description',
        'contentType',
        'media',
        'duration',
        'episode',
        'season',
        'seriesId',
        'image',
        'tagsId',
        'establishmentId',
        'contentUrl',
      ];
      const keys = Object.keys(result);

      expectedKeys.forEach(key => {
        expect(keys).to.include(key);
      });
    });
  });

  describe('#termFor', () => {
    it('returns null if no id is passed', async () => {
      const client = generateClient({ response: 'data' });
      const repository = hubContentRepository(client);
      const result = await repository.termFor();

      expect(client.get.callCount).to.equal(0);
      expect(result).to.equal(null);
    });
    it('returns terms data for a given id', async () => {
      const client = generateClient({});
      const repository = hubContentRepository(client);
      const result = await repository.termFor('id');

      const expectedKeys = [
        'id',
        'contentType',
        'name',
        'description',
        'image',
        'video',
        'audio',
      ];
      const keys = Object.keys(result);

      expect(client.get.lastCall.args[0]).to.include('id');
      expectedKeys.forEach(key => {
        expect(keys).to.include(key);
      });
    });
  });

  describe('#seasonFor', () => {
    it('returns null if no id is passed', async () => {
      const client = generateClient({ response: 'data' });
      const repository = hubContentRepository(client);
      const result = await repository.seasonFor();

      expect(client.get.callCount).to.equal(0);
      expect(result).to.equal(null);
    });
    it('returns formated data for a season', async () => {
      const client = generateClient([
        { content_type: 'moj_video_item' },
        { content_type: 'moj_radio_item' },
      ]);
      const repository = hubContentRepository(client);
      const result = await repository.seasonFor({
        id: 'id',
        establishmentId: 'fooPrisonID',
      });
      const requestQueryString = JSON.stringify(client.get.lastCall.args[1]);

      expect(client.get.lastCall.args[0]).to.include('id');
      expect(requestQueryString).to.include('fooPrisonID');

      expect(result.length).to.equal(2);
    });
  });

  describe('#nextEpisodesFor', () => {
    it('returns null if no id is passed', async () => {
      const client = generateClient({ response: 'data' });
      const repository = hubContentRepository(client);
      const result = await repository.nextEpisodesFor();

      expect(client.get.callCount).to.equal(0);
      expect(result).to.equal(null);
    });
    it('returns the next (n) episodes in the series', async () => {
      const client = generateClient([
        { content_type: 'moj_video_item' },
        { content_type: 'moj_radio_item' },
      ]);
      const repository = hubContentRepository(client);
      const result = await repository.nextEpisodesFor({
        id: 'id',
        episodeId: 'fooEpisodeId',
        establishmentId: 'fooPrisonID',
      });
      const requestQueryString = JSON.stringify(client.get.lastCall.args[1]);

      expect(client.get.lastCall.args[0]).to.include('id');

      expect(requestQueryString).to.include('fooEpisodeId');
      expect(requestQueryString).to.include('fooPrisonID');

      expect(result.length).to.equal(2);
    });
  });

  describe('#relatedContentFor', () => {
    it('returns null if no id is passed', async () => {
      const client = generateClient({ response: 'data' });
      const repository = hubContentRepository(client);
      const result = await repository.relatedContentFor();

      expect(client.get.callCount).to.equal(0);
      expect(result).to.equal(null);
    });
    it('returns formated data for related content', async () => {
      const client = generateClient([
        { content_type: 'moj_radio_item' },
        { content_type: 'moj_radio_item' },
      ]);
      const repository = hubContentRepository(client);

      const result = await repository.relatedContentFor({
        id: 'id',
        establishmentId: 'fooBarQuery',
      });

      const requestQueryString = JSON.stringify(client.get.lastCall.args[1]);

      const expectedKeys = [
        'id',
        'title',
        'contentType',
        'summary',
        'image',
        'duration',
        'contentUrl',
      ];

      expect(requestQueryString).to.include('id');
      expect(requestQueryString).to.include('fooBarQuery');

      expect(result.length).to.equal(2);

      const keys = Object.keys(result[0]);
      expectedKeys.forEach(key => {
        expect(keys).to.include(key);
      });
    });
  });

  describe('#menuFor', () => {
    it('returns null if no id is passed', async () => {
      const client = generateClient({ response: 'data' });
      const repository = hubContentRepository(client);
      const result = await repository.menuFor();

      expect(client.get.callCount).to.equal(0);
      expect(result).to.equal(null);
    });
    it('returns formated menu for a given category id', async () => {
      const client = generateClient([
        { title: 'Foo', link: 'www.foo.com', id: '1' },
        { title: 'Bar', link: 'www.bar.com', id: '2' },
      ]);
      const repository = hubContentRepository(client);
      const content = await repository.menuFor('id');

      const expected = [
        { linkText: 'Foo', href: '/content/1', id: '1' },
        { linkText: 'Bar', href: '/content/2', id: '2' },
      ];

      expect(content).to.eql(expected);
      expect(JSON.stringify(client.get.lastCall.args[1])).to.eql(
        JSON.stringify({ _parent: 'id', _menu: 'main' }),
      );
    });
  });
});

function generateClient(response) {
  const httpClient = {
    get: sinon.stub().returns(response),
  };

  return httpClient;
}
