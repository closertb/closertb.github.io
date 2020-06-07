[关联文章：Rendering on the Web](https://developers.google.com/web/updates/2019/02/rendering-on-the-web)  
本文主要内容来源于对上文的翻译，加上了一点平时工作的理解，有兴趣的可以直接阅读上文链接。

## 预备知识
几种常见的模式：
 - SSR: Server-Side Rendering - rendering a client-side or universal app to HTML on the server.
 - CSR: Client-Side Rendering - rendering an app in a browser, generally using the DOM.
 - Rehydration: “booting up” JavaScript views on the client such that they reuse the server-rendered HTML’s DOM tree and data.
 - Prerendering: running a client-side application at build time to capture its initial state as static HTML.

在开启渲染模式对比之前，了解几个有意义的性能对比参数：
 - TTFB: Time to First Byte - seen as the time between clicking a link and the `first bit of content` coming in.
 - FP: `First Paint` - the first time any pixel gets becomes visible to the user.
 - FCP: `First Contentful Paint` - the time when requested content (article body, etc) becomes visible.
 - TTI: `Time To Interactive` - the time at which a page becomes interactive (events wired up, etc).

## 渲染模式
### SSR 服务端渲染
Server-Side Rendering - 就是服务端渲染出HTML页面，比如以前的`JSP，PHP`

![20200425163137](https://doddle.oss-cn-beijing.aliyuncs.com/oldNotes/20200425163137.png)

除了TTFB会延长（服务端需要去准备相应的页面数据），其他三个性能参数都比较客观；

优点是更好的性能数据，客户端压力更小，利于SEO；缺点是对服务端性能要求更高，压力较大；页面切换`无法渐进式加载`，每个页面都需要重新渲染，页面切换时不能定义过渡动画(间隔有白屏，Chrome 在同域名页面跳转时，有一个[PLS优化](https://developers.google.com/web/updates/2019/05/paint-holding)，即延迟到下一个页面FCP节点时开始下一个页面的渲染)；  

在2014年以前，更多网站是以SSR的形式，随着前端职业化和JS技术的不断发展，纯SSR正在逐渐淡出历史舞台。  

### Static Rendering 静态页面渲染(古老的客户端渲染方式)
静态渲染就是直接用已经成型的html文件进行渲染，会有一些辅助的JS来增强页面交互；比如Hexo模板引擎生成的文章Html，当然很多公司也还存在页面内容纯手工的做法，这种渲染适合交互少的一些官方展示性网站;
![20200425170027](https://doddle.oss-cn-beijing.aliyuncs.com/oldNotes/20200425170027.png)
静态渲染的优点：
 - 性能参数都比较优异，TTFB 和 FP 和 FCP几乎相同；  
 - 适合CDN部署；  
 - 客户端与服务端压力都比较小；  

静态渲染的缺点之一是必须为每个可能的URL生成单独的HTML文件。 当您无法提前预测这些URL的URL或具有大量唯一页面的网站时，这可能具有挑战性甚至不可行, 如果是纯手工开发，那开发效率相对也比较低。  

但从工作几年的经验来看，这种纯静态渲染的网站除了一些文档，博客类网站，更多是借助JS技术来提高页面的可交互能力。

静态渲染与SSR渲染（或则服务端预渲染）很像，可以通过禁用js 和 降低网速来甄别网站是采用的静态渲染技术还是预渲染技术； 

### CSR 客户端渲染
Client-side rendering (CSR) ，一种纯在客户端(浏览器)利用JS操作Dom渲染页面的方式. 所有的生成逻辑, `数据获取`, `模板` and `路由` 都由浏览器而不是服务端来控制。  
![20200425170438](https://doddle.oss-cn-beijing.aliyuncs.com/oldNotes/20200425170438.png)
除了TTFB短，其他都会被延长，可以通过Http2的服务端推送与`<link rel=preload>`来提升FCP；

`客户端渲染`是当前最流行的渲染模式，常以`SPA单页面应用`的方式存在；因为有React，Vue, Angular这种热门UI框架支持，加上Webpack的构建打包，开发效率相比前两种方式高出很多,页面可做很多复杂的交互操作与`图形渲染`；  

由于JS和CSS的大小会影响首屏的渲染，所以最好做好代码分割，只提供页面渲染必要的资源代码，应用懒加载的形式来提供其余的资源时非常有必要的；

骨架屏渲染(CSR with Prerendering)在当代也是一种比较时髦的技术
，GatsBy引擎就是这种技术的突出使用者。就是会先通过服务端渲染出一个大致的骨架，告诉用户网站已经对你的请求有响应了，但其实这个时候只能看到一个很模糊的布局且不能交互，得等到页面数据请求回来后，页面才开始正式的渲染。
## Rehydration 同构渲染
`同构其实就是SSR+CSR的合体`。首屏的html页面由服务端提供，然后加载js，js利用现有的dom树来接管渲染后页面的交互操作，跳转到新页面时就变成纯CSR渲染，是一种比较有技术含量的渲染方式，当下比较流行的NextJs(React), NuxtJs(Vue)就是这种渲染技术的成熟框架；

![20200425173953](https://doddle.oss-cn-beijing.aliyuncs.com/oldNotes/20200425173953.png)

从上图可看，TTFB，FP和SSR几乎一样，FCP会由于js的下载解析变长。页面看起来很快被渲染出来(`直出`)，且看起可交互，但实际上这时候还不能马上响应时间，因为要等到客户端JS执行，事件监听启动后，输入这些交互操作才可用，所以TTI相比SSR也会变长。  

优点：利于SEO，同时结合了SSR与CSR的特点，首屏之后的页面交互可实现渐进式加载，可控性高；  
缺点：
 - 技术要求更高（包含代码处理），同时对服务器和客户端都有性能要求；
 - React过去提供的服务端html生成方法renderToString是同步的，这回阻塞Node服务主线程；但后面推出了异步的renderToNodeStream，服务端压力相对而言就没那么大了

我自己在公司的两个项目做过同构尝试，都是基于Dva的React 同构渲染项目，感兴趣的话，可作为参考入门。
 - [文章：初探SSR，React + Koa + Dva-Core](https://closertb.site/#/blog/35?cursor=Y3Vyc29yOnYyOpK5MjAxOS0xMC0xNFQwMDoxMzoyMCswODowMM4eLjey)
 - [项目：SSrTemplate](https://github.com/closertb/template)  

对于同构渲染可以优化的点，自己的总结是：  
 - JS，CSS等页面静态资源文件，最好还是单独部署走CDN；
 - 交互JS 在页面交互要求不高的情况下，可以设置`async`或则`deffer`标志

### 其他

 - Partial Rehydration 部分同构渲染：顾名思义就是页面的部分组件或试图采用渐进式同构的方式加载，主要目的是减少页面对客户端JS的依赖；
 - Trisomorphic Rendering，三态渲染：这种渲染技术仅适用于service workers可用的时候，大致意思是，首先由服务端提供一个初始文件流，然后service workers接管将文件流渲染出一个html文件，并开始在页面渲染，同时服务端也在生成可用的页面；下图是其提供的思路：

 ![20200425231613](https://doddle.oss-cn-beijing.aliyuncs.com/oldNotes/20200425231613.png)  

贴出原文：  
If service workers are an option for you, “trisomorphic” rendering may also be of interest. It's a technique where you can use streaming server rendering for initial/non-JS navigations, and then have your service worker take on rendering of HTML for navigations after it has been installed. This can keep cached components and templates up to date and enables SPA-style navigations for rendering new views in the same session. This approach works best when you can share the same templating and routing code between the server, client page, and service worker


### 总结
在决定渲染方法时，请思考并了解您应用的瓶颈在哪；考虑静态渲染还是服务器渲染是否可以帮助您达到90％的效果；完全可以以最少的JS来配合HTML来获得交互体验也是完全可以的，下面是一个全文总结性的图表：
![20200425233348](https://doddle.oss-cn-beijing.aliyuncs.com/oldNotes/20200425233348.png)  

