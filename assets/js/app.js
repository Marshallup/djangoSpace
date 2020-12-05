"use strict";

// ANIM SCROLL
function setProperty(defOpt, newOpt) {
  var newKeys = Object.keys(newOpt);
  var options = {};

  for (var i = 0; i < defOpt.length; i++) {
    for (var j = 0; j < newKeys.length; j++) {
      var copy = newOpt[defOpt[i]];

      if (copy !== undefined) {
        options[defOpt[i]] = copy;
      }
    }
  }

  return options;
}

function animeScroll(elem, options) {
  var opt = setProperty(["duration", "linkAnchor", "ease", "anim"], options || {});
  checkProp(opt);
  var el, easeFunc, anim;

  if (elem instanceof Element) {
    el = elem;
  } else if (document.querySelector(elem)) {
    el = document.querySelector(elem);
  } else {
    throw "Элемент не является DOM элементом или не может быть найден по введенному селектору";
  }

  function checkProp(opt) {
    typeof opt.linkAnchor === "boolean" ? opt.linkAnchor : opt.linkAnchor = true;
    typeof opt.ease === "string" && opt.ease === "In" || opt.ease === "Out" || opt.ease === "InOut" ? opt.ease = opt.ease : opt.ease = "In";
    typeof opt.duration === "number" ? opt.duration : opt.duration = 1000;
    typeof opt.anim === "string" && opt.anim === "quad" || opt.anim === "linear" || opt.anim === "bounce" || opt.anim === "sine" || opt.anim === "quart" ? opt.anim = opt.anim : opt.anim = "quad";
  }

  var start = performance.now(),
      ease = opt.ease,
      startPos = window.pageYOffset,
      scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight),
      windowHeight = document.documentElement.clientHeight,
      duration = opt.duration;
  var endPos = el.offsetTop;
  if (scrollHeight - windowHeight <= endPos) endPos = scrollHeight - windowHeight;
  var path = endPos - startPos;

  switch (ease) {
    case "In":
      easeFunc = function makeEaseIn(timing) {
        return function (timeFraction) {
          return timing(timeFraction);
        };
      };

      break;

    case "Out":
      easeFunc = function makeEaseOut(timing) {
        return function (timeFraction) {
          return 1 - timing(1 - timeFraction);
        };
      };

      break;

    case "InOut":
      easeFunc = function makeEaseInOut(timing) {
        return function (timeFraction) {
          if (timeFraction < 0.5) return timing(2 * timeFraction) / 2;else return (2 - timing(2 * (1 - timeFraction))) / 2;
        };
      };

      break;
  }

  switch (opt.anim) {
    case "quad":
      anim = function swing(timeFraction) {
        return Math.pow(timeFraction, 2);
      };

      break;

    case "linear":
      anim = function linear(timeFraction) {
        return timeFraction;
      };

      break;

    case "bounce":
      anim = function bounce(timeFraction) {
        for (var _a = 0, b = 1, result; 1; _a += b, b /= 2) {
          if (timeFraction >= (7 - 4 * _a) / 11) {
            return -Math.pow((11 - 6 * _a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2);
          }
        }
      };

      break;

    case "sine":
      anim = function easeInSine(x) {
        return 1 - Math.cos(x * Math.PI / 2);
      };

      break;

    case "quart":
      anim = function easeInQuart(x) {
        return x * x * x * x;
      };

      break;
  }

  function anime(time) {
    var timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    var easing = easeFunc(anim);
    window.scrollTo(0, startPos + easing(timeFraction) * path);

    if (timeFraction < 1) {
      requestAnimationFrame(anime);
    }
  }

  requestAnimationFrame(anime);
}

var a = document.querySelectorAll("a");

for (var i = 0; i < a.length; i++) {
  var item = a[i]; // console.log(item.getAttribute("href").match(/^#/));
  // console.log(/^#/.test(item.getAttribute("href")), item);

  if (/^#/.test(item.getAttribute("href"))) {
    item.onclick = function (event) {
      event.preventDefault();
      var elemTo = event.target.getAttribute("href"); // quad
      // quart
      // bounce
      // sine
      // linear
      //--
      //In
      //Out
      //InOut

      animeScroll(elemTo, {
        duration: 1000,
        ease: "InOut",
        anim: "sine"
      });
    };
  }
}

var hBurger = document.querySelector(".header-burger"),
    hmBurger = document.querySelector(".header-menu-burger"),
    hMenu = document.querySelector(".header-menu"),
    body = document.body,
    html = document.documentElement;
hBurger.addEventListener("click", function () {
  hMenu.classList.add("header-menu--active");
  body.classList.add("lock");
  html.classList.add("lock");
});
hMenu.addEventListener("click", function () {
  hMenu.classList.remove("header-menu--active");
  body.classList.remove("lock");
  html.classList.remove("lock");
});