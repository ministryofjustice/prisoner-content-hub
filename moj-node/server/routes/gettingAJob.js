const express = require('express');
const { isEmpty, path } = require('ramda');
const { ESTABLISHMENTS: establishments } = require('../constants/hub');

function addCurrentPageToMenu(url, menu) {
  return menu.map(menuItem => {
    const updatedLinks = menuItem.links.map(link => {
      if (link.href === url) {
        return { ...link, currentPage: true };
      }
      return link;
    });
    return { ...menuItem, links: updatedLinks };
  });
}

const createGettingAJobRouter = ({
  logger,
  hubContentService,
  hubMenuService,
  analyticsService,
}) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info(`GET ${req.originalUrl}`);

    const establishmentId = path(['locals', 'establishmentId'], res);

    const establishmentName = establishments[establishmentId];
    const title = `Working in ${establishmentName}`;
    const menu = hubMenuService.gettingAJobMenu(establishmentId);
    const standFirst = {
      792: 'What you need to do to get or change your job in Berwyn.',
      793: 'How to do to get, or change, a job in this prison.',
    };
    const userName = path(['session', 'user', 'name'], req);
    const sessionId = path(['session', 'id'], req);

    const breadcrumbs = [
      {
        text: 'Home',
        href: '/',
      },
      {
        text: title,
      },
    ];

    const config = {
      content: true,
      header: true,
      postscript: true,
      detailsType: 'small',
      userName,
      establishmentId,
      returnUrl: req.originalUrl,
    };

    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: req.originalUrl,
      title,
      sessionId,
    });

    return res.render('pages/getting-a-job', {
      breadcrumbs,
      config,
      data: {
        title,
        menu,
        standFirst: standFirst[establishmentId],
      },
    });
  });

  router.get('/:id', async (req, res, next) => {
    logger.info(`GET ${req.originalUrl}`);
    const urlMap = {
      792: '/working-in-berwyn',
      793: '/working-in-wayland',
    };
    const establishmentId = path(['locals', 'establishmentId'], res);
    const establishmentName = establishments[establishmentId];
    const menu = hubMenuService.gettingAJobMenu(establishmentId);
    const userName = path(['session', 'user', 'name'], req);
    const sessionId = path(['session', 'id'], req);

    const config = {
      content: true,
      header: true,
      postscript: true,
      detailsType: 'small',
      userName,
      establishmentId,
      returnUrl: req.originalUrl,
    };

    try {
      const data = await hubContentService.contentFor(
        req.params.id,
        establishmentId,
      );

      if (isEmpty(data)) {
        return next();
      }

      const rootPath = {
        title: `Working in ${establishmentName}`,
        href: urlMap[establishmentId],
      };

      const breadcrumbs = [
        {
          text: 'Home',
          href: '/',
        },
        {
          text: rootPath.title,
          href: rootPath.href,
        },
        {
          text: data.title,
        },
      ];

      analyticsService.sendPageTrack({
        hostname: req.hostname,
        page: req.originalUrl,
        title: data.title,
        sessionId,
      });

      return res.render('pages/getting-a-job-content', {
        config,
        data: {
          ...data,
          menu: addCurrentPageToMenu(req.originalUrl, menu),
          rootPath,
        },
        breadcrumbs,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};

module.exports = {
  createGettingAJobRouter,
};
