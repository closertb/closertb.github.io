## Blog
分享知识与生活中的点滴

## fork步骤
1. git clone  // 下载

2. npm install // 安装依赖

3. npm start // 开启本地在线调试

4. npm pub // 打包发布你的应用  

## 关于doddle-build
详情请查看[README][1]

## 关于Graphql
 - [Graphql][3]
 - [Applo-Graphql-react][2]
 - [GitHub API][4]  

## 关于构建部署
生成秘钥对： ssh-keygen -t rsa -b 4096 -C "$(git config user.email)" -f gh-pages -N ""
关于deploy-action: [参考文档][5]

## 快速搭建属于你的博客
可查看当前目录下的realtedArticle文件  

[1]: https://www.npmjs.com/package/@doddle/doddle-build
[2]: https://www.apollographql.com/docs/react/
[3]: http://graphql.cn/learn/
[4]: https://developer.github.com/v4/explorer/
[5]: https://github.com/marketplace/actions/deploy-action-for-github-pages