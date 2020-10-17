// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"css/unite-gallery.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./../images/loader_skype_trans.gif":[["loader_skype_trans.e51e0fb7.gif","images/loader_skype_trans.gif"],"images/loader_skype_trans.gif"],"./../images/loader-white1.gif":[["loader-white1.206f9551.gif","images/loader-white1.gif"],"images/loader-white1.gif"],"./../images/loader-black1.gif":[["loader-black1.5f336d5a.gif","images/loader-black1.gif"],"images/loader-black1.gif"],"./../images/loader-white2.gif":[["loader-white2.1a66d1e1.gif","images/loader-white2.gif"],"images/loader-white2.gif"],"./../images/loader-black2.gif":[["loader-black2.3cca930c.gif","images/loader-black2.gif"],"images/loader-black2.gif"],"./../images/loader-white3.gif":[["loader-white3.e26dc7d9.gif","images/loader-white3.gif"],"images/loader-white3.gif"],"./../images/loader-black3.gif":[["loader-black3.16672030.gif","images/loader-black3.gif"],"images/loader-black3.gif"],"./../images/loader-white4.gif":[["loader-white4.6ce0c61c.gif","images/loader-white4.gif"],"images/loader-white4.gif"],"./../images/loader-black4.gif":[["loader-black4.ecc4cb0b.gif","images/loader-black4.gif"],"images/loader-black4.gif"],"./../images/loader-white5.gif":[["loader-white5.1ce89d03.gif","images/loader-white5.gif"],"images/loader-white5.gif"],"./../images/loader-black5.gif":[["loader-black5.3ef5ff25.gif","images/loader-black5.gif"],"images/loader-black5.gif"],"./../images/loader-white6.gif":[["loader-white6.e2d1d775.gif","images/loader-white6.gif"],"images/loader-white6.gif"],"./../images/loader-black6.gif":[["loader-black6.9a25f277.gif","images/loader-black6.gif"],"images/loader-black6.gif"],"./../images/loader-white7.gif":[["loader-white7.d7bafbeb.gif","images/loader-white7.gif"],"images/loader-white7.gif"],"./../images/loader-black7.gif":[["loader-black7.86bd32aa.gif","images/loader-black7.gif"],"images/loader-black7.gif"],"./../images/play-button-square.png":[["play-button-square.5fb530a9.png","images/play-button-square.png"],"images/play-button-square.png"],"./../images/play-button-round.png":[["play-button-round.100f1def.png","images/play-button-round.png"],"images/play-button-round.png"],"./../images/button-close.png":[["button-close.ab78feb1.png","images/button-close.png"],"images/button-close.png"],"./../images/loader.gif":[["loader.6840e231.gif","images/loader.gif"],"images/loader.gif"],"./../images/loader_bright.gif":[["loader_bright.fe87c059.gif","images/loader_bright.gif"],"images/loader_bright.gif"],"./../images/not_loaded.png":[["not_loaded.bb91d73b.png","images/not_loaded.png"],"images/not_loaded.png"],"./../images/cover-grid.png":[["cover-grid.65a85fce.png","images/cover-grid.png"],"images/cover-grid.png"],"./../images/icon-link32.png":[["icon-link32.221bd8dd.png","images/icon-link32.png"],"images/icon-link32.png"],"./../images/icon-zoom32.png":[["icon-zoom32.4c40f8f8.png","images/icon-zoom32.png"],"images/icon-zoom32.png"],"./../images/icon-play32.png":[["icon-play32.11bbf44d.png","images/icon-play32.png"],"images/icon-play32.png"],"./../images/lightbox-arrow-left.png":[["lightbox-arrow-left.b71854dc.png","images/lightbox-arrow-left.png"],"images/lightbox-arrow-left.png"],"./../images/lightbox-arrow-right.png":[["lightbox-arrow-right.759e4363.png","images/lightbox-arrow-right.png"],"images/lightbox-arrow-right.png"],"./../images/lightbox-icon-close.png":[["lightbox-icon-close.9ca45bdf.png","images/lightbox-icon-close.png"],"images/lightbox-icon-close.png"],"./../images/lightbox-icon-close-compact2.png":[["lightbox-icon-close-compact2.e96e76a1.png","images/lightbox-icon-close-compact2.png"],"images/lightbox-icon-close-compact2.png"],"./../skins/default/slider_arrow_left.png":[["slider_arrow_left.7ed052dd.png","skins/default/slider_arrow_left.png"],"skins/default/slider_arrow_left.png"],"./../skins/default/slider_arrow_right.png":[["slider_arrow_right.180dc049.png","skins/default/slider_arrow_right.png"],"skins/default/slider_arrow_right.png"],"./../skins/default/slider_bullets.png":[["slider_bullets.0ccb16df.png","skins/default/slider_bullets.png"],"skins/default/slider_bullets.png"],"./../skins/default/tile_bullets_gray.png":[["tile_bullets_gray.6f6f3e03.png","skins/default/tile_bullets_gray.png"],"skins/default/tile_bullets_gray.png"],"./../skins/default/tile_bullets_blue.png":[["tile_bullets_blue.5b4b28c5.png","skins/default/tile_bullets_blue.png"],"skins/default/tile_bullets_blue.png"],"./../skins/default/tile_bullets_brown.png":[["tile_bullets_brown.10e90250.png","skins/default/tile_bullets_brown.png"],"skins/default/tile_bullets_brown.png"],"./../skins/default/tile_bullets_green.png":[["tile_bullets_green.1c73a353.png","skins/default/tile_bullets_green.png"],"skins/default/tile_bullets_green.png"],"./../skins/default/tile_bullets_red.png":[["tile_bullets_red.f6c3ddd7.png","skins/default/tile_bullets_red.png"],"skins/default/tile_bullets_red.png"],"./../skins/default/tile_button_left.png":[["tile_button_left.274d029a.png","skins/default/tile_button_left.png"],"skins/default/tile_button_left.png"],"./../skins/default/tile_button_right.png":[["tile_button_right.d8f9e516.png","skins/default/tile_button_right.png"],"skins/default/tile_button_right.png"],"./../skins/default/tile_button_play_pause.png":[["tile_button_play_pause.84c70fb4.png","skins/default/tile_button_play_pause.png"],"skins/default/tile_button_play_pause.png"],"./../skins/default/button_playpause.png":[["button_playpause.33e454a5.png","skins/default/button_playpause.png"],"skins/default/button_playpause.png"],"./../skins/default/button_fullscreen.png":[["button_fullscreen.85375cf1.png","skins/default/button_fullscreen.png"],"skins/default/button_fullscreen.png"],"./../skins/default/icon_zoom_plus.png":[["icon_zoom_plus.3c9a0849.png","skins/default/icon_zoom_plus.png"],"skins/default/icon_zoom_plus.png"],"./../skins/default/icon_zoom_minus.png":[["icon_zoom_minus.0a8701d2.png","skins/default/icon_zoom_minus.png"],"skins/default/icon_zoom_minus.png"],"./../skins/default/icon_zoom_back.png":[["icon_zoom_back.9f410153.png","skins/default/icon_zoom_back.png"],"skins/default/icon_zoom_back.png"],"./../skins/default/arrow_grid_down.png":[["arrow_grid_down.bea0f92a.png","skins/default/arrow_grid_down.png"],"skins/default/arrow_grid_down.png"],"./../skins/default/arrow_grid_up.png":[["arrow_grid_up.2f53f711.png","skins/default/arrow_grid_up.png"],"skins/default/arrow_grid_up.png"],"./../skins/default/grid_arrow_left.png":[["grid_arrow_left.6be13c83.png","skins/default/grid_arrow_left.png"],"skins/default/grid_arrow_left.png"],"./../skins/default/grid_arrow_right.png":[["grid_arrow_right.fe2ad74c.png","skins/default/grid_arrow_right.png"],"skins/default/grid_arrow_right.png"],"./../skins/default/arrows_strip_left.png":[["arrows_strip_left.54b2684b.png","skins/default/arrows_strip_left.png"],"skins/default/arrows_strip_left.png"],"./../skins/default/arrows_strip_right.png":[["arrows_strip_right.f590e7d7.png","skins/default/arrows_strip_right.png"],"skins/default/arrows_strip_right.png"],"./../skins/default/arrows_strip_up.png":[["arrows_strip_up.b2b9a276.png","skins/default/arrows_strip_up.png"],"skins/default/arrows_strip_up.png"],"./../skins/default/arrows_strip_down.png":[["arrows_strip_down.fdcb292c.png","skins/default/arrows_strip_down.png"],"skins/default/arrows_strip_down.png"],"./../skins/default/grid_handle_black_left.png":[["grid_handle_black_left.536700db.png","skins/default/grid_handle_black_left.png"],"skins/default/grid_handle_black_left.png"],"./../skins/default/grid_handle_black_right.png":[["grid_handle_black_right.83367d52.png","skins/default/grid_handle_black_right.png"],"skins/default/grid_handle_black_right.png"],"./../skins/default/grid_handle_black_top.png":[["grid_handle_black_top.8a3723c7.png","skins/default/grid_handle_black_top.png"],"skins/default/grid_handle_black_top.png"],"./../skins/default/grid_handle_black_bottom.png":[["grid_handle_black_bottom.8c95cb39.png","skins/default/grid_handle_black_bottom.png"],"skins/default/grid_handle_black_bottom.png"],"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64081" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js"], null)
//# sourceMappingURL=/unite-gallery.5183640d.js.map