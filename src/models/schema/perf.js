module.exports = {
  link: { type: String, index: true },
  os: { type: String, index: true },
  ua: String,
  ip: String,
  title: String,
  size: String,
  referer: String,

  timestamp: String,
  total: String,
  domReady: String,
  readyStart: String,
  redirect: String,
  appcache: String,
  unloadEvent: String,
  dnsLookup: String,
  connect: String,
  request: String,
  initDomTree: String,
  loadEvent: String,
  
  other: String,
  dtime: { type: String, index: true },
  dmonth: String,
  date: Number
}