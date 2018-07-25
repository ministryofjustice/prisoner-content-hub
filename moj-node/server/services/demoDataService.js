module.exports = function createDemoDataService() {
  function getPromotalContentData() {
    return {
      title: 'Headline for the main feature to promote',
      description: 'A brief description about the feature to give a bit more detail about what it is about',
      linktext: 'Read more',
      linkurl: '#',
      graphic: '/images/featured-image.jpg',
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
          linktext: 'Useful contents',
          linkurl: '#',
        },
        item4: {
          linktext: 'Induction',
          linkurl: '#',
        },
        item5: {
          linktext: 'Eduction',
          linkurl: '#',
        },
        item6: {
          linktext: 'Getting out',
          linkurl: '#',
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
          title: 'Hello world',
          description: 'Here is a short description',
          size: 'large',
          grid: 'govuk-grid-column-one-half',
          type: 'news-events',
          icon: 'icon-game',
          linkclass: 'icon-link',
          linktext: 'Play',
          graphic: '/images/content-image.jpg',
        },
        item2: {
          title: 'Hello People',
          description: 'Here is a shorter description',
          size: 'large',
          grid: 'govuk-grid-column-one-half',
          type: 'news-events',
          icon: 'icon-document',
          linkclass: 'icon-play',
          linktext: 'Listen',
          graphic: '/images/content-image.jpg',
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
    getInspirationData,
    getNewsEventsData,
    geSeriesData,
  };
};
