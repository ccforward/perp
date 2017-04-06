## mongo

按dtime、os、link查询

最近5天 总数 列表
os 最近5天



```js
use perp


db.createUser({
  user: "cc",
  pwd: "12345",
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