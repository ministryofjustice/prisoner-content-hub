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
    data: [
      {
        title: 'Some title',
        startTime: '11:30AM',
        endTime: '12:30PM',
        timeString: '11:30AM',
        location: 'Some location',
      },
    ],
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
    data: [
      {
        title: 'Some title',
        startTime: '11:30AM',
        endTime: '',
        timeString: '11:30AM',
        location: 'Some location',
      },
    ],
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
    data: [
      {
        title: 'Some title',
        startTime: '11:30AM',
        endTime: '12:30PM',
        timeString: '11:30AM',
        location: 'Some location',
      },
    ],
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
    data: [],
  },
];
const getEventsForData = [
  {
    title: 'single appointment',
    startDate: nowDateString,
    endDate: nowDateString,
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
      morning: [
        {
          title: 'Some title',
          startTime: '11:30AM',
          endTime: '12:30PM',
          timeString: '11:30AM',
          location: 'Some location',
          eventType: 'APP',
        },
      ],
      afternoon: [],
      evening: [],
    },
  },
  {
    title: 'single appointment no end time',
    startDate: nowDateString,
    endDate: nowDateString,
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
      morning: [
        {
          title: 'Some title',
          startTime: '11:30AM',
          endTime: '',
          timeString: '11:30AM',
          location: 'Some location',
          eventType: 'APP',
        },
      ],
      afternoon: [],
      evening: [],
    },
  },
  {
    title: 'single visit',
    startDate: nowDateString,
    endDate: nowDateString,
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
      morning: [
        {
          title: 'Some title',
          startTime: '11:30AM',
          endTime: '12:30PM',
          timeString: '11:30AM',
          location: 'Some location',
          eventType: 'VISIT',
        },
      ],
      afternoon: [],
      evening: [],
    },
  },
  {
    title: 'single activity',
    startDate: nowDateString,
    endDate: nowDateString,
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
      morning: [
        {
          title: 'Some title',
          startTime: '11:30AM',
          endTime: '12:30PM',
          timeString: '11:30AM',
          location: 'Some location',
          eventType: 'PRISON_ACT',
        },
      ],
      afternoon: [],
      evening: [],
    },
  },
  {
    title: 'multiple activities',
    startDate: nowDateString,
    endDate: nowDateString,
    repo: [
      {
        eventSourceDesc: 'Some title 1',
        startTime: `${nowDateString}T11:30:30`,
        endTime: `${nowDateString}T12:30:30`,
        eventLocation: 'Some location 1',
        eventType: 'PRISON_ACT',
      },
      {
        eventSourceDesc: 'Some title 2',
        startTime: `${nowDateString}T12:30:30`,
        endTime: `${nowDateString}T13:30:30`,
        eventLocation: 'Some location 2',
        eventType: 'VISIT',
      },
    ],
    data: {
      morning: [
        {
          title: 'Some title 1',
          startTime: '11:30AM',
          endTime: '12:30PM',
          timeString: '11:30AM',
          location: 'Some location 1',
          eventType: 'PRISON_ACT',
        },
      ],
      afternoon: [
        {
          title: 'Some title 2',
          startTime: '12:30PM',
          endTime: '1:30PM',
          timeString: '12:30PM',
          location: 'Some location 2',
          eventType: 'VISIT',
        },
      ],
      evening: [],
    },
  },
];

module.exports = {
  getEventsForTodayData,
  getEventsForData,
};
