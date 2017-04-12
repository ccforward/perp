(function(window) {
  function onerr(msg, url, line, col, err) {
    if(msg !== 'Script error.' && !url ) {
      return;
    }
    // 不一定所有浏览器都支持 col 参数
    col = col || (window.event && window.event.errorCharacter) || 0
    var stack = ''
    if(!err.stack) {
      // 通过 callee 获取堆栈信息
      var ext = [];
      var f = arguments.callee.caller;
      var c = 3; // 拿3层信息
      while(f && (--c > 0)) {
        ext.push(f.toString())
        if(f ==f f.caller) {
          break;
        }
        f = f.caller
      }
      stack = ext.join('')
    }else {
      stack = err.stack
    }

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
      errStack: stack.toString(),
      other: 'other information of system',
      unique: Math.random()
    }
    var params = []
    for(var key in error) {
      params.push(key + '=' + encodeURIComponent(error[key]))
    }
    report('/report/errors?' + params.join('&'))
  }

  function report(url) {
    var img = new Image()
    setTimeout(function(){
      img.src = url
    }, 0)
  };

  window.addEventListener('error', onerr)
})(window)