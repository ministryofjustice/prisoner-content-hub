const express = require('express');
const { ESTABLISHMENTS } = require('../constants/hub');

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
    const standFirst = {
      792: 'What you need to do to get or change your job in Berwyn.',
      793: 'How to do to get, or change, a job in this prison.',
    };

    const breadcrumbs = [
      {
        text: 'Home',
        href: '/',
      },
      {
        text: title,
      },
    ];

    return res.render('pages/getting-a-job', {
      breadcrumbs,
      data: {
        title,
        menu: hubMenuService.gettingAJobMenu(establishmentId),
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

    try {
      const data = await hubContentService.contentFor(
        req.params.id,
        establishmentId,
      );
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
        data: {
          ...data,
          menu: hubMenuService.gettingAJobMenu(establishmentId),
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
