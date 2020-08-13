const { renderToString } = require('react-dom/server');
const { getDataFromTree } = require('@apollo/client/react/ssr');
const fs = require('fs');
const path = require('path');
const create = require('../src/static').default;

const staticPath = '../dist';
const fileList = {
  js: [],
  css: []
};
fs.readdir(path.join(__dirname, staticPath), (err, files) => {
  files.forEach((file) => {
    if (/\.js$/.test(file)) {
      fileList.js.push(file);
    }
    if (/\.css$/.test(file)) {
      fileList.css.push(file);
    }
  });
});

function renderFullPage(html, state, title = '吃饭不洗...') {
  const { js, css } = fileList;
  const jsList = js.map(url => `<script type="text/javascript" src="/${url}"></script>`).join('');
  const cssList = css.map(url => `<link href="/${url}" rel="stylesheet">`).join('');

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width = device-width,initial-scale=1, maximum-scale=1, user-scalable=no">
      <meta name="keywords" content="github graphql API,graphql, closertb.site, doddle's blog, 前端饭团">
      <meta name="discription" content="a frontend blog to record doddle technical life, 一个记录前端程序员成长的博客">
      <meta name="author" content="doddle,closertb@163.com">
      <meta name="format-detection" content="telephone=no">
      <meta name="format-detection" content="email=no">
      <title>${title}</title>
      ${cssList}
    </head>
    <body>
      <div id="app" class="home">${html}</div>
      <script type="text/javascript">
        window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')}
      </script>
      <script>
        navigator.serviceWorker && navigator.serviceWorker.register('/worker/worker.js', {
          name: 'doddle-sw'
        }).then(() => {
          console.log('Service Worker 注册成功');
        });
      </script>
      <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
      <script async src="https://hm.baidu.com/hm.js?d4b1cd36e22d08959f409336c0c57d98"></script>
      ${jsList}
    </body>
  </html>
  `;
}

module.exports = async (ctx, next) => {
  const { url } = ctx;
  const { App, client } = create(url);
  await getDataFromTree(App);

  // We are ready to render for real
  const content = renderToString(App);
  const initialState = client.extract();

  // console.log('url', content);
  ctx.body = renderFullPage(content, initialState);

  // generate html source
  await next();
};
