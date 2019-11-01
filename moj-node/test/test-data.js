const { format } = require('date-fns');

const nowDateString = format(new Date(), 'yyyy-MM-dd');
const getEventsForTodayData = [
  {
    title: 'single appointment',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `${nowDateString}T11:30:30`,
        endTime: `${nowDateString}T12:30:30`,
        eventLocation: 'Some location',
        eventType: 'APP',
      },
    ],
    data: {
      todaysEvents: [
        {
          title: 'Some title',
          startTime: '11:30AM',
          endTime: '12:30PM',
          timeString: '11:30AM',
          location: 'Some location',
        },
      ],
      isTomorrow: false,
    },
  },
  {
    title: 'single appointment no end time',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `${nowDateString}T11:30:30`,
        endTime: '',
        eventLocation: 'Some location',
        eventType: 'APP',
      },
    ],
    data: {
      todaysEvents: [
        {
          title: 'Some title',
          startTime: '11:30AM',
          endTime: '',
          timeString: '11:30AM',
          location: 'Some location',
        },
      ],
      isTomorrow: false,
    },
  },
  {
    title: 'single visit',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `${nowDateString}T11:30:30`,
        endTime: `${nowDateString}T12:30:30`,
        eventLocation: 'Some location',
        eventType: 'VISIT',
      },
    ],
    data: {
      todaysEvents: [
        {
          title: 'Some title',
          startTime: '11:30AM',
          endTime: '12:30PM',
          timeString: '11:30AM',
          location: 'Some location',
        },
      ],
      isTomorrow: false,
    },
  },
  {
    title: 'single activity',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `${nowDateString}T11:30:30`,
        endTime: `${nowDateString}T12:30:30`,
        eventLocation: 'Some location',
        eventType: 'PRISON_ACT',
      },
    ],
    data: {
      todaysEvents: [],
      isTomorrow: false,
    },
  },
];
const getEventsForData = [
  {
    title: 'single appointment',
    startDate: '2011-01-01',
    endDate: '2011-01-02',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `2011-01-01T11:30:30`,
        endTime: `2011-01-01T12:30:30`,
        eventLocation: 'Some location',
        eventType: 'APP',
        paid: false,
        eventStatus: true,
      },
    ],
    data: {
      '2011-01-01': {
        morning: {
          events: [
            {
              description: 'Some title',
              startTime: '11:30AM',
              endTime: '12:30PM',
              timeString: '11:30AM - 12:30PM',
              location: 'Some location',
              eventType: 'APP',
              finished: true,
              paid: false,
              status: true,
            },
          ],
          finished: true,
        },
        afternoon: {
          events: [],
          finished: true,
        },
        evening: {
          events: [],
          finished: true,
        },
        title: 'Saturday 1 January',
      },
      '2011-01-02': {
        afternoon: {
          events: [],
          finished: true,
        },
        evening: {
          events: [],
          finished: true,
        },
        morning: {
          events: [],
          finished: true,
        },
        title: 'Sunday 2 January',
      },
    },
  },
  {
    title: 'single appointment no end time',
    startDate: '2011-01-01',
    endDate: '2011-01-02',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `2011-01-01T11:30:30`,
        endTime: '',
        eventLocation: 'Some location',
        eventType: 'APP',
        paid: false,
        eventStatus: true,
      },
    ],
    data: {
      '2011-01-01': {
        morning: {
          events: [
            {
              description: 'Some title',
              startTime: '11:30AM',
              endTime: '',
              timeString: '11:30AM',
              location: 'Some location',
              eventType: 'APP',
              finished: true,
              paid: false,
              status: true,
            },
          ],
          finished: true,
        },
        afternoon: {
          events: [],
          finished: true,
        },
        evening: {
          events: [],
          finished: true,
        },
        title: 'Saturday 1 January',
      },
      '2011-01-02': {
        morning: {
          events: [],
          finished: true,
        },
        afternoon: {
          events: [],
          finished: true,
        },
        evening: {
          events: [],
          finished: true,
        },
        title: 'Sunday 2 January',
      },
    },
  },
  {
    title: 'single visit',
    startDate: '2011-01-01',
    endDate: '2011-01-02',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `2011-01-01T11:30:30`,
        endTime: `2011-01-01T12:30:30`,
        eventLocation: 'Some location',
        eventType: 'VISIT',
        paid: false,
        eventStatus: true,
      },
    ],
    data: {
      '2011-01-01': {
        morning: {
          events: [
            {
              description: 'Some title',
              startTime: '11:30AM',
              endTime: '12:30PM',
              timeString: '11:30AM - 12:30PM',
              location: 'Some location',
              eventType: 'VISIT',
              paid: false,
              status: true,
              finished: true,
            },
          ],
          finished: true,
        },
        afternoon: {
          events: [],
          finished: true,
        },
        evening: {
          events: [],
          finished: true,
        },
        title: 'Saturday 1 January',
      },
      '2011-01-02': {
        morning: {
          events: [],
          finished: true,
        },
        afternoon: {
          events: [],
          finished: true,
        },
        evening: {
          events: [],
          finished: true,
        },
        title: 'Sunday 2 January',
      },
    },
  },
  {
    title: 'single activity',
    startDate: '2011-01-01',
    endDate: '2011-01-02',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `2011-01-01T11:30:30`,
        endTime: `2011-01-01T12:30:30`,
        eventLocation: 'Some location',
        eventType: 'PRISON_ACT',
        paid: false,
        eventStatus: true,
      },
    ],
    data: {
      '2011-01-01': {
        morning: {
          events: [
            {
              description: 'Some title',
              startTime: '11:30AM',
              endTime: '12:30PM',
              timeString: '11:30AM - 12:30PM',
              location: 'Some location',
              eventType: 'PRISON_ACT',
              paid: false,
              status: true,
              finished: true,
            },
          ],
          finished: true,
        },
        afternoon: {
          events: [],
          finished: true,
        },
        evening: {
          events: [],
          finished: true,
        },
        title: 'Saturday 1 January',
      },
      '2011-01-02': {
        morning: {
          events: [],
          finished: true,
        },
        afternoon: {
          events: [],
          finished: true,
        },
        evening: {
          events: [],
          finished: true,
        },
        title: 'Sunday 2 January',
      },
    },
  },
  {
    title: 'multiple activities',
    startDate: '2011-01-01',
    endDate: '2011-01-02',
    repo: [
      {
        eventSourceDesc: 'Some title 1',
        startTime: `2011-01-01T11:30:30`,
        endTime: `2011-01-01T12:30:30`,
        eventLocation: 'Some location 1',
        eventType: 'PRISON_ACT',
        paid: false,
        eventStatus: true,
      },
      {
        eventSourceDesc: 'Some title 2',
        startTime: `2011-01-01T12:30:30`,
        endTime: `2011-01-01T13:30:30`,
        eventLocation: 'Some location 2',
        eventType: 'VISIT',
        paid: false,
        eventStatus: true,
      },
    ],
    data: {
      '2011-01-01': {
        morning: {
          events: [
            {
              description: 'Some title 1',
              startTime: '11:30AM',
              endTime: '12:30PM',
              timeString: '11:30AM - 12:30PM',
              location: 'Some location 1',
              eventType: 'PRISON_ACT',
              paid: false,
              status: true,
              finished: true,
            },
          ],
          finished: true,
        },
        afternoon: {
          events: [
            {
              description: 'Some title 2',
              startTime: '12:30PM',
              endTime: '1:30PM',
              timeString: '12:30PM - 1:30PM',
              location: 'Some location 2',
              eventType: 'VISIT',
              paid: false,
              status: true,
              finished: true,
            },
          ],
          finished: true,
        },
        evening: {
          events: [],
          finished: true,
        },
        title: 'Saturday 1 January',
      },
      '2011-01-02': {
        morning: {
          events: [],
          finished: true,
        },
        afternoon: {
          events: [],
          finished: true,
        },
        evening: {
          events: [],
          finished: true,
        },
        title: 'Sunday 2 January',
      },
    },
  },
];

module.exports = {
  getEventsForTodayData,
  getEventsForData,
};
