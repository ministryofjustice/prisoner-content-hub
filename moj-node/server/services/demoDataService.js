module.exports = function createDemoDataService() {
  function getPromotalContentData() {
    return {
      title: 'New job, new opportunity',
      description: 'Check out all the current Berwyn vacancies, and how to apply.',
      linktext: 'Read more',
      linkurl: '/content/job-vacancies',
      graphic: '/images/new-job-new-opportunity.jpg',
    };
  }

  function getSubMenuData() {
    return {
      menuColour: 'blue',
      items: {
        item1: {
          linktext: 'Life at Berwyn',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-third',
        },
        item2: {
          linktext: 'Your progress',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-third',
        },
        item3: {
          linktext: 'Useful contacts',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-third',
        },
        item4: {
          linktext: 'Induction',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-third',
        },
        item5: {
          linktext: 'Education',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-third',
        },
        item6: {
          linktext: 'Getting out',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-third',
        },
      },
    };
  }

  function getLandingPageSubMenuData() {
    return {
      menuColour: 'white',
      items: {
        item1: {
          linktext: 'Life at Berwyn',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-quarter',
        },
        item2: {
          linktext: 'Your progress',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-quarter',
        },
        item3: {
          linktext: 'Useful contacts',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-quarter',
        },
        item4: {
          linktext: 'Induction',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-quarter',
        },
        item5: {
          linktext: 'Education',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-quarter',
        },
        item6: {
          linktext: 'Getting out',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-quarter',
        },
        item7: {
          linktext: 'Life at Berwyn',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-quarter',
        },
        item8: {
          linktext: 'Your progress',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-quarter',
        },
        item9: {
          linktext: 'Useful contacts',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-quarter',
        },
        item10: {
          linktext: 'Induction',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-quarter',
        },
        item11: {
          linktext: 'Education',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-quarter',
        },
        item12: {
          linktext: 'Getting out',
          linkurl: '#',
          columnClass: 'govuk-grid-column-one-quarter',
        },
      },
    };
  }

  function getNewsEventsData() {
    return {
      number: 2,
      category_title: 'News and events',
      category_link: '#',
      items: {
        item1: {
          title: 'National Prison Radio: Now live on your TV',
          description: 'Check out channel 84 to listen.',
          size: 'large',
          grid: 'govuk-grid-column-one-half',
          type: 'news-events',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Find out more and see the schedule',
          graphic: '/images/national-prison-radio.jpg',
          link: '/content/national-prison-radio',
          duration: '10 mins',
        },
        item2: {
          title: 'New clothing policy',
          description: 'There’s been an update to our clothing policy.',
          size: 'large',
          grid: 'govuk-grid-column-one-half',
          type: 'news-events',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Find out what it means for you',
          graphic: '/images/new-clothing-policy.jpg',
          link: '/content/new-clothing-policy',
          duration: '10 mins',
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
          title: 'Chess',
          description: 'The ultimate game of strategy. From beginner to advanced.',
          size: 'medium',
          grid: 'govuk-grid-column-one-third',
          type: 'games',
          icon: 'icon-game',
          linkclass: 'icon-link',
          linktext: 'Play',
          graphic: '/images/chess.jpg',
          duration: '10 mins',
        },
        item2: {
          title: 'Sudoku',
          description: 'Counting from 1 to 9 has never been so much fun.',
          size: 'medium',
          grid: 'govuk-grid-column-one-third',
          type: 'games',
          icon: 'icon-game',
          linkclass: 'icon-link',
          linktext: 'Listen',
          graphic: '/images/sudoku.jpg',
        },
        item3: {
          title: 'Neontroids',
          description: 'The Hub’s intergalactic shoot ’em up that’s out of this world!',
          size: 'medium',
          grid: 'govuk-grid-column-one-third',
          type: 'games',
          icon: 'icon-game',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/neontroids.jpg',
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
          title: 'Restorative justice',
          description: 'When a violent burglar met his victim.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'inspiration',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/restorative-justice.jpg',
        },
        item2: {
          title: 'Jack’s feature',
          description: 'Long-term prisoner, Jack Murton on life on the outside.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'inspiration',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/jacks-feature.jpg',
        },
        item3: {
          title: 'The danger of silence',
          description: 'Finding the courage to speak up against ignorance and injustice.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'inspiration',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/the-danger-of-silence.jpg',
        },
        item4: {
          title: 'The habits of happiness',
          description: 'Training our minds in fulfilment and wellbeing.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'inspiration',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/the-habits-of-happiness.jpg',
        },
      },
    };
  }

  function getRadioPodcastsData() {
    return {
      number: 4,
      category_title: 'Radio shows and podcasts',
      category_link: '#',
      items: {
        item1: {
          title: 'Sex talk',
          description: 'Let’s talk about sex. Seasons 1 and 2 now available.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'radio-podcasts',
          icon: 'icon-music',
          linkclass: 'icon-link',
          linktext: 'Listen',
          graphic: '/images/sex-talk.jpg',
        },
        item2: {
          title: 'Bob and beyond',
          description: 'A solid hour of reggae classics.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'radio-podcasts',
          icon: 'icon-music',
          linkclass: 'icon-link',
          linktext: 'Listen',
          graphic: '/images/bob-and-beyond.jpg',
        },
        item3: {
          title: 'Outside in',
          description: 'Helping you think through issues for release',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'radio-podcasts',
          icon: 'icon-music',
          linkclass: 'icon-link',
          linktext: 'Listen',
          graphic: '/images/outside-in.jpg',
        },
        item4: {
          title: 'NPR Friday',
          description: 'The best way to start your weekend.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'radio-podcasts',
          icon: 'icon-music',
          linkclass: 'icon-link',
          linktext: 'Listen',
          graphic: '/images/npr-friday.jpg',
        },
      },
    };
  }

  function getHealthyMindBodyData() {
    return {
      number: 4,
      category_title: 'Healthy mind and body',
      category_link: '#',
      items: {
        item1: {
          title: 'Yoga',
          description: 'The perfect exercise for bang up.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'healthy-mind-body',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/yoga.jpg',
        },
        item2: {
          title: 'How to make stress your friend',
          description: 'Finding the positives in stress.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'healthy-mind-body',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/how-to-make-stress-your-friend.jpg',
        },
        item3: {
          title: 'Berwyn gym',
          description: 'Opening times and how to get access.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'healthy-mind-body',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/gym.jpg',
        },
        item4: {
          title: 'What hallucinations reveal about our minds',
          description: 'Neurologist Oliver Sacks talks about hallucinations experienced by visually impaired people.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'healthy-mind-body',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/hallucinations-reveal-about-our-minds.jpg',
        },
      },
    };
  }

  function getScienceNatureData() {
    return {
      number: 4,
      category_title: 'Science and nature',
      category_link: '#',
      items: {
        item1: {
          title: 'Are we in control of our own decisions?',
          description: 'We may not be as rational as we think when making decisions.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'science-nature',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/decisions.jpg',
        },
        item2: {
          title: 'Science can answer moral questions',
          description: 'How science can answer questions of good and evil, right and wrong.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'science-nature',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/moral.jpg',
        },
        item3: {
          title: 'Rewilding the world',
          description: 'What happened when wolves were reintroduced to the Yellowstone National Park.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'science-nature',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/wolves.jpg',
        },
        item4: {
          title: 'What we learn before we’re born',
          description: 'When does learning begin?',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'science-nature',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/learning.jpg',
        },
      },
    };
  }

  function getArtCultureData() {
    return {
      number: 4,
      category_title: 'Art and culture',
      category_link: '#',
      items: {
        item1: {
          title: 'How movies teach manhood',
          description: 'Movies should be sending more positive messages about manhood.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'art-culture',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/manhood.jpg',
        },
        item2: {
          title: 'A father daughter dance in prison',
          description: 'The story of a very special father - daughter dance.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'art-culture',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/dance.jpg',
        },
        item3: {
          title: 'Koestler awards',
          description: 'The national showcase of arts by offenders.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'art-culture',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/arts.jpg',
        },
        item4: {
          title: 'Our unhealthy obsession with choice',
          description: 'Could individual choice be distracting us from something bigger.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'art-culture',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/choice.jpg',
        },
      },
    };
  }

  function getHistoryData() {
    return {
      number: 4,
      category_title: 'History',
      category_link: '#',
      items: {
        item1: {
          title: 'The little problem I had renting a house',
          description: 'A powerful story of everyday racism.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'history',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/racism.jpg',
        },
        item2: {
          title: 'New York, before the city',
          description: 'When Times Square was a wetland.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'history',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/newyork.jpg',
        },
        item3: {
          title: 'What the gay rights movement learned from the civil rights movement',
          description: 'How the 2 struggles intertwine and propel each other forward.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'history',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/civilrights.jpg',
        },
        item4: {
          title: 'The mathematics of history',
          description: 'Digitising history is revealing deep underlying trends.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'history',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/history.jpg',
        },
      },
    };
  }

  function geSeriesData() {
    return { 
      items: {
        item0: {
          linktext: 'All Kinds of Minds',
          linkurl: '#',
        },
        item1: {
          linktext: 'Body of Health',
          linkurl: '#',
        },
        item2: {
          linktext: 'Gender Talk',
          linkurl: '#',
        },
        item3: {
          linktext: 'How We Decide',
          linkurl: '#',
        },
        item4: {
          linktext: 'Lessons From History',
          linkurl: '#',
        },
        item5: {
          linktext: 'Nature\'s Eye Candy',
          linkurl: '#',
        },
        item6: {
          linktext: 'Prime Time',
          linkurl: '#',
        },
        item7: {
          linktext: 'Stories to Help You Build Your Future',
          linkurl: '#',
        },
        item8: {
          linktext: 'Art That Gives You a Voice',
          linkurl: '#',
        },
        item9: {
          linktext: 'Check up',
          linkurl: '#',
        },
        item10: {
          linktext: 'How Failure Leads to Success',
          linkurl: '#',
        },
        item11: {
          linktext: 'How We Love',
          linkurl: '#',
        },
        item12: {
          linktext: 'Life\'s Big Questions',
          linkurl: '#',
        },
        item13: {
          linktext: 'NPR Friday',
          linkurl: '#',
        },
        item14: {
          linktext: 'Prison News',
          linkurl: '#',
        },
        item15: {
          linktext: 'NPR: Takeovers',
          linkurl: '#',
        },
        item16: {
          linktext: 'Becoming a Non-Smoker',
          linkurl: '#',
        },
        item17: {
          linktext: 'Emotional Hygiene',
          linkurl: '#',
        },
        item18: {
          linktext: 'How to Overcome Our Biases',
          linkurl: '#',
        },
        item19: {
          linktext: 'Koestler Trust',
          linkurl: '#',
        },
        item20: {
          linktext: 'Life Lessons from Prison',
          linkurl: '#',
        },
        item21: {
          linktext: 'Past, Present and Future',
          linkurl: '#',
        },
        item22: {
          linktext: 'Rock Show',
          linkurl: '#',
        },
        item23: {
          linktext: 'Timewise',
          linkurl: '#',
        },
        item24: {
          linktext: 'Bob and Beyond',
          linkurl: '#',
        },
        item25: {
          linktext: 'Freedom Inside',
          linkurl: '#',
        },
        item26: {
          linktext: 'How We Really Learn',
          linkurl: '#',
        },
        item27: {
          linktext: 'Khan Academy',
          linkurl: '#',
        },
        item28: {
          linktext: 'Math is Everywhere',
          linkurl: '#',
        },
        item29: {
          linktext: 'Porridge',
          linkurl: '#',
        },
        item30: {
          linktext: 'Straightline',
          linkurl: '#',
        },
        item31: {
          linktext: 'Work It',
          linkurl: '#',
        },
      }
    };
  }

  function getYouMightLike() {
    return {
      number: 8,
      category_title: 'You might like',
      category_link: '#',
      items: {
        item1: {
          title: 'Yoga',
          description: 'The perfect exercise for bang up.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'none',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/yoga.jpg',
        },
        item2: {
          title: 'How to make stress your friend',
          description: 'Finding the positives in stress.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'none',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/how-to-make-stress-your-friend.jpg',
        },
        item3: {
          title: 'Berwyn gym',
          description: 'Opening times and how to get access.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'none',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/gym.jpg',
        },
        item4: {
          title: 'What hallucinations reveal about our minds',
          description: 'Neurologist Oliver Sacks talks about hallucinations experienced by visually impaired people.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'none',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/hallucinations-reveal-about-our-minds.jpg',
        },
        item5: {
          title: 'What hallucinations reveal about our minds',
          description: 'Neurologist Oliver Sacks talks about hallucinations experienced by visually impaired people.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'none',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/hallucinations-reveal-about-our-minds.jpg',
        },
        item6: {
          title: 'What hallucinations reveal about our minds',
          description: 'Neurologist Oliver Sacks talks about hallucinations experienced by visually impaired people.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'none',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/hallucinations-reveal-about-our-minds.jpg',
        },
        item7: {
          title: 'What hallucinations reveal about our minds',
          description: 'Neurologist Oliver Sacks talks about hallucinations experienced by visually impaired people.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'none',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/hallucinations-reveal-about-our-minds.jpg',
        },
        item8: {
          title: 'What hallucinations reveal about our minds',
          description: 'Neurologist Oliver Sacks talks about hallucinations experienced by visually impaired people.',
          size: 'small',
          grid: 'govuk-grid-column-one-quarter',
          type: 'none',
          icon: 'icon-document',
          linkclass: 'icon-link',
          linktext: 'Read',
          graphic: '/images/hallucinations-reveal-about-our-minds.jpg',
        },
      },
    };
  }

  return {
    getPromotalContentData,
    getSubMenuData,
    getGamesData,
    getInspirationData,
    getNewsEventsData,
    geSeriesData,
    getRadioPodcastsData,
    getHealthyMindBodyData,
    getScienceNatureData,
    getArtCultureData,
    getHistoryData,
    getLandingPageSubMenuData,
    getYouMightLike,
  };
};
