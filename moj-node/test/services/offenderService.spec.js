const {
  createNomisOffenderService,
} = require('../../server/services/offender');
const { getEventsForTodayData, getEventsForData } = require('../test-data');

describe('Offender Service', () => {
  describe('getOffenderDetailsFor', () => {
    it('returns offender data', async () => {
      const repository = {
        getOffenderDetailsFor: sinon.stub().returns({
          bookingId: 1013376,
          offenderNo: 'G0653GG',
          firstName: 'CUDMASTARIE',
          middleName: 'JAYMORES',
          lastName: 'AARELL',
        }),
      };
      const service = createNomisOffenderService(repository);
      const data = await service.getOffenderDetailsFor('FOO_ID');

      expect(repository.getOffenderDetailsFor.lastCall.args[0]).to.equal(
        'FOO_ID',
      );
      expect(data).to.eql({
        name: 'Cudmastarie Aarell',
        bookingId: 1013376,
        offenderNo: 'G0653GG',
      });
    });
  });

  describe('getIEPSummaryFor', () => {
    it('returns IEP data', async () => {
      const clock = sinon.useFakeTimers({
        now: 1559343600000, // 01 Jun 2019 00:00
      });
      const repository = {
        getIEPSummaryFor: sinon.stub().returns({
          iepLevel: 'POTANUS',
          iepDate: '2019-06-17T06:00:00.000Z',
          lastName: 'AARELL',
        }),
      };

      const service = createNomisOffenderService(repository);
      const data = await service.getIEPSummaryFor('FOO_ID');

      expect(repository.getIEPSummaryFor.lastCall.args[0]).to.equal('FOO_ID');
      expect(data).to.eql({
        reviewDate: 'Tuesday 17 September',
        iepLevel: 'POTANUS',
        daysSinceReview: '16 days',
      });

      clock.restore();
    });
  });

  describe('getBalancesFor', () => {
    it('returns balance data', async () => {
      const repository = {
        getBalancesFor: sinon.stub().returns({
          spends: '100',
          cash: '100',
          savings: '0',
          currency: 'GBP',
        }),
        getPhoneCreditFor: sinon.stub().returns('0'),
      };
      const service = createNomisOffenderService(repository);
      const data = await service.getBalancesFor('FOO_ID');

      expect(repository.getBalancesFor.lastCall.args[0]).to.equal('FOO_ID');
      expect(data).to.eql({
        spends: '£100.00',
        cash: '£100.00',
        savings: '£0.00',
        currency: 'GBP',
        phone: '£0.00',
      });
    });
  });

  describe('getKeyWorkerFor', () => {
    it('returns keyworker data', async () => {
      const repository = {
        getKeyWorkerFor: sinon.stub().returns({
          firstName: 'CUDMASTARIE',
          lastName: 'JAYMORES',
        }),
      };
      const service = createNomisOffenderService(repository);
      const data = await service.getKeyWorkerFor('FOO_ID');

      expect(repository.getKeyWorkerFor.lastCall.args[0]).to.equal('FOO_ID');
      expect(data).to.eql({
        current: 'Cudmastarie Jaymores',
        lastMeeting: 'Unavailable',
      });
    });
  });

  describe('getVisitsFor', () => {
    it('returns visits data', async () => {
      const repository = {
        getLastVisitFor: sinon.stub().returns({
          startTime: '2014-02-11T11:30:30',
          visitTypeDescription: '',
          leadVisitor: '',
        }),
        getNextVisitFor: sinon.stub().returns({
          startTime: '2019-12-07T11:30:30',
          visitTypeDescription: '',
          leadVisitor: '',
          eventStatus: 'SCH',
        }),
        getVisitsFor: sinon.stub().returns([]),
      };
      const service = createNomisOffenderService(repository);
      const data = await service.getVisitsFor('FOO_ID');

      expect(repository.getNextVisitFor.lastCall.args[0]).to.equal('FOO_ID');

      expect(data).to.eql({
        nextVisit: 'Saturday 07 December 2019',
        nextVisitDate: '7 December',
        nextVisitDay: 'Saturday',
        visitType: '',
        visitorName: '',
      });
    });
  });

  describe('getImportantDatesFor', () => {
    it('returns visits', async () => {
      const repository = {
        sentenceDetailsFor: sinon.stub().returns({
          homeDetentionCurfewEligibilityDate: '2014-02-11T11:30:30',
          conditionalReleaseDate: '2019-04-07T11:30:30',
          licenceExpiryDate: '2019-05-07T11:30:30',
        }),
      };
      const service = createNomisOffenderService(repository);
      const data = await service.getImportantDatesFor('FOO_ID');

      expect(repository.sentenceDetailsFor.lastCall.args[0]).to.equal('FOO_ID');

      expect(data).to.eql({
        reCategorisationDate: 'Unavailable',
        hdcEligibilityDate: 'Tuesday 11 February 2014',
        conditionalReleaseDate: 'Sunday 07 April 2019',
        licenceExpiryDate: 'Tuesday 07 May 2019',
      });
    });
  });

  describe('getEventsForToday', () => {
    it('should call the repository service with the correct bookingId', async () => {
      const repository = {
        getEventsForToday: sinon.stub().returns({
          todaysEvents: [
            {
              eventSourceDesc: 'Some title',
              startTime: '2019-04-07T11:30:30',
              endTime: '2019-04-07T12:30:30',
              eventLocation: 'Some location',
              eventType: 'APP',
            },
          ],
          isTomorrow: false,
        }),
      };
      const service = createNomisOffenderService(repository);
      await service.getEventsForToday('FOO_ID');

      expect(repository.getEventsForToday.lastCall.args[0]).to.equal('FOO_ID');
    });

    getEventsForTodayData.forEach(singleTestData => {
      it(`should return events for ${singleTestData.title}`, async () => {
        const repository = {
          getEventsForToday: sinon.stub().returns(singleTestData.repo),
        };
        const service = createNomisOffenderService(repository);
        const data = await service.getEventsForToday('FOO_ID');

        expect(data).to.eql(singleTestData.data);
      });
    });
  });

  describe('getEventsFor', () => {
    it('should call the repository service with the correct bookingId', async () => {
      const repository = {
        getEventsFor: sinon.stub().returns([
          {
            eventSourceDesc: 'Some title',
            startTime: '2019-04-07T11:30:30',
            endTime: '2019-04-07T12:30:30',
            eventLocation: 'Some location',
            eventType: 'APP',
          },
        ]),
      };
      const service = createNomisOffenderService(repository);
      await service.getEventsFor('FOO_ID', '2019-03-07', '2019-04-07');

      expect(repository.getEventsFor.lastCall.args[0]).to.equal('FOO_ID');
    });

    getEventsForData.forEach(({ title, startDate, endDate, repo, data }) => {
      it(`should return events for ${title}`, async () => {
        const repository = {
          getEventsFor: sinon.stub().returns(repo),
        };
        const service = createNomisOffenderService(repository);
        const serviceData = await service.getEventsFor(
          'FOO_ID',
          startDate,
          endDate,
        );
        expect(serviceData).to.eql(data);
      });
    });
  });
});
