module.exports = function createDemoDataService() {
  function getPromotalContentData() {
    return {
      title: 'New job, new opportunity',
      description: 'Check out all the current Berwyn vacancies, and how to apply.',
      linktext: 'Read more',
      linkurl: '/flat-content',
      graphic: '/images/new-job-new-opportunity.jpg',
    };
  }

  function getSubMenuData() {
    return {
      items: {
        item1: {
          linktext: 'Life at Berwyn',
          linkurl: '#',
        },
        item2: {
          linktext: 'Your Progress',
          linkurl: '#',
        },
        item3: {
          linktext: 'Useful contacts',
          linkurl: '#',
        },
        item4: {
          linktext: 'Induction',
          linkurl: '#',
        },
        item5: {
          linktext: 'Education',
          linkurl: '#',
        },
        item6: {
          linktext: 'Getting out',
          linkurl: '#',
        },
      },
    };
  }

  function getGamesData() {
    return {
      number: 3,
      category_title: 'Games',
      category_link: '#',
      items: {
        item1: {
          title: 'Hello world',
          description: 'Here is a short description',
          size: 'medium',
          grid: 'govuk-grid-column-one-third',
          type: 'inspiration',
          icon: 'icon-game',
          linkclass: 'icon-link',
          linktext: 'Play',
          graphic: '/images/content-image.jpg',
        },
        item2: {
          title: 'Hello People',
          description: 'Here is a shorter description',
          size: 'medium',
          grid: 'govuk-grid-column-one-third',
          type: 'inspiration',
          icon: 'icon-document',
          linkclass: 'icon-play',
          linktext: 'Listen',
          graphic: '/images/content-image.jpg',
        },
        item3: {
          title: 'Hello Cats',
          description: 'Here is a Long description',
          size: 'medium',
          grid: 'govuk-grid-column-one-third',
          type: 'inspiration',
          icon: 'icon-movie',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/content-image.jpg',
        },
      },
    };
  }

  function getInspirationData() {
    return {
      number: 4,
      category_title: 'Inspiration',
      category_link: '#',
      items: {
        item1: {
          title: 'Hello world',
          description: 'Here is a short description',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'inspiration',
          icon: 'icon-game',
          linkclass: 'icon-link',
          linktext: 'Play',
          graphic: '/images/content-image.jpg',
        },
        item2: {
          title: 'Hello People',
          description: 'Here is a shorter description',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'inspiration',
          icon: 'icon-document',
          linkclass: 'icon-play',
          linktext: 'Listen',
          graphic: '/images/content-image.jpg',
        },
        item3: {
          title: 'Hello Cats',
          description: 'Here is a Long description',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'inspiration',
          icon: 'icon-movie',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/content-image.jpg',
        },
        item4: {
          title: 'Hello Dogs',
          description: 'Here is a description',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'inspiration',
          icon: 'icon-music',
          linkclass: 'icon-play',
          linktext: 'Play',
          graphic: '/images/content-image.jpg',
        },
      },
    };
  }

  function getNewsEventsData() {
    return {
      number: 2,
      category_title: 'News and Events',
      category_link: '#',
      items: {
        item1: {
          title: 'National Prison Radio: Now live on your TV',
          description: 'Check out channel XX to listen.',
          size: 'large',
          grid: 'govuk-grid-column-one-half',
          type: 'news-events',
          icon: 'icon-game',
          linkclass: 'icon-link',
          linktext: 'Find out more and see the schedule',
          graphic: '/images/new-job-new-opportunity.jpg',
          link: '#',
        },
        item2: {
          title: 'New clothing policy',
          description: 'There’s been an update to our clothing policy.',
          size: 'large',
          grid: 'govuk-grid-column-one-half',
          type: 'news-events',
          icon: 'icon-document',
          linkclass: 'icon-play',
          linktext: 'Find out what it means for you',
          graphic: '/images/new-clothing-policy.jpg',
          link: '#',
        },
      },
    };
  }

  function geSeriesData() {
    const items = [...Array(40)].reduce((acc, cur, index) => ({
      ...acc,
      [`item${index}`]: {
        linktext: `Sample link ${index}`,
        linkurl: '#',
      },
    }), {});

    return { items };
  }

  return {
    getPromotalContentData,
    getSubMenuData,
    getGamesData,
    getInspirationData,
    getNewsEventsData,
    geSeriesData,
  };
};
