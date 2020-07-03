export const Menu = [{
  name: '首页',
  path: '/blog',
  component: 'Blog',
  children: [{
    path: '/blog/:id',
    component: 'BlogDetail',
  }]
}, {
  name: '专项',
  path: '/project',
  component: 'NavCenter'
}];

export const Routes = Menu.reduce((pre, { children = [], ...others }) => pre.concat(others).concat(children), []);

// 设置项目前，确保相关静态资源已拷贝到public文件夹下，并且文件名大小写与路径一致
export const NavMenu = [{
  name: '公众号编辑器',
  path: '/editor',
  imgUrl: 'https://doddle.oss-cn-beijing.aliyuncs.com/oldNotes/20200607153230.png',
  git: 'https://github.com/closertb/closertb.github.io.git'
}, {
  name: '数字华容道',
  path: '/Klotski',
  imgUrl: 'https://doddle.oss-cn-beijing.aliyuncs.com/article/klotski.png',
  git: 'https://github.com/closertb/klotski.git'
}, {
  name: 'Vue可视化图表',
  path: '/chart',
  imgUrl: 'https://doddle.oss-cn-beijing.aliyuncs.com/article/chart.jpg',
  git: 'https://github.com/closertb/simpleEchartsDemo'
}, {
  name: 'Antd-doddle 组件库',
  path: 'http://doc.closertb.site',
  imgUrl: 'https://doddle.oss-cn-beijing.aliyuncs.com/oldNotes/antd-doddle.png',
  git: 'https://github.com/closertb/antd-doddle'
}];
