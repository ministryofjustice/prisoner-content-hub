const express = require('express');
const brewynSbSMenu = require('../data/berwyn-step-by-step.json');

module.exports = function createStepByStepRouter({
  logger,
  hubContentService,
}) {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info('GET /getting-a-job');

    // const { establishmentId } = req.app.locals.envVars;
    const breadcrumbs = [
      {
        text: 'Home',
        href: '/',
      },
      {
        text: 'Working in Berwyn',
      },
    ];

    return res.render('pages/getting-a-job', {
      breadcrumbs,
      data: {
        title: 'Working in Berwyn',
        menu: brewynSbSMenu,
      },
    });
  });

  router.get('/:id', async (req, res, next) => {
    logger.info(`GET /getting-a-job/${req.params.id}`);

    const { establishmentId } = req.app.locals.envVars;

    try {
      const data = await hubContentService.contentFor(
        req.params.id,
        establishmentId,
      );

      const breadcrumbs = [
        {
          text: 'Home',
          href: '/',
        },
        {
          text: 'Working in Berwyn',
          href: '/getting-a-job',
        },
        {
          text: data.title,
        },
      ];

      return res.render('pages/getting-a-job-content', {
        data: {
          ...data,
          menu: brewynSbSMenu,
        },
        breadcrumbs,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
