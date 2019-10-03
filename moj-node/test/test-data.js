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

module.exports = {
  getEventsForTodayData,
};
