## 吃饭不洗碗
一个造战斗机转行的前端工程师，成长的点点滴滴

## 在线地址
**[closertb.site](http://closertb.site)**

## 我的开源项目
 - [ant-doddle](http://doc.closertb.site): 一个替代antd中后台开发频繁复制粘贴的简易方案库；
 - [deploy-static-action](https://github.com/closertb/deploy-static-action): 一个前端打包部署Action（Github CI/CD）
 - [@doddle](https://github.com/closertb/doddle): 一套可供参考的前端工程化方案；
 - [Dva SSR](https://github.com/closertb/template): 基于React + Koa + Dva-Core的一套前端服务端渲染同构方案；
 - github blog: 见下面一段；

## 如果你也想快速搭建属于你的博客
本博客基于github issues提供数据，github pages提供前端展示，应用github action自动部署。让私人定制化博客不再是你的门槛，可查看[相关文章][6]进一步了解

## 关于doddle-build
详情请查看[README][1]

## 关于Graphql
 - [Graphql][3]
 - [Applo-Graphql-react][2]
 - [GitHub API][4]  

## 关于构建部署
生成秘钥对： ssh-keygen -t rsa -b 4096 -C "$(git config user.email)" -f gh-pages -N ""  
关于deploy-action: [参考文档][5]
 

[1]: https://www.npmjs.com/package/@doddle/doddle-build
[2]: https://www.apollographql.com/docs/react/
[3]: http://graphql.cn/learn/
[4]: https://developer.github.com/v4/explorer/
[5]: https://github.com/marketplace/actions/deploy-action-for-github-pages
[6]: https://github.com/closertb/MyBlog/issues/34