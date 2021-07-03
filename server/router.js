const Router = require('koa-router');
const ssrMiddleware = require('./ssrMiddleware');

const routeMap = {
  root: '/',
  home: '/blog',
  detail: '/blog/:id'
};

const router = new Router();
router.get(routeMap.root, ssrMiddleware);
router.get(routeMap.home, ssrMiddleware);
router.get(routeMap.detail, ssrMiddleware);
// 这个地方的处理感觉不够智能
router.get('404', '*', (ctx) => {
  const { path = '' } = ctx;
  if (path === '/' || path.match('/blog')) {
    return;
  }
  ctx.redirect('/404.html');
  ctx.status = 302;
});

module.exports = router;
