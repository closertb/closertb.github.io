const Router = require('koa-router');
const ssrMiddleware = require('./ssrMiddleware');

const router = new Router();
router.get('/', ssrMiddleware);
router.get('/blog', ssrMiddleware);
router.get('/blog/:id', ssrMiddleware);

module.exports = router;
