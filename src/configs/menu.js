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
  name: '数字华容道',
  path: '/Klotski',
  imgUrl: 'https://doddle.oss-cn-beijing.aliyuncs.com/article/klotski.png'
}];
