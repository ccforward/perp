module.exports = {
  link: { type: String, index: true },
  os: { type: String, index: true },
  ua: String,
  ip: String,
  title: String,
  size: String,
  referer: String,
  timestamp: String,
  msg: String,
  url: String,
  line: String,
  col: String,
  errStack: String,
  other: String,
  dtime: { type: String, index: true },
  dmonth: String,
  date: Number
}