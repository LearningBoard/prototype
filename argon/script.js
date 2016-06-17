
//<!-- Google Analytics -->
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics_debug.js','ga');

// window.ga_debug = {trace: true};

ga('create', 'UA-79439648-1', 'auto');
ga('send', 'pageview', {
  page: "heheda.html",
  title: "how to be happy",
});
//<!-- End Google Analytics -->

"use strict"
console.log(ga.q);

function createFunctionWithTimeout(callback, opt_timeout)
{
  var called = false;

  function fn()
  {
    console.log(called);
    if (!called) 
    {
      called = true;
      callback();
    }
  }

  setTimeout(fn, opt_timeout || 1000);
  return fn;
}

function add(a, b)
{
  return a+b;
}

var func = createFunctionWithTimeout(function()
{
  console.log(add(2, 3));
});
func();

function init()
{
  console.log("ga loading finished");
}

ga(init);

ga('create', 'UA-79439648-1', 'auto', 'myTracker');
ga('myTracker.set', {
  title: 'How to succeed',
  page: 'how_to'
})
ga(function() {
  var dfkr = ga.getByName('t0')
  var trkr = ga.getByName('myTracker');
  console.log(dfkr);
  console.log(trkr.get('name'));
  console.log(trkr.get('clientId'));
  console.log(trkr.get('referrer'));
  console.log(trkr.get('title'));
  console.log(trkr.get('&dt'));
});

ga(init);
