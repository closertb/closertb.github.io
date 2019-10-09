## 前言
国庆七天，就这样没了，以不想看人海的借口（9 s q），在家里白吃白喝的待了七天。但作为前端练习生的我，又有时间倒腾了，这不，夜深人静时，用React + Github Issues + Github Graphql 
 API + Github Action + Github Pages重写了自己的博客，以前是用Hexo搭的,  那为什么要换，嗯........图个乐。

### 目的意图
为什么要这样整呢？除了倒腾；还有就是阿里云又让续费服务器了；用segmentfault做自己的文件存储的计划失效了（图片链接有时效性，动态的）；hexo上条条框框太多了，加个菜单也是费劲。那为什么又要用上面的那一堆东西呢？嗯，是这样的：
 - React :  三大框架，也就这个入了门，写起来快；
 - Github Issues：博客数据库加图片文件存储，一箭双雕, 有时间再整个评论，直接帽子戏法；
 - Github Graphql API：博客数据库（Issues）读取接口，为什么不用V3，接口返回东西太多，浪费带宽；
 - Github Action：Github去年出的新功能-持续集成服务，用于打包构建部署静态资源；
 - Github Pages：服务器就不续费了，钱省下吃火锅。Pages用起挺好，还白送个域名，而且还免费配置了gzip，缓存策略

## 权限申请
### Github Graphql Api 访问token
Github API V3版提供的Restful接口，可以直接访问，不需要鉴权，但访问次数有限制。而对于Github API V4，即Graphql接口，需要鉴权，所以我们需要申请一个token，具体步骤是：登录你的github -> Settings -> Developer settings -> Personal access tokens -> Generate New。 如下图所示，我们需要设置这个token的操作范围，出于安全的考虑，这里不做任何勾选。这样做对应的权限是no_scope，对应的权限是只读，可通过下面的图片和链接获取详细的权限范围。
![image](https://user-images.githubusercontent.com/22979584/66315476-76b4fa80-e948-11e9-9fe3-c8b70ff71ee4.png)

[权限分配说明][1]
![image](https://user-images.githubusercontent.com/22979584/66313719-664f5080-e945-11e9-8a55-96b792ff607c.png)

### Github Action 部署权限
关于Github Action是什么，还未了解的，可以阅读[官方文档][2]， 也可以自己Goggle一下。在后续Github Pages的部署，会用到一对秘钥，可以通过下面的命令在cmd中生成：
```cmd
ssh-keygen -t rsa -b 4096 -C "$(git config user.email)" -f gh-pages -N ""
```  
然后在你的当前目录会得到如下两个文件（gh-pages 与 gh-pages.pub）：
![image](https://user-images.githubusercontent.com/22979584/66314682-f80b8d80-e946-11e9-8c16-bc6f78eae2b8.png)
然后参照Github上一个现成的[手把手部署文档][3]，在你的项目中设置这对秘钥。在后面的项目部署再细讲。

## 博客代码实现
其实一个简单的博客，就一个列表页和一个详情页，列表页就是展示你写了哪些文章，而详情页就是展示文章具体内容；下面的代码不会涉及到页面UI的设计及项目架构设计，重点讲与github的接口交互实现，想直接看源码实现的，可以直接clone下载下来看：
```sh
git clone https://github.com/closertb/MyBlog.git
```
### 写前须知
 - React: 只涉及到React-Router这个生态，页面全部用函数式组件编写，所以Hooks有必要了解一下；
 - 关于Graphql: 可以查看[官网介绍][4], 也可以查看我之前写过的文章，[1、同学，GraphQL了解一下：基础篇][5], [2、同学，GraphQL了解一下：实践篇][6], [3、GraphQL进阶篇: 挥手Redux不是梦][7]， 看前两篇就够用了；
 - 关于apollo graphql: 一个Graphql的第三方框架，可查看[官网介绍][8]，在上面的两篇文章也有提及,重点看下query就行了；
 - Github Graphql API: [官网链接][9]，但相信我，在官网学Github API是相当低效的，Graphql的优势就是接口实现了，运用Graphiql界面技术，相应的接口文档就出来了，官网也提供了这样的界面：[Graphql Explorer][10], 你可以复制下面的代码到Graphql Explorer，并改成你自己的项目进行尝试（需删掉注释）  

![image](https://user-images.githubusercontent.com/22979584/66321973-fa281900-e953-11e9-9016-3d8fb4591a35.png)
```js
query {
  repository(owner: "closertb", name: "MyBlog") {
    issues(last: 10, states:OPEN, orderBy: {
      field: CREATED_AT
      direction: DESC
    }) {
      totalCount
      edges {
        cursor // 节点标志位， 后面分页会用到
        node {
          title
          url
          createdAt
          updatedAt
          reactions(first: 100) { // issue动态，什么赞，踩，喝彩这些
            totalCount
            nodes {
              content
            }
          }
        }
      }
    }
  }
}
```
### 建立Graphq客户端
建立Graphql客户端,类似于我们写常规请求时，要初始化一个Http类或Axios类，来配置请求的目标域名与验证令牌，这个也是相似的；这里就会用到了前面申请的Github Graphql API 访问token，都是一些Api调用，直接上代码：
```js
// Initialize
const cache = new InMemoryCache();
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    Authorization: `bearer ${token}`, // 申请的token
  }
}));
const httpLink = new HttpLink({
  uri: 'https://api.github.com/graphql', // 所有请求的Url
  batchInterval: 10,
  opts: {
    credentials: 'cross-origin',
  },
});
const client = new ApolloClient({
  clientState: { resolvers, defaults, cache, typeDefs },
  cache, // 本地数据存储, 暂时用不上
  link: authLink.concat(httpLink)
});

function App() {
  return (
    <ApolloProvider client={client}>
      <LayoutRouter />
    </ApolloProvider>
  );
}
```
这里关注一下uri 与 header的设置就行了。
### 列表页的实现
#### 列表的展示，链接可点
列表的展示，主要就涉及到文章标题、文章发布日期、关联Issue、相关动态（赞，评论数量什么的），简略版的如我写的这样；
![image](https://user-images.githubusercontent.com/22979584/66409452-2eb6d600-ea23-11e9-8840-ad0a8ccc6c17.png)
最难的，就是写Graphql查询语句了，但幸好有了Graphql Explorer的存在，我们可以无限次的尝试自己写的sql语句，最后版的sql与上面的相似，只不过涉及到动态传参与graphql-tag转化：
```js
import gql from 'graphql-tag';
import { OWNER, PROJECT } from '../../configs/constants';

/**
 * @param pageBefore： 向前查的标志节点
 * @param pageAfter：  向后查的标志节点
 * @param pageFirst:   向前查的条数
 * @param pageLast:    向后查的条数
 * 说明： 查询时，pageFirst与pageAfter设置值，即为向后翻页；pageLast与pageBefore设置值，即为向后翻页
*/
export const sql = gql`
query Blog($pageFirst: Int, $pageLast: Int, $pageBefore: String, $pageAfter: String){
  repository(owner: ${OWNER}, name: ${PROJECT}) {
    sshUrl
    issues(first: $pageFirst, last: $pageLast, states:OPEN, before: $pageBefore,  after: $pageAfter, orderBy: {
      field: CREATED_AT
      direction: DESC
    }, filterBy: {
      createdBy: "closertb"
    }) {
      totalCount
      edges {
        cursor
        node {
          title
          url
          createdAt
          updatedAt
          reactions(first: 100) {
            totalCount
            nodes {
              content
            }
          }
        }
      }
    }
  }
}`;
```
上面这段语句的语义化还是相当明显了，就不再过多说明了。然后直接采用apollo提供的查询hooks：useQuery，通过传入sql语句与查询变量，hooks将返回三个值（loading, error, data），我们优先处理错误，然后处理请求中的状态，当没有错误并请求完成的时候，展示列表，原理很简单，直接看代码：
```js
export default function Blog() {
  const query = { pageFirst: 10 };
  const { loading, error, data } = useQuery(sql, {
    variables: query
  });

  if (error) {
    return (<p>{error.message || '未知错误'}</p>);
  }

  if (loading) {
    return (<p>loading</p>);
  }

  const { repository: { issues: { totalCount = 0, edges = [] } } } = data;

  return (
    <div className="list-wrapper">
      <ul>
        {edges.map(({ node: { title, url, updatedAt } }) => (
          <li className="block" key={url}>
            <h4 className="title">
              <Link to={`/blog/${url.replace(/.*issues\//, '')}`}>{title}</Link>
            </h4>
            <div className="info">
              <div className="reactions">
                <a href={url} target="_blank" rel="noopener noreferrer">Issue链接</a>
              </div>
              <span className="create-time">
                {updatedAt}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>);
```
#### 上下翻页的实现
列表的主要难点，主要体现在翻页的实现上。常用的restful接口，我们在查询时，只需传入page和pageSize，即可获取要查询页的数据。但Github的Graphql接口并没有这样做，而是以另一种思维来做了这件事：
### 详情页的实现

[1]: https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/
[2]: https://github.com/features/actions
[3]: https://github.com/marketplace/actions/deploy-action-for-github-pages
[4]: https://graphql.cn/learn/
[5]: https://github.com/closertb/MyBlog/issues/23
[6]: https://github.com/closertb/MyBlog/issues/24
[7]: https://github.com/closertb/MyBlog/issues/25
[8]: https://www.apollographql.com/docs/react/data/queries/
[9]: https://developer.github.com/v4/
[10]: https://developer.github.com/v4/explorer/
[11]: https://developer.github.com/v4/
[12]: https://developer.github.com/v4/
[13]: https://developer.github.com/v4/
[14]: https://developer.github.com/v4/