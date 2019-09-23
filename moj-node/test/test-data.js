const { format } = require('date-fns');

const nowDateString = format(new Date(), 'yyyy-MM-dd');
const getEventsForTodayData = [
  {
    title: 'single event morning',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `${nowDateString}T11:30:30`,
        endTime: `${nowDateString}T12:30:30`,
      },
    ],
    data: {
      morning: [
        {
          title: 'Some title',
          startTime: '11:30AM',
          endTime: '12:30PM',
          timeString: '11:30AM to 12:30PM',
        },
      ],
      afternoon: [],
      evening: [],
    },
  },
  {
    title: 'single event morning no end time',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `${nowDateString}T11:30:30`,
        endTime: '',
      },
    ],
    data: {
      morning: [
        {
          title: 'Some title',
          startTime: '11:30AM',
          endTime: '',
          timeString: '11:30AM',
        },
      ],
      afternoon: [],
      evening: [],
    },
  },
  {
    title: 'single event afternoon',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `${nowDateString}T12:30:30`,
        endTime: `${nowDateString}T13:30:30`,
      },
    ],
    data: {
      morning: [],
      afternoon: [
        {
          title: 'Some title',
          startTime: '12:30PM',
          endTime: '1:30PM',
          timeString: '12:30PM to 1:30PM',
        },
      ],
      evening: [],
    },
  },
  {
    title: 'single event afternoon no end time',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `${nowDateString}T12:30:30`,
        endTime: '',
      },
    ],
    data: {
      morning: [],
      afternoon: [
        {
          title: 'Some title',
          startTime: '12:30PM',
          endTime: '',
          timeString: '12:30PM',
        },
      ],
      evening: [],
    },
  },
  {
    title: 'single event evening',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `${nowDateString}T18:30:30`,
        endTime: `${nowDateString}T19:30:30`,
      },
    ],
    data: {
      morning: [],
      afternoon: [],
      evening: [
        {
          title: 'Some title',
          startTime: '6:30PM',
          endTime: '7:30PM',
          timeString: '6:30PM to 7:30PM',
        },
      ],
    },
  },
  {
    title: 'single event evening no end time',
    repo: [
      {
        eventSourceDesc: 'Some title',
        startTime: `${nowDateString}T18:30:30`,
        endTime: '',
      },
    ],
    data: {
      morning: [],
      afternoon: [],
      evening: [
        {
          title: 'Some title',
          startTime: '6:30PM',
          endTime: '',
          timeString: '6:30PM',
        },
      ],
    },
  },
];

module.exports = {
  getEventsForTodayData,
};
