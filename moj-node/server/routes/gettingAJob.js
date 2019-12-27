const express = require('express');
const { isEmpty, path } = require('ramda');
const { ESTABLISHMENTS } = require('../constants/hub');

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

module.exports = function createStepByStepRouter({
  logger,
  hubContentService,
  hubMenuService,
}) {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info(`GET ${req.originalUrl}`);

    const { establishmentId } = req.app.locals.envVars;

    const establishmentName = ESTABLISHMENTS[establishmentId];
    const title = `Working in ${establishmentName}`;
    const menu = hubMenuService.gettingAJobMenu(establishmentId);
    const standFirst = {
      792: 'What you need to do to get or change your job in Berwyn.',
      793: 'How to do to get, or change, a job in this prison.',
    };
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);
    const userDetails = path(['session', 'user'], req);

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
      newDesigns,
      detailsType: 'small',
      userName: path(['name'], userDetails),
      establishmentId,
    };

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
    const { establishmentId } = req.app.locals.envVars;
    const establishmentName = ESTABLISHMENTS[establishmentId];
    const menu = hubMenuService.gettingAJobMenu(establishmentId);
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);
    const userDetails = path(['session', 'user'], req);

    const config = {
      content: true,
      header: true,
      postscript: true,
      newDesigns,
      detailsType: 'small',
      userName: path(['name'], userDetails),
      establishmentId,
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
