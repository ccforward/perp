
url
title
UA {
  os
}
referer
net wifi 2g 3g 4g
window width height

error {
  m: errorMessage,
  s: scriptURI,
  l: lineNumber,
  c: colNumber,
  e: err
}

ext

timestamp


## mongo

create user

```js
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