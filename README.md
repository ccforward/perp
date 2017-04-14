# 前端性能、异常监控平台 PERP

Performance and Errors Report Platform for FrontEnd

## 技术栈
Koa2 + MongoDB + Vue.js

* Koa2 做web框架，log4js做日志服务
* 通过定时任务将日志存入 MongoDB 中
* 后台前端页面基于 Vue.js 和 Rubik UI 搭建
* node.js 版本 >= 7.6.0

## 功能

### 定时任务

* 扫描任务，每 5min 扫描一次异常缓存中的数据，如果同一异常数据过高，则会发送报警邮件或报警短信
* 准实时日志任务，每 3min 扫描一次当天的日志文件，将最新的日志数据添增量添加进数据库
* 每日任务，每天 00:05 将前一天异常、性能日志全量入库

### 数据统计

* 使用 MongoDB 统计每一天的遗产数据 并可以根据系统、连接、日期多个维度查询
* 通过 URL 搜索该页面的最近5日的错误数据

### 代码翻译、还原

通过异常信息中的 line(行) column(列) 和对应的 surcemap 文件，将压缩后的代码出错位置还原到压缩前源码位置上。

### demo

demo暂时无数据

* [异常数据统计](http://perp.ccforward.net/) 
* [性能数据统计](http://perp.ccforward.net/#/performance)
* [代码翻译demo](http://perp.ccforward.net/translate)  
  直接点解析源码和翻译源码按钮即可查看默认代码的翻译

### 前端 SDK

性能统计是根据浏览器的 `timing` API 来完成上报的，如果不支持 `timing` API，则不上报，可以手动上报性能统计数据。

异常统计通过监听浏览器的 `error` 事件获取异常信息上报。  
其中通过用 `arguments.callee.caller` 来兼容不支持 `onerror` 事件中 `stack` 参数的情况。

## 数据 MongoDB

### 异常上报数据字段

``` js
link: '异常页面链接',
os: '系统',
ua: '浏览器UA',
ip: 'IP地址',
title: '页面title',
size: '页面width*height',
referer: 'referer',
timestamp: '客户端上报时间',
msg: '异常信息',
url: '异常 js 链接',
line: '异常 line',
col: '异常 column',
errStack: '异常stack',
other: '可自定义的其他信息',
dtime: '日期 20170101 格式',
dmonth: '月份 201701 格式',
date: '服务端上报时间',
```

### 性能统计数据字段

```js
link: '异常页面链接',
os: '系统',
ua: '浏览器UA',
ip: 'IP地址',
title: '页面title',
size: '页面width*height',
referer: 'referer',
timestamp: '客户端上报时间',

// timing.loadEventEnd - timing.fetchStart;
total: '总时间 start 到 load',
// timing.domComplete - timing.domInteractive;
domReady: '构建DOM时间',
// timing.fetchStart - timing.navigationStart;
readyStart: '新页面准备时间',
// timing.redirectEnd - timing.redirectStart;
redirect: 'redirect时间',
// timing.domainLookupStart - timing.fetchStart;
appcache: '缓存时间',
// timing.unloadEventEnd - timing.unloadEventStart;
unloadEvent: 'unload document 时间',
// timing.domainLookupEnd - timing.domainLookupStart;
dnsLookup: 'DNS查询时间',
// timing.connectEnd - timing.connectStart;
connect: 'TCP连接时间',
// timing.responseEnd - timing.requestStart;
request: '请求时间',
// timing.domInteractive - timing.responseEnd;
initDomTree: 'DOM可交互时间',
// timing.loadEventEnd - timing.loadEventStart;
loadEvent: 'load事件时间',

other: '可自定义的其他信息',
dtime: '日期 20170101 格式',
dmonth: '月份 201701 格式',
date: '服务端上报时间',
```

## Usage

### 创建数据库

进入mongo

```js
use perp
db.createUser({
  user: "username",
  pwd: "password",
  "roles" : [
  {
    "role" : "readWrite",
    "db" : "report"
  },{
    "role" : "dbAdmin",
    "db" : "report"
  }]
})
```

### 启动

修改配置文件 

* `./src/config/default.js` 端口配置
* 根据 mail.sample 新建文件 `./src/config/mail.js` 邮件配置
* 根据 mongo.sample 新建文件 `./src/config/mongo.js` MongoDB 数据库配置

```shell
yarn install 
# 或者
npm install

# 开发
npm run dev

# 前端页面开发
npm run dev:fe

# 部署
npm run deploy

# 线上用 PM2 部署
pm2 start src/index.js
```





