module.exports = function createDemoDataService() {
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
          graphic: '/images/content-image.jpg'
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
          graphic: '/images/content-image.jpg'
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
          graphic: '/images/content-image.jpg'
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
          graphic: '/images/content-image.jpg'
        }
      }
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
          graphic: '/images/content-image.jpg'
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
          graphic: '/images/content-image.jpg'
        }
      }
    };
  }

  return {
    getInspirationData,
    getNewsEventsData,
  };
};
