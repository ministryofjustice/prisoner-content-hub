const nock = require('nock');
const fromHTML = require('from-html/lib/from-html.js');
const relatedContentLoader = require('../../assets/javascript/relatedContentLoader.js');
const MutationObserver = require('mutation-observer');

const { loader } = fromHTML(`
  <div ref="container">
    <span class="ajax-loader" ref="loader" hidden>
  </div>
`);

describe('relatedContentLoader', () => {
  describe('on Initialization', () => {
    let scope;
    beforeEach(() => {
      scope = nock(/example\.org/)
        .get(/server/)
        .reply(200, [{ contentType: 'radio' }]);
    });

    it('calls the onUpdate method on initialization', function(done) {
      this.timeout(500);

      relatedContentLoader({
        loader,
        endpointUrl: '/server?test=1',
        initialOffset: 8,
        perPage: 8,
        onUpdate: () => {
          expect(true).to.be.equal(
            true,
            'The on update method was not called on initialization',
          );
          done();
        },
      });
    });

    it('displays the loader on initialization', function(done) {
      this.timeout(500);

      const spy = sinon.spy();
      const config = {
        attributes: true,
        childList: false,
        subtree: false,
      };
      const callBack = ([mutation]) => {
        spy(mutation.target.cloneNode());
      };

      const observer = new MutationObserver(callBack);
      observer.observe(loader, config);

      expect(loader.hidden).to.equal(true);

      relatedContentLoader({
        loader,
        endpointUrl: '/server?test=1',
        initialOffset: 8,
        perPage: 8,
        onUpdate: () => {
          // set timeout hack because it's the only way to have the these running on the next tick
          setTimeout(() => {
            try {
              expect(spy.callCount).to.equal(2);

              const mutation1Element = spy.firstCall.args[0];
              const mutation2Element = spy.secondCall.args[0];

              expect(mutation1Element.hidden).to.equal(
                false,
                'The loader should have been become visible at some point',
              );
              expect(mutation2Element.hidden).to.equal(
                true,
                'The loader should have become hidden after becoming visible',
              );

              done();
            } catch (exp) {
              done(exp);
            } finally {
              observer.disconnect();
            }
          }, 1);
        },
      });
    });

    it('provides data on update', function(done) {
      this.timeout(500);

      relatedContentLoader({
        loader,
        endpointUrl: '/server?test=1',
        initialOffset: 1,
        perPage: 1,
        onUpdate: data => {
          try {
            expect(data).to.be.eql(
              [
                {
                  contentType: 'radio',
                  iconType: 'icon-music',
                  linkIcon: 'icon-play',
                  linkText: 'Listen',
                },
              ],
              'data was not provided on update',
            );
            done();
          } catch (exp) {
            done(exp);
          }
        },
      });
    });
  });
});
