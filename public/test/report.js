var oldOnerrorHandler = window.onerror

function onerr(msg, url, line, col, err) {
  window.onerror = null
  var error = {
    link: location.href,
    ua: navigator.userAgent,
    title: document.title,
    size: document.documentElement.clientWidth + '*' + document.documentElement.clientHeight,
    referer: document.referer || '',
    timestamp: new Date().getTime(),
    msg: msg,
    url: url,
    line: line,
    col: col,
    errStack: err.stack && err.stack.toString() || '',
    other: 'other information of system',
    unique: Math.random()
  }
  var params = []
  for(var key in error) {
    params.push(key + '=' + encodeURIComponent(error[key]))
  }
  report('/report/errors?' + params.join('&'))
  
  if (oldOnerrorHandler) {
    oldOnerrorHandler.apply(this, arguments)
  }
  window.onerror = arguments.callee
}


function report(url) {
  var img = new Image()
  setTimeout(function(){
    img.src = url
  }, 0)
};

window.onerror = onerr