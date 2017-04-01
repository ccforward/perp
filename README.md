## mongo

create user

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