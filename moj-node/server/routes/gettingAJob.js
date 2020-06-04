const express = require('express');
const { isEmpty, path } = require('ramda');
const {
  getEstablishmentFormattedName,
  getEstablishmentStandFirst,
  getEstablishmentName,
} = require('../utils');

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
}) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info(`GET ${req.originalUrl}`);

    const establishmentId = path(['locals', 'establishmentId'], res);
    const establishmentName = getEstablishmentFormattedName(establishmentId);
    const title = `Working in ${establishmentName}`;
    const menu = hubMenuService.gettingAJobMenu(establishmentId);
    const userName = path(['session', 'user', 'name'], req);

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

    return res.render('pages/getting-a-job', {
      breadcrumbs,
      config,
      data: {
        title,
        menu,
        standFirst: getEstablishmentStandFirst(establishmentId),
      },
    });
  });

  router.get('/:id', async (req, res, next) => {
    logger.info(`GET ${req.originalUrl}`);
    const establishmentId = path(['locals', 'establishmentId'], res);
    const establishmentName = getEstablishmentFormattedName(establishmentId);
    const menu = hubMenuService.gettingAJobMenu(establishmentId);
    const userName = path(['session', 'user', 'name'], req);

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
        href: `/working-in-${getEstablishmentName(establishmentId)}`,
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

module.exports = {
  createGettingAJobRouter,
};
