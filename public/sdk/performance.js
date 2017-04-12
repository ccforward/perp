(function(window) {
  window.timing = window.timing || {
    getTimes: function() {
      var performance = window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance;
      if (performance === undefined) {
        return false;
      }

      var timing = performance.timing;
      var api = {};

      if (timing) {
        // Time to first paint
        if (api.firstPaint === undefined) {
          // All times are relative times to the start time within the
          // same objects
          var firstPaint = 0;

          // Chrome
          if (window.chrome && window.chrome.loadTimes) {
            // Convert to ms
            firstPaint = window.chrome.loadTimes().firstPaintTime * 1000;
            api.firstPaintTime = firstPaint - window.performance.timing.navigationStart;
          }
          // IE
          else if (typeof window.performance.timing.msFirstPaint === 'number') {
            firstPaint = window.performance.timing.msFirstPaint;
            api.firstPaintTime = firstPaint - window.performance.timing.navigationStart;
          }
          // Firefox
          // This will use the first times after MozAfterPaint fires
          //else if (window.performance.timing.navigationStart && typeof InstallTrigger !== 'undefined') {
          //    api.firstPaint = window.performance.timing.navigationStart;
          //    api.firstPaintTime = mozFirstPaintTime - window.performance.timing.navigationStart;
          //}
        }

        var perf = {}
        // Total time from start to load
        perf.total = timing.loadEventEnd - timing.fetchStart;
        // Time spent constructing the DOM tree
        perf.domReady = timing.domComplete - timing.domInteractive;
        // Time consumed preparing the new page
        perf.readyStart = timing.fetchStart - timing.navigationStart;
        // Time spent during redirection
        perf.redirect = timing.redirectEnd - timing.redirectStart;
        // AppCache
        perf.appcache = timing.domainLookupStart - timing.fetchStart;
        // Time spent unloading documents
        perf.unloadEvent = timing.unloadEventEnd - timing.unloadEventStart;
        // DNS query time
        perf.dnsLookup = timing.domainLookupEnd - timing.domainLookupStart;
        // TCP connection time
        perf.connect = timing.connectEnd - timing.connectStart;
        // Time spent during the request
        perf.request = timing.responseEnd - timing.requestStart;
        // Request to completion of the DOM loading
        perf.initDomTree = timing.domInteractive - timing.responseEnd;
        // Load event time
        perf.loadEvent = timing.loadEventEnd - timing.loadEventStart;
      }

      return perf;
    }
  };
  // Expose as a commonjs module
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.timing
  }

  function report(url) {
    var img = new Image()
    setTimeout(function(){
      img.src = url
    }, 100)
  }

  window.addEventListener('load', function(){
    setTimeout(function() {
      var info = {
        link: location.href,
        ua: navigator.userAgent,
        title: document.title,
        size: document.documentElement.clientWidth + '*' + document.documentElement.clientHeight,
        referer: document.referer || '',
        timestamp: new Date().getTime(),
        other: 'other information of system',
        unique: Math.random()
      }
      var params = []
      for(var key in info) {
        params.push(key + '=' + encodeURIComponent(info[key]))
      }
      var times = timing.getTimes()

      for(var t in times) {
        params.push(t + '=' + encodeURIComponent(times[t]))
      }
      report('/report/performance?' + params.join('&'))
    }, 1000)
  })
})(window)