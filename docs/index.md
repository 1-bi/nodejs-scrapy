heloo mess

#### 导航任务

NPMJS 项目地址

https://www.npmjs.com/package/nodejs-scrapy

* 代码引用方式

```typescript
const scrapy = require("@1-bi/scrapy");
```

本项目下载实现组件支持以下两种

##### puppeteer-core
##### embbed ---- Axios


```javascript 1.8
// 构建初始化参数
let settingsInst = Settings.newCls()
    .setProperty("env1","prop")
    .setScheduler()
    .build()

// 构建入口请求
let spi  = new Spider()
spi.setStartUrls( ['https://mockbin.org/request'] )

// 定义爬虫
let c = new Crawler(spi , spiderSettings)

//  启动
let result = c.start()

```
