const { format } = require('date-fns');

const nowDateString = format(new Date(), 'YYYY-MM-DD');
const getActivitiesForTodayData = [
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
          startTime: '11:30am',
          endTime: '12:30pm',
          timeString: '11:30am to 12:30pm',
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
          startTime: '11:30am',
          endTime: '',
          timeString: '11:30am',
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
          startTime: '12:30pm',
          endTime: '1:30pm',
          timeString: '12:30pm to 1:30pm',
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
          startTime: '12:30pm',
          endTime: '',
          timeString: '12:30pm',
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
          startTime: '6:30pm',
          endTime: '7:30pm',
          timeString: '6:30pm to 7:30pm',
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
          startTime: '6:30pm',
          endTime: '',
          timeString: '6:30pm',
        },
      ],
    },
  },
];

module.exports = {
  getActivitiesForTodayData,
};
