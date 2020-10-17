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
})({"themes/carousel/ug-theme-carousel.js":[function(require,module,exports) {
if (typeof g_ugFunctions != "undefined") g_ugFunctions.registerTheme("carousel");else jQuery(document).ready(function () {
  g_ugFunctions.registerTheme("carousel");
});
/**
 * Grid gallery theme
 */

function UGTheme_carousel() {
  var t = this;
  var g_gallery = new UniteGalleryMain(),
      g_objGallery,
      g_objects,
      g_objWrapper;
  var g_lightbox = new UGLightbox(),
      g_carousel = new UGCarousel();
  var g_functions = new UGFunctions(),
      g_objTileDesign = new UGTileDesign();
  ;
  var g_objNavWrapper, g_objButtonLeft, g_objButtonRight, g_objButtonPlay, g_objPreloader;
  var g_apiDefine = new UG_API();
  var g_options = {
    theme_gallery_padding: 0,
    //the padding of the gallery wrapper
    theme_carousel_align: "center",
    //the align of the carousel
    theme_carousel_offset: 0,
    //the offset of the carousel from the align sides
    theme_enable_navigation: true,
    theme_navigation_position: "bottom",
    //top,bottom: the vertical position of the navigation reative to the carousel
    theme_navigation_enable_play: true,
    //enable / disable the play button of the navigation
    theme_navigation_align: "center",
    //the align of the navigation
    theme_navigation_offset_hor: 0,
    //horizontal offset of the navigation
    theme_navigation_margin: 20,
    //the space between the carousel and the navigation
    theme_space_between_arrows: 5 //the space between arrows in the navigation

  };
  var g_defaults = {
    gallery_width: "100%",
    tile_width: 160,
    tile_height: 160,
    tile_enable_border: true,
    tile_enable_outline: true,
    carousel_vertical_scroll_ondrag: true
  }; //temp variables

  var g_temp = {};
  /**
   * Init the theme
   */

  function initTheme(gallery, customOptions) {
    g_gallery = gallery; //set default options

    g_options = jQuery.extend(g_options, g_defaults); //set custom options

    g_options = jQuery.extend(g_options, customOptions); //modifyOptions();
    //set gallery options

    g_gallery.setOptions(g_options);
    g_gallery.setFreestyleMode();
    g_objects = gallery.getObjects(); //get some objects for local use

    g_objGallery = jQuery(gallery);
    g_objWrapper = g_objects.g_objWrapper; //init objects

    g_lightbox.init(gallery, g_options);
    g_carousel.init(gallery, g_options);
    g_objTileDesign = g_carousel.getObjTileDesign();
  }
  /**
   * set gallery html elements
   */


  function setHtml() {
    //add html elements
    g_objWrapper.addClass("ug-theme-carousel");
    g_carousel.setHtml(g_objWrapper);

    if (g_options.theme_enable_navigation == true) {
      var htmlAdd = "<div class='ug-tile-navigation-wrapper' style='position:absolute'>";
      htmlAdd += "<div class='ug-button-tile-navigation ug-button-tile-left'></div>"; //put play/pause button

      if (g_options.theme_navigation_enable_play == true) htmlAdd += "<div class='ug-button-tile-navigation ug-button-tile-play'></div>";
      htmlAdd += "<div class='ug-button-tile-navigation ug-button-tile-right'></div>";
      htmlAdd += "</div>";
      g_objWrapper.append(htmlAdd);
      g_objNavWrapper = g_objWrapper.children(".ug-tile-navigation-wrapper");
      g_objButtonLeft = g_objNavWrapper.children(".ug-button-tile-left");
      g_objButtonRight = g_objNavWrapper.children(".ug-button-tile-right");
      g_objButtonLeft.css("margin-right", g_options.theme_space_between_arrows + "px");

      if (g_options.theme_navigation_enable_play == true) {
        g_objButtonPlay = g_objNavWrapper.children(".ug-button-tile-play");
        g_objButtonPlay.css("margin-right", g_options.theme_space_between_arrows + "px");
      }
    }

    g_lightbox.putHtml(); //add preloader

    g_objWrapper.append("<div class='ug-tiles-preloader ug-preloader-trans'></div>");
    g_objPreloader = g_objWrapper.children(".ug-tiles-preloader");
    g_objPreloader.fadeTo(0, 0);
  }
  /**
   * get gallery width available for the grid
   */


  function getGalleryWidth() {
    var galleryWidth = g_gallery.getSize().width;
    galleryWidth -= g_options.theme_gallery_padding * 2;
    return galleryWidth;
  }
  /**
   * get estimated height of the carousel and the navigation
   */


  function getEstimatedHeight() {
    var height = g_carousel.getEstimatedHeight();

    if (g_objNavWrapper) {
      var navHeight = g_objNavWrapper.height();
      height += navHeight + g_options.theme_navigation_margin;
    }

    return height;
  }
  /**
   * actually run the theme
   */


  function actualRun() {
    //first set the height, maybe scrollbars will appear
    var galleryHeight = getEstimatedHeight();
    g_objWrapper.height(galleryHeight);
    var galleryWidth = getGalleryWidth();
    initEvents();
    g_carousel.setMaxWidth(galleryWidth);
    g_carousel.run();
    g_lightbox.run();
    positionElements();
  }
  /**
   * run the theme
   */


  function runTheme() {
    setHtml();
    actualRun();
  }
  /**
   * position elements
   */


  function positionElements() {
    var carouselElement = g_carousel.getElement();
    var sizeCar = g_functions.getElementSize(carouselElement);
    var navHeight = 0;

    if (g_objNavWrapper) {
      var sizeNav = g_functions.getElementSize(g_objNavWrapper);
      navHeight = sizeNav.height;
    }

    var galleryHeight = sizeCar.height;
    if (navHeight > 0) galleryHeight += g_options.theme_navigation_margin + navHeight; //vars for bottom nav position

    var carouselTop = 0;

    if (g_objNavWrapper) {
      var navTop = sizeCar.height + g_options.theme_navigation_margin; //change vars for top nav position

      if (g_options.theme_navigation_position == "top") {
        carouselTop = sizeNav.height + g_options.theme_navigation_margin;
        navTop = 0;
      }
    } //align the carousel


    g_functions.placeElement(carouselElement, g_options.theme_carousel_align, carouselTop, g_options.theme_carousel_offset, 0);
    var sizeCar = g_functions.getElementSize(carouselElement); //position buttons

    if (g_objNavWrapper) {
      var navX = sizeCar.left + g_functions.getElementRelativePos(g_objNavWrapper, g_options.theme_navigation_align, g_options.theme_navigation_offset_hor, carouselElement);
      g_functions.placeElement(g_objNavWrapper, navX, navTop);
    }

    g_objWrapper.height(galleryHeight); //temp height
    //place preloader

    g_functions.placeElement(g_objPreloader, "center", 50);
  }
  /**
   * on tile click - open lightbox
   */


  function onTileClick(data, objTile) {
    objTile = jQuery(objTile);
    var objItem = g_objTileDesign.getItemByTile(objTile);
    var index = objItem.index;
    g_lightbox.open(index);
  }
  /**
   * on gallery size change - resize the theme.
   */


  function onSizeChange() {
    var galleryWidth = getGalleryWidth();
    g_carousel.setMaxWidth(galleryWidth);
    g_carousel.run();
    positionElements();
  }
  /**
   * before items request: hide items, show preloader
   */


  function onBeforeReqestItems() {
    g_carousel.stopAutoplay();
    g_carousel.getElement().hide();
    if (g_objNavWrapper) g_objNavWrapper.hide(); //show preloader:

    g_objPreloader.fadeTo(0, 1);
  }
  /**
   * init api functions
   */


  function initAPIFunctions(event, api) {
    api.carouselStartAutoplay = function () {
      g_carousel.startAutoplay();
    };

    api.carouselStopAutoplay = function () {
      g_carousel.stopAutoplay();
    };

    api.carouselPause = function () {
      g_carousel.pauseAutoplay();
    };

    api.carouselUnpause = function () {
      g_carousel.unpauseAutoplay();
    };

    api.scrollLeft = function (numTiles) {
      g_carousel.scrollLeft(numTiles);
    };

    api.scrollRight = function (numTiles) {
      g_carousel.scrollRight(numTiles);
    };
  }
  /**
   * init buttons functionality and events
   */


  function initEvents() {
    //set navigation buttons events
    if (g_objNavWrapper) {
      g_carousel.setScrollLeftButton(g_objButtonRight);
      g_carousel.setScrollRightButton(g_objButtonLeft);
      if (g_objButtonPlay) g_carousel.setPlayPauseButton(g_objButtonPlay);
    }

    g_objGallery.on(g_gallery.events.SIZE_CHANGE, onSizeChange);
    g_objGallery.on(g_gallery.events.GALLERY_BEFORE_REQUEST_ITEMS, onBeforeReqestItems); //on click events

    jQuery(g_objTileDesign).on(g_objTileDesign.events.TILE_CLICK, onTileClick); //init api

    g_objGallery.on(g_apiDefine.events.API_INIT_FUNCTIONS, initAPIFunctions);
  }
  /**
   * destroy the carousel events
   */


  this.destroy = function () {
    if (g_objNavWrapper) {
      g_functions.destroyButton(g_objButtonRight);
      g_functions.destroyButton(g_objButtonLeft);
      if (g_objButtonPlay) g_functions.destroyButton(g_objButtonPlay);
    }

    g_objGallery.off(g_gallery.events.SIZE_CHANGE);
    jQuery(g_objTileDesign).off(g_objTileDesign.events.TILE_CLICK);
    g_objGallery.off(g_gallery.events.GALLERY_BEFORE_REQUEST_ITEMS);
    g_carousel.destroy();
    g_lightbox.destroy();
  };
  /**
   * run the theme setting
   */


  this.run = function () {
    runTheme();
  };
  /**
   * init 
   */


  this.init = function (gallery, customOptions) {
    initTheme(gallery, customOptions);
  };
}
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","themes/carousel/ug-theme-carousel.js"], null)
//# sourceMappingURL=/ug-theme-carousel.2627a763.js.map