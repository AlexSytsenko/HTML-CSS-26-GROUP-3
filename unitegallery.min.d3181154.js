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
})({"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/jquery/dist/jquery.js":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
var define;
/*!
 * jQuery JavaScript Library v3.5.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2020-05-04T22:49Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.5.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( _i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.5
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2020-03-14
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem.namespaceURI,
		docElem = ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
					dataPriv.get( this, "events" ) || Object.create( null )
				)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();
						return result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px";
				tr.style.height = "1px";
				trChild.style.height = "9px";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = parseInt( trStyle.height ) > 3;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
					jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = (
					dataPriv.get( cur, "events" ) || Object.create( null )
				)[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script
			if ( !isSuccess && jQuery.inArray( "script", s.dataTypes ) > -1 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			if ( typeof props.top === "number" ) {
				props.top += "px";
			}
			if ( typeof props.left === "number" ) {
				props.left += "px";
			}
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{"process":"../node_modules/process/browser.js"}],"js/unitegallery.min.js":[function(require,module,exports) {
var define;
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Unite Gallery, Version: 1.7.45, released 27 Feb 2017 
function debugLine(e, t, i) {
  e === !0 && (e = "true"), e === !1 && (e = "false");
  var n = e;

  if ("object" == _typeof(e)) {
    n = "";

    for (name in e) {
      var r = e[name];
      n += " " + name + ": " + r;
    }
  }

  if (1 != t || i || (n += " " + Math.random()), 1 == i) {
    var o = jQuery("#debug_line");
    o.width(200), o.height() >= 500 && o.html("");
    var a = o.html();
    n = a + "<br> -------------- <br>" + n;
  }

  jQuery("#debug_line").show().html(n);
}

function debugSide(e) {
  var t = "";

  for (name in e) {
    var i = e[name];
    t += name + " : " + i + "<br>";
  }

  jQuery("#debug_side").show().html(t);
}

function trace(e) {
  "undefined" != typeof console && console.log(e);
}

function UGFunctions() {
  function e(e, t, i) {
    t.addEventListener ? t.addEventListener(e, i, !1) : t.attachEvent ? t.attachEvent("on" + e, i) : t[e] = i;
  }

  var t = null,
      i = this,
      n = {
    starTime: 0,
    arrThemes: [],
    isTouchDevice: -1,
    isRgbaSupported: -1,
    timeCache: {},
    dataCache: {},
    lastEventType: "",
    lastEventTime: 0,
    lastTouchStartElement: null,
    touchThreshold: 700,
    handle: null
  };
  this.debugVar = "", this.z__________FULL_SCREEN___________ = function () {}, this.toFullscreen = function (e, t) {
    if (e.requestFullscreen) e.requestFullscreen();else if (e.mozRequestFullScreen) e.mozRequestFullScreen();else if (e.webkitRequestFullscreen) e.webkitRequestFullscreen();else {
      if (!e.msRequestFullscreen) return !1;
      e.msRequestFullscreen();
    }
    return !0;
  }, this.exitFullscreen = function () {
    if (0 == i.isFullScreen()) return !1;
    if (document.exitFullscreen) document.exitFullscreen();else if (document.cancelFullScreen) document.cancelFullScreen();else if (document.mozCancelFullScreen) document.mozCancelFullScreen();else if (document.webkitExitFullscreen) document.webkitExitFullscreen();else {
      if (!document.msExitFullscreen) return !1;
      document.msExitFullscreen();
    }
    return !0;
  }, this.addFullScreenChangeEvent = function (t) {
    document.webkitCancelFullScreen ? e("webkitfullscreenchange", document, t) : document.msExitFullscreen ? e("MSFullscreenChange", document, t) : document.mozCancelFullScreen ? e("mozfullscreenchange", document, t) : e("fullscreenchange", document, t);
  }, this.destroyFullScreenChangeEvent = function () {
    jQuery(document).unbind("fullscreenChange"), jQuery(document).unbind("mozfullscreenchange"), jQuery(document).unbind("webkitfullscreenchange"), jQuery(document).unbind("MSFullscreenChange");
  }, this.getFullScreenElement = function () {
    var e = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    return e;
  }, this.isFullScreen = function () {
    var e = document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement;
    return e = e ? !0 : !1;
  }, this.z__________GET_PROPS___________ = function () {}, this.getBrowserPrefix = function () {
    if (null !== t) return t;
    var e = ["webkit", "Moz", "ms", "O"],
        i = document.createElement("div");

    for (var n in e) {
      var r = e[n];
      if (r + "Transform" in i.style) return r = r.toLowerCase(), t = r, r;
    }

    return t = "", "";
  }, this.getImageInsideParentDataByImage = function (e, t, n) {
    var r = e.parent(),
        o = i.getImageOriginalSize(e),
        a = i.getImageInsideParentData(r, o.width, o.height, t, n);
    return a;
  }, this.getImageInsideParentData = function (e, t, i, n, r, o, a) {
    if (!r) var r = {};
    var s = {};
    if ("undefined" == typeof o) var o = e.width();
    if ("undefined" == typeof a) var a = e.height();
    r.padding_left && (o -= r.padding_left), r.padding_right && (o -= r.padding_right), r.padding_top && (a -= r.padding_top), r.padding_bottom && (a -= r.padding_bottom);
    var l = null,
        u = "100%",
        d = null,
        _ = null,
        g = "display:block;margin:0px auto;";

    if (t > 0 && i > 0) {
      if ("down" == n && o > t && a > i) u = i, l = t, _ = (o - l) / 2, d = (a - u) / 2;else if ("fill" == n) {
        var c = t / i;
        u = a, l = u * c, o > l ? (l = o, u = l / c, _ = 0, d = Math.round((u - a) / 2 * -1)) : (d = 0, _ = Math.round((l - o) / 2 * -1));
      } else {
        var c = t / i;
        u = a, l = u * c, d = 0, _ = (o - l) / 2, "fitvert" != n && l > o && (l = o, u = l / c, _ = 0, d = (a - u) / 2);
      }
      l = Math.floor(l), u = Math.floor(u), d = Math.floor(d), _ = Math.floor(_), g = "position:absolute;";
    }

    return r.padding_top && (d += r.padding_top), r.padding_left && (_ += r.padding_left), s.imageWidth = l, s.imageHeight = u, s.imageTop = d, s.imageLeft = _, s.imageRight = _ + l, 0 == d || "100%" == u ? s.imageBottom = null : s.imageBottom = d + u, s.style = g, s;
  }, this.getElementCenterPosition = function (e, t) {
    var n = e.parent(),
        r = i.getElementSize(e),
        o = i.getElementSize(n),
        a = o.width,
        s = o.height;
    t && void 0 !== t.padding_top && (s -= t.padding_top), t && void 0 !== t.padding_bottom && (s -= t.padding_bottom), t && void 0 !== t.padding_left && (a -= t.padding_left), t && void 0 !== t.padding_right && (a -= t.padding_right);
    var l = {};
    return l.left = Math.round((a - r.width) / 2), l.top = Math.round((s - r.height) / 2), t && void 0 !== t.padding_top && (l.top += t.padding_top), t && void 0 !== t.padding_left && (l.left += t.padding_left), l;
  }, this.getElementCenterPoint = function (e, t) {
    if (!t) var t = !1;
    var n = i.getElementSize(e),
        r = {};
    return r.x = n.width / 2, r.y = n.height / 2, 1 == t && (r.x += n.left, r.y += n.top), r.x = Math.round(r.x), r.y = Math.round(r.y), r;
  }, this.getMousePosition = function (e, t) {
    var i = {
      pageX: e.pageX,
      pageY: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY
    };

    if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length > 0 && (i.pageX = e.originalEvent.touches[0].pageX, i.pageY = e.originalEvent.touches[0].pageY, i.clientX = e.originalEvent.touches[0].clientX, i.clientY = e.originalEvent.touches[0].clientY), t) {
      var n = t.offset();
      i.mouseX = i.pageX - n.left, i.mouseY = i.pageY - n.top;
    }

    return i;
  }, this.getMouseElementPoint = function (e, t) {
    var n = {
      x: e.pageX,
      y: e.pageY
    },
        r = i.getElementLocalPoint(n, t);
    return r;
  }, this.getElementLocalPoint = function (e, t) {
    var i = {},
        n = t.offset();
    return i.x = Math.round(e.x - n.left), i.y = Math.round(e.y - n.top), i;
  }, this.getImageOriginalSize = function (e, t, i) {
    if ("undefined" != typeof t && "undefined" != typeof i) return {
      width: t,
      height: i
    };
    var n = e[0];
    if ("undefined" == typeof n) throw new Error("getImageOriginalSize error - Image not found");
    var r = {};

    if ("undefined" == typeof n.naturalWidth) {
      if ("number" == typeof e.data("naturalWidth")) {
        var r = {};
        return r.width = e.data("naturalWidth"), r.height = e.data("naturalHeight"), r;
      }

      var o = new Image();
      return o.src = n.src, o.complete ? (r.width = o.width, r.height = o.height, e.data("naturalWidth", r.width), e.data("naturalHeight", r.height), r) : {
        width: 0,
        height: 0
      };
    }

    return r.width = n.naturalWidth, r.height = n.naturalHeight, r;
  }, this.getimageRatio = function (e) {
    var t = i.getImageOriginalSize(e),
        n = i.getElementSize(e),
        r = n.width / t.width;
    return r;
  }, this.isImageFitParent = function (e) {
    var t = e.parent(),
        n = i.getElementSize(e),
        r = i.getElementSize(t);
    return n.width <= r.width && n.height <= r.height ? !0 : !1;
  }, this.getElementSize = function (e) {
    if (void 0 === e) throw new Error("Can't get size, empty element");
    var t = e.position();
    return t.height = e.outerHeight(), t.width = e.outerWidth(), t.left = Math.round(t.left), t.top = Math.round(t.top), t.right = t.left + t.width, t.bottom = t.top + t.height, t;
  }, this.isElementBiggerThenParent = function (e) {
    var t = e.parent(),
        n = i.getElementSize(e),
        r = i.getElementSize(t);
    return n.width > r.width || n.height > r.height ? !0 : !1;
  }, this.isPointInsideElement = function (e, t) {
    var i = e.x >= 0 && e.x < t.width;
    if (0 == i) return !1;
    var n = e.y >= 0 && e.y < t.height;
    return 0 == n ? !1 : !0;
  }, this.getElementRelativePos = function (e, t, n, r) {
    if (!r) var r = e.parent();
    if ("number" == typeof e) var o = {
      width: e,
      height: e
    };else var o = i.getElementSize(e);
    var a = i.getElementSize(r);

    switch (t) {
      case "top":
      case "left":
        t = 0, n && (t += n);
        break;

      case "center":
        t = Math.round((a.width - o.width) / 2), n && (t += n);
        break;

      case "right":
        t = a.width - o.width, n && (t -= n);
        break;

      case "middle":
        t = Math.round((a.height - o.height) / 2), n && (t += n);
        break;

      case "bottom":
        t = a.height - o.height, n && (t -= n);
    }

    return t;
  }, this.z_________SET_ELEMENT_PROPS_______ = function () {}, this.zoomImageInsideParent = function (e, t, n, r, o, a, s) {
    if (!n) var n = 1.2;
    if (!o) var o = "fit";

    var l,
        u,
        d,
        _,
        g = n,
        c = e.parent(),
        h = i.getElementSize(e),
        p = i.getImageOriginalSize(e),
        f = !1,
        m = 0,
        v = 0,
        b = 0,
        y = 0;

    if (r) {
      var I = i.getMouseElementPoint(r, e);
      f = i.isPointInsideElement(I, h), b = I.x, y = I.y;
    } else f = !1;

    if (0 == f) {
      var w = i.getElementCenterPoint(e);
      b = w.x, y = w.y;
    }

    if (1 == t) l = h.height * g, u = h.width * g, 0 != b && (m = -(b * g - b)), 0 != y && (v = -(y * g - y));else {
      l = h.height / g, u = h.width / g;
      var E = i.getImageInsideParentData(c, p.width, p.height, o, s);
      if (u < E.imageWidth) return i.scaleImageFitParent(e, p.width, p.height, o, s), !0;
      1 == f && (0 != b && (m = -(b / g - b)), 0 != y && (v = -(y / g - y)));
    }

    if (a) {
      var T = 1;
      if (0 != p.width && (T = u / p.width), T > a) return !1;
    }

    if (i.setElementSize(e, u, l), 0 == t && 0 == f) {
      var S = i.getElementCenterPosition(e);
      d = S.left, _ = S.top;
    } else d = h.left + m, _ = h.top + v;

    return i.placeElement(e, d, _), !0;
  }, this.placeElement = function (e, t, n, r, o, a) {
    if (0 == jQuery.isNumeric(t) || 0 == jQuery.isNumeric(n)) {
      if (!a) var a = e.parent();
      var s = i.getElementSize(e),
          l = i.getElementSize(a);
    }

    if (0 == jQuery.isNumeric(t)) switch (t) {
      case "left":
        t = 0, r && (t += r);
        break;

      case "center":
        t = Math.round((l.width - s.width) / 2), r && (t += r);
        break;

      case "right":
        t = l.width - s.width, r && (t -= r);
    }
    if (0 == jQuery.isNumeric(n)) switch (n) {
      case "top":
        n = 0, o && (n += o);
        break;

      case "middle":
      case "center":
        n = Math.round((l.height - s.height) / 2), o && (n += o);
        break;

      case "bottom":
        n = l.height - s.height, o && (n -= o);
    }
    var u = {
      position: "absolute",
      margin: "0px"
    };
    null !== t && (u.left = t), null !== n && (u.top = n), e.css(u);
  }, this.placeElementInParentCenter = function (e) {
    i.placeElement(e, "center", "middle");
  }, this.setElementSizeAndPosition = function (e, t, i, n, r) {
    var o = {
      width: n + "px",
      height: r + "px",
      left: t + "px",
      top: i + "px",
      position: "absolute",
      margin: "0px"
    };
    e.css(o);
  }, this.setElementSize = function (e, t, i) {
    var n = {
      width: t + "px"
    };
    null !== i && "undefined" != typeof i && (n.height = i + "px"), e.css(n);
  }, this.cloneElementSizeAndPos = function (e, t, n, r, o) {
    var a = e.position();
    if (void 0 == a) throw new Error("Can't get size, empty element");
    n === !0 ? (a.height = e.outerHeight(), a.width = e.outerWidth()) : (a.height = e.height(), a.width = e.width()), a.left = Math.round(a.left), a.top = Math.round(a.top), r && (a.left += r), o && (a.top += o), i.setElementSizeAndPosition(t, a.left, a.top, a.width, a.height);
  }, this.placeImageInsideParent = function (e, t, n, r, o, a) {
    var s = i.getImageInsideParentData(t, n, r, o, a),
        l = "<img";
    null !== s.imageWidth && (l += " width = '" + s.imageWidth + "'", s.style += "width:" + s.imageWidth + ";"), null != s.imageHeight && ("100%" == s.imageHeight ? (l += " height = '" + s.imageHeight + "'", s.style += "height:" + s.imageHeight + ";") : (l += " height = '" + s.imageHeight + "'", s.style += "height:" + s.imageHeight + "px;")), null !== s.imageTop && (s.style += "top:" + s.imageTop + "px;"), null !== s.imageLeft && (s.style += "left:" + s.imageLeft + "px;"), e = i.escapeDoubleSlash(e), l += " style='" + s.style + "'", l += ' src="' + e + '"', l += ">", t.html(l);
    var u = t.children("img");
    return u;
  }, this.scaleImageCoverParent = function (e, t, n) {
    if ("number" == typeof t) var r = t,
        o = n;else var r = t.outerWidth(),
        o = t.outerHeight();

    var a = i.getImageOriginalSize(e),
        s = a.width,
        l = a.height,
        u = s / l,
        d = o,
        _ = d * u,
        g = 0,
        c = 0;

    r > _ ? (_ = r, d = _ / u, c = 0, g = Math.round((d - o) / 2 * -1)) : (g = 0, c = Math.round((_ - r) / 2 * -1)), _ = Math.round(_), d = Math.round(d), e.css({
      width: _ + "px",
      height: d + "px",
      left: c + "px",
      top: g + "px"
    });
  }, this.scaleImageFitParent = function (e, t, n, r, o) {
    var a = e.parent(),
        s = i.getImageInsideParentData(a, t, n, r, o),
        l = !1,
        u = {};
    return null !== s.imageWidth && (l = !0, e.removeAttr("width"), u.width = s.imageWidth + "px"), null != s.imageHeight && (l = !0, e.removeAttr("height"), u.height = s.imageHeight + "px"), null !== s.imageTop && (l = !0, u.top = s.imageTop + "px"), null !== s.imageLeft && (l = !0, u.left = s.imageLeft + "px"), 1 == l && (u.position = "absolute", u.margin = "0px 0px", e.css(u)), s;
  }, this.scaleImageByHeight = function (e, t, n, r) {
    var o = i.getImageOriginalSize(e, n, r),
        a = o.width / o.height,
        s = Math.round(t * a);
    t = Math.round(t), i.setElementSize(e, s, t);
  }, this.scaleImageByWidth = function (e, t, n, r) {
    var o = i.getImageOriginalSize(e, n, r),
        a = o.width / o.height,
        s = Math.round(t / a);
    t = Math.round(t), i.setElementSize(e, t, s);
  }, this.scaleImageExactSizeInParent = function (e, t, n, r, o, a) {
    var s = e.parent(),
        l = i.getElementSize(s);
    l.width < r && (r = l.width), l.height < o && (o = l.height);
    var u = i.getImageInsideParentData(null, t, n, a, null, r, o),
        d = r,
        _ = o,
        g = u.imageLeft,
        c = u.imageLeft,
        h = u.imageTop,
        p = u.imageTop,
        f = Math.round((l.width - r) / 2),
        m = Math.round((l.height - o) / 2),
        v = u.imageWidth + g + c,
        b = r - v;
    0 != b && (c += b);
    var y = u.imageHeight + h + p,
        b = o - y;
    0 != b && (p += b), e.removeAttr("width"), e.removeAttr("height");
    var I = {
      position: "absolute",
      margin: "0px 0px"
    };
    I.width = d + "px", I.height = _ + "px", I.left = f + "px", I.top = m + "px", I["padding-left"] = g + "px", I["padding-top"] = h + "px", I["padding-right"] = c + "px", I["padding-bottom"] = p + "px", e.css(I);
    var w = {};
    return w.imageWidth = d, w.imageHeight = _, w;
  }, this.showElement = function (e, t, i) {
    e.show().fadeTo(0, 1), t && t.show().fadeTo(0, 1), i && i.show().fadeTo(0, 1);
  }, this.z_________GALLERY_RELATED_FUNCTIONS_______ = function () {}, this.disableButton = function (e, t) {
    if (!t) var t = "ug-button-disabled";
    0 == i.isButtonDisabled(e, t) && e.addClass(t);
  }, this.convertCustomPrefixOptions = function (e, t, i) {
    if (!t) return e;
    var n = {};
    return jQuery.each(e, function (e, r) {
      if (0 === e.indexOf(t + "_" + i + "_")) {
        var o = e.replace(t + "_" + i + "_", i + "_");
        n[o] = r;
      } else n[e] = r;
    }), n;
  }, this.enableButton = function (e, t) {
    if (!t) var t = "ug-button-disabled";
    1 == i.isButtonDisabled(e, t) && e.removeClass(t);
  }, this.isButtonDisabled = function (e, t) {
    if (!t) var t = "ug-button-disabled";
    return e.hasClass(t) ? !0 : !1;
  }, this.z_________MATH_FUNCTIONS_______ = function () {}, this.normalizeSetting = function (e, t, i, n, r, o) {
    if (!o) var o = !1;
    var a = (r - i) / (n - i);
    return r = e + (t - e) * a, 1 == o && (e > r && (r = e), r > t && (r = t)), r;
  }, this.getNormalizedValue = function (e, t, i, n, r) {
    var o = (r - e) / (t - e);
    return r = e + (n - i) * o;
  }, this.getDistance = function (e, t, i, n) {
    var r = Math.round(Math.sqrt(Math.abs((i - e) * (i - e) + (n - t) * (n - t))));
    return r;
  }, this.getMiddlePoint = function (e, t, i, n) {
    var r = {};
    return r.x = e + Math.round((i - e) / 2), r.y = t + Math.round((n - t) / 2), r;
  }, this.getNumItemsInSpace = function (e, t, i) {
    var n = Math.floor((e + i) / (t + i));
    return n;
  }, this.getNumItemsInSpaceRound = function (e, t, i) {
    var n = Math.round((e + i) / (t + i));
    return n;
  }, this.getSpaceByNumItems = function (e, t, i) {
    var n = e * t + (e - 1) * i;
    return n;
  }, this.getItemSizeInSpace = function (e, t, i) {
    var n = Math.floor((e - (t - 1) * i) / t);
    return n;
  }, this.getColX = function (e, t, i) {
    var n = e * (t + i);
    return n;
  }, this.getColByIndex = function (e, t) {
    var i = t % e;
    return i;
  }, this.getColRowByIndex = function (e, t) {
    var i = Math.floor(e / t),
        n = Math.floor(e % t);
    return {
      col: n,
      row: i
    };
  }, this.getIndexByRowCol = function (e, t, i) {
    if (0 > e) return -1;
    if (0 > t) return -1;
    var n = e * i + t;
    return n;
  }, this.getPrevRowSameColIndex = function (e, t) {
    var n = i.getColRowByIndex(e, t),
        r = i.getIndexByRowCol(n.row - 1, n.col, t);
    return r;
  }, this.getNextRowSameColIndex = function (e, t) {
    var n = i.getColRowByIndex(e, t),
        r = i.getIndexByRowCol(n.row + 1, n.col, t);
    return r;
  }, this.z_________DATA_FUNCTIONS_______ = function () {}, this.setGlobalData = function (e, t) {
    jQuery.data(document.body, e, t);
  }, this.getGlobalData = function (e) {
    var t = jQuery.data(document.body, e);
    return t;
  }, this.z_________EVENT_DATA_FUNCTIONS_______ = function () {}, this.handleScrollTop = function (e) {
    if (0 == i.isTouchDevice()) return null;
    var t = i.getStoredEventData(e),
        r = 15,
        o = 15;
    if (null === t.scrollDir && (Math.abs(t.diffMouseX) > r ? t.scrollDir = "hor" : Math.abs(t.diffMouseY) > o && Math.abs(t.diffMouseY) > Math.abs(t.diffMouseX) && (t.scrollDir = "vert", t.scrollStartY = t.lastMouseClientY, t.scrollOrigin = jQuery(document).scrollTop(), n.dataCache[e].scrollStartY = t.lastMouseClientY, n.dataCache[e].scrollOrigin = t.scrollOrigin), n.dataCache[e].scrollDir = t.scrollDir), "vert" !== t.scrollDir) return t.scrollDir;
    var a = (jQuery(document).scrollTop(), t.scrollOrigin - (t.lastMouseClientY - t.scrollStartY));
    return a >= 0 && jQuery(document).scrollTop(a), t.scrollDir;
  }, this.wasVerticalScroll = function (e) {
    var t = i.getStoredEventData(e);
    return "vert" === t.scrollDir ? !0 : !1;
  }, this.storeEventData = function (e, t, r) {
    var o = i.getMousePosition(e),
        a = jQuery.now(),
        s = {
      startTime: a,
      lastTime: a,
      startMouseX: o.pageX,
      startMouseY: o.pageY,
      lastMouseX: o.pageX,
      lastMouseY: o.pageY,
      startMouseClientY: o.clientY,
      lastMouseClientY: o.clientY,
      scrollTop: jQuery(document).scrollTop(),
      scrollDir: null
    };
    r && (s = jQuery.extend(s, r)), n.dataCache[t] = s;
  }, this.updateStoredEventData = function (e, t, r) {
    if (!n.dataCache[t]) throw new Error("updateEventData error: must have stored cache object");
    var o = n.dataCache[t],
        a = i.getMousePosition(e);
    o.lastTime = jQuery.now(), void 0 !== a.pageX && (o.lastMouseX = a.pageX, o.lastMouseY = a.pageY, o.lastMouseClientY = a.clientY), r && (o = jQuery.extend(o, r)), n.dataCache[t] = o;
  }, this.getStoredEventData = function (e, t) {
    if (!n.dataCache[e]) throw new Error("updateEventData error: must have stored cache object");
    var i = n.dataCache[e];
    return i.diffMouseX = i.lastMouseX - i.startMouseX, i.diffMouseY = i.lastMouseY - i.startMouseY, i.diffMouseClientY = i.lastMouseClientY - i.startMouseClientY, i.diffTime = i.lastTime - i.startTime, t === !0 ? (i.startMousePos = i.lastMouseY, i.lastMousePos = i.lastMouseY, i.diffMousePos = i.diffMouseY) : (i.startMousePos = i.lastMouseX, i.lastMousePos = i.lastMouseX, i.diffMousePos = i.diffMouseX), i;
  }, this.isApproveStoredEventClick = function (e, t) {
    if (!n.dataCache[e]) return !0;
    var r = i.getStoredEventData(e, t),
        o = Math.abs(r.diffMousePos);
    return r.diffTime > 400 ? !1 : o > 30 ? !1 : !0;
  }, this.clearStoredEventData = function (e) {
    n.dataCache[e] = null;
  }, this.z_________CHECK_SUPPORT_FUNCTIONS_______ = function () {}, this.isCanvasExists = function () {
    var e = jQuery('<canvas width="500" height="500" > </canvas>')[0];
    return "function" == typeof e.getContext ? !0 : !1;
  }, this.isScrollbarExists = function () {
    var e = window.innerWidth > document.documentElement.clientWidth;
    return e;
  }, this.isTouchDevice = function () {
    if (-1 !== n.isTouchDevice) return n.isTouchDevice;

    try {
      document.createEvent("TouchEvent"), n.isTouchDevice = !0;
    } catch (e) {
      n.isTouchDevice = !1;
    }

    return n.isTouchDevice;
  }, this.isRgbaSupported = function () {
    if (-1 !== n.isRgbaSupported) return n.isRgbaSupported;
    var e = document.getElementsByTagName("script")[0],
        t = e.style.color;

    try {
      e.style.color = "rgba(1,5,13,0.44)";
    } catch (i) {}

    var r = e.style.color != t;
    return e.style.color = t, n.isRgbaSupported = r, r;
  }, this.z_________GENERAL_FUNCTIONS_______ = function () {}, this.checkMinJqueryVersion = function (e) {
    for (var t = jQuery.fn.jquery.split("."), i = e.split("."), n = 0, r = t.length; r > n; n++) {
      var o = parseInt(t[n]),
          a = parseInt(i[n]);
      if ("undefined" == typeof i[n]) return !0;
      if (a > o) return !1;
      if (o > a) return !0;
    }

    return !0;
  }, this.getCssSizeParam = function (e) {
    return jQuery.isNumeric(e) ? e + "px" : e;
  }, this.convertHexToRGB = function (e, t) {
    var i = e.replace("#", "");
    return i === e ? e : (r = parseInt(i.substring(0, 2), 16), g = parseInt(i.substring(2, 4), 16), b = parseInt(i.substring(4, 6), 16), result = "rgba(" + r + "," + g + "," + b + "," + t + ")", result);
  }, this.timestampToString = function (e) {
    var t = new Date(e),
        i = t.getDate() + "/" + t.getMonth();
    return i += " " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds();
  }, this.getArrTouches = function (e) {
    var t = [];
    return e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length > 0 && (t = e.originalEvent.touches), t;
  }, this.getArrTouchPositions = function (e) {
    for (var t = [], i = 0; i < e.length; i++) {
      var n = {
        pageX: e[i].pageX,
        pageY: e[i].pageY
      };
      t.push(n);
    }

    return t;
  }, this.startTimeDebug = function () {
    n.starTime = jQuery.now();
  }, this.showTimeDebug = function () {
    var e = jQuery.now(),
        t = e - n.starTime;
    debugLine({
      "Time Passed": t
    }, !0);
  }, this.initProgressIndicator = function (e, t, n) {
    switch ("bar" != e && 0 == i.isCanvasExists() && (e = "bar"), e) {
      case "bar":
        var r = new UGProgressBar();
        r.putHidden(n, t);
        break;

      default:
      case "pie":
        var r = new UGProgressPie();
        r.putHidden(n, t);
        break;

      case "pie2":
        t.type_fill = !0;
        var r = new UGProgressPie();
        r.putHidden(n, t);
    }

    return r;
  }, this.setButtonMobileReady = function (e) {
    e.on("touchstart", function (e) {
      jQuery(this).addClass("ug-nohover");
    }), e.on("mousedown touchend", function (e) {
      return e.stopPropagation(), e.stopImmediatePropagation(), !1;
    });
  }, this.registerTheme = function (e) {
    n.arrThemes.push(e);
  }, this.getArrThemes = function () {
    return n.arrThemes;
  }, this.isThemeRegistered = function (e) {
    return -1 !== jQuery.inArray(e, n.arrThemes) ? !0 : !1;
  }, this.getFirstRegisteredTheme = function () {
    if (0 == n.arrThemes.length) return "";
    var e = n.arrThemes[0];
    return e;
  }, this.isTimePassed = function (e, t) {
    if (!t) var t = 100;
    var i = jQuery.now();
    0 == n.timeCache.hasOwnProperty(e) ? lastTime = 0 : lastTime = n.timeCache[e];
    var r = i - lastTime;
    return n.timeCache[e] = i, t >= r ? !1 : !0;
  }, this.whenContiniousEventOver = function (e, t, i) {
    if (!i) var i = 300;
    1 == n.timeCache.hasOwnProperty(e) && null != n.timeCache[e] && (clearTimeout(n.timeCache[e]), n.timeCache[e] = null), n.timeCache[e] = setTimeout(t, i);
  }, this.validateClickTouchstartEvent = function (e) {
    var t = !0,
        i = jQuery.now() - n.lastEventTime;
    return "click" == e && "touchstart" == n.lastEventType && 1e3 > i && (t = !1), n.lastEventTime = jQuery.now(), n.lastEventType = e, t;
  }, this.addClassOnHover = function (e, t) {
    if (!t) var t = "ug-button-hover";
    e.hover(function () {
      jQuery(this).addClass(t);
    }, function () {
      jQuery(this).removeClass(t);
    });
  }, this.destroyButton = function (e) {
    e.off("mouseenter"), e.off("mouseleave"), e.off("click"), e.off("touchstart"), e.off("touchend"), e.off("mousedown"), e.off("tap");
  }, this.setButtonOnClick = function (e, t) {
    i.setButtonMobileReady(e), e.on("click touchstart", function (e) {
      return objThis = jQuery(this), e.stopPropagation(), e.stopImmediatePropagation(), 0 == i.validateClickTouchstartEvent(e.type) ? !0 : void t(objThis, e);
    });
  }, this.setButtonOnTap = function (e, t) {
    e.on("tap", t), 0 == i.isTouchDevice() ? e.on("click", function (e) {
      var t = jQuery(this);
      return 0 == i.validateClickTouchstartEvent(e.type) ? !0 : void t.trigger("tap");
    }) : (e.on("touchstart", function (e) {
      var t = jQuery(this);
      t.addClass("ug-nohover"), n.lastTouchStartElement = jQuery(this), n.lastEventTime = jQuery.now();
    }), e.on("touchend", function (e) {
      var t = jQuery(this);
      if (0 == t.is(n.lastTouchStartElement)) return !0;
      if (!n.lastEventTime) return !0;
      var i = jQuery.now() - n.lastEventTime;
      return i > n.touchThreshold ? !0 : void t.trigger("tap");
    }));
  }, this.loadJs = function (e, t) {
    t === !0 && (e = location.protocol + "//" + e);
    var i = document.createElement("script");
    i.src = e;
    var n = document.getElementsByTagName("script")[0];
    n.parentNode.insertBefore(i, n);
  }, this.loadCss = function (e, t) {
    t === !0 && (e = location.protocol + "//" + e);
    var i = document.createElement("link");
    i.setAttribute("rel", "stylesheet"), i.setAttribute("type", "text/css"), i.setAttribute("href", e), document.getElementsByTagName("head")[0].appendChild(i);
  }, this.addEvent = function (e, t, i) {
    "undefined" != typeof e.addEventListener ? e.addEventListener(t, i, !1) : e.attachEvent && e.attachEvent("on" + t, i);
  }, this.checkImagesLoaded = function (e, t, i) {
    function n(e, n) {
      r++, "function" == typeof i && setTimeout(function () {
        i(e, n);
      }), r == o && "function" == typeof t && setTimeout(function () {
        t();
      });
    }

    var r = 0,
        o = e.length;
    return 0 == o && t ? (t(), !1) : void setTimeout(function () {
      for (var t = 0; o > t; t++) {
        var i = e[t];
        if (void 0 !== i.naturalWidth && 0 !== i.naturalWidth) n(e[t], !1);else {
          var r = jQuery("<img/>");
          r.data("index", t), r.on("load", function () {
            var t = jQuery(this).data("index");
            n(e[t], !1);
          }), r.on("error", function () {
            var t = jQuery(this).data("index");
            n(e[t], !0);
          }), r.attr("src", i.src);
        }
      }
    });
  }, this.waitForWidth = function (e, t) {
    var i = e.width();
    return 0 != i ? (t(), !1) : void (n.handle = setInterval(function () {
      i = e.width(), 0 != i && (clearInterval(n.handle), t());
    }, 300));
  }, this.arrayShuffle = function (e) {
    if ("object" != _typeof(e)) return e;

    for (var t, i, n = e.length; n; t = parseInt(Math.random() * n), i = e[--n], e[n] = e[t], e[t] = i) {
      ;
    }

    return e;
  }, this.getObjectLength = function (e) {
    var t = 0;

    for (var i in e) {
      t++;
    }

    return t;
  }, this.normalizePercent = function (e) {
    return 0 > e && (e = 0), e > 1 && (e = 1), e;
  }, this.stripTags = function (e) {
    var t = e.replace(/(<([^>]+)>)/gi, "");
    return t;
  }, this.escapeDoubleSlash = function (e) {
    return e.replace('"', '"');
  }, this.htmlentitles = function (e) {
    var t = jQuery("<div/>").text(e).html();
    return t;
  }, this.z_________END_GENERAL_FUNCTIONS_______ = function () {};
}

function UGThumbsGeneral() {
  function e(e, t) {
    var i = w[e],
        n = "";
    0 == C.customThumbs && (n = " ug-thumb-generated");
    var r = i.index + 1,
        o = "style='z-index:" + r + ";'",
        a = "<div class='ug-thumb-wrapper" + n + "' " + o + "></div>";

    if (1 == j.thumb_wrapper_as_link) {
      var s = i.link;
      "" == i.link && (s = "javascript:void(0)");
      var l = "";
      1 == j.thumb_link_newpage && i.link && (l = " target='_blank'");
      var a = "<a href='" + s + "'" + l + " class='ug-thumb-wrapper" + n + "'></a>";
    }

    var u = jQuery(a),
        d = i.objThumbImage;

    if (0 == C.customThumbs) {
      if (1 == j.thumb_show_loader && d) {
        var _ = "ug-thumb-loader-dark";
        "bright" == j.thumb_loader_type && (_ = "ug-thumb-loader-bright"), u.append("<div class='ug-thumb-loader " + _ + "'></div>"), u.append("<div class='ug-thumb-error' style='display:none'></div>");
      }

      if (d) {
        if (d.addClass("ug-thumb-image"), 1 == j.thumb_image_overlay_effect) {
          var g = d.clone().appendTo(u);
          g.addClass("ug-thumb-image-overlay " + t).removeClass("ug-thumb-image"), g.fadeTo(0, 0), i.objImageOverlay = g;
        }

        u.append(d);
      }
    }

    return C.isEffectBorder && u.append("<div class='ug-thumb-border-overlay'></div>"), C.isEffectOverlay && u.append("<div class='ug-thumb-overlay'></div>"), E.append(u), C.customThumbs && C.funcSetCustomThumbHtml(u, i), w[e].objThumbWrapper = u, u;
  }

  function t(e, t, i, n) {
    var r = {
      width: e + "px",
      height: t + "px"
    },
        o = {
      width: e - C.thumbInnerReduce + "px",
      height: t - C.thumbInnerReduce + "px"
    },
        a = ".ug-thumb-loader, .ug-thumb-error, .ug-thumb-border-overlay, .ug-thumb-overlay";
    i ? (n !== !0 && i.css(r), i.find(a).css(o)) : (E.children(".ug-thumb-wrapper").css(r), E.find(a).css(o));
  }

  function i(e, t, i, n) {
    if (!n) var n = !1;
    P.isFakeFullscreen() && (n = !0);
    var r = e.children(".ug-thumb-border-overlay"),
        o = {};
    o["border-width"] = t + "px", 0 != t && (o["border-color"] = i), n && n === !0 ? (r.css(o), 0 == t ? r.hide() : r.show()) : (0 == t ? r.stop().fadeOut(j.thumb_transition_duration) : r.show().stop().fadeIn(j.thumb_transition_duration), l(r, o));
  }

  function n(e, t, i) {
    var n = e.children(".ug-thumb-overlay"),
        r = j.thumb_transition_duration;
    i && i === !0 && (r = 0), t ? n.stop(!0).fadeTo(r, C.colorOverlayOpacity) : n.stop(!0).fadeTo(r, 0);
  }

  function r(e, t, i) {
    var n = e.children("img.ug-thumb-image"),
        r = e.children("img.ug-thumb-image-overlay"),
        o = j.thumb_transition_duration;
    i && i === !0 && (o = 0), t ? r.stop(!0).fadeTo(o, 1) : (n.fadeTo(0, 1), r.stop(!0).fadeTo(o, 0));
  }

  function o(e, t) {
    if (C.isEffectBorder && i(e, j.thumb_selected_border_width, j.thumb_selected_border_color, t), C.isEffectOverlay) {
      var o = 1 == j.thumb_overlay_reverse ? !0 : !1;
      n(e, o, t);
    }

    C.isEffectImage && r(e, !1, t), S.trigger(T.events.SETSELECTEDSTYLE, e);
  }

  function a(e) {
    var t = T.getItemByThumb(e);
    return t.isLoaded = !0, t.isThumbImageLoaded = !1, 1 == C.customThumbs ? (S.trigger(T.events.IMAGELOADERROR, e), !0) : (e.children(".ug-thumb-loader").hide(), void e.children(".ug-thumb-error").show());
  }

  function s(e) {
    if (j.thumb_round_corners_radius <= 0) return !1;
    var t = {
      "border-radius": j.thumb_round_corners_radius + "px"
    };
    e ? (e.css(t), e.find(".ug-thumb-border-overlay").css(t)) : E.find(".ug-thumb-wrapper, .ug-thumb-wrapper .ug-thumb-border-overlay").css(t);
  }

  function l(e, t) {
    e.stop(!0).animate(t, {
      duration: j.thumb_transition_duration,
      easing: j.thumb_transition_easing,
      queue: !1
    });
  }

  function u(e) {
    1 == c(e) ? o(e, !0, "redraw") : T.setThumbNormalStyle(e, !0, "redraw");
  }

  function d(e, i, n) {
    if (1 == j.thumb_fixed_size) x.scaleImageCoverParent(i, e);else {
      "height" == j.thumb_resize_by ? x.scaleImageByHeight(i, j.thumb_height) : x.scaleImageByWidth(i, j.thumb_width);
      var r = x.getElementSize(i);
      x.placeElement(i, 0, 0), t(r.width, r.height, e);
    }
    e.children(".ug-thumb-loader").hide(), i.show(), 0 == j.thumb_image_overlay_effect ? i.fadeTo(0, 1) : (1 == j.thumb_image_overlay_effect && _(i), i.fadeTo(0, 0), u(e)), S.trigger(T.events.AFTERPLACEIMAGE, e);
  }

  function _(e) {
    var t = e.siblings(".ug-thumb-image-overlay");
    if (0 == t.length) return !1;
    var i = x.getElementSize(e),
        n = {
      width: i.width + "px",
      height: i.height + "px",
      left: i.left + "px",
      top: i.top + "px"
    };
    t.css(n), 0 == C.customThumbs && t.fadeTo(0, 1);
  }

  function g() {
    var e = "",
        t = j.thumb_image_overlay_type.split(",");

    for (var i in t) {
      var n = t[i];

      switch (n) {
        case "bw":
          e += " ug-bw-effect";
          break;

        case "blur":
          e += " ug-blur-effect";
          break;

        case "sepia":
          e += " ug-sepia-effect";
      }
    }

    return e;
  }

  function c(e) {
    return e.hasClass("ug-thumb-selected") ? !0 : !1;
  }

  function h(e, i) {
    i = jQuery(i);
    var n = (T.getItemByThumb(i), x.getElementSize(i));
    t(n.width, n.height, i, !0), u(i);
  }

  function p(e) {
    return 1 == C.touchEnabled ? (objThumbs.off("mouseenter").off("mouseleave"), !0) : void (0 == c(e) && T.setThumbOverStyle(e));
  }

  function f(e) {
    return 1 == C.touchEnabled ? !0 : void (0 == c(e) && T.setThumbNormalStyle(e, !1));
  }

  function m(e, t) {
    if (!t) var t = !1;
    var i = jQuery(e),
        n = i.parents(".ug-thumb-wrapper");
    return 0 == n.parent().length ? !1 : (objItem = T.getItemByThumb(n), 1 == objItem.isLoaded && t === !1 ? !1 : (T.triggerImageLoadedEvent(n, i), void (1 == C.customThumbs ? S.trigger(T.events.PLACEIMAGE, [n, i]) : d(n, i, objItem))));
  }

  function v(e, t, i) {
    objItem = T.getItemByThumb(t), objItem.isLoaded = !0, objItem.isThumbImageLoaded = !0;
    var n = x.getImageOriginalSize(i);
    objItem.thumbWidth = n.width, objItem.thumbHeight = n.height, objItem.thumbRatioByWidth = n.width / n.height, objItem.thumbRatioByHeight = n.height / n.width, t.addClass("ug-thumb-ratio-set");
  }

  var b,
      y,
      I,
      w,
      E,
      T = this,
      S = jQuery(T),
      P = new UniteGalleryMain(),
      x = new UGFunctions();
  this.type = {
    GET_THUMBS_ALL: "all",
    GET_THUMBS_RATIO: "ratio",
    GET_THUMBS_NO_RATIO: "no_ratio",
    GET_THUMBS_NEW: "new"
  }, this.events = {
    SETOVERSTYLE: "thumbmouseover",
    SETNORMALSTYLE: "thumbmouseout",
    SETSELECTEDSTYLE: "thumbsetselected",
    PLACEIMAGE: "thumbplaceimage",
    AFTERPLACEIMAGE: "thumb_after_place_image",
    IMAGELOADERROR: "thumbimageloaderror",
    THUMB_IMAGE_LOADED: "thumb_image_loaded"
  };
  var j = {
    thumb_width: 88,
    thumb_height: 50,
    thumb_fixed_size: !0,
    thumb_resize_by: "height",
    thumb_border_effect: !0,
    thumb_border_width: 0,
    thumb_border_color: "#000000",
    thumb_over_border_width: 0,
    thumb_over_border_color: "#d9d9d9",
    thumb_selected_border_width: 1,
    thumb_selected_border_color: "#d9d9d9",
    thumb_round_corners_radius: 0,
    thumb_color_overlay_effect: !0,
    thumb_overlay_color: "#000000",
    thumb_overlay_opacity: .4,
    thumb_overlay_reverse: !1,
    thumb_image_overlay_effect: !1,
    thumb_image_overlay_type: "bw",
    thumb_transition_duration: 200,
    thumb_transition_easing: "easeOutQuad",
    thumb_show_loader: !0,
    thumb_loader_type: "dark",
    thumb_wrapper_as_link: !1,
    thumb_link_newpage: !1
  },
      C = {
    touchEnabled: !1,
    num_thumbs_checking: 0,
    customThumbs: !1,
    funcSetCustomThumbHtml: null,
    isEffectBorder: !1,
    isEffectOverlay: !1,
    isEffectImage: !1,
    colorOverlayOpacity: 1,
    thumbInnerReduce: 0,
    allowOnResize: !0,
    classNewThumb: "ug-new-thumb"
  },
      A = {
    timeout_thumb_check: 100,
    thumb_max_check_times: 600,
    eventSizeChange: "thumb_size_change"
  };
  this.init = function (e, t) {
    y = e.getObjects(), P = e, b = jQuery(e), I = y.g_objWrapper, w = y.g_arrItems, j = jQuery.extend(j, t), C.isEffectBorder = j.thumb_border_effect, C.isEffectOverlay = j.thumb_color_overlay_effect, C.isEffectImage = j.thumb_image_overlay_effect;
  }, this._____________EXTERNAL_SETTERS__________ = function () {}, this.setHtmlThumbs = function (t, i) {
    if (E = t, 1 == C.isEffectImage) var n = g();
    if (i !== !0) for (var r = P.getNumItems(), o = 0; r > o; o++) {
      e(o, n);
    } else {
      var a = T.getThumbs();
      a.removeClass(C.classNewThumb);
      var s = P.getNewAddedItemsIndexes();
      jQuery.each(s, function (t, i) {
        var r = e(i, n);
        r.addClass(C.classNewThumb);
      });
    }
  }, this.setThumbNormalStyle = function (e, t, o) {
    if (1 == C.customThumbs && e.removeClass("ug-thumb-over"), C.isEffectBorder && i(e, j.thumb_border_width, j.thumb_border_color, t), C.isEffectOverlay) {
      var a = 1 == j.thumb_overlay_reverse ? !1 : !0;
      n(e, a, t);
    }

    C.isEffectImage && r(e, !0, t), S.trigger(T.events.SETNORMALSTYLE, e);
  }, this.setThumbOverStyle = function (e) {
    if (1 == C.customThumbs && e.addClass("ug-thumb-over"), C.isEffectBorder && i(e, j.thumb_over_border_width, j.thumb_over_border_color), C.isEffectOverlay) {
      var t = 1 == j.thumb_overlay_reverse ? !0 : !1;
      n(e, t);
    }

    1 == C.isEffectImage && r(e, !1), S.trigger(T.events.SETOVERSTYLE, e);
  }, this.setHtmlProperties = function (e) {
    if (!e) var e = T.getThumbs();

    if (0 == C.customThumbs) {
      1 == j.thumb_fixed_size && t(j.thumb_width, j.thumb_height, e), s(e);
    }

    if (e.each(function () {
      var e = jQuery(this);
      u(e);
    }), C.isEffectOverlay && j.thumb_overlay_color) {
      var i = {};

      if (x.isRgbaSupported()) {
        var n = x.convertHexToRGB(j.thumb_overlay_color, j.thumb_overlay_opacity);
        i["background-color"] = n;
      } else i["background-color"] = j.thumb_overlay_color, C.colorOverlayOpacity = j.thumb_overlay_opacity;

      e.find(".ug-thumb-overlay").css(i);
    }
  }, this.setThumbSelected = function (e) {
    return 1 == C.customThumbs && e.removeClass("ug-thumb-over"), 1 == c(e) ? !0 : (e.addClass("ug-thumb-selected"), void o(e));
  }, this.setThumbUnselected = function (e) {
    e.removeClass("ug-thumb-selected"), T.setThumbNormalStyle(e, !1, "set unselected");
  }, this.setOptions = function (e) {
    j = jQuery.extend(j, e);
  }, this.setThumbInnerReduce = function (e) {
    C.thumbInnerReduce = e;
  }, this.setCustomThumbs = function (e, t, i) {
    if (C.customThumbs = !0, "function" != typeof e) throw new Error("The argument should be function");
    C.funcSetCustomThumbHtml = e, -1 == jQuery.inArray("overlay", t) && (C.isEffectOverlay = !1), -1 == jQuery.inArray("border", t) && (C.isEffectBorder = !1), C.isEffectImage = !1, i && i.allow_onresize === !1 && (C.allowOnResize = !1);
  }, this._____________EXTERNAL_GETTERS__________ = function () {}, this.getOptions = function () {
    return j;
  }, this.getNumThumbs = function () {
    var e = w.length;
    return e;
  }, this.getThumbImage = function (e) {
    var t = e.find(".ug-thumb-image");
    return t;
  }, this.getThumbByIndex = function (e) {
    var t = T.getThumbs();
    if (e >= t.length || 0 > e) throw new Error("Wrong thumb index");
    var i = jQuery(t[e]);
    return i;
  }, this.getThumbs = function (e) {
    var t = ".ug-thumb-wrapper",
        i = ".ug-thumb-ratio-set";

    switch (e) {
      default:
      case T.type.GET_THUMBS_ALL:
        var n = E.children(t);
        break;

      case T.type.GET_THUMBS_NO_RATIO:
        var n = E.children(t).not(i);
        break;

      case T.type.GET_THUMBS_RATIO:
        var n = E.children(t + i);
        break;

      case T.type.GET_THUMBS_NEW:
        var n = E.children("." + C.classNewThumb);
    }

    return n;
  }, this.getItemByThumb = function (e) {
    var t = e.data("index");
    void 0 === t && (t = e.index());
    var i = w[t];
    return i;
  }, this.isThumbLoaded = function (e) {
    var t = T.getItemByThumb(e);
    return t.isLoaded;
  }, this.getGlobalThumbSize = function () {
    var e = {
      width: j.thumb_width,
      height: j.thumb_height
    };
    return e;
  }, this._____________EXTERNAL_OTHERS__________ = function () {}, this.initEvents = function () {
    var e = ".ug-thumb-wrapper";
    1 == C.allowOnResize && I.on(A.eventSizeChange, h), S.on(T.events.THUMB_IMAGE_LOADED, v), E.on("touchstart", e, function () {
      C.touchEnabled = !0, E.off("mouseenter").off("mouseleave");
    }), E.on("mouseenter", e, function (e) {
      var t = jQuery(this);
      p(t);
    }), E.on("mouseleave", e, function (e) {
      var t = jQuery(this);
      f(t);
    });
  }, this.destroy = function () {
    var e = ".ug-thumb-wrapper";
    E.off("touchstart", e), I.off(A.eventSizeChange), E.off("mouseenter", e), E.off("mouseleave", e), S.off(T.events.THUMB_IMAGE_LOADED);
  }, this.loadThumbsImages = function () {
    var e = E.find(".ug-thumb-image");
    x.checkImagesLoaded(e, null, function (e, t) {
      if (0 == t) m(e, !0);else {
        var i = jQuery(e).parent();
        a(i);
      }
    });
  }, this.triggerImageLoadedEvent = function (e, t) {
    S.trigger(T.events.THUMB_IMAGE_LOADED, [e, t]);
  }, this.hideThumbs = function () {
    E.find(".ug-thumb-wrapper").hide();
  };
}

function UGThumbsStrip() {
  function e(e, i) {
    S = e.getObjects(), z = e, z.attachThumbsPanel("strip", O), T = jQuery(e), P = S.g_objWrapper, x = S.g_arrItems, k = jQuery.extend(k, i), H = k.strip_vertical_type, 1 == H && (k = jQuery.extend(k, D), k = jQuery.extend(k, i), i.thumb_resize_by = "width"), N.init(e, i), t();
  }

  function t() {
    var e = N.getOptions();
    R.isNotFixedThumbs = e.thumb_fixed_size === !1, H = k.strip_vertical_type;
  }

  function n() {
    N.setHtmlProperties(), o(), l(), s(), 0 == R.isRunOnce && (1 == k.strip_control_touch && (M = new UGTouchThumbsControl(), M.init(O)), 1 == k.strip_control_avia && (A = new UGAviaControl(), A.init(O)), p(), N.loadThumbsImages(), y()), R.isRunOnce = !0;
  }

  function r(e) {
    G.stripSize = e, 0 == H ? G.stripActiveSize = G.stripSize - k.strip_padding_left - k.strip_padding_right : G.stripActiveSize = G.stripSize - k.strip_padding_top - k.strip_padding_bottom, G.stripActiveSize < 0 && (G.stripActiveSize = 0);
  }

  function o() {
    var e = C.children(".ug-thumb-wrapper"),
        t = jQuery(e[0]),
        i = t.outerWidth(),
        n = t.outerHeight(),
        o = N.getOptions();
    0 == H ? (G.thumbSize = i, 1 == o.thumb_fixed_size ? G.thumbSecondSize = n : G.thumbSecondSize = o.thumb_height, r(j.width()), G.stripInnerSize = C.width()) : (G.thumbSize = n, 1 == o.thumb_fixed_size ? G.thumbSecondSize = i : G.thumbSecondSize = o.thumb_width, r(j.height()), G.stripInnerSize = C.height());
  }

  function a(e) {
    0 == H ? C.width(e) : C.height(e), G.stripInnerSize = e, p(), jQuery(O).trigger(O.events.INNER_SIZE_CHANGE);
  }

  function s() {
    var e = C.children(".ug-thumb-wrapper"),
        t = 0,
        n = 0;

    for (0 == H && (n = k.strip_padding_top), i = 0; i < e.length; i++) {
      var r = jQuery(e[i]);

      if (1 == R.isNotFixedThumbs) {
        if (objItem = N.getItemByThumb(r), 0 == objItem.isLoaded) continue;
        r.show();
      }

      L.placeElement(r, t, n), 0 == H ? t += r.outerWidth() + k.strip_space_between_thumbs : n += r.outerHeight() + k.strip_space_between_thumbs;
    }

    if (0 == H) var o = t - k.strip_space_between_thumbs;else var o = n - k.strip_space_between_thumbs;
    a(o);
  }

  function l() {
    if (0 == H) {
      var e = G.thumbSecondSize,
          t = {};
      t.height = e + "px";
      var i = {};
      i.height = e + "px";
    } else {
      var n = G.thumbSecondSize,
          t = {};
      t.width = n + "px";
      var i = {};
      i.width = n + "px";
    }

    j.css(t), C.css(i);
  }

  function u(e) {
    var t = O.getInnerStripPos(),
        i = t + e;
    i = O.fixInnerStripLimits(i), O.positionInnerStrip(i, !0);
  }

  function d(e) {
    var t = E(e),
        i = -1 * t.min;
    i = O.fixInnerStripLimits(i), O.positionInnerStrip(i, !0);
  }

  function _(e) {
    var t = E(e),
        i = -1 * t.max + G.stripSize;
    i = O.fixInnerStripLimits(i), O.positionInnerStrip(i, !0);
  }

  function g(e) {
    if (0 == I()) return !1;
    var t = w(),
        i = E(e);

    if (i.min < t.minPosThumbs) {
      var n = e.prev();
      d(n.length ? n : e);
    } else if (i.max > t.maxPosThumbs) {
      var r = e.next();

      _(r.length ? r : e);
    }
  }

  function c() {
    var e = z.getSelectedItem();
    if (null == e) return !0;
    var t = e.objThumbWrapper;
    t && g(t);
  }

  function h() {
    if (0 == I()) return !1;
    var e = O.getInnerStripPos(),
        t = O.fixInnerStripLimits(e);
    e != t && O.positionInnerStrip(t, !0);
  }

  function p() {
    var e = I();
    1 == e ? (A && A.enable(), M && M.enable()) : (A && A.disable(), M && M.disable());
  }

  function f() {
    return I() ? !1 : void (0 == H ? L.placeElement(C, k.strip_thumbs_align, 0) : L.placeElement(C, 0, k.strip_thumbs_align));
  }

  function m(e) {
    if (O.isTouchMotionActive()) {
      var t = M.isSignificantPassed();
      if (1 == t) return !0;
    }

    var i = N.getItemByThumb(e);
    z.selectItem(i);
  }

  function v() {
    clearTimeout(R.handle), R.handle = setTimeout(function () {
      s();
    }, 50);
  }

  function b() {
    var e = z.getSelectedItem();
    N.setThumbSelected(e.objThumbWrapper), g(e.objThumbWrapper);
  }

  function y() {
    N.initEvents();
    var e = j.find(".ug-thumb-wrapper");
    e.on("click touchend", function (e) {
      var t = jQuery(this);
      m(t);
    }), T.on(z.events.ITEM_CHANGE, b), R.isNotFixedThumbs && jQuery(N).on(N.events.AFTERPLACEIMAGE, v);
  }

  function I() {
    return G.stripInnerSize > G.stripActiveSize ? !0 : !1;
  }

  function w() {
    var e = {},
        t = O.getInnerStripPos();
    return e.minPosThumbs = -1 * t + 1, e.maxPosThumbs = -1 * t + G.stripSize - 1, e;
  }

  function E(e) {
    var t = {},
        i = e.position();
    return 0 == H ? (t.min = i.left, t.max = i.left + G.thumbSize) : (t.min = i.top, t.max = i.top + G.thumbSize), t;
  }

  var T,
      S,
      P,
      x,
      j,
      C,
      A,
      M,
      O = this,
      z = new UniteGalleryMain(),
      L = new UGFunctions(),
      H = !1,
      N = new UGThumbsGeneral(),
      L = new UGFunctions(),
      k = {
    strip_vertical_type: !1,
    strip_thumbs_align: "left",
    strip_space_between_thumbs: 6,
    strip_thumb_touch_sensetivity: 15,
    strip_scroll_to_thumb_duration: 500,
    strip_scroll_to_thumb_easing: "easeOutCubic",
    strip_control_avia: !0,
    strip_control_touch: !0,
    strip_padding_top: 0,
    strip_padding_bottom: 0,
    strip_padding_left: 0,
    strip_padding_right: 0
  },
      R = {
    isRunOnce: !1,
    is_placed: !1,
    isNotFixedThumbs: !1,
    handle: null
  },
      G = {
    stripSize: 0,
    stripActiveSize: 0,
    stripInnerSize: 0,
    thumbSize: 0,
    thumbSecondSize: 0
  };
  this.events = {
    STRIP_MOVE: "stripmove",
    INNER_SIZE_CHANGE: "size_change"
  };
  var D = {
    strip_thumbs_align: "top",
    thumb_resize_by: "width"
  };
  this.setHtml = function (e) {
    if (!e) {
      var e = P;
      null != k.parent_container && (e = k.parent_container);
    }

    e.append("<div class='ug-thumbs-strip'><div class='ug-thumbs-strip-inner'></div></div>"), j = e.children(".ug-thumbs-strip"), C = j.children(".ug-thumbs-strip-inner"), N.setHtmlThumbs(C), 1 == R.isNotFixedThumbs && N.hideThumbs();
  }, this.destroy = function () {
    var e = j.find(".ug-thumb-wrapper");
    e.off("click"), e.off("touchend"), T.off(z.events.ITEM_CHANGE), jQuery(N).off(N.events.AFTERPLACEIMAGE), M && M.destroy(), A && A.destroy(), N.destroy();
  }, this.________EXTERNAL_GENERAL___________ = function () {}, this.init = function (t, i) {
    e(t, i);
  }, this.run = function () {
    n();
  }, this.positionInnerStrip = function (e, t) {
    if (void 0 === t) var t = !1;
    if (0 == H) var i = {
      left: e + "px"
    };else var i = {
      top: e + "px"
    };
    0 == t ? (C.css(i), O.triggerStripMoveEvent()) : (O.triggerStripMoveEvent(), C.stop(!0).animate(i, {
      duration: k.strip_scroll_to_thumb_duration,
      easing: k.strip_scroll_to_thumb_easing,
      queue: !1,
      progress: function progress() {
        O.triggerStripMoveEvent();
      },
      always: function always() {
        O.triggerStripMoveEvent();
      }
    }));
  }, this.triggerStripMoveEvent = function () {
    jQuery(O).trigger(O.events.STRIP_MOVE);
  }, this.isTouchMotionActive = function () {
    if (!M) return !1;
    var e = M.isTouchActive();
    return e;
  }, this.isItemThumbVisible = function (e) {
    var t = e.objThumbWrapper,
        i = t.position(),
        n = -1 * O.getInnerStripPos();
    if (0 == H) var r = n + G.stripSize,
        o = i.left,
        a = i.left + t.width();else var r = n + G.stripSize,
        o = i.top,
        a = i.top + t.height();
    var s = !1;
    return a >= n && r >= o && (s = !0), s;
  }, this.getInnerStripPos = function () {
    return 0 == H ? C.position().left : C.position().top;
  }, this.getInnerStripLimits = function () {
    var e = {};
    return 0 == H ? e.maxPos = k.strip_padding_left : e.maxPos = k.strip_padding_top, e.minPos = -(G.stripInnerSize - G.stripActiveSize), e;
  }, this.fixInnerStripLimits = function (e) {
    var t = O.getInnerStripLimits();
    return e > t.maxPos && (e = t.maxPos), e < t.minPos && (e = t.minPos), e;
  }, this.scrollForeward = function () {
    u(-G.stripSize);
  }, this.scrollBack = function () {
    u(G.stripSize);
  }, this.________EXTERNAL_SETTERS___________ = function () {}, this.setOptions = function (e) {
    k = jQuery.extend(k, e), N.setOptions(e), t();
  }, this.setSizeVertical = function (e) {
    if (0 == H) throw new Error("setSizeVertical error, the strip size is not vertical");
    var t = G.thumbSecondSize,
        i = {};
    i.width = t + "px", i.height = e + "px", j.css(i), r(e);
    var n = {};
    n.width = t + "px", n.left = "0px", n.top = "0px", C.css(n), R.is_placed = !0, p();
  }, this.setSizeHorizontal = function (e) {
    if (1 == H) throw new Error("setSizeHorizontal error, the strip size is not horizontal");
    var t = G.thumbSecondSize + k.strip_padding_top + k.strip_padding_bottom,
        i = {};
    i.width = e + "px", i.height = t + "px", j.css(i), r(e);
    var n = k.strip_padding_left,
        o = {};
    o.height = t + "px", o.left = n + "px", o.top = "0px", C.css(o), R.is_placed = !0, p();
  }, this.setPosition = function (e, t, i, n) {
    L.placeElement(j, e, t, i, n);
  }, this.resize = function (e) {
    0 == H ? (j.width(e), G.stripActiveSize = e - k.strip_padding_left - k.strip_padding_right) : (j.height(e), G.stripActiveSize = e - k.strip_padding_top - k.strip_padding_bottom), r(e), p(), h(), f(), c();
  }, this.setThumbUnselected = function (e) {
    N.setThumbUnselected(e);
  }, this.setCustomThumbs = function (e) {
    N.setCustomThumbs(e);
  }, this.________EXTERNAL_GETTERS___________ = function () {}, this.getObjects = function () {
    var e = N.getOptions(),
        t = jQuery.extend(k, e),
        i = {
      g_gallery: z,
      g_objGallery: T,
      g_objWrapper: P,
      g_arrItems: x,
      g_objStrip: j,
      g_objStripInner: C,
      g_aviaControl: A,
      g_touchThumbsControl: M,
      isVertical: H,
      g_options: t,
      g_thumbs: N
    };
    return i;
  }, this.getObjThumbs = function () {
    return N;
  }, this.getSelectedThumb = function () {
    var e = z.getSelectedItemIndex();
    return -1 == e ? null : N.getThumbByIndex(e);
  }, this.getSizeAndPosition = function () {
    var e = L.getElementSize(j);
    return e;
  }, this.getHeight = function () {
    var e = j.outerHeight();
    return e;
  }, this.getWidth = function () {
    var e = j.outerWidth();
    return e;
  }, this.getSizes = function () {
    return G;
  }, this.isVertical = function () {
    return H;
  }, this.isPlaced = function () {
    return R.is_placed;
  }, this.isMoveEnabled = function () {
    var e = I();
    return e;
  };
}

function UGTouchThumbsControl() {
  function e() {
    var e = jQuery.now(),
        t = {};
    return t.passedTime = T.lastTime - T.startTime, t.lastActiveTime = e - T.buttonReleaseTime, t.passedDistance = T.lastPos - T.startPos, t.passedDistanceAbs = Math.abs(t.passedDistance), t;
  }

  function t() {
    E.thumb_touch_slowFactor = w.normalizeSetting(5e-5, .01, 1, 100, y.strip_thumb_touch_sensetivity, !0);
  }

  function i(e) {
    return 0 == I ? w.getMousePosition(e).pageX : w.getMousePosition(e).pageY;
  }

  function n(e) {
    var t = T.mousePos - e,
        i = T.innerPos - t,
        n = h.getInnerStripLimits();

    if (i > n.maxPos) {
      var r = i - n.maxPos;
      i = n.maxPos + r / 3;
    }

    if (i < n.minPos) {
      var r = n.minPos - i;
      i = n.minPos - r / 3;
    }

    h.positionInnerStrip(i);
  }

  function r(e) {
    var t = h.getInnerStripPos();
    T.mousePos = e, T.innerPos = t, T.lastPortionPos = t, T.lastDeltaTime = 0, T.lastDeltaPos = 0, T.startTime = jQuery.now(), T.startPos = T.innerPos, T.lastTime = T.startTime, T.lastPos = T.startPos, T.speed = 0;
  }

  function o() {
    var e = jQuery.now(),
        t = e - T.lastTime;
    t >= E.touch_portion_time && (T.lastDeltaTime = e - T.lastTime, T.lastDeltaTime > E.touch_portion_time && (T.lastDeltaTime = E.touch_portion_time), T.lastDeltaPos = T.lastPos - T.lastPortionPos, T.lastPortionPos = T.lastPos, T.lastTime = e);
  }

  function a() {
    var e = E.thumb_touch_slowFactor,
        t = E.minDeltaTime,
        i = E.minPath,
        n = h.getInnerStripPos(),
        r = jQuery.now(),
        o = r - T.lastTime,
        a = n - T.lastPortionPos;
    t > o && T.lastDeltaTime > 0 && (o = T.lastDeltaTime, a = T.lastDeltaPos + a), t > o && (o = t);
    var l = a > 0 ? 1 : -1,
        u = 0;
    o > 0 && (u = a / o);
    var d = u * u / (2 * e) * l;
    Math.abs(d) <= i && (d = 0);

    var _ = h.getInnerStripPos(),
        g = _ + d,
        c = h.fixInnerStripLimits(g),
        p = h.getInnerStripLimits(),
        f = E.limitsBreakAddition,
        m = !1,
        v = c;

    if (g > p.maxPos && (m = !0, c = f, f > g && (c = g)), g < p.minPos) {
      m = !0;
      var y = p.minPos - f;
      c = y, g > y && (c = g);
    }

    var w = c - _,
        S = Math.abs(Math.round(u / e));

    if (0 != d && (S = S * w / d), _ != c) {
      var P = {
        left: c + "px"
      };
      1 == I && (P = {
        top: c + "px"
      }), b.animate(P, {
        duration: S,
        easing: E.animationEasing,
        queue: !0,
        progress: s
      });
    }

    if (1 == m) {
      var x = E.returnAnimateSpeed,
          j = {
        left: v + "px"
      };
      1 == I && (j = {
        top: v + "px"
      }), b.animate(j, {
        duration: x,
        easing: E.returnAnimationEasing,
        queue: !0,
        progress: s
      });
    }
  }

  function s() {
    T.lastPos = h.getInnerStripPos(), h.triggerStripMoveEvent();
  }

  function l() {
    return 1 == T.loop_active ? !0 : (T.loop_active = !0, void (T.handle = setInterval(o, 10)));
  }

  function u(e) {
    if (0 == T.loop_active) return !0;

    if (e) {
      var t = i(e);
      a(t);
    }

    T.loop_active = !1, T.handle = clearInterval(T.handle);
  }

  function d(e) {
    return 0 == T.isControlEnabled ? !0 : (T.buttonReleaseTime = jQuery.now(), 0 == T.touch_active ? (u(e), !0) : (e.preventDefault(), T.touch_active = !1, u(e), void v.removeClass("ug-dragging")));
  }

  function _(e) {
    if (0 == T.isControlEnabled) return !0;
    e.preventDefault(), T.touch_active = !0;
    var t = i(e);
    b.stop(!0), r(t), l(), v.addClass("ug-dragging");
  }

  function g(e) {
    if (0 == T.isControlEnabled) return !0;
    if (0 == T.touch_active) return !0;
    if (e.preventDefault(), 0 == e.buttons) return T.touch_active = !1, u(e), !0;
    var t = i(e);
    T.lastPos = h.getInnerStripPos(), n(t), o();
  }

  function c() {
    v.bind("mousedown touchstart", _), jQuery(window).add("body").bind("mouseup touchend", d), jQuery("body").bind("mousemove touchmove", g);
  }

  var h,
      p,
      f,
      m,
      v,
      b,
      y,
      I,
      w = new UGFunctions(),
      E = {
    touch_portion_time: 200,
    thumb_touch_slowFactor: 0,
    minDeltaTime: 70,
    minPath: 10,
    limitsBreakAddition: 30,
    returnAnimateSpeed: 500,
    animationEasing: "easeOutCubic",
    returnAnimationEasing: "easeOutCubic"
  },
      T = {
    touch_active: !1,
    loop_active: !1,
    mousePos: 0,
    innerPos: 0,
    startPos: 0,
    startTime: 0,
    lastTime: 0,
    buttonReleaseTime: 0,
    lastPos: 0,
    lastPortionPos: 0,
    lastDeltaTime: 0,
    lastDeltaPos: 0,
    speed: 0,
    handle: "",
    touchEnabled: !1,
    isControlEnabled: !0
  };
  this.enable = function () {
    T.isControlEnabled = !0;
  }, this.disable = function () {
    T.isControlEnabled = !1;
  }, this.init = function (e) {
    h = e, m = e.getObjects(), p = m.g_gallery, f = m.g_objGallery, v = m.g_objStrip, b = m.g_objStripInner, y = m.g_options, I = m.isVertical, t(), c();
  }, this.isSignificantPassed = function () {
    var t = e();
    return t.passedTime > 300 ? !0 : t.passedDistanceAbs > 30 ? !0 : !1;
  }, this.isTouchActive = function () {
    if (1 == T.touch_active) return !0;
    if (1 == b.is(":animated")) return !0;
    var t = e();
    return t.lastActiveTime < 50 ? !0 : !1;
  }, this.destroy = function () {
    v.unbind("mousedown"), v.unbind("touchstart"), jQuery(window).add("body").unbind("mouseup").unbind("touchend"), jQuery("body").unbind("mousemove").unbind("touchmove");
  };
}

function UGPanelsBase() {
  function e(e, t) {
    switch (n.orientation) {
      case "right":
      case "left":
        var i = {
          left: e + "px"
        };
        break;

      case "top":
      case "bottom":
        var i = {
          top: e + "px"
        };
    }

    o.stop(!0).animate(i, {
      duration: 300,
      easing: "easeInOutQuad",
      queue: !1,
      complete: function complete() {
        t && t();
      }
    });
  }

  function t(e) {
    switch (n.orientation) {
      case "right":
      case "left":
        g.placeElement(o, e, null);
        break;

      case "top":
      case "bottom":
        g.placeElement(o, null, e);
    }
  }

  function i() {
    s.trigger(r.events.FINISH_MOVE);
  }

  var n,
      r,
      o,
      a,
      s,
      l,
      u,
      d = new UniteGalleryMain(),
      _ = this,
      g = new UGFunctions();

  this.init = function (e, t, i, o, l) {
    n = t, r = i, d = e, a = o, s = l, u = jQuery(d);
  }, this.setHtml = function (e) {
    if (o = e, "strip" == n.panelType) var t = a.strippanel_enable_handle;else var t = a.gridpanel_enable_handle;

    if (1 == t && (l = new UGPanelHandle(), l.init(r, o, a, n.panelType, d), l.setHtml()), n.isDisabledAtStart === !0) {
      var i = "<div class='ug-overlay-disabled'></div>";
      o.append(i), setTimeout(function () {
        o.children(".ug-overlay-disabled").hide();
      }, n.disabledAtStartTimeout);
    }
  }, this.placeElements = function () {
    l && l.placeHandle();
  }, this.initEvents = function () {
    l && (l.initEvents(), u.on(d.events.SLIDER_ACTION_START, function () {
      l.hideHandle();
    }), u.on(d.events.SLIDER_ACTION_END, function () {
      l.showHandle();
    }));
  }, this.destroy = function () {
    l && (l.destroy(), u.off(d.events.SLIDER_ACTION_START), u.off(d.events.SLIDER_ACTION_END));
  }, this.openPanel = function (a) {
    if (!a) var a = !1;
    return o.is(":animated") ? !1 : 0 == n.isClosed ? !1 : (n.isClosed = !1, s.trigger(r.events.OPEN_PANEL), void (a === !1 ? e(n.originalPos, i) : (t(n.originalPos), i())));
  }, this.closePanel = function (a) {
    if (!a) var a = !1;
    if (o.is(":animated")) return !1;
    if (1 == n.isClosed) return !1;

    var l = _.getClosedPanelDest();

    n.isClosed = !0, s.trigger(r.events.CLOSE_PANEL), a === !1 ? e(l, i) : (t(l), i());
  }, this.setClosedState = function (e) {
    n.originalPos = e, s.trigger(r.events.CLOSE_PANEL), n.isClosed = !0;
  }, this.setOpenedState = function (e) {
    s.trigger(r.events.OPEN_PANEL), n.isClosed = !1;
  }, this.getClosedPanelDest = function () {
    var e,
        t = g.getElementSize(o);

    switch (n.orientation) {
      case "left":
        n.originalPos = t.left, e = -n.panelWidth;
        break;

      case "right":
        n.originalPos = t.left;
        var i = d.getSize();
        e = i.width;
        break;

      case "top":
        n.originalPos = t.top, e = -n.panelHeight;
        break;

      case "bottom":
        n.originalPos = t.top;
        var i = d.getSize();
        e = i.height;
    }

    return e;
  }, this.isPanelClosed = function () {
    return n.isClosed;
  }, this.setDisabledAtStart = function (e) {
    return 0 >= e ? !1 : (n.isDisabledAtStart = !0, void (n.disabledAtStartTimeout = e));
  };
}

function UGPanelHandle() {
  function e() {
    s.removeClass("ug-button-hover");
  }

  function t() {
    s.addClass("ug-button-closed");
  }

  function i() {
    s.removeClass("ug-button-closed");
  }

  function n(e) {
    return e.stopPropagation(), e.stopImmediatePropagation(), 0 == l.validateClickTouchstartEvent(e.type) ? !0 : void (a.isPanelClosed() ? a.openPanel() : a.closePanel());
  }

  function r() {
    var e = a.getOrientation();

    switch (e) {
      case "right":
      case "left":
        "top" != u.panel_handle_align && "bottom" != u.panel_handle_align && (u.panel_handle_align = "top");
        break;

      case "bottom":
        "left" != u.panel_handle_align && "right" != u.panel_handle_align && (u.panel_handle_align = "left");
        break;

      case "top":
        "left" != u.panel_handle_align && "right" != u.panel_handle_align && (u.panel_handle_align = "right");
    }
  }

  var o,
      a,
      s,
      l = new UGFunctions(),
      u = {
    panel_handle_align: "top",
    panel_handle_offset: 0,
    panel_handle_skin: 0
  };
  this.init = function (e, t, i, n, r) {
    switch (a = e, o = t, n) {
      case "grid":
        u.panel_handle_align = i.gridpanel_handle_align, u.panel_handle_offset = i.gridpanel_handle_offset, u.panel_handle_skin = i.gridpanel_handle_skin;
        break;

      case "strip":
        u.panel_handle_align = i.strippanel_handle_align, u.panel_handle_offset = i.strippanel_handle_offset, u.panel_handle_skin = i.strippanel_handle_skin;
        break;

      default:
        throw new Error("Panel handle error: wrong panel type: " + n);
    }

    var s = r.getOptions(),
        l = s.gallery_skin;
    "" == u.panel_handle_skin && (u.panel_handle_skin = l);
  }, this.setHtml = function () {
    var e = a.getOrientation(),
        t = "ug-panel-handle-tip";

    switch (e) {
      case "right":
        t += " ug-handle-tip-left";
        break;

      case "left":
        t += " ug-handle-tip-right";
        break;

      case "bottom":
        t += " ug-handle-tip-top";
        break;

      case "top":
        t += " ug-handle-tip-bottom";
    }

    o.append("<div class='" + t + " ug-skin-" + u.panel_handle_skin + "'></div>"), s = o.children(".ug-panel-handle-tip");
  }, this.initEvents = function () {
    l.addClassOnHover(s), s.bind("click touchstart", n), jQuery(a).on(a.events.OPEN_PANEL, function () {
      e(), i();
    }), jQuery(a).on(a.events.CLOSE_PANEL, function () {
      e(), t();
    });
  }, this.destroy = function () {
    l.destroyButton(s), jQuery(a).off(a.events.OPEN_PANEL), jQuery(a).off(a.events.CLOSE_PANEL);
  }, this.placeHandle = function () {
    var e = l.getElementSize(s);
    r();
    var t = a.getOrientation();

    switch (t) {
      case "left":
        l.placeElement(s, "right", u.panel_handle_align, -e.width);
        break;

      case "right":
        l.placeElement(s, -e.width, u.panel_handle_align, 0, u.panel_handle_offset);
        break;

      case "top":
        l.placeElement(s, u.panel_handle_align, "bottom", u.panel_handle_offset, -e.height);
        break;

      case "bottom":
        l.placeElement(s, u.panel_handle_align, "top", u.panel_handle_offset, -e.height);
        break;

      default:
        throw new Error("Wrong panel orientation: " + t);
    }
  }, this.hideHandle = function () {
    1 == s.is(":visible") && s.hide();
  }, this.showHandle = function () {
    0 == s.is(":visible") && s.show();
  };
}

function UGStripPanel() {
  function e(e, t) {
    T = e, m = jQuery(T), j = jQuery.extend(j, t);
    var i = !1;
    1 == j.strippanel_vertical_type && (j = jQuery.extend(j, C), i = !0), 0 == j.strippanel_enable_buttons && (j = jQuery.extend(j, A), i = !0), 1 == i && (j = jQuery.extend(j, t));
    var n = T.getOptions(),
        r = n.gallery_skin;
    "" == j.strippanel_buttons_skin && (j.strippanel_buttons_skin = r), v = T.getElement(), x.init(T, M, w, j, E), P = new UGThumbsStrip(), P.init(T, j);
  }

  function t() {
    if (0 == j.strippanel_vertical_type) {
      if (0 == M.panelWidth) throw new Error("Strip panel error: The width not set, please set width");
    } else if (0 == M.panelHeight) throw new Error("Strip panel error: The height not set, please set height");

    if (null == M.orientation) throw new Error("Wrong orientation, please set panel orientation before run");
    return !0;
  }

  function i() {
    return 1 == M.isFirstRun && 0 == t() ? !1 : (P.run(), s(), d(), f(), M.isFirstRun = !1, void c());
  }

  function n(e) {
    if (!e) var e = v;

    if (e.append("<div class='ug-strip-panel'></div>"), b = e.children(".ug-strip-panel"), 1 == j.strippanel_enable_buttons) {
      var t = "ug-strip-arrow-left",
          i = "ug-strip-arrow-right";
      1 == j.strippanel_vertical_type && (t = "ug-strip-arrow-up", i = "ug-strip-arrow-down"), b.append("<div class='ug-strip-arrow " + t + " ug-skin-" + j.strippanel_buttons_skin + "'><div class='ug-strip-arrow-tip'></div></div>"), b.append("<div class='ug-strip-arrow " + i + " ug-skin-" + j.strippanel_buttons_skin + "'><div class='ug-strip-arrow-tip'></div></div>");
    }

    x.setHtml(b), P.setHtml(b), 1 == j.strippanel_enable_buttons && (I = b.children("." + t), y = b.children("." + i)), r();
  }

  function r() {
    "" != j.strippanel_background_color && b.css("background-color", j.strippanel_background_color);
  }

  function o() {
    var e = P.getHeight(),
        t = M.panelWidth;

    if (y) {
      I.height(e), y.height(e);
      var i = I.children(".ug-strip-arrow-tip");
      S.placeElement(i, "center", "middle");
      var n = y.children(".ug-strip-arrow-tip");
      S.placeElement(n, "center", "middle");
    }

    var r = e + j.strippanel_padding_top + j.strippanel_padding_bottom;
    b.width(t), b.height(r), M.panelHeight = r;
    var o = t - j.strippanel_padding_left - j.strippanel_padding_right;

    if (y) {
      var a = y.outerWidth();
      o = o - 2 * a - 2 * j.strippanel_padding_buttons;
    }

    P.resize(o);
  }

  function a() {
    var e = P.getWidth(),
        t = M.panelHeight;

    if (y) {
      I.width(e), y.width(e);
      var i = I.children(".ug-strip-arrow-tip");
      S.placeElement(i, "center", "middle");
      var n = y.children(".ug-strip-arrow-tip");
      S.placeElement(n, "center", "middle");
    }

    var r = e + j.strippanel_padding_left + j.strippanel_padding_right;
    b.width(r), b.height(t), M.panelWidth = r;
    var o = t - j.strippanel_padding_top - j.strippanel_padding_bottom;

    if (y) {
      var a = y.outerHeight();
      o = o - 2 * a - 2 * j.strippanel_padding_buttons;
    }

    P.resize(o);
  }

  function s() {
    0 == j.strippanel_vertical_type ? o() : a();
  }

  function l() {
    y && (S.placeElement(I, "left", "top", j.strippanel_padding_left, j.strippanel_padding_top), S.placeElement(y, "right", "top", j.strippanel_padding_right, j.strippanel_padding_top));
    var e = j.strippanel_padding_left;
    y && (e += y.outerWidth() + j.strippanel_padding_buttons), P.setPosition(e, j.strippanel_padding_top);
  }

  function u() {
    y && (S.placeElement(I, "left", "top", j.strippanel_padding_left, j.strippanel_padding_top), S.placeElement(y, "left", "bottom", j.strippanel_padding_left, j.strippanel_padding_bottom));
    var e = j.strippanel_padding_top;
    y && (e += y.outerHeight() + j.strippanel_padding_buttons), P.setPosition(j.strippanel_padding_left, e);
  }

  function d() {
    0 == j.strippanel_vertical_type ? l() : u(), x.placeElements();
  }

  function _(e) {
    return S.isButtonDisabled(e) ? !0 : void ("advance_item" == j.strippanel_buttons_role ? T.nextItem() : P.scrollForeward());
  }

  function g(e) {
    return S.isButtonDisabled(e) ? !0 : void ("advance_item" == j.strippanel_buttons_role ? T.prevItem() : P.scrollBack());
  }

  function c() {
    if (!y) return !0;
    if (0 == P.isMoveEnabled()) return S.disableButton(I), S.disableButton(y), !0;
    var e = P.getInnerStripLimits(),
        t = P.getInnerStripPos();
    t >= e.maxPos ? S.disableButton(I) : S.enableButton(I), t <= e.minPos ? S.disableButton(y) : S.enableButton(y);
  }

  function h() {
    c();
  }

  function p() {
    T.isLastItem() ? S.disableButton(y) : S.enableButton(y), T.isFirstItem() ? S.disableButton(I) : S.enableButton(I);
  }

  function f() {
    if (1 == M.isEventsInited) return !1;
    if (M.isEventsInited = !0, y) if (S.addClassOnHover(y, "ug-button-hover"), S.addClassOnHover(I, "ug-button-hover"), S.setButtonOnClick(I, g), S.setButtonOnClick(y, _), "advance_item" != j.strippanel_buttons_role) jQuery(P).on(P.events.STRIP_MOVE, h), jQuery(P).on(P.events.INNER_SIZE_CHANGE, c), m.on(T.events.SIZE_CHANGE, c);else {
      var e = T.getOptions();
      0 == e.gallery_carousel && jQuery(T).on(T.events.ITEM_CHANGE, p);
    }
    x.initEvents();
  }

  var m,
      v,
      b,
      y,
      I,
      w = this,
      E = jQuery(this),
      T = new UniteGalleryMain(),
      S = new UGFunctions(),
      P = new UGThumbsStrip(),
      x = new UGPanelsBase();
  this.events = {
    FINISH_MOVE: "gridpanel_move_finish",
    OPEN_PANEL: "open_panel",
    CLOSE_PANEL: "close_panel"
  };
  var j = {
    strippanel_vertical_type: !1,
    strippanel_padding_top: 8,
    strippanel_padding_bottom: 8,
    strippanel_padding_left: 0,
    strippanel_padding_right: 0,
    strippanel_enable_buttons: !0,
    strippanel_buttons_skin: "",
    strippanel_padding_buttons: 2,
    strippanel_buttons_role: "scroll_strip",
    strippanel_enable_handle: !0,
    strippanel_handle_align: "top",
    strippanel_handle_offset: 0,
    strippanel_handle_skin: "",
    strippanel_background_color: ""
  },
      C = {
    strip_vertical_type: !0,
    strippanel_padding_left: 8,
    strippanel_padding_right: 8,
    strippanel_padding_top: 0,
    strippanel_padding_bottom: 0
  },
      A = {
    strippanel_padding_left: 8,
    strippanel_padding_right: 8,
    strippanel_padding_top: 8,
    strippanel_padding_bottom: 8
  },
      M = {
    panelType: "strip",
    panelWidth: 0,
    panelHeight: 0,
    isEventsInited: !1,
    isClosed: !1,
    orientation: null,
    originalPos: null,
    isFirstRun: !0
  };
  this.destroy = function () {
    y && (S.destroyButton(y), S.destroyButton(I), jQuery(P).off(P.events.STRIP_MOVE), jQuery(T).off(T.events.ITEM_CHANGE), jQuery(T).off(T.events.SIZE_CHANGE)), x.destroy(), P.destroy();
  }, this.getOrientation = function () {
    return M.orientation;
  }, this.setOrientation = function (e) {
    M.orientation = e;
  }, this.init = function (t, i) {
    e(t, i);
  }, this.run = function () {
    i();
  }, this.setHtml = function (e) {
    n(e);
  }, this.getElement = function () {
    return b;
  }, this.getSize = function () {
    var e = S.getElementSize(b);
    return e;
  }, this.setWidth = function (e) {
    M.panelWidth = e;
  }, this.setHeight = function (e) {
    M.panelHeight = e;
  }, this.resize = function (e) {
    w.setWidth(e), s(), d();
  }, this.__________Functions_From_Base_____ = function () {}, this.isPanelClosed = function () {
    return x.isPanelClosed();
  }, this.getClosedPanelDest = function () {
    return x.getClosedPanelDest();
  }, this.openPanel = function (e) {
    x.openPanel(e);
  }, this.closePanel = function (e) {
    x.closePanel(e);
  }, this.setOpenedState = function (e) {
    x.setOpenedState(e);
  }, this.setClosedState = function (e) {
    x.setClosedState(e);
  }, this.setCustomThumbs = function (e) {
    P.setCustomThumbs(e);
  }, this.setDisabledAtStart = function (e) {
    x.setDisabledAtStart(e);
  };
}

function UGGridPanel() {
  function e(e, i) {
    x = e, t(), i && i.vertical_scroll && (M.gridpanel_vertical_scroll = i.vertical_scroll), M = jQuery.extend(M, i), 1 == L.isHorType ? (M = jQuery.extend(M, z), M = jQuery.extend(M, i)) : 1 == M.gridpanel_vertical_scroll && (M = jQuery.extend(M, O), M = jQuery.extend(M, i), M.grid_panes_direction = "bottom");
    var n = x.getOptions(),
        r = n.gallery_skin;
    "" == M.gridpanel_arrows_skin && (M.gridpanel_arrows_skin = r);
    var o = e.getObjects();
    I = o.g_objWrapper, A.init(x, L, S, M, P), C = new UGThumbsGrid(), C.init(x, M);
  }

  function t() {
    if (null == L.orientation) throw new Error("Wrong orientation, please set panel orientation before run");
  }

  function i() {
    t(), o(), C.run(), l(), u(), y(), d();
  }

  function n() {
    I.append("<div class='ug-grid-panel'></div>"), w = I.children(".ug-grid-panel"), L.isHorType ? (w.append("<div class='grid-arrow grid-arrow-left-hortype ug-skin-" + M.gridpanel_arrows_skin + "'></div>"), w.append("<div class='grid-arrow grid-arrow-right-hortype ug-skin-" + M.gridpanel_arrows_skin + "'></div>"), T = w.children(".grid-arrow-left-hortype"), E = w.children(".grid-arrow-right-hortype")) : 0 == M.gridpanel_vertical_scroll ? (w.append("<div class='grid-arrow grid-arrow-left ug-skin-" + M.gridpanel_arrows_skin + "'></div>"), w.append("<div class='grid-arrow grid-arrow-right ug-skin-" + M.gridpanel_arrows_skin + "'></div>"), T = w.children(".grid-arrow-left"), E = w.children(".grid-arrow-right")) : (w.append("<div class='grid-arrow grid-arrow-up ug-skin-" + M.gridpanel_arrows_skin + "'></div>"), w.append("<div class='grid-arrow grid-arrow-down ug-skin-" + M.gridpanel_arrows_skin + "'></div>"), T = w.children(".grid-arrow-up"), E = w.children(".grid-arrow-down")), A.setHtml(w), T.fadeTo(0, 0), E.fadeTo(0, 0), C.setHtml(w), r();
  }

  function r() {
    "" != M.gridpanel_background_color && w.css("background-color", M.gridpanel_background_color);
  }

  function o() {
    "center" == M.gridpanel_grid_align && (M.gridpanel_grid_align = "middle");
  }

  function a() {
    var e = M.gridpanel_padding_border_top + M.gridpanel_padding_border_bottom,
        t = L.panelHeight - e;

    if (0 == M.gridpanel_arrows_always_on) {
      var i = C.getNumPanesEstimationByHeight(t);
      if (1 == i) return t;
    }

    var n = j.getElementSize(E),
        r = n.height,
        e = r + M.gridpanel_arrows_padding_vert;
    return 1 == M.gridpanel_vertical_scroll && (e *= 2), e += M.gridpanel_padding_border_top + M.gridpanel_padding_border_bottom, t = L.panelHeight - e;
  }

  function s() {
    var e = M.gridpanel_padding_border_left + M.gridpanel_padding_border_right,
        t = L.panelWidth - e;

    if (0 == M.gridpanel_arrows_always_on) {
      var i = C.getNumPanesEstimationByWidth(t);
      if (1 == i) return t;
    }

    var n = j.getElementSize(E),
        r = n.width;
    return e += 2 * (r + M.gridpanel_arrows_padding_hor), t = L.panelWidth - e;
  }

  function l() {
    var e = !1;
    if (1 == M.gridpanel_arrows_always_on) e = !0;else {
      var t = C.getNumPanes();
      t > 1 && (e = !0);
    }
    1 == e ? (E.show().fadeTo(0, 1), T.show().fadeTo(0, 1), L.arrowsVisible = !0) : (E.hide(), T.hide(), L.arrowsVisible = !1);
  }

  function u() {
    var e = C.getSize();
    1 == L.isHorType ? L.panelHeight = e.height + M.gridpanel_padding_border_top + M.gridpanel_padding_border_bottom : L.panelWidth = e.width + M.gridpanel_padding_border_left + M.gridpanel_padding_border_right, j.setElementSize(w, L.panelWidth, L.panelHeight);
  }

  function d() {
    return 1 == L.isEventsInited ? !1 : (L.isEventsInited = !0, T && (j.addClassOnHover(T), C.attachPrevPaneButton(T)), E && (j.addClassOnHover(E), C.attachNextPaneButton(E)), void A.initEvents());
  }

  function _() {
    var e = M.gridpanel_padding_border_left;
    return e;
  }

  function g() {
    var e = M.gridpanel_grid_align,
        t = 0;

    switch (e) {
      case "top":
        t = M.gridpanel_padding_border_top;
        break;

      case "bottom":
        t = M.gridpanel_padding_border_bottom;
    }

    var i = _(),
        n = C.getElement();

    j.placeElement(n, i, e, 0, t);
  }

  function c() {
    var e,
        t,
        i,
        n,
        r = j.getElementSize(T),
        o = C.getSize();

    switch (M.gridpanel_grid_align) {
      default:
      case "top":
        e = M.gridpanel_padding_border_top + r.height + M.gridpanel_arrows_padding_vert;
        break;

      case "middle":
        e = "middle";
        break;

      case "bottom":
        e = L.panelHeight - o.height - r.height - M.gridpanel_padding_border_bottom - M.gridpanel_arrows_padding_vert;
    }

    var a = _(),
        s = C.getElement();

    j.placeElement(s, a, e);
    var o = C.getSize();

    switch (M.gridpanel_arrows_align_vert) {
      default:
      case "center":
      case "middle":
        t = (o.top - r.height) / 2, i = o.bottom + (L.panelHeight - o.bottom - r.height) / 2, n = 0;
        break;

      case "grid":
        t = o.top - r.height - M.gridpanel_arrows_padding_vert_vert, i = o.bottom + M.gridpanel_arrows_padding_vert, n = 0;
        break;

      case "border":
      case "borders":
        t = M.gridpanel_padding_border_top, i = "bottom", n = M.gridpanel_padding_border_bottom;
    }

    j.placeElement(T, "center", t), j.placeElement(E, "center", i, 0, n);
  }

  function h() {
    1 == L.arrowsVisible ? c() : g();
  }

  function p() {
    var e,
        t,
        i,
        n,
        r = j.getElementSize(T),
        o = C.getSize(),
        a = M.gridpanel_padding_border_top;

    switch (M.gridpanel_grid_align) {
      case "middle":
        switch (M.gridpanel_arrows_align_vert) {
          default:
            var s = o.height + M.gridpanel_arrows_padding_vert + r.height;
            a = (L.panelHeight - s) / 2;
            break;

          case "border":
          case "borders":
            var l = L.panelHeight - r.height - M.gridpanel_padding_border_bottom;
            a = (l - o.height) / 2;
        }

        break;

      case "bottom":
        var s = o.height + r.height + M.gridpanel_arrows_padding_vert;
        a = L.panelHeight - s - M.gridpanel_padding_border_bottom;
    }

    var u = C.getElement(),
        d = _();

    j.placeElement(u, d, a);
    var o = C.getSize();

    switch (M.gridpanel_arrows_align_vert) {
      default:
      case "center":
      case "middle":
        e = o.bottom + (L.panelHeight - o.bottom - r.height) / 2, i = 0;
        break;

      case "grid":
        e = o.bottom + M.gridpanel_arrows_padding_vert, i = 0;
        break;

      case "border":
      case "borders":
        e = "bottom", i = M.gridpanel_padding_border_bottom;
    }

    t = -r.width / 2 - M.gridpanel_space_between_arrows / 2, j.placeElement(T, "center", e, t, i);
    var n = Math.abs(t);
    j.placeElement(E, "center", e, n, i);
  }

  function f() {
    1 == L.arrowsVisible ? p() : g();
  }

  function m() {
    var e,
        t,
        i,
        n,
        r = j.getElementSize(T),
        o = C.getSize();

    switch (M.gridpanel_grid_align) {
      default:
      case "left":
        e = M.gridpanel_padding_border_left + M.gridpanel_arrows_padding_hor + r.width;
        break;

      case "middle":
      case "center":
        e = "center";
        break;

      case "right":
        e = L.panelWidth - o.width - r.width - M.gridpanel_padding_border_right - M.gridpanel_arrows_padding_hor;
    }

    var a = C.getElement();

    switch (j.placeElement(a, e, M.gridpanel_padding_border_top), o = C.getSize(), M.gridpanel_arrows_align_vert) {
      default:
      case "center":
      case "middle":
        n = (o.height - r.height) / 2 + o.top;
        break;

      case "top":
        n = M.gridpanel_padding_border_top + M.gridpanel_arrows_padding_vert;
        break;

      case "bottom":
        n = L.panelHeight - M.gridpanel_padding_border_bottom - M.gridpanel_arrows_padding_vert - r.height;
    }

    switch (M.gridpanel_arrows_align_hor) {
      default:
      case "borders":
        t = M.gridpanel_padding_border_left, i = L.panelWidth - M.gridpanel_padding_border_right - r.width;
        break;

      case "grid":
        t = o.left - M.gridpanel_arrows_padding_hor - r.width, i = o.right + M.gridpanel_arrows_padding_hor;
        break;

      case "center":
        t = (o.left - r.width) / 2, i = o.right + (L.panelWidth - o.right - r.width) / 2;
    }

    j.placeElement(T, t, n), j.placeElement(E, i, n);
  }

  function v() {
    var e,
        t = C.getSize();

    switch (M.gridpanel_grid_align) {
      default:
      case "left":
        e = M.gridpanel_padding_border_left;
        break;

      case "middle":
      case "center":
        e = "center";
        break;

      case "right":
        e = L.panelWidth - t.width - M.gridpanel_padding_border_right;
    }

    var i = C.getElement();
    j.placeElement(i, e, M.gridpanel_padding_border_top);
  }

  function b() {
    1 == L.arrowsVisible ? m() : v();
  }

  function y() {
    0 == L.isHorType ? 1 == M.gridpanel_vertical_scroll ? h() : f() : b(), A.placeElements();
  }

  var I,
      w,
      E,
      T,
      S = this,
      P = jQuery(this),
      x = new UniteGalleryMain(),
      j = new UGFunctions(),
      C = new UGThumbsGrid(),
      A = new UGPanelsBase();
  this.events = {
    FINISH_MOVE: "gridpanel_move_finish",
    OPEN_PANEL: "open_panel",
    CLOSE_PANEL: "close_panel"
  };
  var M = {
    gridpanel_vertical_scroll: !0,
    gridpanel_grid_align: "middle",
    gridpanel_padding_border_top: 10,
    gridpanel_padding_border_bottom: 4,
    gridpanel_padding_border_left: 10,
    gridpanel_padding_border_right: 10,
    gridpanel_arrows_skin: "",
    gridpanel_arrows_align_vert: "middle",
    gridpanel_arrows_padding_vert: 4,
    gridpanel_arrows_align_hor: "center",
    gridpanel_arrows_padding_hor: 10,
    gridpanel_space_between_arrows: 20,
    gridpanel_arrows_always_on: !1,
    gridpanel_enable_handle: !0,
    gridpanel_handle_align: "top",
    gridpanel_handle_offset: 0,
    gridpanel_handle_skin: "",
    gridpanel_background_color: ""
  },
      O = {
    gridpanel_grid_align: "middle",
    gridpanel_padding_border_top: 2,
    gridpanel_padding_border_bottom: 2
  },
      z = {
    gridpanel_grid_align: "center"
  },
      L = {
    panelType: "grid",
    isHorType: !1,
    arrowsVisible: !1,
    panelHeight: 0,
    panelWidth: 0,
    originalPosX: null,
    isEventsInited: !1,
    isClosed: !1,
    orientation: null
  };
  this.destroy = function () {
    T && j.destroyButton(T), E && j.destroyButton(E), A.destroy(), C.destroy();
  }, this.getOrientation = function () {
    return L.orientation;
  }, this.setOrientation = function (e) {
    switch (L.orientation = e, e) {
      case "right":
      case "left":
        L.isHorType = !1;
        break;

      case "top":
      case "bottom":
        L.isHorType = !0;
        break;

      default:
        throw new Error("Wrong grid panel orientation: " + e);
    }
  }, this.setHeight = function (e) {
    if (1 == L.isHorType) throw new Error("setHeight is not appliable to this orientatio (" + L.orientation + "). Please use setWidth");
    L.panelHeight = e;
    var t = a();
    C.setMaxHeight(t);
  }, this.setWidth = function (e) {
    if (0 == L.isHorType) throw new Error("setWidth is not appliable to this orientatio (" + L.orientation + "). Please use setHeight");
    L.panelWidth = e;
    var t = s();
    C.setMaxWidth(t);
  }, this.init = function (t, i) {
    e(t, i);
  }, this.setHtml = function () {
    n();
  }, this.run = function () {
    i();
  }, this.getElement = function () {
    return w;
  }, this.getSize = function () {
    var e = j.getElementSize(w);
    return e;
  }, this.__________Functions_From_Base_____ = function () {}, this.isPanelClosed = function () {
    return A.isPanelClosed();
  }, this.getClosedPanelDest = function () {
    return A.getClosedPanelDest();
  }, this.openPanel = function (e) {
    A.openPanel(e);
  }, this.closePanel = function (e) {
    A.closePanel(e);
  }, this.setOpenedState = function (e) {
    A.setOpenedState(e);
  }, this.setClosedState = function (e) {
    A.setClosedState(e);
  }, this.setDisabledAtStart = function (e) {
    A.setDisabledAtStart(e);
  };
}

function UGThumbsGrid() {
  function e(e, t, i) {
    if (N = e.getObjects(), B = e, B.attachThumbsPanel("grid", Q), H = jQuery(e), k = N.g_objWrapper, R = N.g_arrItems, i === !0 && (X.isTilesMode = !0), X.numThumbs = R.length, _(t), 1 == X.isTilesMode) {
      U.setFixedMode(), U.setApproveClickFunction(x), U.init(e, V);
      var n = U.getOptions();
      X.tileMaxHeight = n.tile_height, X.tileMaxWidth = n.tile_width, Y = U.getObjThumbs();
    } else t.thumb_fixed_size = !0, Y.init(e, t);
  }

  function t(e) {
    var t = k;
    e && (t = e), t.append("<div class='ug-thumbs-grid'><div class='ug-thumbs-grid-inner'></div></div>"), G = t.children(".ug-thumbs-grid"), D = G.children(".ug-thumbs-grid-inner"), 1 == X.isTilesMode ? U.setHtml(D) : Y.setHtmlThumbs(D);
  }

  function n() {
    if (0 == X.isHorizontal) {
      if (0 == X.gridHeight) throw new Error("You must set height before run.");
    } else if (0 == X.gridWidth) throw new Error("You must set width before run.");
  }

  function r() {
    var e = B.getSelectedItem();
    if (n(), 1 == X.isFirstTimeRun) L(), 1 == X.isTilesMode ? (a(), u(), U.run()) : (Y.setHtmlProperties(), u(), Y.loadThumbsImages());else if (1 == X.isTilesMode) {
      var t = a();
      1 == t && (u(), U.run());
    }

    if (p(), 1 == X.isFirstTimeRun && X.isTilesMode) {
      var i = Y.getThumbs();
      i.each(function (e, t) {
        k.trigger(X.eventSizeChange, jQuery(t));
      }), i.fadeTo(0, 1);
    }

    null != e && d(e.index), W.trigger(Q.events.PANE_CHANGE, X.currentPane), X.isFirstTimeRun = !1;
  }

  function o() {
    if (1 == X.isTilesMode) var e = U.getGlobalTileSize();else var e = Y.getGlobalThumbSize();
    return e;
  }

  function a() {
    if (0 == X.isTilesMode) throw new Error("Dynamic size can be set only in tiles mode");
    var e = !1,
        t = B.isMobileMode(),
        i = X.spaceBetweenCols;
    1 == t ? (X.spaceBetweenCols = V.grid_space_between_mobile, X.spaceBetweenRows = V.grid_space_between_mobile) : (X.spaceBetweenCols = V.grid_space_between_cols, X.spaceBetweenRows = V.grid_space_between_rows), X.spaceBetweenCols != i && (e = !0);
    var n = o(),
        r = n.width,
        a = X.tileMaxWidth,
        s = F.getNumItemsInSpace(X.gridWidth, X.tileMaxWidth, X.spaceBetweenCols);
    return s < V.grid_min_cols && (a = F.getItemSizeInSpace(X.gridWidth, V.grid_min_cols, X.spaceBetweenCols)), U.setTileSizeOptions(a), a != r && (e = !0), e;
  }

  function s() {
    var e = o(),
        t = e.height,
        i = X.gridWidth,
        n = V.grid_num_rows * t + (V.grid_num_rows - 1) * X.spaceBetweenRows + 2 * V.grid_padding;
    X.gridHeight = n, F.setElementSize(G, i, n), F.setElementSize(D, i, n), X.innerWidth = i, X.innerHeight = n;
  }

  function l() {
    var e = o(),
        t = e.width,
        i = V.grid_num_cols * t + (V.grid_num_cols - 1) * X.spaceBetweenCols + 2 * V.grid_padding,
        n = X.gridHeight;
    X.gridWidth = i, F.setElementSize(G, i, n), F.setElementSize(D, i, n), X.innerWidth = i, X.innerHeight = n;
  }

  function u() {
    0 == X.isHorizontal ? l() : s();
  }

  function d(e) {
    var t = T(e);
    return -1 == t ? !1 : void Q.gotoPane(t, "scroll");
  }

  function _(e) {
    V = jQuery.extend(V, e), Y.setOptions(e), X.isNavigationVertical = "top" == V.grid_panes_direction || "bottom" == V.grid_panes_direction, X.spaceBetweenCols = V.grid_space_between_cols, X.spaceBetweenRows = V.grid_space_between_rows;
  }

  function g() {
    var e = D.children(".ug-thumb-wrapper"),
        t = 0,
        n = 0,
        r = 0,
        o = 0,
        a = 0,
        s = 0;
    X.innerWidth = 0, X.numPanes = 1, X.arrPanes = [], X.numThumbsInPane = 0, X.arrPanes.push(o);
    var l = e.length;

    for (i = 0; i < l; i++) {
      var u = jQuery(e[i]);
      F.placeElement(u, t, n);

      var d = u.outerWidth(),
          _ = u.outerHeight();

      t > a && (a = t);
      var g = n + _;
      g > s && (s = g);
      var c = a + d;
      c > X.innerWidth && (X.innerWidth = c), t += d + X.spaceBetweenCols, r++, r >= V.grid_num_cols && (n += _ + X.spaceBetweenRows, t = o, r = 0), 1 == X.numPanes && X.numThumbsInPane++, n + _ > X.gridHeight && (n = 0, o = X.innerWidth + X.spaceBetweenCols, t = o, r = 0, 1 == X.isMaxHeight && 1 == X.numPanes && (X.gridHeight = s, G.height(X.gridHeight)), i < l - 1 && (X.numPanes++, X.arrPanes.push(o)));
    }

    D.width(X.innerWidth), 1 == X.isMaxHeight && 1 == X.numPanes && (X.gridHeight = s, G.height(s));
  }

  function c() {
    var e = D.children(".ug-thumb-wrapper"),
        t = 0,
        n = 0,
        r = 0,
        o = 0,
        a = 0,
        s = 0;
    X.innerWidth = 0, X.numPanes = 1, X.arrPanes = [], X.numThumbsInPane = 0, X.arrPanes.push(a);
    var l = e.length;

    for (i = 0; i < l; i++) {
      var u = jQuery(e[i]);
      F.placeElement(u, t, n);

      var d = u.outerWidth(),
          _ = u.outerHeight();

      t += d + X.spaceBetweenCols;
      var g = n + _;
      g > r && (r = g), o++, o >= V.grid_num_cols && (n += _ + X.spaceBetweenRows, t = a, o = 0), 1 == X.numPanes && X.numThumbsInPane++, g = n + _;
      var c = s + X.gridHeight;
      g > c && (1 == X.isMaxHeight && 1 == X.numPanes && (X.gridHeight = r, G.height(X.gridHeight), c = X.gridHeight), n = c + X.spaceBetweenRows, s = n, a = 0, t = a, o = 0, i < l - 1 && (X.numPanes++, X.arrPanes.push(n)));
    }

    D.height(r), X.innerHeight = r, 1 == X.isMaxHeight && 1 == X.numPanes && (X.gridHeight = r, G.height(r));
  }

  function h() {
    var e = D.children(".ug-thumb-wrapper"),
        t = V.grid_padding,
        n = V.grid_padding,
        r = n,
        o = t,
        a = 0,
        s = 0,
        l = 0,
        u = 0,
        d = 0;
    X.innerWidth = 0, X.numPanes = 1, X.arrPanes = [], X.numThumbsInPane = 0, X.arrPanes.push(t - V.grid_padding);
    var _ = e.length;

    for (i = 0; i < _; i++) {
      var g = jQuery(e[i]),
          c = g.outerWidth(),
          h = g.outerHeight();
      o - t + c > X.gridWidth && (d++, r = 0, d >= V.grid_num_rows ? (d = 0, t = o, r = n, l = 0, 1 == X.numPanes && (X.gridWidth = a + V.grid_padding, G.width(X.gridWidth), X.gridHeight = u + V.grid_padding, G.height(X.gridHeight)), X.numPanes++, X.arrPanes.push(t - V.grid_padding)) : (o = t, r = l + X.spaceBetweenRows)), F.placeElement(g, o, r);
      var p = o + c;
      p > a && (a = p);
      var f = r + h;
      f > l && (l = f), f > u && (u = f), f > s && (s = f);
      var p = a + c;
      p > X.innerWidth && (X.innerWidth = p), o += c + X.spaceBetweenCols, 1 == X.numPanes && X.numThumbsInPane++;
    }

    X.innerWidth = a + V.grid_padding, X.innerHeight = u + V.grid_padding, D.width(X.innerWidth), D.height(X.innerHeight), 1 == X.numPanes && (X.gridWidth = a + V.grid_padding, X.gridHeight = u + V.grid_padding, G.width(X.gridWidth), G.height(X.gridHeight));
  }

  function p() {
    0 == X.isHorizontal ? X.isNavigationVertical ? c() : g() : h();
  }

  function f(e) {
    if (0 > e || e >= X.numThumbs) throw new Error("Thumb not exists: " + e);
    return !0;
  }

  function m(e) {
    if (e >= X.numPanes || 0 > e) throw new Error("Pane " + index + " doesn't exists.");
    return !0;
  }

  function v(e) {
    var t = w(e);
    return 0 == t ? !1 : void D.css(t);
  }

  function b(e) {
    var t = w(e);
    return 0 == t ? !1 : void D.stop(!0).animate(t, {
      duration: V.grid_transition_duration,
      easing: V.grid_transition_easing,
      queue: !1
    });
  }

  function y() {
    var e = -X.arrPanes[X.currentPane];
    b(e);
  }

  function I() {
    return 1 == X.isNavigationVertical ? X.gridHeight : X.gridWidth;
  }

  function w(e) {
    var t = {};
    return 1 == X.isNavigationVertical ? t.top = e + "px" : t.left = e + "px", t;
  }

  function E() {
    var e = F.getElementSize(D);
    return 1 == X.isNavigationVertical ? e.top : e.left;
  }

  function T(e) {
    if (0 == f(e)) return -1;
    var t = Math.floor(e / X.numThumbsInPane);
    return t;
  }

  function S() {
    if (1 == X.numPanes) return !1;
    var e = F.getStoredEventData(X.storedEventID),
        t = e.diffTime,
        i = E(),
        n = Math.abs(i - e.startInnerPos);
    return n > 30 ? !0 : n > 5 && t > 300 ? !0 : !1;
  }

  function P() {
    var e = F.getStoredEventData(X.storedEventID),
        t = E();
    diffPos = Math.abs(e.startInnerPos - t);
    var i = I(),
        n = Math.round(3 * i / 8);
    return diffPos >= n ? !0 : e.diffTime < 300 && diffPos > 25 ? !0 : !1;
  }

  function x() {
    if (1 == X.numPanes) return !0;
    var e = F.isApproveStoredEventClick(X.storedEventID, X.isNavigationVertical);
    return e;
  }

  function j(e) {
    if (1 == S()) return !0;
    var t = jQuery(this),
        i = Y.getItemByThumb(t);
    B.selectItem(i);
  }

  function C(e) {
    if (1 == X.numPanes) return !0;
    if (1 == X.touchActive) return !0;
    0 == X.isTilesMode && e.preventDefault(), X.touchActive = !0;
    var t = {
      startInnerPos: E()
    };
    F.storeEventData(e, X.storedEventID, t);
  }

  function A() {
    if (0 == V.grid_vertical_scroll_ondrag) return !1;
    if (1 == X.isNavigationVertical) return !1;
    var e = F.handleScrollTop(X.storedEventID);
    return "vert" === e ? !0 : !1;
  }

  function M(e) {
    if (0 == X.touchActive) return !0;
    e.preventDefault(), F.updateStoredEventData(e, X.storedEventID);
    var t = F.getStoredEventData(X.storedEventID, X.isNavigationVertical),
        i = A();
    if (i) return !0;
    var n = t.diffMousePos,
        r = t.startInnerPos + n,
        o = n > 0 ? "prev" : "next",
        a = X.arrPanes[X.numPanes - 1];
    0 == V.grid_carousel && r > 0 && "prev" == o && (r /= 3), 0 == V.grid_carousel && -a > r && "next" == o && (r = t.startInnerPos + n / 3), v(r);
  }

  function O(e) {
    if (0 == X.touchActive) return !0;
    F.updateStoredEventData(e, X.storedEventID);
    var t = F.getStoredEventData(X.storedEventID, X.isNavigationVertical);
    if (X.touchActive = !1, 0 == P()) return y(), !0;
    var i = E(),
        n = i - t.startInnerPos,
        r = n > 0 ? "prev" : "next";
    "next" == r ? 0 == V.grid_carousel && Q.isLastPane() ? y() : Q.nextPane() : 0 == V.grid_carousel && Q.isFirstPane() ? y() : Q.prevPane();
  }

  function z() {
    var e = B.getSelectedItem();
    Y.setThumbSelected(e.objThumbWrapper), d(e.index);
  }

  function L() {
    if (0 == X.isTilesMode) {
      Y.initEvents();
      var e = G.find(".ug-thumb-wrapper");
      e.on("click touchend", j), H.on(B.events.ITEM_CHANGE, z);
    } else U.initEvents();

    G.bind("mousedown touchstart", C), jQuery("body").bind("mousemove touchmove", M), jQuery(window).add("body").bind("mouseup touchend", O);
  }

  var H,
      N,
      k,
      R,
      G,
      D,
      Q = this,
      W = jQuery(this),
      B = new UniteGalleryMain(),
      F = new UGFunctions(),
      Y = new UGThumbsGeneral(),
      U = new UGTileDesign(),
      V = {
    grid_panes_direction: "left",
    grid_num_cols: 2,
    grid_min_cols: 2,
    grid_num_rows: 2,
    grid_space_between_cols: 10,
    grid_space_between_rows: 10,
    grid_space_between_mobile: 10,
    grid_transition_duration: 300,
    grid_transition_easing: "easeInOutQuad",
    grid_carousel: !1,
    grid_padding: 0,
    grid_vertical_scroll_ondrag: !1
  };
  this.events = {
    PANE_CHANGE: "pane_change"
  };
  var X = {
    eventSizeChange: "thumb_size_change",
    isHorizontal: !1,
    isMaxHeight: !1,
    isMaxWidth: !1,
    gridHeight: 0,
    gridWidth: 0,
    innerWidth: 0,
    innerHeight: 0,
    numPanes: 0,
    arrPanes: 0,
    numThumbs: 0,
    currentPane: 0,
    numThumbsInPane: 0,
    isNavigationVertical: !1,
    touchActive: !1,
    startScrollPos: 0,
    isFirstTimeRun: !0,
    isTilesMode: !1,
    storedEventID: "thumbsgrid",
    tileMaxWidth: null,
    tileMaxHeight: null,
    spaceBetweenCols: null,
    spaceBetweenRows: null
  };
  this.destroy = function () {
    if (0 == X.isTilesMode) {
      var e = G.find(".ug-thumb-wrapper");
      e.off("click"), e.off("touchend"), H.on(B.events.ITEM_CHANGE), Y.destroy();
    } else U.destroy();

    G.unbind("mousedown"), G.unbind("touchstart"), jQuery("body").unbind("mousemove"), jQuery("body").unbind("touchmove"), jQuery(window).add("body").unbind("touchend"), jQuery(window).add("body").unbind("mouseup"), W.off(Q.events.PANE_CHANGE);
  }, this.__________EXTERNAL_GENERAL_________ = function () {}, this.setThumbUnselected = function (e) {
    Y.setThumbUnselected(e);
  }, this.isItemThumbVisible = function (e) {
    var t = e.index,
        i = T(t);
    return i == X.currentPane ? !0 : !1;
  }, this.__________EXTERNAL_API_________ = function () {}, this.getNumPanesEstimationByHeight = function (e) {
    if (1 == X.isTilesMode) var t = V.tile_height;else var i = Y.getOptions(),
        t = i.thumb_height;
    var n = Y.getNumThumbs(),
        r = Math.ceil(n / V.grid_num_cols),
        o = r * t + (r - 1) * X.spaceBetweenRows,
        a = Math.ceil(o / e);
    return a;
  }, this.getNumPanesEstimationByWidth = function (e) {
    if (X.isTilesMode) var t = V.tile_width;else var i = Y.getOptions(),
        t = i.thumb_width;
    var n = Y.getNumThumbs(),
        r = Math.ceil(n / V.grid_num_rows),
        o = r * t + (r - 1) * X.spaceBetweenCols,
        a = Math.ceil(o / e);
    return a;
  }, this.getHeightEstimationByWidth = function (e) {
    if (0 == X.isTilesMode) throw new Error("This function works only with tiles mode");
    var t = Y.getNumThumbs(),
        i = F.getNumItemsInSpace(e, V.tile_width, X.spaceBetweenCols),
        n = Math.ceil(t / i);
    n > V.grid_num_rows && (n = V.grid_num_rows);
    var r = F.getSpaceByNumItems(n, V.tile_height, X.spaceBetweenRows);
    return r += 2 * V.grid_padding;
  }, this.getElement = function () {
    return G;
  }, this.getSize = function () {
    var e = F.getElementSize(G);
    return e;
  }, this.getNumPanes = function () {
    return X.numPanes;
  }, this.isFirstPane = function () {
    return 0 == X.currentPane ? !0 : !1;
  }, this.isLastPane = function () {
    return X.currentPane == X.numPanes - 1 ? !0 : !1;
  }, this.getPaneInfo = function () {
    var e = {
      pane: X.currentPane,
      total: X.numPanes
    };
    return e;
  }, this.getPane = function () {
    return X.currentPane;
  }, this.setWidth = function (e) {
    X.gridWidth = e, X.isHorizontal = !0;
  }, this.setMaxWidth = function (e) {
    X.gridWidth = e, X.isMaxWidth = !0, X.isHorizontal = !0;
  }, this.setHeight = function (e) {
    X.gridHeight = e, X.isHorizontal = !1;
  }, this.setMaxHeight = function (e) {
    X.gridHeight = e, X.isMaxHeight = !0, X.isHorizontal = !1;
  }, this.gotoPane = function (e, t) {
    if (0 == m(e)) return !1;
    if (e == X.currentPane) return !1;
    var i = -X.arrPanes[e];
    X.currentPane = e, b(i), W.trigger(Q.events.PANE_CHANGE, e);
  }, this.nextPane = function () {
    var e = X.currentPane + 1;

    if (e >= X.numPanes) {
      if (0 == V.grid_carousel) return !0;
      e = 0;
    }

    Q.gotoPane(e, "next");
  }, this.prevPane = function () {
    var e = X.currentPane - 1;
    return 0 > e && (e = X.numPanes - 1, 0 == V.grid_carousel) ? !1 : void Q.gotoPane(e, "prev");
  }, this.attachNextPaneButton = function (e) {
    return F.setButtonOnClick(e, Q.nextPane), 1 == V.grid_carousel ? !0 : (Q.isLastPane() && e.addClass("ug-button-disabled"), void W.on(Q.events.PANE_CHANGE, function () {
      Q.isLastPane() ? e.addClass("ug-button-disabled") : e.removeClass("ug-button-disabled");
    }));
  }, this.attachPrevPaneButton = function (e) {
    return F.setButtonOnClick(e, Q.prevPane), 1 == V.grid_carousel ? !0 : (Q.isFirstPane() && e.addClass("ug-button-disabled"), void W.on(Q.events.PANE_CHANGE, function () {
      Q.isFirstPane() ? e.addClass("ug-button-disabled") : e.removeClass("ug-button-disabled");
    }));
  }, this.attachBullets = function (e) {
    e.setActive(X.currentPane), jQuery(e).on(e.events.BULLET_CLICK, function (t, i) {
      Q.gotoPane(i, "theme"), e.setActive(i);
    }), jQuery(Q).on(Q.events.PANE_CHANGE, function (t, i) {
      e.setActive(i);
    });
  }, this.getObjTileDesign = function () {
    return U;
  }, this.init = function (t, i, n) {
    e(t, i, n);
  }, this.run = function () {
    r();
  }, this.setHtml = function (e) {
    t(e);
  };
}

function UGTiles() {
  function e(e, i) {
    g_objects = e.getObjects(), oe = e, K = jQuery(e), J = g_objects.g_objWrapper, ee = g_objects.g_arrItems, de = jQuery.extend(de, i), t(), se.init(e, de), le = se.getObjThumbs();
  }

  function t() {
    de.tiles_min_columns < 1 && (de.tiles_min_columns = 1), 0 != de.tiles_max_columns && de.tiles_max_columns < de.tiles_min_columns && (de.tiles_max_columns = de.tiles_min_columns);
  }

  function i(e) {
    if (!e) if ($) e = $;else var e = J;
    $ = e;
    var t = de.tiles_type;
    e.addClass("ug-tiletype-" + t), se.setHtml(e), e.children(".ug-thumb-wrapper").hide();
  }

  function n() {
    if ($.addClass("ug-tiles-rest-mode"), _e.isTransInited = !0, 1 == de.tiles_enable_transition) {
      $.addClass("ug-tiles-transit");
      var e = se.getOptions();
      1 == e.tile_enable_image_effect && 0 == e.tile_image_effect_reverse && $.addClass("ug-tiles-transit-overlays"), _e.isTransActive = !0;
    }
  }

  function r() {
    return ae.getElementSize($).width;
  }

  function o() {
    return 0 == _e.isTransInited ? !1 : ($.addClass("ug-tiles-transition-active"), $.removeClass("ug-tiles-rest-mode"), 0 == _e.isTransActive ? !1 : void se.disableEvents());
  }

  function a() {
    return 0 == _e.isTransInited ? !1 : ($.removeClass("ug-tiles-transition-active"), void $.addClass("ug-tiles-rest-mode"));
  }

  function s() {
    1 == _e.isTransActive ? (setTimeout(function () {
      se.enableEvents(), se.triggerSizeChangeEventAllTiles(), a();
    }, 800), _e.handle && clearTimeout(_e.handle), _e.handle = setTimeout(function () {
      a(), se.triggerSizeChangeEventAllTiles(), _e.handle = null;
    }, 2e3)) : (se.triggerSizeChangeEventAllTiles(), a());
  }

  function l() {
    ue.colWidth = (ue.availWidth - ue.colGap * (ue.numCols - 1)) / ue.numCols, ue.colWidth = Math.floor(ue.colWidth), ue.totalWidth = ae.getSpaceByNumItems(ue.numCols, ue.colWidth, ue.colGap);
  }

  function u() {
    if (ue.colWidth = de.tiles_col_width, ue.minCols = de.tiles_min_columns, ue.maxCols = de.tiles_max_columns, 0 == oe.isMobileMode() ? ue.colGap = de.tiles_space_between_cols : ue.colGap = de.tiles_space_between_cols_mobile, ue.galleryWidth = r(), ue.availWidth = ue.galleryWidth, 1 == de.tiles_include_padding && (ue.availWidth = ue.galleryWidth - 2 * ue.colGap), 1 == de.tiles_exact_width) ue.numCols = ae.getNumItemsInSpace(ue.availWidth, ue.colWidth, ue.colGap), ue.maxCols > 0 && ue.numCols > ue.maxCols && (ue.numCols = ue.maxCols), ue.numCols < ue.minCols ? (ue.numCols = ue.minCols, l()) : ue.totalWidth = ue.numCols * (ue.colWidth + ue.colGap) - ue.colGap;else {
      var e = ae.getNumItemsInSpaceRound(ue.availWidth, ue.colWidth, ue.colGap);
      e < ue.minCols ? e = ue.minCols : 0 != ue.maxCols && e > ue.maxCols && (e = ue.maxCols), ue.numCols = e, l();
    }

    switch (de.tiles_align) {
      case "center":
      default:
        ue.addX = Math.round((ue.galleryWidth - ue.totalWidth) / 2);
        break;

      case "left":
        ue.addX = 0;
        break;

      case "right":
        ue.addX = ue.galleryWidth - ue.totalWidth;
    }

    for (ue.arrPosx = [], col = 0; col < ue.numCols; col++) {
      var t = ae.getColX(col, ue.colWidth, ue.colGap);
      ue.arrPosx[col] = t + ue.addX;
    }
  }

  function d() {
    ue.maxColHeight = 0, ue.colHeights = [0];
  }

  function _() {
    var e = 0,
        t = 999999999;

    for (col = 0; col < ue.numCols; col++) {
      if (void 0 == ue.colHeights[col] || 0 == ue.colHeights[col]) return col;
      ue.colHeights[col] < t && (e = col, t = ue.colHeights[col]);
    }

    return e;
  }

  function g(e, t, i, n) {
    if (null === n || "undefined" == typeof n) var n = _();
    var r = 0;
    void 0 !== ue.colHeights[n] && (r = ue.colHeights[n]);
    var o = se.getTileHeightByWidth(ue.colWidth, e);

    if (null === o) {
      if (1 == de.tiles_enable_transition) throw new Error("Can't know tile height, please turn off transition");
      var a = ae.getElementSize(e);
      o = a.height;
    }

    var s = ue.arrPosx[n];
    ae.placeElement(e, s, r);
    var l = r + o;
    ue.colHeights[n] = l + ue.colGap, ue.maxColHeight < l && (ue.maxColHeight = l), 1 == t && e.show().fadeTo(0, 1), 1 == i && $.height(ue.maxColHeight);
  }

  function c(e) {
    e || (e = !1), u(), d();
    var t = le.getThumbs(le.type.GET_THUMBS_RATIO);
    o(), se.resizeAllTiles(ue.colWidth, se.resizemode.VISIBLE_ELEMENTS, t);

    for (var i = 0; i < t.length; i++) {
      var n = jQuery(t[i]),
          r = void 0;
      1 == de.tiles_keep_order && (r = ae.getColByIndex(ue.numCols, i)), g(n, e, !1, r);
    }

    s();
    var a = $.height();
    1 == _e.isTransActive && a > ue.maxColHeight ? setTimeout(function () {
      $.height(ue.maxColHeight);
    }, 700) : $.height(ue.maxColHeight);
  }

  function h(e) {
    var t = e.index(),
        i = oe.getItem(t);
    if (i.ordered_placed === !0) return !1;
    var n = ae.getPrevRowSameColIndex(t, ue.numCols);
    if (0 > n) return !0;
    var r = oe.getItem(n);
    return r.ordered_placed === !0 ? !0 : !1;
  }

  function p(e, t) {
    if (t !== !0) {
      var i = h(e);
      if (0 == i) return !1;
    }

    var n = e.index(),
        r = ae.getColByIndex(ue.numCols, n),
        o = oe.getItem(n);
    se.resizeTile(e, ue.colWidth), g(e, !0, !0, r), o.ordered_placed = !0;
    var a = oe.getNumItems(),
        s = ae.getNextRowSameColIndex(n, ue.numCols);
    if (s >= a) return !1;
    var l = le.getThumbByIndex(s),
        u = oe.getItem(s);
    le.isThumbLoaded(l);
    le.isThumbLoaded(l) && !u.ordered_placed && p(l, !0);
  }

  function f(e, t) {
    if (1 == t) return !1;
    e = jQuery(e);
    var i = jQuery(e).parent();
    le.triggerImageLoadedEvent(i, e), 1 == de.tiles_keep_order ? p(i) : (se.resizeTile(i, ue.colWidth), g(i, !0, !0));
  }

  function m() {
    var e = le.getThumbs(le.type.GET_THUMBS_NO_RATIO);
    if (!e || 0 == e.length) return !1;

    if (_e.isAllLoaded = !1, 1 == _e.isFirstPlaced) {
      u(), d();
      var t = Math.abs(ue.galleryWidth - ue.totalWidth);

      if (1 == de.tiles_set_initial_height && 0 == ae.isScrollbarExists() && 25 > t) {
        var i = (e.length, Math.ceil(e.length / ue.numCols)),
            r = i * de.tiles_col_width * .75;
        $.height(r), u();
      }
    }

    e.fadeTo(0, 0);
    var o = e.find("img.ug-thumb-image"),
        a = ue.numCols,
        s = ue.galleryWidth;
    ae.checkImagesLoaded(o, function () {
      u(), (a != ue.numCols || s != ue.galleryWidth) && c(!1), n(), re.trigger(ne.events.ALL_TILES_LOADED);
    }, function (e, t) {
      1 == _e.isFirstPlaced && oe.triggerEvent(ne.events.TILES_FIRST_PLACED), f(e, t);
    });
  }

  function v() {
    var e = r(),
        t = le.getThumbs(!0),
        i = de.tiles_justified_row_height,
        n = [],
        o = 0,
        a = de.tiles_justified_space_between,
        s = t.length;
    jQuery.each(t, function (e, t) {
      t = jQuery(t);
      var r = le.getItemByThumb(t),
          a = r.thumbWidth,
          s = r.thumbHeight;
      s !== i && (a = Math.floor(r.thumbRatioByWidth * i)), n[e] = a, o += a;
    });
    var l = Math.ceil(o / e);
    l > s && (l = s);
    var u = o / l,
        d = [],
        _ = 0,
        g = [],
        c = [],
        h = 0,
        p = 0;
    jQuery.each(t, function (e, t) {
      var i = n[e];
      h + i / 2 > (p + 1) * u && (g[d.length] = _, d.push(c), c = [], _ = 0, p++), h += i, _ += i, c.push(t);
    }), g[d.length] = _, d.push(c);
    var f = [],
        m = [],
        v = 0;
    jQuery.each(d, function (t, r) {
      var o = (r.length, g[t]),
          s = (r.length - 1) * a,
          l = (e - s) / o,
          u = Math.round(i * l);
      v += u, t > 0 && (v += a), m.push(u);
      var d = u / i,
          _ = [],
          c = s;
      jQuery.each(r, function (e, t) {
        var i = jQuery(t),
            r = i.index(),
            o = n[r],
            a = Math.round(o * d);
        _[e] = a, c += a;
      });
      var h = c - e;
      jQuery.each(_, function (e, t) {
        return 0 == h ? !1 : (0 > h ? (_[e] = t + 1, h++) : (_[e] = t - 1, h--), void (e == _.length - 1 && 0 != h && (_[e] -= h)));
      }), f[t] = _;
    });
    var b = {
      arrRows: d,
      arrRowWidths: f,
      arrRowHeights: m,
      gap: a,
      totalHeight: v
    };
    return b;
  }

  function b(e) {
    if (!e) var e = !1;
    var t = r(),
        i = v();
    $.height(i.totalHeight);
    var n = r();
    n != t && (i = v()), o();
    var a = 0,
        l = 0;
    jQuery.each(i.arrRows, function (t, n) {
      var r = i.arrRowWidths[t],
          o = i.arrRowHeights[t],
          s = 0;
      jQuery.each(n, function (t, n) {
        var u = jQuery(n),
            d = o,
            _ = r[t];
        se.resizeTile(u, _, d, se.resizemode.VISIBLE_ELEMENTS), ae.placeElement(u, s, a), s += _, s > l && (l = s), s += i.gap, 1 == e && jQuery(n).show();
      }), a += o + i.gap;
    }), s();
  }

  function y() {
    var e = jQuery(J).find("img.ug-thumb-image"),
        t = le.getThumbs();
    _e.isAllLoaded = !1, t.fadeTo(0, 0), ae.checkImagesLoaded(e, function () {
      setTimeout(function () {
        b(!0), t.fadeTo(0, 1), oe.triggerEvent(ne.events.TILES_FIRST_PLACED), n(), re.trigger(ne.events.ALL_TILES_LOADED);
      });
    }, function (e, t) {
      e = jQuery(e);
      var i = jQuery(e).parent();
      le.triggerImageLoadedEvent(i, e);
    });
  }

  function I() {
    var e = jQuery(J).find("img.ug-thumb-image"),
        t = le.getThumbs();
    _e.isAllLoaded = !1, t.fadeTo(0, 0), ae.checkImagesLoaded(e, function () {
      1 == oe.isMobileMode() ? c(!0) : E(!0), oe.triggerEvent(ne.events.TILES_FIRST_PLACED), n(), re.trigger(ne.events.ALL_TILES_LOADED);
    }, function (e, t) {
      e = jQuery(e);
      var i = jQuery(e).parent();
      le.triggerImageLoadedEvent(i, e);
    });
  }

  function w() {
    var e = r();
    ge.galleryWidth = e, te = {}, ge.colWidth = de.tiles_nested_col_width, ge.optimalTileWidth = de.tiles_nested_optimal_tile_width, ge.currentGap = de.tiles_space_between_cols, 1 == oe.isMobileMode() && (ge.currentGap = de.tiles_space_between_cols_mobile), null == ge.colWidth ? ge.colWidth = Math.floor(ge.optimalTileWidth / ge.nestedOptimalCols) : ge.optimalTileWidth > ge.colWidth ? ge.nestedOptimalCols = Math.ceil(ge.optimalTileWidth / ge.colWidth) : ge.nestedOptimalCols = 1, ge.maxColumns = ae.getNumItemsInSpace(e, ge.colWidth, ge.currentGap), ge.colWidth = ae.getItemSizeInSpace(e, ge.maxColumns, ge.currentGap), ge.gridY = 0, ie = [];
    var t = le.getThumbs(!0);

    switch (t.each(function () {
      var e = jQuery(this),
          t = T(e);
      ie.push(t);
    }), ge.optimalTileWidth > ge.colWidth ? ge.nestedOptimalCols = Math.ceil(ge.optimalTileWidth / ge.colWidth) : ge.nestedOptimalCols = 1, ge.totalWidth = ge.maxColumns * (ge.colWidth + ge.currentGap) - ge.currentGap, de.tiles_align) {
      case "center":
      default:
        ge.addX = Math.round((ge.galleryWidth - ge.totalWidth) / 2);
        break;

      case "left":
        ge.addX = 0;
        break;

      case "right":
        ge.addX = ge.galleryWidth - ge.totalWidth;
    }

    ge.maxGridY = 0;
  }

  function E(e) {
    var t = r();
    w(), x();
    var i = ge.maxGridY * (ge.colWidth + ge.currentGap) - ge.currentGap;
    $.height(i);
    var n = r();
    n != t && (w(), x()), 0 == de.tiles_nested_debug && U(e);
  }

  function T(e) {
    var t,
        i,
        n = {},
        r = ge.colWidth,
        o = ge.currentGap,
        a = se.getTileImageSize(e),
        s = e.index(),
        l = Math.ceil(S(s) * (1 * ge.nestedOptimalCols / 3) + 2 * ge.nestedOptimalCols / 3),
        u = a.width,
        d = a.height,
        _ = u / d;

    return u > d ? (t = l, i = Math.round(t / _), 0 == i && (i = 1)) : (i = l, t = Math.round(i * _), 0 == t && (t = 1)), n.dimWidth = t, n.dimHeight = i, n.width = t * r + o * (t - 1), n.height = i * r + o * (i - 1), n.imgWidth = u, n.imgHeight = d, n.left = 0, n.top = 0, n;
  }

  function S(e) {
    return Math.abs(Math.sin(Math.abs(1e3 * Math.sin(e))));
  }

  function P(e, t) {
    if (0 == t) {
      for (var i = ge.currentItem; i < ie.length; i++) {
        j(i, !0);
      }

      ge.currentItem = ie.length - 1;
    } else j(ge.currentItem, !0);

    for (var i = 0; i <= ge.currentItem; i++) {
      V(i, !0);
    }

    ge.currentItem++;
  }

  function x(e) {
    if (1 == de.tiles_nested_debug) return "undefined" == typeof e && (e = !0), P(!0, e), !1;

    for (var t = 0; t < ie.length; t++) {
      j(t, !0);
    }
  }

  function j(e, t) {
    if (!t) var t = !1;
    ge.maxColHeight = 0;

    for (var i = ae.getObjectLength(te), n = ge.gridY; i + 1 >= n; n++) {
      for (var r = 0; r < ge.maxColumns; r++) {
        if (0 == Q(ge.gridY) || 0 == F(ge.gridY, r)) {
          var o = D(r);
          return void C(e, o, r);
        }
      }

      ge.gridY++;
    }
  }

  function C(e, t, i) {
    var n = jQuery.extend(!0, {}, ie[e]),
        r = n.dimWidth,
        o = t - n.dimWidth,
        a = ge.nestedOptimalCols,
        s = t <= n.dimWidth || .33 * a >= o || a >= t;
    if (s) N(e, t);else if (a >= o) a >= 4 ? 1 == G(Math.floor(t / 2), i) ? N(e, Math.floor(t / 2) + 1) : N(e, Math.floor(t / 2)) : N(objImage, t);else if (1 == G(r, i)) switch (r >= a) {
      case !0:
        N(e, r - 1);
        break;

      case !1:
        N(e, r + 1);
    }
    n = jQuery.extend(!0, {}, ie[e]);
    var l = L(e, n.dimWidth, i);

    if (ge.columnsValueToEnableHeightResize <= l[0] && ge.maxColumns >= 2 * ge.nestedOptimalCols) {
      var u = H(i, n),
          d = k(e, u.newHeight, !0);
      ie[e].dimHeight = d.dimHeight;

      var _ = z(l, d.dimWidth, i),
          g = A(_),
          c = !1;

      g >= 2 && (c = !0), u.newHeight >= n.dimHeight && (n = k(e, u.newHeight, !0));
      var h = M(u.idToResize, u.newHeight, n.dimHeight);
      n.top = ge.gridY, n.left = i, h.push({
        tileID: e,
        sizes: n
      });
      var p = R(h),
          f = R(_);
      return f > p || 1 == c ? void O(h) : void O(_);
    }

    n.left = i, n.top = ge.gridY, ie[e] = n, W(e, n, i, ge.gridY), ge.maxGridY = n.top + n.dimHeight;
  }

  function A(e) {
    for (var t = 0, i = 0, n = 0; n < e.length - 1; n++) {
      var r = e[n].sizes,
          o = -1,
          a = -1;
      Q(r.top + r.dimHeight) && ge.maxColumns > r.left + r.dimWidth && (o = te[r.top + r.dimHeight - 1][r.left + r.dimWidth], a = te[r.top + r.dimHeight][r.left + r.dimWidth]), o != a && t++;
    }

    for (var n = 0; n < e.length - 1; n++) {
      var r = e[n].sizes,
          o = -1,
          a = -1;
      Q(r.top + r.dimHeight) && r.left - 1 >= 0 && (o = te[r.top + r.dimHeight - 1][r.left - 1], a = te[r.top + r.dimHeight][r.left - 1]), o != a && i++;
    }

    return Math.max(i, t);
  }

  function M(e, t, i) {
    var n = ie[e],
        r = n.dimHeight,
        o = (n.dimWidth, n.left),
        a = n.top,
        s = (parseInt(a / (ge.colWidth + ge.currentGap)), parseInt(o / (ge.colWidth + ge.currentGap)), r - t + i),
        l = k(e, s, !0),
        u = [];
    return u.push({
      tileID: e,
      sizes: l
    }), u;
  }

  function O(e) {
    for (var t = 0; t < e.length; t++) {
      var i = e[t].sizes,
          n = e[t].tileID;
      ie[n] = jQuery.extend(!0, {}, i), W(n, i, i.left, i.top);
    }
  }

  function z(e, t) {
    for (var i = 0, n = 0, r = [], o = 0, a = 0, s = 0; s < e[1].length; s++) {
      var l = e[1][s],
          u = ie[e[1][s]];
      if (n += u.dimHeight, 0 != s) i += u.dimHeight, r.push([l, u.dimHeight]);else {
        var d = N(l, t, !0);
        i += d.dimHeight, r.push([e[1][s], d.dimHeight]);
      }
    }

    o = u.left, a = u.top;

    for (var _ = n, g = [], s = r.length - 1; s >= 0; s--) {
      var c,
          l = r[s][0];
      0 != s ? (c = Math.max(Math.round(1 * n / 3), Math.floor(r[s][1] * (n / i))), _ -= c, d = k(l, c, !0), d.left = o, d.top = a, g.push({
        tileID: l,
        sizes: d
      }), a += d.dimHeight) : (c = _, d = k(l, c, !0), d.left = o, d.top = a, g.push({
        tileID: l,
        sizes: d
      }));
    }

    return g;
  }

  function L(e, t, i) {
    var n = ge.gridY - 1,
        r = 0,
        o = 0,
        a = 1,
        s = [],
        l = [];

    if (s.push(e), n >= 0) {
      for (o = 0; n >= 0;) {
        if (r = te[n][i], "undefined" != typeof te[n][i - 1] && te[n][i - 1] == te[n][i] || "undefined" != typeof te[n][i + t] && te[n][i + t - 1] == te[n][i + t] || te[n][i] != te[n][i + t - 1]) return l.push(a), l.push(s), l;
        o != r && (a++, s.push(r)), n--, o = r;
      }

      return l.push(a), l.push(s), l;
    }

    return [0, []];
  }

  function H(e, t) {
    var i = 0,
        n = 0,
        r = t.dimWidth,
        o = t.dimHeight,
        a = 0,
        s = 0,
        l = jQuery.map(te, function (e, t) {
      return [e];
    });
    if ("undefined" == typeof l[ge.gridY] || "undefined" == typeof l[ge.gridY][e - 1]) n = 0;else for (var u = 0;;) {
      if ("undefined" == typeof te[ge.gridY + u] || -1 == te[ge.gridY + u][e - 1]) break;
      a = te[ge.gridY + u][e - 2], u++, n++;
    }
    if ("undefined" == typeof l[ge.gridY] || "undefined" == typeof l[ge.gridY][e + r]) i = 0;else for (u = 0;;) {
      if ("undefined" == typeof te[ge.gridY + u] || -1 == te[ge.gridY + u][e + r]) break;
      s = te[ge.gridY + u][e + r + 1], u++, i++;
    }
    var d = 0,
        _ = 0;
    Math.abs(o - n) < Math.abs(o - i) && 0 != n ? (d = n, _ = a) : 0 != i ? (d = i, _ = s) : d = o;
    var g = {
      newHeight: d,
      idToResize: _
    };
    return g;
  }

  function N(e, t, i) {
    i || (i = !1);
    var n = ge.colWidth,
        r = ge.currentGap,
        o = ie[e],
        a = o.imgWidth,
        s = o.imgHeight,
        l = a / s;

    if (dimWidth = t, dimHeight = Math.round(dimWidth / l), 1 == i) {
      var u = jQuery.extend(!0, {}, o);
      return u.dimWidth = dimWidth, u.dimHeight = dimHeight, u.width = dimWidth * n + r * (dimWidth - 1), u.height = dimHeight * n + r * (dimHeight - 1), u;
    }

    o.dimWidth = dimWidth, o.dimHeight = dimHeight, o.width = dimWidth * n + r * (dimWidth - 1), o.height = dimHeight * n + r * (dimHeight - 1);
  }

  function k(e, t, i) {
    i || (i = !1);
    var n = ie[e],
        r = n.dimWidth,
        o = ge.colWidth,
        a = ge.currentGap;

    if (1 == i) {
      var s = jQuery.extend(!0, {}, n);
      return s.dimHeight = t, s.width = r * o + a * (r - 1), s.height = t * o + a * (t - 1), s;
    }

    n.dimHeight = t, n.width = r * o + a * (r - 1), n.height = t * o + a * (t - 1);
  }

  function R(e) {
    for (var t = 0, i = 0, n = 0; n < e.length; n++) {
      var r = ie[e[n].tileID];
      if (0 == r.dimHeight || 0 == r.height) return;
      resizeVal = r.dimWidth / r.dimHeight / (r.imgWidth / r.imgHeight), resizeVal < 1 && (resizeVal = 1 / resizeVal), t += resizeVal, i++;
    }

    return t / i;
  }

  function G(e, t) {
    var i = ge.gridY - 1;
    return 0 >= i || 0 == Q(i) ? !1 : te[i][t + e - 1] != te[i][t + e] ? !0 : !1;
  }

  function D(e) {
    var t = e,
        i = 0;
    if (1 == Q(ge.gridY)) for (; 0 == F(ge.gridY, t);) {
      i++, t++;
    } else i = ge.maxColumns;
    return i;
  }

  function Q(e) {
    return "undefined" == typeof te[e] ? !1 : !0;
  }

  function W(e, t, i, n) {
    for (var r = 0; r < t.dimHeight; r++) {
      for (var o = 0; o < t.dimWidth; o++) {
        0 == Q(n + r) && B(n + r), Y(n + r, i + o, e);
      }
    }
  }

  function B(e) {
    te[e] = new Object();

    for (var t = 0; t < ge.maxColumns; t++) {
      te[e][t] = -1;
    }
  }

  function F(e, t) {
    return -1 != te[e][t];
  }

  function Y(e, t, i) {
    te[e][t] = i;
  }

  function U(e) {
    if (!e) var e = !1;
    o();

    for (var t = 0; t < ie.length; t++) {
      V(t, e);
    }

    $.height(ge.maxColHeight), s();
  }

  function V(e, t) {
    var i = le.getThumbByIndex(e),
        n = ie[e],
        r = n.top * (ge.colWidth + ge.currentGap),
        o = ge.addX + n.left * (ge.colWidth + ge.currentGap);
    se.resizeTile(i, n.width, n.height, se.resizemode.VISIBLE_ELEMENTS), ae.placeElement(i, o, r), r + n.height > ge.maxColHeight && (ge.maxColHeight = r + n.height), 1 == t && i.fadeTo(0, 1);
  }

  function X() {
    if (1 == _e.isFirstTimeRun) return !0;
    if (0 == _e.isAllLoaded) return !1;

    switch (de.tiles_type) {
      case "columns":
        c(!1);
        break;

      case "justified":
        b(!1);
        break;

      case "nested":
        var e = oe.isMobileMode();
        1 == e ? c(!1) : E(!1);
    }
  }

  function Z() {
    re.on(ne.events.ALL_TILES_LOADED, function () {
      _e.isAllLoaded = !0;
    }), K.on(oe.events.SIZE_CHANGE, X), K.on(ne.events.TILES_FIRST_PLACED, function () {
      _e.isFirstPlaced = !1;
    }), se.initEvents();
  }

  function q() {
    switch (J.children(".ug-tile").show(), 1 == _e.isFirstTimeRun && Z(), se.run(), de.tiles_type) {
      default:
      case "columns":
        m();
        break;

      case "justified":
        y();
        break;

      case "nested":
        I();
    }

    _e.isFirstTimeRun = !1;
  }

  var K,
      J,
      $,
      ee,
      te,
      ie,
      ne = this,
      re = jQuery(this),
      oe = new UniteGalleryMain(),
      ae = new UGFunctions(),
      se = new UGTileDesign(),
      le = new UGThumbsGeneral(),
      ue = {},
      de = {
    tiles_type: "columns",
    tiles_col_width: 250,
    tiles_align: "center",
    tiles_exact_width: !1,
    tiles_space_between_cols: 3,
    tiles_space_between_cols_mobile: 3,
    tiles_include_padding: !0,
    tiles_min_columns: 2,
    tiles_max_columns: 0,
    tiles_keep_order: !1,
    tiles_set_initial_height: !0,
    tiles_justified_row_height: 150,
    tiles_justified_space_between: 3,
    tiles_nested_optimal_tile_width: 250,
    tiles_nested_col_width: null,
    tiles_nested_debug: !1,
    tiles_enable_transition: !0
  };
  this.events = {
    THUMB_SIZE_CHANGE: "thumb_size_change",
    TILES_FIRST_PLACED: "tiles_first_placed",
    ALL_TILES_LOADED: "all_tiles_loaded"
  };
  var _e = {
    isFirstTimeRun: !0,
    handle: null,
    isTransActive: !1,
    isTransInited: !1,
    isFirstPlaced: !0,
    isAllLoaded: !1
  },
      ge = {
    colWidth: null,
    nestedOptimalCols: 5,
    gridY: 0,
    maxColumns: 0,
    columnsValueToEnableHeightResize: 3,
    resizeLeftRightToColumn: !0,
    currentItem: 0,
    currentGap: null,
    optimalTileWidth: null,
    maxGridY: 0
  };
  this.destroy = function () {
    K.off(oe.events.SIZE_CHANGE), se.destroy(), K.off(ne.events.TILES_FIRST_PLACED);
  }, this.init = function (t, i) {
    e(t, i);
  }, this.setHtml = function (e) {
    i(e);
  }, this.getObjTileDesign = function () {
    return se;
  }, this.run = function () {
    q();
  }, this.runNewItems = function () {
    if (!$) throw new Error("Can't run new items - parent not set");

    switch (se.setHtml($, !0), se.run(!0), de.tiles_type) {
      case "columns":
        m();
        break;

      default:
      case "justified":
      case "nested":
        throw new Error("Tiles type: " + de.tiles_type + " not support load more yet");
    }
  };
}

function UGTileDesign() {
  function e(e, i) {
    D = e, L = jQuery(e);
    var r = D.getObjects();
    N = r.g_objWrapper, k = D.getArrItems(), B = jQuery.extend(B, F), B = jQuery.extend(B, i), t(), W.init(e, B);
    var o = {
      allow_onresize: !1
    },
        a = ["overlay"];
    Y.funcCustomTileHtml && (a = []), W.setCustomThumbs(n, a, o);
    var s = W.getOptions();
    B = jQuery.extend(B, s), Y.ratioByWidth = B.tile_width / B.tile_height, Y.ratioByHeight = B.tile_height / B.tile_width, B.tile_size_by == R.sizeby.GLOBAL_RATIO && Y.isTextpanelOutside && (Y.hasImageContainer = !0);
  }

  function t() {
    if (1 == B.tile_enable_overlay ? (B.thumb_overlay_opacity = B.tile_overlay_opacity, B.thumb_overlay_color = B.tile_overlay_color) : 0 == B.tile_enable_icons ? B.thumb_color_overlay_effect = !1 : B.thumb_overlay_opacity = 0, B.tile_as_link && (B.thumb_wrapper_as_link = !0, B.thumb_link_newpage = B.tile_link_newpage), 1 == B.tile_enable_outline && 0 == B.tile_enable_border && (B.tile_enable_outline = !1), Y.tileInnerReduce = 0, B.tile_enable_border && (Y.tileInnerReduce = 2 * B.tile_border_width, W.setThumbInnerReduce(Y.tileInnerReduce)), Y.isSaparateIcons = !Q.isRgbaSupported(), 1 == B.tile_enable_textpanel) {
      switch (B.tile_textpanel_position) {
        case "top":
          B.tile_textpanel_align = "top";

        case "bottom":
          Y.isTextpanelOutside = !0, B.tile_textpanel_always_on = !0, B.tile_textpanel_offset = 0;
          break;

        case "inside_top":
          B.tile_textpanel_align = "top";
          break;

        case "middle":
          B.tile_textpanel_align = "middle", B.tile_textpanel_appear_type = "fade";
      }

      0 == B.tile_textpanel_always_on && (Y.isSaparateIcons = !0);
    }

    0 != B.tile_textpanel_offset && (B.tile_textpanel_appear_type = "fade", B.tile_textpanel_margin = B.tile_textpanel_offset), "title_and_desc" == B.tile_textpanel_source && (B.tile_textpanel_enable_description = !0, B.tile_textpanel_desc_style_as_title = !0);
  }

  function i() {
    var e = D.isMobileMode();

    switch (Y.isTextPanelHidden = !1, 1 == e && 0 == B.tile_textpanel_always_on && (Y.isTextPanelHidden = !0), Y.isVideoplayIconAlwaysOn = B.tile_videoplay_icon_always_on, B.tile_videoplay_icon_always_on) {
      case "always":
        Y.isVideoplayIconAlwaysOn = !0;
        break;

      case "never":
        Y.isVideoplayIconAlwaysOn = !1;
        break;

      case "mobile_only":
        Y.isVideoplayIconAlwaysOn = 1 == e ? !0 : !1;
        break;

      case "desktop_only":
        Y.isVideoplayIconAlwaysOn = 0 == e ? !0 : !1;
    }
  }

  function n(e, t) {
    if (e.addClass("ug-tile"), Y.funcCustomTileHtml) return Y.funcCustomTileHtml(e, t), !1;
    var i = "";
    1 == Y.hasImageContainer && (i += "<div class='ug-image-container ug-trans-enabled'>");
    var n = "ug-thumb-image";
    (0 == B.tile_enable_image_effect || 1 == B.tile_image_effect_reverse) && (n += " ug-trans-enabled");
    var r = Q.stripTags(t.title);
    r = Q.htmlentitles(r), i += '<img src="' + Q.escapeDoubleSlash(t.urlThumb) + "\" alt='" + r + "' class='" + n + "'>", 1 == Y.hasImageContainer && (i += "</div>"), e.append(i), B.tile_size_by == R.sizeby.GLOBAL_RATIO && e.fadeTo(0, 0);
    var o = {};

    if (1 == B.tile_enable_background && (o["background-color"] = B.tile_background_color), 1 == B.tile_enable_border && (o["border-width"] = B.tile_border_width + "px", o["border-style"] = "solid", o["border-color"] = B.tile_border_color, B.tile_border_radius && (o["border-radius"] = B.tile_border_radius + "px")), 1 == B.tile_enable_outline && (o.outline = "1px solid " + B.tile_outline_color), 1 == B.tile_enable_shadow) {
      var a = B.tile_shadow_h + "px ";
      a += B.tile_shadow_v + "px ", a += B.tile_shadow_blur + "px ", a += B.tile_shadow_spread + "px ", a += B.tile_shadow_color, o["box-shadow"] = a;
    }

    e.css(o);
    var s = "";

    if (B.tile_enable_icons) {
      if (0 == B.tile_as_link && 1 == B.tile_enable_action) {
        var l = "ug-button-play ug-icon-zoom";
        "image" != t.type && (l = "ug-button-play ug-icon-play"), s += "<div class='ug-tile-icon " + l + "' style='display:none'></div>";
      }

      if (t.link && 1 == B.tile_show_link_icon || 1 == B.tile_as_link) if (0 == B.tile_as_link) {
        var u = "";
        1 == B.tile_link_newpage && (u = " target='_blank'"), s += "<a href='" + t.link + "'" + u + " class='ug-tile-icon ug-icon-link'></a>";
      } else s += "<div class='ug-tile-icon ug-icon-link' style='display:none'></div>";
      var _ = Y.isSaparateIcons;
      if (0 == _ && "image" != t.type && 1 == Y.isVideoplayIconAlwaysOn && (_ = !0), _) var g = e;else var g = e.children(".ug-thumb-overlay");
      g.append(s);
      var c = g.children("." + l);
      0 == c.length ? c = null : c.hide();
      var h = g.children(".ug-icon-link");
      0 == h.length ? h = null : h.hide(), h || 1 != B.tile_enable_action || e.addClass("ug-tile-clickable");
    } else 1 == B.tile_enable_action && e.addClass("ug-tile-clickable");

    if (1 == B.tile_enable_image_effect) {
      var p = "";
      0 == B.tile_image_effect_reverse && (p = " ug-trans-enabled");
      var f = "<div class='ug-tile-image-overlay" + p + "' >",
          m = " ug-" + B.tile_image_effect_type + "-effect";
      f += '<img src="' + Q.escapeDoubleSlash(t.urlThumb) + "\" alt='" + t.title + "' class='" + m + p + "'>", f += "</div>", e.append(f), 1 == B.tile_image_effect_reverse && e.children(".ug-tile-image-overlay").fadeTo(0, 0);
    }

    if (1 == B.tile_enable_textpanel) {
      var v = new UGTextPanel();
      v.init(D, B, "tile");
      var b = "";
      (1 == B.tile_textpanel_always_on || 1 == Y.isTextpanelOutside) && (b = "ug-trans-enabled"), v.appendHTML(e, b);
      var y = t.title,
          I = "";

      switch (B.tile_textpanel_source) {
        case "desc":
        case "description":
          y = t.description;
          break;

        case "desc_title":
          "" != t.description && (y = t.description);
          break;

        case "title_and_desc":
          y = t.title, I = t.description;
      }

      if (v.setTextPlain(y, I), 0 == B.tile_textpanel_always_on && v.getElement().fadeTo(0, 0), e.data("objTextPanel", v), 1 == B.tile_textpanel_always_on) {
        var w = d(e);
        w.css("z-index", 2);
      }

      if (1 == Y.isTextpanelOutside) {
        var E = "<div class='ug-tile-cloneswrapper'></div>";
        e.append(E);
        var T = e.children(".ug-tile-cloneswrapper"),
            S = new UGTextPanel();
        S.init(D, B, "tile"), S.appendHTML(T), S.setTextPlain(y, I), e.data("objTextPanelClone", S);
      }
    }

    null !== t.addHtml && e.append(t.addHtml);
  }

  function r(e) {
    var t = e.children(".ug-tile-image-overlay");
    return t;
  }

  function o(e) {
    var t = e.children(".ug-thumb-overlay");
    return t;
  }

  function a(e) {
    if (0 == Y.hasImageContainer) return null;
    var t = e.children(".ug-image-container");
    return t;
  }

  function s(e) {
    var t = e.find(".ug-tile-image-overlay img");
    return t;
  }

  function l(e) {
    var t = e.data("objTextPanel");
    return t;
  }

  function u(e) {
    var t = e.data("objTextPanelClone");
    return t;
  }

  function d(e) {
    var t = e.children(".ug-textpanel");
    return t;
  }

  function _(e) {
    var t = e.find(".ug-tile-cloneswrapper .ug-textpanel");
    if (0 == t.length) throw new Error("text panel cloned element not found");
    return t;
  }

  function g(e) {
    if (1 == Y.isTextpanelOutside) var t = _(e);else var t = d(e);
    if (!t) return 0;
    var i = Q.getElementSize(t);
    return i.height;
  }

  function c(e) {
    var t = e.find(".ug-icon-link");
    return 0 == t.length ? null : t;
  }

  function h(e) {
    var t = Y.ratioByHeight;

    switch (B.tile_size_by) {
      default:
        t = Y.ratioByHeight;
        break;

      case R.sizeby.IMAGE_RATIO:
        if (!e) throw new Error("tile should be given for tile ratio");
        var i = R.getItemByTile(e);

        if ("undefined" != typeof i.thumbRatioByHeight) {
          if (0 == i.thumbRatioByHeight) throw trace(i), new Error("the item ratio not inited yet");
          t = i.thumbRatioByHeight;
        }

        break;

      case R.sizeby.CUSTOM:
        return null;
    }

    return t;
  }

  function p(e) {
    var t = e.find(".ug-button-play");
    return 0 == t.length ? null : t;
  }

  function f(e) {
    return e.hasClass("ug-thumb-over") ? !0 : !1;
  }

  function m(e) {
    return e.hasClass("ug-tile-clickable");
  }

  function v(e) {
    return 1 == B.tile_enable_icons && 1 == Y.isVideoplayIconAlwaysOn && "image" != e.type ? !0 : !1;
  }

  function b(e, t, i, n) {
    var o = r(e),
        l = R.getTileImage(e),
        u = s(e);
    t -= Y.tileInnerReduce, i -= Y.tileInnerReduce;
    var d = null;

    if (1 == Y.isTextpanelOutside) {
      var _ = g(e);

      if (i -= _, "top" == B.tile_textpanel_position && (d = _), 1 == Y.hasImageContainer) {
        var c = a(e);
        Q.setElementSize(c, t, i), null !== d && Q.placeElement(c, 0, d);
      }
    }

    if (0 == B.tile_enable_image_effect) Q.scaleImageCoverParent(l, t, i), 0 == Y.hasImageContainer && null !== d && Q.placeElement(l, 0, d);else {
      var h = "nothing";
      n === !0 && 0 == Y.isTextpanelOutside && (h = 1 == B.tile_image_effect_reverse ? "effect" : "image"), "effect" != h && (Q.setElementSize(o, t, i), null !== d && Q.placeElement(o, 0, d), Q.scaleImageCoverParent(u, t, i)), "image" != h && (1 == Y.hasImageContainer ? Q.scaleImageCoverParent(l, t, i) : "effect" == h ? (Q.scaleImageCoverParent(l, t, i), null !== d && Q.placeElement(l, 0, d)) : Q.cloneElementSizeAndPos(u, l, !1, null, d));
    }
  }

  function y(e, t, i, n) {
    var r = null;

    if (i && (r = i - Y.tileInnerReduce), n && (n -= Y.tileInnerReduce), "clone" == t) {
      var o = u(e);
      o.refresh(!0, !0, r);
      var a = R.getItemByTile(e);
      return a.textPanelCloneSizeSet = !0, !1;
    }

    var s = l(e);
    if (!s) return !1;
    var d = null;
    1 == Y.isTextpanelOutside && (d = g(e)), s.refresh(!1, !0, r, d);

    var _ = 1 == B.tile_textpanel_always_on || "fade" == B.tile_textpanel_appear_type;

    if (_) if (1 == Y.isTextpanelOutside && n && "bottom" == B.tile_textpanel_position) {
      var c = n - d;
      s.positionPanel(c);
    } else s.positionPanel();
  }

  function I(e) {
    var t = (R.getItemByTile(e), p(e)),
        i = c(e),
        n = Q.getElementSize(e);
    b(e, n.width, n.height), 1 == B.tile_enable_textpanel && y(e, "regular", n.width, n.height);
    var r = n.width - Y.tileInnerReduce,
        a = n.height - Y.tileInnerReduce,
        s = 0;

    if (1 == Y.isTextpanelOutside) {
      var l = g(e);
      a -= l, "top" == B.tile_textpanel_position && (s = l);
    }

    var u = o(e);

    if (Q.setElementSizeAndPosition(u, 0, s, r, a), t || i) {
      var _ = 0;

      if (1 == B.tile_enable_textpanel && 0 == Y.isTextPanelHidden && 0 == Y.isTextpanelOutside) {
        var h = d(e),
            f = Q.getElementSize(h);
        f.height > 0 && (_ = Math.floor(f.height / 2 * -1));
      }
    }

    if (t && i) {
      var m = Q.getElementSize(t),
          v = Q.getElementSize(i),
          I = B.tile_space_between_icons,
          w = m.width + I + v.width,
          E = Math.floor((n.width - w) / 2);
      I > E && (I = Math.floor((n.width - m.width - v.width) / 3), w = m.width + I + v.width, E = Math.floor((n.width - w) / 2)), Q.placeElement(t, E, "middle", 0, _), Q.placeElement(i, E + m.width + I, "middle", 0, _);
    } else t && Q.placeElement(t, "center", "middle", 0, _), i && Q.placeElement(i, "center", "middle", 0, _);

    t && t.show(), i && i.show();
  }

  function w(e, t) {
    var i = (R.getItemByTile(e), r(e)),
        n = B.thumb_transition_duration;

    if (0 == B.tile_image_effect_reverse) {
      var o = R.getTileImage(e);
      t ? (o.fadeTo(0, 1), i.stop(!0).fadeTo(n, 0)) : i.stop(!0).fadeTo(n, 1);
    } else t ? i.stop(!0).fadeTo(n, 1) : i.stop(!0).fadeTo(n, 0);
  }

  function E(e, t) {
    var i = B.thumb_transition_duration,
        n = d(e);
    if (!n) return !0;

    if ("slide" == B.tile_textpanel_appear_type) {
      var r = Q.getElementSize(n);
      if (0 == r.width) return !1;
      var o = -r.height,
          a = 0,
          s = {},
          l = {},
          u = "bottom";
      "inside_top" == B.tile_textpanel_position && (u = "top"), s[u] = o + "px", l[u] = a + "px", 1 == t ? (n.fadeTo(0, 1), 0 == n.is(":animated") && n.css(s), l.opacity = 1, n.stop(!0).animate(l, i)) : n.stop(!0).animate(s, i);
    } else 1 == t ? n.stop(!0).fadeTo(i, 1) : n.stop(!0).fadeTo(i, 0);
  }

  function T(e, t, i) {
    var n = B.thumb_transition_duration;
    i && i === !0 && (n = 0);
    var r = p(e),
        o = c(e),
        a = t ? 1 : 0;
    r && r.stop(!0).fadeTo(n, a), o && o.stop(!0).fadeTo(n, a);
  }

  function S(e, t) {
    if (t = jQuery(t), B.tile_enable_image_effect && w(t, !0), 1 == B.tile_enable_textpanel && 0 == B.tile_textpanel_always_on && 0 == Y.isTextPanelHidden && E(t, !0), Y.isSaparateIcons && 1 == B.tile_enable_icons) {
      var i = 1 == B.thumb_overlay_reverse,
          n = R.getItemByTile(t);
      0 == v(n) && T(t, i, !1);
    }
  }

  function P(e, t) {
    if (t = jQuery(t), B.tile_enable_image_effect && w(t, !1), 1 == B.tile_enable_textpanel && 0 == B.tile_textpanel_always_on && E(t, !1), 1 == Y.isSaparateIcons && 1 == B.tile_enable_icons) {
      var i = 1 == B.thumb_overlay_reverse ? !1 : !0,
          n = R.getItemByTile(t);
      0 == v(n) ? T(t, i, !1) : T(t, !0, !0);
    }
  }

  function x(e) {
    var t = W.getThumbs().not(e);
    t.each(function (e, t) {
      W.setThumbNormalStyle(jQuery(t));
    });
  }

  function j(e, t, i) {
    return t = jQuery(t), 1 == B.tile_visible_before_image && t.data("image_placed") !== !0 && i !== !0 ? !0 : (I(t), void W.setThumbNormalStyle(t));
  }

  function C(e, t, i) {
    I(t), i.fadeTo(0, 1), t.data("image_placed", !0);
  }

  function A(e) {
    return 1 == m(e) ? (G.trigger(R.events.TILE_CLICK, e), !0) : void (0 == f(e) && (x(e), W.setThumbOverStyle(e)));
  }

  function M(e) {
    var t = jQuery(this),
        i = t.prop("tagName").toLowerCase(),
        n = !0;
    if (Y.funcParentApproveClick && 0 == Y.funcParentApproveClick() && (n = !1), "a" == i) 0 == n && e.preventDefault();else if (0 == f(t)) 1 == n && A(t);else {
      if (0 == m(t)) return !0;
      1 == n && G.trigger(R.events.TILE_CLICK, t);
    }
  }

  function O(e) {
    e.stopPropagation();
    var t = jQuery(this).parents(".ug-tile"),
        i = !0;
    return Y.funcParentApproveClick && 0 == Y.funcParentApproveClick() && (i = !1), 0 == f(t) ? (A(t), !0) : 1 == i ? (G.trigger(R.events.TILE_CLICK, t), !1) : void 0;
  }

  function z(e) {
    var t = jQuery(this).parents(".ug-tile");
    Y.funcParentApproveClick && 0 == Y.funcParentApproveClick() && e.preventDefault(), 0 == f(t) && 0 == B.tile_as_link && (e.preventDefault(), A(t));
  }

  var L,
      H,
      N,
      k,
      R = this,
      G = jQuery(this),
      D = new UniteGalleryMain(),
      Q = new UGFunctions(),
      W = new UGThumbsGeneral();
  this.resizemode = {
    FULL: "full",
    WRAPPER_ONLY: "wrapper_only",
    VISIBLE_ELEMENTS: "visible_elements"
  }, this.sizeby = {
    GLOBAL_RATIO: "global_ratio",
    TILE_RATIO: "tile_ratio",
    IMAGE_RATIO: "image_ratio",
    CUSTOM: "custom"
  }, this.events = {
    TILE_CLICK: "tile_click"
  };
  var B = {
    tile_width: 250,
    tile_height: 200,
    tile_size_by: R.sizeby.IMAGE_RATIO,
    tile_visible_before_image: !1,
    tile_enable_background: !0,
    tile_background_color: "#F0F0F0",
    tile_enable_border: !1,
    tile_border_width: 3,
    tile_border_color: "#F0F0F0",
    tile_border_radius: 0,
    tile_enable_outline: !1,
    tile_outline_color: "#8B8B8B",
    tile_enable_shadow: !1,
    tile_shadow_h: 1,
    tile_shadow_v: 1,
    tile_shadow_blur: 3,
    tile_shadow_spread: 2,
    tile_shadow_color: "#8B8B8B",
    tile_enable_action: !0,
    tile_as_link: !1,
    tile_link_newpage: !0,
    tile_enable_overlay: !0,
    tile_overlay_opacity: .4,
    tile_overlay_color: "#000000",
    tile_enable_icons: !0,
    tile_show_link_icon: !1,
    tile_videoplay_icon_always_on: "never",
    tile_space_between_icons: 26,
    tile_enable_image_effect: !1,
    tile_image_effect_type: "bw",
    tile_image_effect_reverse: !1,
    tile_enable_textpanel: !1,
    tile_textpanel_source: "title",
    tile_textpanel_always_on: !1,
    tile_textpanel_appear_type: "slide",
    tile_textpanel_position: "inside_bottom",
    tile_textpanel_offset: 0
  },
      F = {
    thumb_color_overlay_effect: !0,
    thumb_overlay_reverse: !0,
    thumb_image_overlay_effect: !1,
    tile_textpanel_enable_description: !1,
    tile_textpanel_bg_opacity: .6,
    tile_textpanel_padding_top: 8,
    tile_textpanel_padding_bottom: 8
  },
      Y = {
    ratioByHeight: 0,
    ratioByWidth: 0,
    eventSizeChange: "thumb_size_change",
    funcCustomTileHtml: null,
    funcCustomPositionElements: null,
    funcParentApproveClick: null,
    isSaparateIcons: !1,
    tileInnerReduce: 0,
    isTextpanelOutside: !1,
    hasImageContainer: !1,
    isVideoplayIconAlwaysOn: !1,
    isTextPanelHidden: !1
  };
  this.loadTileImage = function (e) {
    var t = R.getTileImage(e);
    Q.checkImagesLoaded(t, null, function (t, i) {
      C(null, e, jQuery(t));
    });
  }, this.setHtml = function (e, t) {
    H = e, t !== !0 && i(), W.setHtmlThumbs(e, t);
  }, this.initEvents = function () {
    W.initEvents(), jQuery(W).on(W.events.SETOVERSTYLE, S), jQuery(W).on(W.events.SETNORMALSTYLE, P), jQuery(W).on(W.events.PLACEIMAGE, C), N.on(Y.eventSizeChange, j), H.on("click", ".ug-tile", M), H.on("click", ".ug-tile .ug-button-play", O), H.on("click", ".ug-tile .ug-icon-link", z);
  }, this.destroy = function () {
    if (H.off("click", ".ug-tile"), H.off("click", ".ug-tile .ug-button-play"), H.off("click", ".ug-tile .ug-icon-link"), jQuery(W).off(W.events.SETOVERSTYLE), jQuery(W).off(W.events.SETNORMALSTYLE), jQuery(W).off(W.events.PLACEIMAGE), N.off(Y.eventSizeChange), 1 == B.tile_enable_textpanel) {
      var e = W.getThumbs();
      jQuery.each(e, function (e, t) {
        var i = l(jQuery(t));
        i && i.destroy();
      });
    }

    W.destroy();
  }, this.init = function (t, i, n) {
    e(t, i, n);
  }, this.setFixedMode = function () {
    B.tile_size_by = R.sizeby.GLOBAL_RATIO, B.tile_visible_before_image = !0;
  }, this.setApproveClickFunction = function (e) {
    Y.funcParentApproveClick = e;
  }, this.resizeTile = function (e, t, i, n) {
    if (1 == Y.isTextpanelOutside && y(e, "clone", t), t) {
      if (!i) var i = R.getTileHeightByWidth(t, e);
    } else var t = B.tile_width,
        i = B.tile_height;

    switch (Q.setElementSize(e, t, i), n) {
      default:
      case R.resizemode.FULL:
        R.triggerSizeChangeEvent(e, !0);
        break;

      case R.resizemode.WRAPPER_ONLY:
        return !0;

      case R.resizemode.VISIBLE_ELEMENTS:
        if (Y.funcCustomTileHtml) return R.triggerSizeChangeEvent(e, !0), !0;
        b(e, t, i, !0), 1 == B.tile_enable_textpanel && 1 == B.tile_textpanel_always_on && t && y(e, "regular", t, i);
    }
  }, this.resizeAllTiles = function (e, t, n) {
    i();
    var r = null;
    if (B.tile_size_by == R.sizeby.GLOBAL_RATIO && (r = R.getTileHeightByWidth(e)), !n) var n = W.getThumbs();
    n.each(function (i, n) {
      R.resizeTile(jQuery(n), e, r, t);
    });
  }, this.triggerSizeChangeEvent = function (e, t) {
    if (!e) return !1;
    if (!t) var t = !1;
    N.trigger(Y.eventSizeChange, [e, t]);
  }, this.triggerSizeChangeEventAllTiles = function (e) {
    var t = W.getThumbs();
    t.each(function () {
      var t = jQuery(this);
      R.triggerSizeChangeEvent(t, e);
    });
  }, this.disableEvents = function () {
    var e = W.getThumbs();
    e.css("pointer-events", "none");
  }, this.enableEvents = function () {
    var e = W.getThumbs();
    e.css("pointer-events", "auto");
  }, this.setOptions = function (e) {
    B = jQuery.extend(B, e), W.setOptions(e);
  }, this.setTileSizeOptions = function (e) {
    if (B.tile_size_by !== R.sizeby.GLOBAL_RATIO) throw new Error("setNewTileOptions works with global ration only");
    B.tile_width = e, B.tile_height = Math.floor(e * Y.ratioByHeight);
  }, this.setCustomFunctions = function (e, t) {
    Y.funcCustomTileHtml = e, Y.funcCustomPositionElements = t;
  }, this.run = function (e) {
    var t = W.type.GET_THUMBS_ALL;
    e === !0 && (t = W.type.GET_THUMBS_NEW);
    var i = W.getThumbs(t);
    B.tile_size_by == R.sizeby.GLOBAL_RATIO && R.resizeAllTiles(B.tile_width, R.resizemode.WRAPPER_ONLY, i), 1 == B.tile_enable_image_effect && 0 == B.tile_image_effect_reverse && i.children(".ug-thumb-image").fadeTo(0, 0), W.setHtmlProperties(i), 1 == B.tile_visible_before_image && (i.children(".ug-thumb-image").fadeTo(0, 0), W.loadThumbsImages());
  }, this._____________EXTERNAL_GETTERS____________ = function () {}, this.getObjThumbs = function () {
    return W;
  }, this.getOptions = function () {
    return B;
  }, this.getTileImage = function (e) {
    var t = e.find("img.ug-thumb-image");
    return t;
  }, this.getItemByTile = function (e) {
    return W.getItemByThumb(e);
  }, this.getTileHeightByWidth = function (e, t) {
    var i = h(t);
    if (null === i) return null;
    var n = Math.floor((e - Y.tileInnerReduce) * i) + Y.tileInnerReduce;
    return t && 1 == Y.isTextpanelOutside && B.tile_size_by == R.sizeby.IMAGE_RATIO && (n += g(t)), n;
  }, this.getTileImageSize = function (e) {
    var t = R.getItemByTile(e);
    if (!t.thumbWidth || !t.thumbHeight) throw new Error("Can't get image size - image not inited.");
    var i = {
      width: t.thumbWidth,
      height: t.thumbHeight
    };
    return i;
  }, this.getGlobalTileSize = function () {
    if (B.tile_size_by != R.sizeby.GLOBAL_RATIO) throw new Error("The size has to be global ratio");
    var e = {
      width: B.tile_width,
      height: B.tile_height
    };
    return e;
  };
}

function UGAviaControl() {
  function e(e) {
    return 0 == p ? e.pageX : e.pageY;
  }

  function t(t) {
    jQuery("body").on("touchstart", function (e) {
      return 0 == f.isControlEnabled ? !0 : void (f.touchEnabled = !0);
    }), jQuery("body").mousemove(function (t) {
      if (0 == f.isControlEnabled) return !0;
      if (1 == f.touchEnabled) return jQuery("body").off("mousemove"), !0;
      f.isMouseInsideStrip = g.ismouseover();
      var i = u.isTouchMotionActive();

      if (1 == f.isMouseInsideStrip && 0 == i) {
        var n = e(t);
        l(n);
      } else a();
    });
  }

  function i(e) {
    var t = h.strip_padding_top,
        i = (h.strip_padding_bottom, g.height()),
        n = c.height();
    if (i > n) return null;
    var r = g.offset(),
        o = r.top,
        a = e - o - t;
    if (0 > a) return null;
    var s = h.thumb_height,
        l = i - h.thumb_height,
        u = l - s;
    s > a && (a = s), a > l && (a = l);

    var d = (a - s) / u,
        _ = (n - i) * d;

    return _ = -1 * Math.round(_) + t;
  }

  function n(e) {
    var t = h.strip_padding_left,
        i = h.strip_padding_right,
        n = g.width() - t - i,
        r = c.width();
    if (n > r) return null;
    var o = g.offset(),
        a = o.left,
        s = e - a - t,
        l = h.thumb_width,
        u = n - h.thumb_width,
        d = u - l;
    l > s && (s = l), s > u && (s = u);

    var _ = (s - l) / d,
        p = (r - n) * _;

    return p = -1 * Math.round(p) + t;
  }

  function r() {
    if (0 == f.is_strip_moving) return !1;
    var e = u.getInnerStripPos();
    Math.floor(e) == Math.floor(f.strip_finalPos) && a();
    var t,
        i = Math.abs(f.strip_finalPos - e);
    1 > i ? t = i : (t = i / 4, t > 0 && 1 > t && (t = 1)), f.strip_finalPos < e && (t = -1 * t);
    var n = e + t;
    u.positionInnerStrip(n);
  }

  function o() {
    return 1 == f.isStripMoving ? !1 : (f.isStripMoving = !0, void (f.handle_timeout = setInterval(r, 10)));
  }

  function a() {
    return 0 == f.isStripMoving ? !1 : (f.isStripMoving = !1, void (f.handle_timeout = clearInterval(f.handle_timeout)));
  }

  function s(e) {
    return 0 == p ? n(e) : i(e);
  }

  function l(e) {
    var t = s(e);
    return null === t ? !1 : (f.is_strip_moving = !0, f.strip_finalPos = t, void o());
  }

  var u,
      d,
      _,
      g,
      c,
      h,
      p,
      f = {
    touchEnabled: !1,
    isMouseInsideStrip: !1,
    strip_finalPos: 0,
    handle_timeout: "",
    isStripMoving: !1,
    isControlEnabled: !0
  };

  this.enable = function () {
    f.isControlEnabled = !0;
  }, this.disable = function () {
    f.isControlEnabled = !1;
  }, this.init = function (e) {
    u = e, _ = e.getObjects(), d = _.g_gallery, g = _.g_objStrip, c = _.g_objStripInner, h = _.g_options, p = _.isVertical, t();
  }, this.destroy = function () {
    jQuery("body").off("touchstart"), jQuery("body").off("mousemove");
  };
}

function UGSlider() {
  function e(e, t, n) {
    me = e, n && (he = n, t = we.convertCustomPrefixOptions(t, he, "slider")), te = jQuery(e);
    var r = me.getObjects();

    if (ie = r.g_objWrapper, ne = r.g_objThumbs, t.hasOwnProperty("slider_progress_indicator_type") && (Se.slider_progress_indicator_type = t.slider_progress_indicator_type), "bar" == Se.slider_progress_indicator_type && (Se = jQuery.extend(Se, Pe)), t && pe.setOptions(t), i(), 1 == Se.slider_enable_bullets) {
      ye = new UGBullets();
      var o = {
        bullets_skin: Se.slider_bullets_skin,
        bullets_space_between: Se.slider_bullets_space_between
      };
      ye.init(me, o);
    }

    Se.slider_enable_text_panel && (Te = new UGTextPanel(), Te.init(me, Se, "slider")), Se.slider_enable_zoom_panel && (ce = new UGZoomButtonsPanel(), ce.init(pe, Se));
    var a = me.getGalleryID();
    Ie.init(Se, !1, a);
  }

  function t() {
    if (1 == xe.isRunOnce) return !1;

    if (xe.isRunOnce = !0, Se.slider_background_color) {
      var e = Se.slider_background_color;
      1 != Se.slider_background_opacity && (e = we.convertHexToRGB(e, Se.slider_background_opacity)), re.css("background-color", e);
    } else 1 != Se.slider_background_opacity && (e = we.convertHexToRGB("#000000", Se.slider_background_opacity), re.css("background-color", e));

    1 == Se.slider_control_swipe && (_e = new UGTouchSliderControl(), _e.init(pe, Se)), 1 == Se.slider_control_zoom && (ge = new UGZoomSliderControl(), ge.init(pe, Se)), Te && Te.run(), X();
  }

  function i() {
    var e = me.getOptions(),
        t = e.gallery_skin;
    "" == Se.slider_bullets_skin && (Se.slider_bullets_skin = t), "" == Se.slider_arrows_skin && (Se.slider_arrows_skin = t), "" == Se.slider_zoompanel_skin && (Se.slider_zoompanel_skin = t), "" == Se.slider_play_button_skin && (Se.slider_play_button_skin = t), "" == Se.slider_fullscreen_button_skin && (Se.slider_fullscreen_button_skin = t), Se.video_enable_closebutton = Se.slider_video_enable_closebutton, "zoom" != e.gallery_mousewheel_role && (Se.slider_zoom_mousewheel = !1);
  }

  function n(e, t) {
    var i = "ug-type-square";
    "round" == Se.slider_videoplay_button_type && (i = "ug-type-round");
    var n = "";
    return n += "<div class='ug-slide-wrapper ug-slide" + t + "'>", n += "<div class='ug-item-wrapper'></div>", n += "<div class='ug-slider-preloader " + e + "'></div>", n += "<div class='ug-button-videoplay " + i + "' style='display:none'></div>", n += "</div>";
  }

  function r(e) {
    e && (ie = e);
    var t = Z(),
        i = (me.getOptions(), "<div class='ug-slider-wrapper'>");

    if (i += "<div class='ug-slider-inner'>", i += n(t, 1), i += n(t, 2), i += n(t, 3), i += "</div>", 1 == Se.slider_enable_arrows && (i += "<div class='ug-slider-control ug-arrow-left ug-skin-" + Se.slider_arrows_skin + "'></div>", i += "<div class='ug-slider-control ug-arrow-right ug-skin-" + Se.slider_arrows_skin + "'></div>"), 1 == Se.slider_enable_play_button && (i += "<div class='ug-slider-control ug-button-play ug-skin-" + Se.slider_play_button_skin + "'></div>"), 1 == Se.slider_enable_fullscreen_button && (i += "<div class='ug-slider-control ug-button-fullscreen ug-skin-" + Se.slider_fullscreen_button_skin + "'></div>"), i += "</div>", ie.append(i), re = ie.children(".ug-slider-wrapper"), oe = re.children(".ug-slider-inner"), ae = oe.children(".ug-slide1"), se = oe.children(".ug-slide2"), le = oe.children(".ug-slide3"), ae.data("slidenum", 1), se.data("slidenum", 2), le.data("slidenum", 3), ye && ye.appendHTML(re), 1 == Se.slider_enable_arrows && (ue = re.children(".ug-arrow-left"), de = re.children(".ug-arrow-right")), 1 == Se.slider_enable_play_button && (ve = re.children(".ug-button-play")), 1 == Se.slider_enable_fullscreen_button && (be = re.children(".ug-button-fullscreen")), 1 == Se.slider_enable_progress_indicator) {
      Ee = we.initProgressIndicator(Se.slider_progress_indicator_type, Se, re);
      var r = Ee.getType();
      "bar" == r && "pie" == Se.slider_progress_indicator_type && (Se.slider_progress_indicator_type = "bar", Se = jQuery.extend(Se, Pe)), me.setProgressIndicator(Ee);
    }

    if (1 == Se.slider_enable_text_panel && (Te.appendHTML(re), 0 == Se.slider_textpanel_always_on)) {
      var o = Te.getElement();
      o.hide().data("isHidden", !0), xe.isTextPanelSaparateHover = !0;
    }

    1 == Se.slider_enable_zoom_panel && ce.appendHTML(re), Ie.setHtml(oe);
  }

  function o(e) {
    var t = J(e);
    we.placeElementInParentCenter(t);
    var i = $(e);
    we.placeElementInParentCenter(i);
  }

  function a() {
    if (ye && (objBullets = ye.getElement(), we.placeElement(objBullets, Se.slider_bullets_align_hor, Se.slider_bullets_align_vert, Se.slider_bullets_offset_hor, Se.slider_bullets_offset_vert), we.placeElement(objBullets, Se.slider_bullets_align_hor, Se.slider_bullets_align_vert, Se.slider_bullets_offset_hor, Se.slider_bullets_offset_vert)), 1 == Se.slider_enable_arrows && (we.placeElement(ue, Se.slider_arrow_left_align_hor, Se.slider_arrow_left_align_vert, Se.slider_arrow_left_offset_hor, Se.slider_arrow_left_offset_vert), we.placeElement(de, Se.slider_arrow_right_align_hor, Se.slider_arrow_left_align_vert, Se.slider_arrow_right_offset_hor, Se.slider_arrow_right_offset_vert)), 0 == Se.slider_controls_always_on && M(!0), Ee) {
      var e = Ee.getElement();

      if ("bar" == Se.slider_progress_indicator_type) {
        var t = re.width();
        Ee.setSize(t), we.placeElement(e, "left", Se.slider_progress_indicator_align_vert, 0, Se.slider_progress_indicator_offset_vert);
      } else we.placeElement(e, Se.slider_progress_indicator_align_hor, Se.slider_progress_indicator_align_vert, Se.slider_progress_indicator_offset_hor, Se.slider_progress_indicator_offset_vert);
    }

    Te && Te.positionPanel(), s(), o(ae), o(se), o(le), C();
  }

  function s() {
    if (ve && we.placeElement(ve, Se.slider_play_button_align_hor, Se.slider_play_button_align_vert, Se.slider_play_button_offset_hor, Se.slider_play_button_offset_vert), be && we.placeElement(be, Se.slider_fullscreen_button_align_hor, Se.slider_fullscreen_button_align_vert, Se.slider_fullscreen_button_offset_hor, Se.slider_fullscreen_button_offset_vert), ce) {
      var e = ce.getElement();
      we.placeElement(e, Se.slider_zoompanel_align_hor, Se.slider_zoompanel_align_vert, Se.slider_zoompanel_offset_hor, Se.slider_zoompanel_offset_vert);
    }
  }

  function l() {
    var e,
        t,
        i,
        n,
        r = pe.getSlidesReference(),
        o = 0,
        a = 0,
        s = 0;
    i = pe.isSlideHasItem(r.objNextSlide), n = pe.isSlideHasItem(r.objPrevSlide), n ? (s = r.objPrevSlide.outerWidth(), r.objPrevSlide.css("z-index", 1)) : r.objPrevSlide.hide(), t = s + r.objCurrentSlide.outerWidth(), e = t, i ? (e = t + r.objNextSlide.outerWidth(), r.objPrevSlide.css("z-index", 2)) : r.objNextSlide.hide(), r.objCurrentSlide.css("z-index", 3), we.placeElement(r.objCurrentSlide, s, o), oe.css({
      left: -s + "px",
      width: e + "px"
    }), n && (we.placeElement(r.objPrevSlide, a, o), we.showElement(r.objPrevSlide)), i && (we.showElement(r.objNextSlide), we.placeElement(r.objNextSlide, t, o));
  }

  function u(e) {
    var t = e.data("index");
    if (void 0 === t || null == t) return !1;
    var i = me.getItem(t);
    return i ? void f(e, i) : !1;
  }

  function d(e) {
    e.stop(!0).show(100);
  }

  function _(e) {
    e.stop(!0).hide(100);
  }

  function g(e, t) {
    var i = Se.slider_image_border_width;
    if (10 >= i) return i;
    var n = we.getElementSize(e),
        r = n.width,
        o = n.height;
    if (t && (t.hasOwnProperty("imageWidth") && (r = t.imageWidth), t.hasOwnProperty("imageHeight") && (o = t.imageHeight)), 0 >= r) return i;
    var a = o > r ? r : o,
        s = 2 * i,
        l = s / a;
    if (l < Se.slider_image_border_maxratio) return i;
    var i = a * Se.slider_image_border_maxratio / 2;
    return i = Math.round(i);
  }

  function c(e, t, i) {
    var n = {};

    if (1 == Se.slider_image_border) {
      n["border-style"] = "solid";
      var r = g(e, i);
      n["border-width"] = r + "px", n["border-color"] = Se.slider_image_border_color, n["border-radius"] = Se.slider_image_border_radius;
    }

    "image" != t && 1 == Se.slider_video_constantsize && (n["background-color"] = "#000000"), 1 == Se.slider_image_shadow && (n["box-shadow"] = "3px 3px 10px 0px #353535"), e.css(n);
  }

  function h(e, t) {
    var i = Se.slider_video_constantsize_width,
        n = Se.slider_video_constantsize_height,
        r = Se.slider_video_constantsize_scalemode,
        o = we.scaleImageExactSizeInParent(e, t.imageWidth, t.imageHeight, i, n, r);
    return o;
  }

  function p(e, t, i) {
    var n = e.children(".ug-item-wrapper"),
        r = J(e);
    if ("undefined" == typeof t.urlImage || "" == t.urlImage) throw new Error("The slide don't have big image defined ( data-image='imageurl' ). Please check gallery items.", "showbig");
    var o = t.urlImage,
        a = e.data("urlImage");
    e.data("urlImage", o);
    var s = pe.getScaleMode(e),
        l = pe.getSlideType(e);

    if (objPadding = pe.getObjImagePadding(), a == o && i !== !0) {
      var u = n.children("img");
      (0 == t.imageWidth || 0 == t.imageHeight) && me.checkFillImageSize(u, t);
      var g = {};
      g = "image" != l && 1 == Se.slider_video_constantsize ? h(u, t) : we.scaleImageFitParent(u, t.imageWidth, t.imageHeight, s, objPadding), c(u, l, g), fe.trigger(pe.events.AFTER_PUT_IMAGE, e);
    } else if (u = we.placeImageInsideParent(o, n, t.imageWidth, t.imageHeight, s, objPadding), 1 == t.isBigImageLoaded) {
      if (u.fadeTo(0, 1), _(r), "image" != l && 1 == Se.slider_video_constantsize) var g = h(u, t);else var g = we.getImageInsideParentData(n, t.imageWidth, t.imageHeight, s, objPadding);
      u.css("width", g.imageWidth + "px"), c(u, l, g), fe.trigger(pe.events.AFTER_PUT_IMAGE, e);
    } else u.fadeTo(0, 0), d(r), e.data("isLoading", !0), pe.isSlideCurrent(e) && fe.trigger(pe.events.CURRENTSLIDE_LOAD_START), u.data("itemIndex", t.index), u.on("load", function () {
      var e = jQuery(this),
          t = e.data("itemIndex");
      e.fadeTo(0, 1);
      var i = e.parent().parent(),
          n = pe.getSlideType(i),
          r = J(i),
          o = pe.getObjImagePadding(),
          a = pe.getScaleMode(i);
      _(r), i.data("isLoading", !1), pe.isSlideCurrent(i) && fe.trigger(pe.events.CURRENTSLIDE_LOAD_END), me.onItemBigImageLoaded(null, e);
      var s = me.getItem(t),
          l = {};
      "image" != n && 1 == Se.slider_video_constantsize ? h(e, s) : l = we.scaleImageFitParent(e, s.imageWidth, s.imageHeight, a, o), e.fadeTo(0, 1), c(e, n, l), fe.trigger(pe.events.AFTER_PUT_IMAGE, i);
    });
  }

  function f(e, t) {
    try {
      var i = e.children(".ug-item-wrapper");
      if (null == t) return i.html(""), e.removeData("index"), e.removeData("type"), e.removeData("urlImage"), !1;
      e.data("index");
      e.data("index", t.index), e.data("type", t.type), 1 == Se.slider_enable_links && "image" == t.type && (t.link ? e.addClass("ug-slide-clickable") : e.removeClass("ug-slide-clickable")), p(e, t);
      var n = $(e);

      switch (t.type) {
        case "image":
          n.hide();
          break;

        default:
          n.show();
      }
    } catch (r) {
      throw "undefined" != typeof r.fileName && "showbig" == r.fileName && me.showErrorMessageReplaceGallery(r.message), i.html(""), new Error(r);
    }
  }

  function m() {
    if (!Te) return !1;
    if (1 == b()) return !1;
    var e = Te.getElement(),
        t = 0;
    (1 == xe.isTextPanelSaparateHover || 1 == Se.slider_textpanel_always_on) && (t = Se.slider_controls_appear_duration), e.stop().fadeTo(t, 0), e.data("isHidden", !0);
  }

  function v() {
    if (!Te) return !1;
    if (0 == b()) return !1;
    var e = Te.getElement(),
        t = 0;
    (1 == xe.isTextPanelSaparateHover || 1 == Se.slider_textpanel_always_on) && (e.show(), Te.positionElements(), t = Se.slider_controls_appear_duration), e.stop().show().fadeTo(t, 1), e.data("isHidden", !1);
  }

  function b() {
    var e = Te.getElement(),
        t = e.data("isHidden");
    return t === !1 ? !1 : !0;
  }

  function y(e, t) {
    if (void 0 == t) var t = pe.getCurrentSlide();
    var i = pe.getSlideType(t);
    if (i != e) throw new Error("Wrong slide type: " + i + ", should be: " + e);
    return !0;
  }

  function I() {
    var e = pe.getCurrentSlide(),
        t = pe.getSlideImage(e),
        i = we.getElementSize(e),
        n = i.left,
        r = i.top;

    if (1 == Se.slider_video_constantsize) {
      var o = we.getElementSize(t);
      n += o.left, r += o.top;
    } else n += Se.slider_video_padding_left, r += Se.slider_video_padding_top;

    Ie.setPosition(n, r);
  }

  function w() {
    var e = Se.slider_video_constantsize_width,
        t = Se.slider_video_constantsize_height;
    Ie.setSize(e, t);
    var i = Ie.getObject();
    c(i, "video");
  }

  function E(e, t, i) {
    fe.trigger(pe.events.TRANSITION_START);
    var n = Se.slider_transition;

    switch (i && (n = i), pe.stopSlideAction(null, !0), n) {
      default:
      case "fade":
        P(t);
        break;

      case "slide":
        T(e, t);
        break;

      case "lightbox_open":
        P(t, !1, !0);
    }
  }

  function T(e, t) {
    var i = pe.isAnimating();
    if (1 == i) return xe.itemWaiting = t, !0;
    null != xe.itemWaiting && (xe.itemWaiting = null);
    var n = pe.getSlidesReference();

    switch (e) {
      case "right":
        f(n.objPrevSlide, t), l();
        var r = we.getElementSize(n.objPrevSlide),
            o = -r.left;
        pe.switchSlideNums("right");
        break;

      case "left":
        f(n.objNextSlide, t), l();
        var a = we.getElementSize(n.objNextSlide),
            o = -a.left;
        pe.switchSlideNums("left");
        break;

      default:
        throw new Error("wrong direction: " + e);
    }

    var s = Se.slider_transition_speed,
        u = Se.slider_transition_easing,
        d = {
      duration: s,
      easing: u,
      queue: !1,
      always: function always() {
        if (pe.stopSlideAction(), Ie.hide(), null != xe.itemWaiting) {
          var e = K(xe.itemWaiting);
          T(e, xe.itemWaiting);
        } else pe.placeNabourItems(), fe.trigger(pe.events.TRANSITION_END);
      }
    };
    oe.animate({
      left: o + "px"
    }, d);
  }

  function S(e, t, i) {
    i ? e.fadeTo(Se.slider_transition_speed, t, i) : e.fadeTo(Se.slider_transition_speed, t);
  }

  function P(e, t, i) {
    if (!t) var t = !1;
    var n = pe.getSlidesReference();
    f(n.objNextSlide, e);
    var r = we.getElementSize(n.objCurrentSlide);
    we.placeElement(n.objNextSlide, r.left, r.top);
    var o = xe.numCurrent;
    if (xe.numCurrent = xe.numNext, xe.numNext = o, fe.trigger(pe.events.ITEM_CHANGED), n.objNextSlide.stop(!0), n.objCurrentSlide.stop(!0), 1 == t) n.objCurrentSlide.fadeTo(0, 0), n.objNextSlide.fadeTo(0, 1), pe.placeNabourItems(), fe.trigger(pe.events.TRANSITION_END), i !== !0 && Ie.hide();else {
      if (n.objNextSlide.fadeTo(0, 0), S(n.objCurrentSlide, 0, function () {
        pe.placeNabourItems(), fe.trigger(pe.events.TRANSITION_END), i !== !0 && Ie.hide();
      }), 1 == Ie.isVisible()) {
        var a = Ie.getObject();
        S(a, 0);
      }

      S(n.objNextSlide, 1);
    }
  }

  function x() {
    1 == Se.slider_fullscreen_button_mobilehide && be && be.hide(), 1 == Se.slider_play_button_mobilehide && ve && ve.hide(), 1 == Se.slider_zoompanel_mobilehide && ce && ce.getElement().hide();
  }

  function j() {
    1 == Se.slider_fullscreen_button_mobilehide && be && be.show(), 1 == Se.slider_play_button_mobilehide && ve && ve.show(), 1 == Se.slider_zoompanel_mobilehide && ce && ce.getElement().show();
  }

  function C() {
    var e = me.isMobileMode();
    e ? x() : j();
  }

  function A() {
    var e = re.children(".ug-slider-control");
    return e;
  }

  function M(e) {
    if (0 == we.isTimePassed("sliderControlsToggle")) return !1;
    if (0 == xe.isControlsVisible) return !1;
    if (!e) var e = !1;
    var t = A();
    e === !0 ? t.stop().fadeTo(0, 0).hide() : t.stop().fadeTo(Se.slider_controls_appear_duration, 0, function () {
      t.hide();
    }), xe.isControlsVisible = !1;
  }

  function O(e) {
    if (0 == we.isTimePassed("sliderControlsToggle")) return !1;
    if (1 == xe.isControlsVisible) return !0;
    if (!e) var e = !1;
    var t = A();
    e === !0 ? t.stop().show() : (t.stop().show().fadeTo(0, 0), t.fadeTo(Se.slider_controls_appear_duration, 1)), xe.isControlsVisible = !0;
  }

  function z() {
    0 == xe.isControlsVisible ? O() : M();
  }

  function L(e) {
    if (e == xe.currentControlsMode) return !1;

    switch (e) {
      case "image":
        ce && ce.getElement().show();
        break;

      case "video":
        ce && ce.getElement().hide();
        break;

      default:
        throw new Error("wrong controld mode: " + e);
    }

    xe.currentControlsMode = e;
  }

  function H(e, t, i) {
    var n = me.getSelectedItem();
    pe.setItem(n, !1, i);
    var r = n.index;
    ye && ye.setActive(r), Te && 0 == xe.isTextPanelSaparateHover && v(), L("image" == n.type ? "image" : "video");
  }

  function N(e, t) {
    me.selectItem(t);
  }

  function k(e) {
    return _e && 0 == _e.isTapEventOccured(e) ? !0 : void fe.trigger(pe.events.CLICK, e);
  }

  function R() {
    var e = pe.getCurrentSlide(),
        t = e.hasClass("ug-slide-clickable"),
        i = pe.getCurrentItem();
    return t ? (0 == Se.slider_links_newpage ? location.href = i.link : window.open(i.link, "_blank"), !0) : void (0 == Se.slider_controls_always_on && 1 == Se.slider_controls_appear_ontap && 1 == pe.isCurrentSlideType("image") && (z(), Te && 1 == Se.slider_textpanel_always_on && pe.isCurrentSlideType("image") && pe.isCurrentSlideImageFit() && v()));
  }

  function G(e) {
    Te && pe.isCurrentSlideType("image") && 0 == pe.isCurrentSlideImageFit() && m();
  }

  function D() {
    O();
  }

  function Q() {
    M();
  }

  function W(e) {
    var t = e.parent();
    pe.startSlideAction(t);
  }

  function B() {
    me.isPlayMode() && me.pausePlaying(), fe.trigger(pe.events.ACTION_START);
  }

  function F() {
    me.isPlayMode() && me.continuePlaying(), fe.trigger(pe.events.ACTION_END);
  }

  function Y(e, t, i) {
    ae.data("index") == t && (objItem = me.getItem(t), p(ae, objItem, !0)), se.data("index") == t && (objItem = me.getItem(t), p(se, objItem, !0)), le.data("index") == t && (objItem = me.getItem(t), p(le, objItem, !0));
  }

  function U(e, t) {
    t = jQuery(t);
    var i = pe.getSlideImage(t),
        n = $(t),
        r = we.getElementSize(i);
    we.placeElement(n, "center", "middle", r.left, r.top, i);
  }

  function V(e) {
    var t = $(e);
    we.addClassOnHover(t), we.setButtonOnClick(t, W);
  }

  function X() {
    te.on(me.events.ITEM_IMAGE_UPDATED, Y), te.on(me.events.ITEM_CHANGE, H), ye && jQuery(ye).on(ye.events.BULLET_CLICK, N), 1 == Se.slider_enable_arrows && (we.addClassOnHover(de, "ug-arrow-hover"), we.addClassOnHover(ue, "ug-arrow-hover"), me.setNextButton(de), me.setPrevButton(ue)), 0 == Se.slider_controls_always_on && re.hover(D, Q), re.on("touchend click", k), fe.on(pe.events.CLICK, R), Te && 1 == xe.isTextPanelSaparateHover && re.hover(v, m), ve && (we.addClassOnHover(ve, "ug-button-hover"), me.setPlayButton(ve)), be && (we.addClassOnHover(be, "ug-button-hover"), me.setFullScreenToggleButton(be)), ge && fe.on(pe.events.ZOOM_CHANGE, G), ce && ce.initEvents(), Ie.initEvents(), jQuery(Ie).on(Ie.events.SHOW, B), jQuery(Ie).on(Ie.events.HIDE, F), V(ae), V(se), V(le), fe.on(pe.events.AFTER_PUT_IMAGE, U), re.on("mouseenter", ".ug-item-wrapper img", function (e) {
      fe.trigger(pe.events.IMAGE_MOUSEENTER);
    }), re.on("mouseleave", ".ug-item-wrapper img", function (e) {
      var t = pe.isMouseInsideSlideImage(e);
      0 == t && fe.trigger(pe.events.IMAGE_MOUSELEAVE);
    });
  }

  function Z() {
    var e;

    switch (Se.slider_loader_type) {
      default:
      case 1:
        e = "ug-loader1";
        break;

      case 2:
        e = "ug-loader2";
        break;

      case 3:
        e = "ug-loader3";
        break;

      case 4:
        e = "ug-loader4";
        break;

      case 5:
        e = "ug-loader5";
        break;

      case 6:
        e = "ug-loader6";
        break;

      case 7:
        e = "ug-loader7";
        break;

      case 8:
        e = "ug-loader8";
        break;

      case 9:
        e = "ug-loader9";
    }

    return "black" == Se.slider_loader_color && (e += " ug-loader-black"), e;
  }

  function q(e) {
    switch (e) {
      case 1:
        return ae;

      case 2:
        return se;

      case 3:
        return le;

      default:
        throw new Error("wrong num: " + e);
    }
  }

  function K(e) {
    var t = pe.getSlidesReference(),
        i = t.objCurrentSlide.data("index"),
        n = e.index,
        r = "left";
    return i > n && (r = "right"), r;
  }

  function J(e) {
    if (!e) var e = pe.getCurrentSlide();
    var t = e.children(".ug-slider-preloader");
    return t;
  }

  function $(e) {
    var t = e.children(".ug-button-videoplay");
    return t;
  }

  function ee(e) {
    if (!e) var e = pe.getCurrentSlide();
    var t = e.data("index");
    if (void 0 == t) return null;
    var i = me.getItem(t);
    return i;
  }

  var te,
      ie,
      ne,
      re,
      oe,
      ae,
      se,
      le,
      ue,
      de,
      _e,
      ge,
      ce,
      he,
      pe = this,
      fe = jQuery(pe),
      me = new UniteGalleryMain(),
      ve = null,
      be = null,
      ye = null,
      Ie = new UGVideoPlayer(),
      we = new UGFunctions(),
      Ee = null,
      Te = null;

  this.events = {
    ITEM_CHANGED: "item_changed",
    BEFORE_SWITCH_SLIDES: "before_switch",
    BEFORE_RETURN: "before_return",
    AFTER_RETURN: "after_return",
    ZOOM_START: "slider_zoom_start",
    ZOOM_END: "slider_zoom_end",
    ZOOMING: "slider_zooming",
    ZOOM_CHANGE: "slider_zoom_change",
    START_DRAG: "start_drag",
    AFTER_DRAG_CHANGE: "after_drag_change",
    ACTION_START: "action_start",
    ACTION_END: "action_end",
    CLICK: "slider_click",
    TRANSITION_START: "slider_transition_start",
    TRANSITION_END: "slider_transition_end",
    AFTER_PUT_IMAGE: "after_put_image",
    IMAGE_MOUSEENTER: "slider_image_mouseenter",
    IMAGE_MOUSELEAVE: "slider_image_mouseleave",
    CURRENTSLIDE_LOAD_START: "slider_current_loadstart",
    CURRENTSLIDE_LOAD_END: "slider_current_loadend"
  };
  var Se = {
    slider_scale_mode: "fill",
    slider_scale_mode_media: "fill",
    slider_scale_mode_fullscreen: "down",
    slider_item_padding_top: 0,
    slider_item_padding_bottom: 0,
    slider_item_padding_left: 0,
    slider_item_padding_right: 0,
    slider_background_color: "",
    slider_background_opacity: 1,
    slider_image_padding_top: 0,
    slider_image_padding_bottom: 0,
    slider_image_padding_left: 0,
    slider_image_padding_right: 0,
    slider_image_border: !1,
    slider_image_border_width: 10,
    slider_image_border_color: "#ffffff",
    slider_image_border_radius: 0,
    slider_image_border_maxratio: .35,
    slider_image_shadow: !1,
    slider_video_constantsize: !1,
    slider_video_constantsize_scalemode: "fit",
    slider_video_constantsize_width: 854,
    slider_video_constantsize_height: 480,
    slider_video_padding_top: 0,
    slider_video_padding_bottom: 0,
    slider_video_padding_left: 0,
    slider_video_padding_right: 0,
    slider_video_enable_closebutton: !0,
    slider_transition: "slide",
    slider_transition_speed: 300,
    slider_transition_easing: "easeInOutQuad",
    slider_control_swipe: !0,
    slider_control_zoom: !0,
    slider_zoom_mousewheel: !0,
    slider_vertical_scroll_ondrag: !1,
    slider_loader_type: 1,
    slider_loader_color: "white",
    slider_enable_links: !0,
    slider_links_newpage: !1,
    slider_enable_bullets: !1,
    slider_bullets_skin: "",
    slider_bullets_space_between: -1,
    slider_bullets_align_hor: "center",
    slider_bullets_align_vert: "bottom",
    slider_bullets_offset_hor: 0,
    slider_bullets_offset_vert: 10,
    slider_enable_arrows: !0,
    slider_arrows_skin: "",
    slider_arrow_left_align_hor: "left",
    slider_arrow_left_align_vert: "middle",
    slider_arrow_left_offset_hor: 20,
    slider_arrow_left_offset_vert: 0,
    slider_arrow_right_align_hor: "right",
    slider_arrow_right_align_vert: "middle",
    slider_arrow_right_offset_hor: 20,
    slider_arrow_right_offset_vert: 0,
    slider_enable_progress_indicator: !0,
    slider_progress_indicator_type: "pie",
    slider_progress_indicator_align_hor: "right",
    slider_progress_indicator_align_vert: "top",
    slider_progress_indicator_offset_hor: 10,
    slider_progress_indicator_offset_vert: 10,
    slider_enable_play_button: !0,
    slider_play_button_skin: "",
    slider_play_button_align_hor: "left",
    slider_play_button_align_vert: "top",
    slider_play_button_offset_hor: 40,
    slider_play_button_offset_vert: 8,
    slider_play_button_mobilehide: !1,
    slider_enable_fullscreen_button: !0,
    slider_fullscreen_button_skin: "",
    slider_fullscreen_button_align_hor: "left",
    slider_fullscreen_button_align_vert: "top",
    slider_fullscreen_button_offset_hor: 11,
    slider_fullscreen_button_offset_vert: 9,
    slider_fullscreen_button_mobilehide: !1,
    slider_enable_zoom_panel: !0,
    slider_zoompanel_skin: "",
    slider_zoompanel_align_hor: "left",
    slider_zoompanel_align_vert: "top",
    slider_zoompanel_offset_hor: 12,
    slider_zoompanel_offset_vert: 92,
    slider_zoompanel_mobilehide: !1,
    slider_controls_always_on: !1,
    slider_controls_appear_ontap: !0,
    slider_controls_appear_duration: 300,
    slider_enable_text_panel: !0,
    slider_textpanel_always_on: !0,
    slider_videoplay_button_type: "square"
  },
      Pe = {
    slider_progress_indicator_align_hor: "left",
    slider_progress_indicator_align_vert: "bottom",
    slider_progress_indicator_offset_hor: 0,
    slider_progress_indicator_offset_vert: 0
  },
      xe = {
    isRunOnce: !1,
    isTextPanelSaparateHover: !1,
    numPrev: 1,
    numCurrent: 2,
    numNext: 3,
    isControlsVisible: !0,
    currentControlsMode: "image"
  };
  this.switchSlideNums = function (e) {
    switch (fe.trigger(pe.events.BEFORE_SWITCH_SLIDES), e) {
      case "left":
        var t = xe.numCurrent;
        xe.numCurrent = xe.numNext, xe.numNext = xe.numPrev, xe.numPrev = t;
        break;

      case "right":
        var t = xe.numCurrent;
        xe.numCurrent = xe.numPrev, xe.numPrev = xe.numNext, xe.numNext = t;
        break;

      default:
        throw new Error("wrong direction: " + e);
    }

    fe.trigger(pe.events.ITEM_CHANGED);
  }, this.destroy = function () {
    fe.off(pe.events.AFTER_PUT_IMAGE), te.off(me.events.ITEM_IMAGE_UPDATED), te.off(me.events.ITEM_CHANGE), ye && jQuery(ye).on(ye.events.BULLET_CLICK), re.off("mouseenter"), re.off("mouseleave"), re.off("touchend"), re.off("click"), fe.off(pe.events.CLICK), ge && fe.off(pe.events.ZOOM_CHANGE), fe.off(pe.events.BEFORE_SWITCH_SLIDES), jQuery(Ie).off(Ie.events.SHOW), jQuery(Ie).off(Ie.events.HIDE), Ie.destroy(), re.off("mouseenter", ".ug-item-wrapper img"), re.off("mouseleave", ".ug-item-wrapper img");
  }, this.________EXTERNAL_GENERAL___________ = function () {}, this.init = function (t, i, n) {
    e(t, i, n);
  }, this.getSlideImage = function (e) {
    if (!e) var e = pe.getCurrentSlide();
    var t = e.find(".ug-item-wrapper img");
    return t;
  }, this.setHtml = function (e) {
    r(e);
  }, this.run = function () {
    t();
  }, this.isInnerInPlace = function () {
    var e = pe.getSlidesReference(),
        t = we.getElementSize(e.objCurrentSlide),
        i = -t.left,
        n = we.getElementSize(oe);
    return i == n.left ? !0 : !1;
  }, this.isAnimating = function () {
    var e = oe.is(":animated");
    return e;
  }, this.isSlideCurrent = function (e) {
    var t = e.data("slidenum");
    return xe.numCurrent == t ? !0 : !1;
  }, this.isSlideHasItem = function (e) {
    var t = e.data("index");
    return void 0 === t || null === t ? !1 : !0;
  }, this.getObjImagePadding = function () {
    var e = {
      padding_top: Se.slider_image_padding_top,
      padding_bottom: Se.slider_image_padding_bottom,
      padding_left: Se.slider_image_padding_left,
      padding_right: Se.slider_image_padding_right
    };
    return e;
  }, this.getSlidesReference = function () {
    var e = {
      objPrevSlide: q(xe.numPrev),
      objNextSlide: q(xe.numNext),
      objCurrentSlide: q(xe.numCurrent)
    };
    return e;
  }, this.getCurrentSlide = function () {
    var e = pe.getSlidesReference();
    return e.objCurrentSlide;
  }, this.getCurrentItemIndex = function () {
    var e = pe.getSlidesReference(),
        t = e.objCurrentSlide.data("index");
    return (null === t || void 0 === t) && (t = -1), t;
  }, this.getCurrentItem = function () {
    var e = pe.getCurrentItemIndex();
    if (-1 == e) return null;
    var t = me.getItem(e);
    return t;
  }, this.getSlideType = function (e) {
    void 0 == e && (e = pe.getCurrentSlide());
    var t = e.data("type");
    return t;
  }, this.isMouseInsideSlideImage = function (e) {
    var t = pe.getSlideImage(),
        i = we.getMousePosition(e);
    void 0 === i.pageX && (i = _e.getLastMousePos());
    var n = we.getMouseElementPoint(i, t),
        r = we.getElementSize(t);
    return isMouseInside = we.isPointInsideElement(n, r), isMouseInside;
  }, this.isCurrentSlideType = function (e) {
    var t = pe.getSlideType();
    return t == e ? !0 : !1;
  }, this.isCurrentSlideLoadingImage = function () {
    var e = pe.getCurrentSlide(),
        t = e.data("isLoading");
    return t === !0 ? !0 : !1;
  }, this.setItem = function (e, t, i) {
    var n = pe.getSlidesReference(),
        r = n.objCurrentSlide.data("index"),
        o = e.index;
    if (o == r) return !0;
    var a = void 0 == r;
    if (a) f(n.objCurrentSlide, e), pe.placeNabourItems();else {
      var s = "left";
      me.getNumItems();
      "next" == i ? s = "left" : "prev" == i || r > o ? s = "right" : r > o && (s = "right"), E(s, e, t);
    }
  }, this.placeNabourItems = function () {
    var e = pe.getSlidesReference(),
        t = e.objCurrentSlide.data("index"),
        i = me.getPrevItem(t),
        n = me.getNextItem(t);
    f(e.objNextSlide, n), f(e.objPrevSlide, i), l();
  }, this.________EXTERNAL_API___________ = function () {}, this.stopSlideAction = function (e, t) {
    e || (e = pe.getCurrentSlide()), t === !0 ? Ie.pause() : Ie.hide();
  }, this.startSlideAction = function (e) {
    e || (e = pe.getCurrentSlide());
    var t = ee(e);
    if ("image" == t.type) return !0;

    switch (1 == Se.slider_video_constantsize && w(), I(), Ie.show(), t.type) {
      case "youtube":
        Ie.playYoutube(t.videoid);
        break;

      case "vimeo":
        Ie.playVimeo(t.videoid);
        break;

      case "html5video":
        Ie.playHtml5Video(t.videoogv, t.videowebm, t.videomp4, t.urlImage);
        break;

      case "soundcloud":
        Ie.playSoundCloud(t.trackid);
        break;

      case "wistia":
        Ie.playWistia(t.videoid);
    }
  }, this.getScaleMode = function (e) {
    if (!e) var e = pe.getCurrentSlide();
    var t = pe.getSlideType(e);
    return "image" != t ? Se.slider_scale_mode_media : Se.slider_scale_mode == Se.slider_scale_mode_fullscreen ? Se.slider_scale_mode : 1 == me.isFullScreen() ? Se.slider_scale_mode_fullscreen : Se.slider_scale_mode;
  }, this.getObjects = function () {
    var e = {
      g_objSlider: re,
      g_objInner: oe,
      g_options: Se,
      g_objZoomSlider: ge
    };
    return e;
  }, this.getObjZoom = function () {
    return ge;
  }, this.getOptions = function () {
    return Se;
  }, this.getElement = function () {
    return re;
  }, this.getVideoObject = function () {
    return Ie;
  }, this.isCurrentSlideImageFit = function () {
    var e = pe.getCurrentSlide();
    pe.getSlideType(e);
    y("image", e);
    var t = pe.getSlideImage(e);
    if (0 == t.length) return !1;
    var i = we.isImageFitParent(t);
    return i;
  }, this.isCurrentImageInPlace = function () {
    var e = pe.getSlideImage();
    if (0 == e.length) return !1;
    var t = pe.getScaleMode(),
        i = pe.getObjImagePadding(),
        n = ee(),
        r = e.parent(),
        o = we.getImageInsideParentData(r, n.imageWidth, n.imageHeight, t, i),
        a = we.getElementSize(e),
        s = !1;
    return o.imageWidth == a.width && (s = !0), s;
  }, this.isSlideActionActive = function () {
    return Ie.isVisible();
  }, this.isSwiping = function () {
    if (!_e) return !1;

    var e = _e.isTouchActive();

    return e;
  }, this.isPreloading = function () {
    var e = J();
    return e.is(":visible") ? !0 : !1;
  }, this.setOptions = function (e) {
    he && (e = we.convertCustomPrefixOptions(e, he, "slider")), Se = jQuery.extend(Se, e);
  }, this.setSize = function (e, t) {
    if (0 > e || 0 > t) return !0;
    var i = {};
    i.width = e + "px", i.height = t + "px", re.css(i);
    var n = {};
    n.height = t + "px", n.top = "0px", n.left = "0px", oe.css(n);
    var r = {};
    r.height = t + "px", r.width = e + "px", ae.css(r), se.css(r), le.css(r);
    var o = e - Se.slider_item_padding_left - Se.slider_item_padding_right,
        s = t - Se.slider_item_padding_top - Se.slider_item_padding_bottom,
        d = {};
    d.width = o + "px", d.height = s + "px", d.top = Se.slider_item_padding_top + "px", d.left = Se.slider_item_padding_left + "px", re.find(".ug-item-wrapper").css(d), Te && Te.setSizeByParent(), a(), u(ae), u(se), u(le), l();

    var _ = pe.getSlideType();

    if ("image" != _ && 1 == Se.slider_video_constantsize) w();else {
      var g = e - Se.slider_video_padding_left - Se.slider_video_padding_right,
          c = t - Se.slider_video_padding_top - Se.slider_video_padding_bottom;
      Ie.setSize(g, c);
    }
    I();
  }, this.refreshSlideItems = function () {
    return 1 == pe.isAnimating() ? !0 : (u(ae), u(se), u(le), void l());
  }, this.isMouseOver = function () {
    return re.ismouseover();
  }, this.setPosition = function (e, t) {
    we.placeElement(re, e, t);
  }, this.zoomIn = function () {
    return ge ? void ge.zoomIn() : !0;
  }, this.zoomOut = function () {
    return ge ? void ge.zoomOut() : !0;
  }, this.zoomBack = function () {
    return ge ? void ge.zoomBack() : !0;
  };
}

function UGTextPanel() {
  function e(e, t) {
    if (!t) var t = v.textpanel_padding_top;
    var i = t;

    if (d) {
      var n = i;
      f.placeElement(d, 0, n);
      var o = d.is(":visible");

      if (1 == o) {
        var a = f.getElementSize(d),
            i = a.bottom;
        i > 0 && (b.lastTitleBottom = i);
      } else {
        var i = 20;
        b.lastTitleBottom > 0 && (i = b.lastTitleBottom);
      }
    }

    var s = "";

    if (_ && (s = jQuery.trim(_.text())), "" != s) {
      var l = i;
      d && (l += v.textpanel_padding_title_description), f.placeElement(_, 0, l);
      var u = jQuery(_).is(":visible");

      if (1 == u) {
        var g = f.getElementSize(_);
        i = g.bottom, g.height > 0 && (b.lastDescHeight = g.height);
      } else {
        var c = 16;
        b.lastDescHeight > 0 && (c = b.lastDescHeight), i = l + c;
      }
    }

    if (!v.textpanel_height && 1 == b.setInternalHeight) {
      var h = i + v.textpanel_padding_bottom;
      r(h, e);
    }
  }

  function t() {
    var e = 0;

    if (d && (e += d.outerHeight()), _) {
      var t = "";
      _ && (t = jQuery.trim(_.text())), "" != t && (d && (e += v.textpanel_padding_title_description), e += _.outerHeight());
    }

    return e;
  }

  function i() {
    var i = t(),
        n = (c.height() - i) / 2;
    e(!1, n);
  }

  function n() {
    var i = t(),
        n = c.height() - i - v.textpanel_padding_bottom;
    e(!1, n);
  }

  function r(e, t) {
    if (!t) var t = !1;

    if (1 == t) {
      if (g) {
        var i = g.height();
        e > i && g.height(e);
      }

      var n = {
        height: e + "px"
      };
      l.add(c).animate(n, v.textpanel_fade_duration);
    } else g && g.height(e), l.add(c).height(e);
  }

  function o() {
    if (1 == v.textpanel_enable_bg) {
      g = l.children(".ug-textpanel-bg"), g.fadeTo(0, v.textpanel_bg_opacity);
      var e = {
        "background-color": v.textpanel_bg_color
      };
      e = jQuery.extend(e, v.textpanel_bg_css), g.css(e);
    }

    if (1 == v.textpanel_enable_title) {
      d = c.children(".ug-textpanel-title");
      var t = {};
      null !== v.textpanel_title_color && (t.color = v.textpanel_title_color), null !== v.textpanel_title_font_family && (t["font-family"] = v.textpanel_title_font_family), null !== v.textpanel_title_text_align && (t["text-align"] = v.textpanel_title_text_align), null !== v.textpanel_title_font_size && (t["font-size"] = v.textpanel_title_font_size + "px"), null !== v.textpanel_title_bold && (v.textpanel_title_bold === !0 ? t["font-weight"] = "bold" : t["font-weight"] = "normal"), v.textpanel_css_title && (t = jQuery.extend(t, v.textpanel_css_title)), d.css(t);
    }

    if (1 == v.textpanel_enable_description) {
      _ = c.children(".ug-textpanel-description");
      var i = {};
      null !== v.textpanel_desc_color && (i.color = v.textpanel_desc_color), null !== v.textpanel_desc_font_family && (i["font-family"] = v.textpanel_desc_font_family), null !== v.textpanel_desc_text_align && (i["text-align"] = v.textpanel_desc_text_align), null !== v.textpanel_desc_font_size && (i["font-size"] = v.textpanel_desc_font_size + "px"), null !== v.textpanel_desc_bold && (v.textpanel_desc_bold === !0 ? i["font-weight"] = "bold" : i["font-weight"] = "normal"), v.textpanel_css_title && (i = jQuery.extend(i, v.textpanel_css_description)), _.css(i);
    }
  }

  function a() {
    var e = h.getSelectedItem();
    p.setText(e.title, e.description);
  }

  function s() {
    jQuery(h).on(h.events.ITEM_CHANGE, a);
  }

  var l,
      u,
      d,
      _,
      g,
      c,
      h,
      p = this,
      f = new UGFunctions(),
      m = "",
      v = {
    textpanel_align: "bottom",
    textpanel_margin: 0,
    textpanel_text_valign: "middle",
    textpanel_padding_top: 10,
    textpanel_padding_bottom: 10,
    textpanel_height: null,
    textpanel_padding_title_description: 5,
    textpanel_padding_right: 11,
    textpanel_padding_left: 11,
    textpanel_fade_duration: 200,
    textpanel_enable_title: !0,
    textpanel_enable_description: !0,
    textpanel_enable_bg: !0,
    textpanel_bg_color: "#000000",
    textpanel_bg_opacity: .4,
    textpanel_title_color: null,
    textpanel_title_font_family: null,
    textpanel_title_text_align: null,
    textpanel_title_font_size: null,
    textpanel_title_bold: null,
    textpanel_css_title: {},
    textpanel_desc_color: null,
    textpanel_desc_font_family: null,
    textpanel_desc_text_align: null,
    textpanel_desc_font_size: null,
    textpanel_desc_bold: null,
    textpanel_css_description: {},
    textpanel_desc_style_as_title: !1,
    textpanel_bg_css: {}
  },
      b = {
    isFirstTime: !0,
    setInternalHeight: !0,
    lastTitleBottom: 0,
    lastDescHeight: 0
  };

  this.positionElements = function (t) {
    if (!v.textpanel_height || "top" == v.textpanel_text_valign) return e(t), !1;

    switch (v.textpanel_text_valign) {
      default:
      case "top":
        e(!1);
        break;

      case "bottom":
        n();
        break;

      case "center":
      case "middle":
        i();
    }
  }, this.init = function (e, t, i) {
    if (h = e, i && (m = i, t = f.convertCustomPrefixOptions(t, m, "textpanel")), t && (v = jQuery.extend(v, t)), 0 == v.textpanel_enable_title && 0 == v.textpanel_enable_description) throw new Error("Textpanel Error: The title or description must be enabled");
    v.textpanel_height && v.textpanel_height < 0 && (v.textpanel_height = null), 1 == v.textpanel_desc_style_as_title && (v.textpanel_desc_color || (v.textpanel_desc_color = v.textpanel_title_color), v.textpanel_desc_bold || (v.textpanel_desc_bold = v.textpanel_title_bold), v.textpanel_desc_font_family || (v.textpanel_desc_font_family = v.textpanel_title_font_family), v.textpanel_desc_font_size || (v.textpanel_desc_font_size = v.textpanel_title_font_size), v.textpanel_desc_text_align || (v.textpanel_desc_text_align = v.textpanel_title_text_align));
  }, this.appendHTML = function (e, t) {
    u = e, t = t ? " " + t : "";
    var i = "<div class='ug-textpanel" + t + "'>";
    1 == v.textpanel_enable_bg && (i += "<div class='ug-textpanel-bg" + t + "'></div>"), i += "<div class='ug-textpanel-textwrapper" + t + "'>", 1 == v.textpanel_enable_title && (i += "<div class='ug-textpanel-title" + t + "'></div>"), 1 == v.textpanel_enable_description && (i += "<div class='ug-textpanel-description" + t + "'></div>"), i += "</div></div>", e.append(i), l = e.children(".ug-textpanel"), c = l.children(".ug-textpanel-textwrapper"), o();
  }, this.destroy = function () {
    jQuery(h).off(h.events.ITEM_CHANGE);
  }, this.run = function () {
    p.setSizeByParent(), s();
  }, this.setPanelSize = function (e, t) {
    if (b.setInternalHeight = !0, t) b.setInternalHeight = !1;else var t = 80;
    v.textpanel_height && (t = v.textpanel_height), l.width(e), l.height(t), g && (g.width(e), g.height(t));
    var i = e - v.textpanel_padding_left - v.textpanel_padding_right,
        n = v.textpanel_padding_left;
    f.setElementSizeAndPosition(c, n, 0, i, t), d && d.width(i), _ && _.width(i), 0 == b.isFirstTime && p.positionElements(!1);
  }, this.setSizeByParent = function () {
    var e = f.getElementSize(u);
    p.setPanelSize(e.width);
  }, this.setTextPlain = function (e, t) {
    d && d.html(e), _ && _.html(t);
  }, this.setText = function (e, t) {
    1 == b.isFirstTime ? (p.setTextPlain(e, t), b.isFirstTime = !1, p.positionElements(!1)) : c.stop().fadeTo(v.textpanel_fade_duration, 0, function () {
      p.setTextPlain(e, t), p.positionElements(!0), jQuery(this).fadeTo(v.textpanel_fade_duration, 1);
    });
  }, this.positionPanel = function (e, t) {
    var i = {};
    if (void 0 !== e && null !== e) i.top = e, i.bottom = "auto";else switch (v.textpanel_align) {
      case "top":
        i.top = v.textpanel_margin + "px";
        break;

      case "bottom":
        i.top = "auto", i.bottom = v.textpanel_margin + "px";
        break;

      case "middle":
        i.top = f.getElementRelativePos(l, "middle", v.textpanel_margin);
    }
    void 0 !== t && null !== t && (i.left = t), l.css(i);
  }, this.setOptions = function (e) {
    m && (e = f.convertCustomPrefixOptions(e, m, "textpanel")), v = jQuery.extend(v, e);
  }, this.getElement = function () {
    return l;
  }, this.getSize = function () {
    var e = f.getElementSize(l);
    return e;
  }, this.refresh = function (e, t, i, n) {
    o(), i ? p.setPanelSize(i, n) : p.setSizeByParent(), p.positionElements(!1), t !== !0 && p.positionPanel(), e === !0 && p.show();
  }, this.hide = function () {
    l.hide();
  }, this.show = function () {
    l.show();
  }, this.getOptions = function () {
    return v;
  }, this.getOption = function (e) {
    return 0 == v.hasOwnProperty(e) ? null : v[e];
  };
}

function UGZoomButtonsPanel() {
  function e(e) {
    return e ? e.hasClass("ug-zoompanel-button-disabled") ? !0 : !1 : !0;
  }

  function t(e) {
    e && e.addClass("ug-zoompanel-button-disabled");
  }

  function i(e) {
    e && e.removeClass("ug-zoompanel-button-disabled");
  }

  function n() {
    if (0 == d.isCurrentSlideType("image")) return !0;
    var n = d.isCurrentSlideImageFit();
    1 == n ? 0 == e(s) && (t(s), t(l)) : 1 == e(s) && (i(s), i(l));
  }

  var r,
      o,
      a,
      s,
      l,
      u = this,
      d = new UGSlider(),
      _ = new UGFunctions(),
      g = {
    slider_zoompanel_skin: ""
  };

  this.init = function (e, t) {
    d = e, t && (g = jQuery.extend(g, t));
  }, this.appendHTML = function (e) {
    o = e;
    var t = "<div class='ug-slider-control ug-zoompanel ug-skin-" + g.slider_zoompanel_skin + "'>";
    t += "<div class='ug-zoompanel-button ug-zoompanel-plus'></div>", t += "<div class='ug-zoompanel-button ug-zoompanel-minus ug-zoompanel-button-disabled'></div>", t += "<div class='ug-zoompanel-button ug-zoompanel-return ug-zoompanel-button-disabled'></div>", t += "</div>", e.append(t), r = e.children(".ug-zoompanel"), a = r.children(".ug-zoompanel-plus"), s = r.children(".ug-zoompanel-minus"), l = r.children(".ug-zoompanel-return");
  }, this.setObjects = function (e, t, i) {
    a = e, s = t, l = i, s && s.addClass("ug-zoompanel-button-disabled"), l && l.addClass("ug-zoompanel-button-disabled");
  }, this.getElement = function () {
    return r;
  }, u.initEvents = function () {
    _.addClassOnHover(a, "ug-button-hover"), _.addClassOnHover(s, "ug-button-hover"), _.addClassOnHover(l, "ug-button-hover"), _.setButtonOnClick(a, function () {
      return 1 == e(a) ? !0 : void d.zoomIn();
    }), _.setButtonOnClick(s, function () {
      return 1 == e(s) ? !0 : void d.zoomOut();
    }), _.setButtonOnClick(l, function () {
      return 1 == e(l) ? !0 : void d.zoomBack();
    }), jQuery(d).on(d.events.ZOOM_CHANGE, n), jQuery(d).on(d.events.ITEM_CHANGED, n);
  };
}

function UGBullets() {
  function e() {
    var e = "",
        t = "";
    -1 != h.bullets_space_between && (t = " style='margin-left:" + h.bullets_space_between + "px'");

    for (var i = 0; u > i; i++) {
      e += 0 == i ? "<div class='ug-bullet'></div>" : "<div class='ug-bullet'" + t + "></div>";
    }

    if (o.html(e), !s) {
      var n = o.find(".ug-bullet:first-child");
      n.length && (s = n.width());
    }
  }

  function t(e) {
    if (1 == l.isActive(e)) return !0;
    var t = e.index();
    jQuery(l).trigger(l.events.BULLET_CLICK, t);
  }

  function i() {
    var e = o.children(".ug-bullet");
    g.setButtonOnClick(e, t), e.on("mousedown mouseup", function (e) {
      return !1;
    });
  }

  function n(e) {
    if (0 > e || e >= u) throw new Error("wrong bullet index: " + e);
  }

  function r() {
    if (1 == c.isInited) return !0;
    throw new Error("The bullets are not inited!");
  }

  var o,
      a,
      s,
      l = this,
      u = 0,
      d = new UniteGalleryMain(),
      _ = -1,
      g = new UGFunctions(),
      c = {
    isInited: !1
  },
      h = {
    bullets_skin: "",
    bullets_addclass: "",
    bullets_space_between: -1
  };

  this.events = {
    BULLET_CLICK: "bullet_click"
  }, this.init = function (e, t, i) {
    d = e, u = i ? i : d.getNumItems(), c.isInited = !0, h = jQuery.extend(h, t), "" == h.bullets_skin && (h.bullets_skin = h.gallery_skin);
  }, this.getBulletsWidth = function () {
    if (0 == u) return 0;
    if (!s) return 0;
    var e = u * s + (u - 1) * h.bullets_space_between;
    return e;
  }, this.appendHTML = function (t) {
    a = t, r();
    var n = "";
    "" != h.bullets_addclass && (n = " " + h.bullets_addclass);
    var s = "<div class='ug-slider-control ug-bullets ug-skin-" + h.bullets_skin + n + "'>";
    s += "</div>", o = jQuery(s), t.append(o), e(), i();
  }, this.updateNumBullets = function (t) {
    u = t, e(), i();
  }, this.getElement = function () {
    return o;
  }, this.setActive = function (e) {
    r(), n(e);
    var t = o.children(".ug-bullet");
    t.removeClass("ug-bullet-active");
    var i = jQuery(t[e]);
    i.addClass("ug-bullet-active"), _ = e;
  }, this.isActive = function (e) {
    if (n(e), "number" != typeof e) var t = e;else var t = o.children(".ug-bullet")[e];
    return t.hasClass("ug-bullet-active") ? !0 : !1;
  }, this.getNumBullets = function () {
    return u;
  };
}

function UGProgressBar() {
  var e,
      t,
      i = this,
      n = 0,
      r = new UGFunctions(),
      o = {
    slider_progressbar_color: "#ffffff",
    slider_progressbar_opacity: .6,
    slider_progressbar_line_width: 5
  };
  this.put = function (i, n) {
    n && (o = jQuery.extend(o, n)), i.append("<div class='ug-progress-bar'><div class='ug-progress-bar-inner'></div></div>"), e = i.children(".ug-progress-bar"), t = e.children(".ug-progress-bar-inner"), t.css("background-color", o.slider_progressbar_color), e.height(o.slider_progressbar_line_width), t.height(o.slider_progressbar_line_width), t.width("0%");
    var r = o.slider_progressbar_opacity,
        a = t[0];
    a.style.opacity = r, a.style.filter = "alpha(opacity=" + 100 * r + ")";
  }, this.putHidden = function (t, n) {
    i.put(t, n), e.hide();
  }, this.getElement = function () {
    return e;
  }, this.setSize = function (n) {
    e.width(n), t.width(n), i.draw();
  }, this.setPosition = function (t, i, n, o) {
    r.placeElement(e, t, i, n, o);
  }, this.draw = function () {
    var e = 100 * n;
    t.width(e + "%");
  }, this.setProgress = function (e) {
    n = r.normalizePercent(e), i.draw();
  }, this.getType = function () {
    return "bar";
  };
}

function UGProgressPie() {
  function e(e) {
    if (!e) var e = 0;
    var t = Math.min(a.slider_progresspie_width, a.slider_progresspie_height) / 2,
        n = i[0].getContext("2d");
    0 == r && (r = !0, n.rotate(1.5 * Math.PI), n.translate(-2 * t, 0)), n.clearRect(0, 0, a.slider_progresspie_width, a.slider_progresspie_height);
    var o = a.slider_progresspie_width / 2,
        s = a.slider_progresspie_height / 2,
        l = 0,
        u = e * Math.PI * 2;
    if (1 == a.slider_progresspie_type_fill) n.beginPath(), n.moveTo(o, s), n.arc(o, s, t, l, u), n.lineTo(o, s), n.fillStyle = a.slider_progresspie_color1, n.fill(), n.closePath();else {
      n.globalCompositeOperation = "source-over", n.beginPath(), n.moveTo(o, s), n.arc(o, s, t, l, u), n.lineTo(o, s), n.fillStyle = a.slider_progresspie_color1, n.fill(), n.closePath(), n.globalCompositeOperation = "destination-out";
      var d = t - a.slider_progresspie_stroke_width;
      n.beginPath(), n.moveTo(o, s), n.arc(o, s, d, l, u), n.lineTo(o, s), n.fillStyle = a.slider_progresspie_color1, n.fill(), n.closePath();
    }
    1 == a.slider_progresspie_type_fill && (l = u, u = 2 * Math.PI, n.beginPath(), n.arc(o, s, t, l, u), n.lineTo(o, s), n.fillStyle = a.slider_progresspie_color2, n.fill(), n.closePath());
  }

  var t,
      i,
      n = this,
      r = !1,
      o = new UGFunctions(),
      a = {
    slider_progresspie_type_fill: !1,
    slider_progresspie_color1: "#B5B5B5",
    slider_progresspie_color2: "#E5E5E5",
    slider_progresspie_stroke_width: 6,
    slider_progresspie_width: 30,
    slider_progresspie_height: 30
  };
  this.put = function (e, t) {
    t && (a = jQuery.extend(a, t)), e.append("<canvas class='ug-canvas-pie' width='" + a.slider_progresspie_width + "' height='" + a.slider_progresspie_height + "'></canvas>"), i = e.children(".ug-canvas-pie");
  }, this.putHidden = function (t, r) {
    n.put(t, r), e(.1), i.hide();
  }, this.getElement = function () {
    return i;
  }, this.setPosition = function (e, t) {
    o.placeElement(i, e, t);
  }, this.getSize = function () {
    var e = {
      width: a.slider_progresspie_width,
      height: a.slider_progresspie_height
    };
    return e;
  }, this.setProgress = function (i) {
    i = o.normalizePercent(i), t = i, e(i);
  }, this.getType = function () {
    return "pie";
  };
}

function UGTouchSliderControl() {
  function e(e) {
    if (!e) var e = m.getSlidesReference();
    var t = v.getElementSize(e.objCurrentSlide),
        i = -t.left,
        n = v.getElementSize(h),
        r = i - n.left;
    return r;
  }

  function t() {
    var t = m.getSlidesReference(),
        i = e(t),
        n = Math.round(3 * t.objCurrentSlide.width() / 8);
    if (Math.abs(i) >= n) return !0;
    var r = Math.abs(b.lastMouseX - b.startMouseX);
    Math.abs(b.lastMouseY - b.startMouseY);
    if (20 > r) return !1;
    var o = jQuery.now(),
        a = o - b.startTime;
    return 500 > a ? !0 : !1;
  }

  function i(e) {
    if (1 == m.isInnerInPlace()) return !1;
    if (p.trigger(m.events.BEFORE_RETURN), !e) var e = m.getSlidesReference();
    var t = v.getElementSize(e.objCurrentSlide),
        i = -t.left;
    h.animate({
      left: i + "px"
    }, {
      duration: f.slider_transition_return_speed,
      easing: f.slider_transition_continuedrag_easing,
      queue: !1,
      progress: function progress(e, t, n) {
        if (1 == b.isDragVideo) {
          var r = v.getElementSize(h),
              o = r.left,
              a = o - i,
              s = b.videoStartX + a;
          b.videoObject.css("left", s);
        }
      },
      complete: function complete() {
        p.trigger(m.events.AFTER_RETURN);
      }
    });
  }

  function n(e) {
    m.getVideoObject().hide(), m.switchSlideNums(e), m.placeNabourItems();
  }

  function r() {
    var t = m.getSlidesReference(),
        r = e(t);
    if (0 == r) return !1;
    var o = r > 0 ? "left" : "right",
        a = !1;

    switch (o) {
      case "right":
        if (m.isSlideHasItem(t.objPrevSlide)) var s = v.getElementSize(t.objPrevSlide),
            l = -s.left;else a = !0;
        break;

      case "left":
        if (m.isSlideHasItem(t.objNextSlide)) var u = v.getElementSize(t.objNextSlide),
            l = -u.left;else a = !0;
    }

    1 == a ? i(t) : h.stop().animate({
      left: l + "px"
    }, {
      duration: f.slider_transition_continuedrag_speed,
      easing: f.slider_transition_continuedrag_easing,
      queue: !1,
      progress: function progress() {
        if (1 == b.isDragVideo) {
          var e = v.getElementSize(h),
              t = e.left,
              i = t - b.startPosx,
              n = b.videoStartX + i;
          b.videoObject.css("left", n);
        }
      },
      always: function always() {
        n(o), p.trigger(m.events.AFTER_DRAG_CHANGE);
      }
    });
  }

  function o(e) {
    var t = b.lastMouseX - b.startMouseX;
    if (0 == t) return !0;
    var i = 0 > t ? "left" : "right",
        n = m.getObjZoom();

    if (n) {
      var r = n.isPanEnabled(e, i);
      if (1 == r) return b.isInitDataValid = !1, !0;
      if (0 == b.isInitDataValid) return a(e), !0;
    }

    var o = b.startPosx + t;
    if (t > 0 && o > 0) o /= 3;else if (0 > t) {
      var s = o + h.width(),
          l = c.width();
      l > s && (o = b.startPosx + t / 3);
    }

    if (0 == b.isDragging && (b.isDragging = !0, p.trigger(m.events.START_DRAG)), h.css("left", o + "px"), 1 == b.isDragVideo) {
      var u = o - b.startPosx,
          d = b.videoStartX + u;
      b.videoObject.css("left", d);
    }
  }

  function a(e) {
    var t = v.getMousePosition(e);
    b.startMouseX = t.pageX, b.startMouseY = t.pageY, b.lastMouseX = b.startMouseX, b.lastMouseY = b.startMouseY, b.startTime = jQuery.now();
    var i = v.getArrTouches(e);
    b.startArrTouches = v.getArrTouchPositions(i);
    var n = v.getElementSize(h);
    b.startPosx = n.left, b.isInitDataValid = !0, b.isDragVideo = !1, v.storeEventData(e, b.storedEventID);
  }

  function s(e) {
    b.touch_active = !1;
  }

  function l(e, t) {
    b.touch_active = !0, a(t);
  }

  function u(e) {
    e.preventDefault(), b.isDragging = !1, 1 == m.isAnimating() && h.stop(!0, !0);
    var t = v.getArrTouches(e);
    return t.length > 1 ? (1 == b.touch_active && s("1"), !0) : 1 == b.touch_active ? !0 : void l("1", e);
  }

  function d(e) {
    if (0 == b.touch_active) return !0;
    if (0 == e.buttons) return s("2"), r(), !0;
    v.updateStoredEventData(e, b.storedEventID), e.preventDefault();
    var t = v.getMousePosition(e);
    b.lastMouseX = t.pageX, b.lastMouseY = t.pageY;
    var i = null;
    1 == f.slider_vertical_scroll_ondrag && (i = v.handleScrollTop(b.storedEventID)), "vert" !== i && o(e);
  }

  function _(e) {
    var n = v.getArrTouches(e),
        o = n.length,
        a = m.isInnerInPlace();
    if (1 == a && 0 == b.touch_active && 0 == o) return !0;

    if (0 == o && 1 == b.touch_active) {
      s("3");
      var u = !1,
          d = v.wasVerticalScroll(b.storedEventID);
      0 == d && (u = t()), 1 == u ? r() : i();
    } else 1 == o && 0 == b.touch_active && l("2", e);
  }

  function g() {
    c.bind("mousedown touchstart", u), jQuery("body").bind("mousemove touchmove", d), jQuery(window).add("body").bind("mouseup touchend", _);
  }

  var c,
      h,
      p,
      f,
      m = new UGSlider(),
      v = new UGFunctions(),
      f = {
    slider_transition_continuedrag_speed: 250,
    slider_transition_continuedrag_easing: "linear",
    slider_transition_return_speed: 300,
    slider_transition_return_easing: "easeInOutQuad"
  },
      b = {
    touch_active: !1,
    startMouseX: 0,
    startMouseY: 0,
    lastMouseX: 0,
    lastMouseY: 0,
    startPosx: 0,
    startTime: 0,
    isInitDataValid: !1,
    slides: null,
    lastNumTouches: 0,
    isDragging: !1,
    storedEventID: "touchSlider",
    videoStartX: 0,
    isDragVideo: !1,
    videoObject: null
  };
  this.isTapEventOccured = function (t) {
    var i = v.getArrTouches(t),
        n = i.length;
    if (0 != n || 0 != b.lastNumTouches) return b.lastNumTouches = n, !1;
    b.lastNumTouches = n;
    var r = m.getSlidesReference(),
        o = (e(r), Math.abs(b.lastMouseX - b.startMouseX)),
        a = Math.abs(b.lastMouseY - b.startMouseY),
        s = jQuery.now(),
        l = s - b.startTime;
    return 20 > o && 50 > a && 500 > l ? !0 : !1;
  }, this.init = function (e, t) {
    m = e, p = jQuery(m), g_objects = e.getObjects(), c = g_objects.g_objSlider, h = g_objects.g_objInner, f = jQuery.extend(f, t), g();
  }, this.getLastMousePos = function () {
    var e = {
      pageX: b.lastMouseX,
      pageY: b.lastMouseY
    };
    return e;
  }, this.isTouchActive = function () {
    return b.touch_active;
  };
}

function UGZoomSliderControl() {
  function e(e, t) {
    E = e, w = jQuery(E), g_objects = e.getObjects(), y = g_objects.g_objSlider, I = g_objects.g_objInner, S = jQuery.extend(S, t), b();
  }

  function t() {
    var e = E.getScaleMode();
    return "down" != e && (e = "fit"), e;
  }

  function i() {
    var e = jQuery.now(),
        i = e - P.storeImageLastTime;
    if (20 > i) return !1;
    var n = E.getSlidesReference();
    if (P.objSlide = n.objCurrentSlide, P.objImage = n.objCurrentSlide.find("img"), 0 == P.objImage.length) return !1;
    P.objImageSize = T.getElementSize(P.objImage), P.objParent = P.objImage.parent(), P.objParentSize = T.getElementSize(P.objParent);
    var r = t();
    objPadding = E.getObjImagePadding(), P.objFitImageSize = T.getImageInsideParentDataByImage(P.objImage, r, objPadding);
    var e = jQuery.now();
    return P.storeImageLastTime = e, !0;
  }

  function n(e, i) {
    var n = E.getSlidesReference(),
        r = n.objCurrentSlide.find("img"),
        o = t();
    w.trigger(E.events.ZOOM_START);
    var a = !0,
        s = E.getObjImagePadding();

    if ("back" == e) {
      var l = T.getImageOriginalSize(r);
      T.scaleImageFitParent(r, l.width, l.height, o, s);
    } else {
      var u = "in" == e ? !0 : !1;
      a = T.zoomImageInsideParent(r, u, S.slider_zoom_step, i, o, S.slider_zoom_max_ratio, s);
    }

    1 == a && (w.trigger(E.events.ZOOMING), w.trigger(E.events.ZOOM_CHANGE), w.trigger(E.events.ZOOM_END));
  }

  function r(e, t, i) {
    var n = T.getArrTouches(t);

    if (i === !0) {
      if (1 != n.length) return !1;
    } else if (n.length > 1) return !1;

    return T.isElementBiggerThenParent(e) ? !0 : !1;
  }

  function o(e) {
    var t = T.getMousePosition(e);
    P.startMouseX = t.pageX, P.startMouseY = t.pageY, P.lastMouseX = P.startMouseX, P.lastMouseY = P.startMouseY, P.startImageX = P.objImageSize.left, P.startImageY = P.objImageSize.top, P.panXActive = P.objImageSize.width > P.objParentSize.width, P.panYActive = P.objImageSize.height > P.objParentSize.height;
  }

  function a(e) {
    P.isPanActive = !0, o(e);
  }

  function s(e) {
    if (void 0 == P.objImage || 0 == P.objImage.length) return !0;
    var t = T.getMousePosition(e),
        i = (t.pageX - P.startMouseX, t.pageY - P.startMouseY, t.pageX - P.lastMouseX),
        n = t.pageY - P.lastMouseY,
        r = 0 > i ? "left" : "right",
        o = 0 > n ? "up" : "down";
    P.lastMouseX = t.pageX, P.lastMouseY = t.pageY;
    var a = T.getElementSize(P.objImage);
    0 == P.panYActive ? n = 0 : "down" == o && a.top > 0 ? n /= 3 : "up" == o && a.bottom < P.objParentSize.height && (n /= 3), 0 == P.panXActive || 0 == E.isInnerInPlace() ? i = 0 : "right" == r && a.left > 0 ? i /= 3 : "left" == r && a.right < P.objParentSize.width && (i /= 3);
    var s = a.left + i,
        l = a.top + n;
    T.placeElement(P.objImage, s, l);
  }

  function l() {
    var e = !1,
        t = !1,
        i = 0,
        n = 0,
        r = T.getElementSize(P.objImage),
        o = E.getObjImagePadding(),
        a = T.getElementCenterPosition(P.objImage, o);
    P.panXActive = P.objImageSize.width > P.objParentSize.width, P.panYActive = P.objImageSize.height > P.objParentSize.height, 1 == P.panYActive ? r.top > 0 ? (n = 0, t = !0) : r.bottom < P.objParentSize.height && (n = P.objParentSize.height - r.height, t = !0) : r.top != a.top && (t = !0, n = a.top), 1 == P.panXActive ? r.left > 0 ? (i = 0, e = !0) : r.right < P.objParentSize.width && (i = P.objParentSize.width - r.width, e = !0) : r.left != a.left && (e = !0, i = a.left);
    var s = {};
    1 == t && (s.top = n + "px"), 1 == e && (s.left = i + "px"), (1 == t || 1 == e) && P.objImage.animate(s, {
      duration: S.slider_zoom_return_pan_duration,
      easing: S.slider_zoom_return_pan_easing,
      queue: !1
    });
  }

  function u() {
    return P.objImage && P.objImage.is(":animated") ? !0 : !1;
  }

  function d(e) {
    P.isZoomActive = !0, P.startDistance = T.getDistance(e[0].pageX, e[0].pageY, e[1].pageX, e[1].pageY), 0 == P.startDistance && (P.startDistance = 1), P.startMiddlePoint = T.getMiddlePoint(e[0].pageX, e[0].pageY, e[1].pageX, e[1].pageY), P.objImageSize = T.getElementSize(P.objImage), P.startImageX = P.objImageSize.left, P.startImageY = P.objImageSize.top, P.imageOrientPoint = T.getElementLocalPoint(P.startMiddlePoint, P.objImage);
    var t = T.isPointInsideElement(P.imageOrientPoint, P.objImageSize);
    0 == t && (P.imageOrientPoint = T.getElementCenterPoint(P.objImage)), w.trigger(E.events.ZOOM_START);
  }

  function _(e) {
    if (0 == P.isZoomActive) return !1;
    var t = T.getArrTouches(e);
    2 != t.length && (P.isZoomActive = !1, w.trigger(E.events.ZOOM_END));
  }

  function g(e) {
    if (1 == P.isZoomActive) return !0;
    var t = T.getArrTouches(e);
    return 2 != t.length ? !0 : void d(t);
  }

  function c(e) {
    var t = T.getArrTouches(e),
        i = T.getDistance(t[0].pageX, t[0].pageY, t[1].pageX, t[1].pageY),
        n = i / P.startDistance,
        r = T.getMiddlePoint(t[0].pageX, t[0].pageY, t[1].pageX, t[1].pageY),
        o = P.objImageSize.width * n,
        a = P.objImageSize.height * n,
        s = T.getImageOriginalSize(P.objImage),
        l = 1;
    if (s.width > 0 && (l = o / s.width), l > S.slider_zoom_max_ratio) return !0;
    panX = -(P.imageOrientPoint.x * n - P.imageOrientPoint.x), panY = -(P.imageOrientPoint.y * n - P.imageOrientPoint.y);

    var u = r.x - P.startMiddlePoint.x,
        d = r.y - P.startMiddlePoint.y,
        _ = P.startImageX + panX + u,
        g = P.startImageY + panY + d;

    T.setElementSizeAndPosition(P.objImage, _, g, o, a), w.trigger(E.events.ZOOMING), w.trigger(E.events.ZOOM_CHANGE);
  }

  function h() {
    if (void 0 == P.objImage || 0 == P.objImage.length) return !0;
    var e = T.getElementSize(P.objImage);

    if (e.width < P.objFitImageSize.imageWidth) {
      P.objImage.css({
        position: "absolute",
        margin: "none"
      });
      var t = {
        top: P.objFitImageSize.imageTop + "px",
        left: P.objFitImageSize.imageLeft + "px",
        width: P.objFitImageSize.imageWidth + "px",
        height: P.objFitImageSize.imageHeight + "px"
      };
      P.objImage.animate(t, {
        duration: S.slider_zoom_return_pan_duration,
        easing: S.slider_zoom_return_pan_easing,
        queue: !1
      });
    } else l();
  }

  function p(e) {
    if (0 == E.isCurrentSlideType("image")) return !0;
    i();
    return void 0 == P.objImage || 0 == P.objImage.length ? !0 : (e.preventDefault(), 1 == u() && P.objImage.stop(!0), 1 == P.isZoomActive ? _(e) : g(e), void (1 == P.isZoomActive ? P.isPanActive = !1 : 1 == r(P.objImage, e) && 1 == P.isZoomedOnce && a(e)));
  }

  function f(e) {
    if (0 == E.isCurrentSlideType("image")) return !0;
    var t = jQuery(e.target);
    if (1 == t.data("ug-button")) return !1;
    i();
    if (void 0 == P.objImage || 0 == P.objImage.length) return !0;
    var n = P.isPanActive,
        o = P.isZoomActive;
    if (0 == E.isInnerInPlace()) return P.isZoomActive = !1, P.isPanActive = !1, !0;
    if (1 == P.isZoomActive ? _(e) : g(e), 1 == P.isZoomActive) P.isPanActive = !1;else {
      var s = r(P.objImage, e, !0);
      1 == P.isPanActive ? P.isPanActive = !1 : 1 == s && a(e);
    }
    (n || o) && 0 == P.isZoomActive && 0 == P.isPanActive && h();
  }

  function m(e) {
    return 0 == E.isCurrentSlideType("image") ? !0 : void (1 == P.isZoomActive ? c(e) : 1 == P.isPanActive && s(e));
  }

  function v(e, t, i, r) {
    if (0 == S.slider_zoom_mousewheel) return !0;
    if (0 == E.isCurrentSlideType("image")) return !0;
    e.preventDefault();
    var o = t > 0,
        a = T.getMousePosition(e),
        s = 1 == o ? "in" : "out";
    n(s, a);
  }

  function b() {
    y.on("mousewheel", v), y.bind("mousedown touchstart", p), jQuery("body").bind("mousemove touchmove", m), jQuery(window).add("body").bind("mouseup touchend", f), w.bind(E.events.BEFORE_RETURN, function () {
      h();
    }), w.bind(E.events.ITEM_CHANGED, function () {
      P.isZoomedOnce = !1;
    }), w.bind(E.events.ZOOM_CHANGE, function () {
      P.isZoomedOnce = !0;
    });
  }

  var y,
      I,
      w,
      E = new UGSlider(),
      T = new UGFunctions(),
      S = {
    slider_zoom_step: 1.2,
    slider_zoom_max_ratio: 6,
    slider_zoom_return_pan_duration: 400,
    slider_zoom_return_pan_easing: "easeOutCubic"
  },
      P = {
    isPanActive: !1,
    startMouseX: 0,
    startMouseY: 0,
    lastMouseX: 0,
    lastMouseY: 0,
    startImageX: 0,
    startImageY: 0,
    panXActive: !1,
    panYActive: !1,
    objImage: null,
    objImageSize: null,
    objParent: null,
    objParentSize: null,
    objSlide: null,
    storeImageLastTime: 0,
    isZoomActive: !1,
    startDistance: 0,
    startMiddlePoint: null,
    imageOrientPoint: null,
    objFitImageSize: null,
    isZoomedOnce: !1
  };
  this.________EXTERNAL_____________ = function () {}, this.isPanEnabled = function (e, t) {
    if (i(), void 0 == P.objImage || 0 == P.objImage.length) return !1;
    if (0 == P.isZoomedOnce) return !1;
    if (0 == r(P.objImage, e)) return !1;
    if (0 == E.isInnerInPlace()) return !1;

    if ("left" == t) {
      if (P.objImageSize.right <= P.objParentSize.width) return !1;
    } else if (P.objImageSize.left >= 0) return !1;

    return !0;
  }, this.init = function (t, i) {
    e(t, i);
  }, this.zoomIn = function () {
    n("in");
  }, this.zoomOut = function () {
    n("out");
  }, this.zoomBack = function () {
    n("back");
  };
}

function UGWistiaAPI() {
  function e() {
    return "undefined" != typeof Wistia;
  }

  function t(e, t, n, o, a) {
    r = null, s = !1;
    var l = e + "_video",
        u = "<div id='" + l + "' class='wistia_embed' style='width:" + n + ";height:" + o + ";' data-video-width='" + n + "' data-video-height='" + o + "'>&nbsp;</div>";
    jQuery("#" + e).html(u), r = Wistia.embed(t, {
      version: "v1",
      videoWidth: n,
      videoHeight: o,
      container: l,
      autoPlay: a
    }), s = !0, i();
  }

  function i() {
    r.bind("play", function () {
      a.trigger(o.events.START_PLAYING);
    }), r.bind("pause", function () {
      a.trigger(o.events.STOP_PLAYING);
    }), r.bind("end", function () {
      a.trigger(o.events.STOP_PLAYING), a.trigger(o.events.VIDEO_ENDED);
    });
  }

  this.isAPILoaded = !1;
  var n,
      r,
      o = this,
      a = jQuery(this),
      s = !1;
  this.events = {
    START_PLAYING: "start_playing",
    STOP_PLAYING: "stop_playing",
    VIDEO_ENDED: "video_ended"
  }, this.loadAPI = function () {
    return 1 == g_ugWistiaAPI.isAPILoaded ? !0 : e() ? (g_ugWistiaAPI.isAPILoaded = !0, !0) : (g_ugFunctions.loadJs("fast.wistia.com/assets/external/E-v1.js", !0), void (g_ugWistiaAPI.isAPILoaded = !0));
  }, this.doCommand = function (e) {
    if (null == r) return !1;
    if (0 == s) return !1;

    switch (e) {
      case "play":
        r.play();
        break;

      case "pause":
        r.pause();
    }
  }, this.pause = function () {
    o.doCommand("pause");
  }, this.play = function () {
    o.doCommand("play");
  }, this.putVideo = function (i, r, o, a, s) {
    return e() ? (t(i, r, o, a, s), !0) : (this.loadAPI(), void (n = setInterval(function () {
      e() && (t(i, r, o, a, s), clearInterval(n));
    }, 500)));
  }, this.isPlayerReady = function () {
    return s && r ? !0 : !1;
  };
}

function UGSoundCloudAPI() {
  function e() {
    return "undefined" != typeof SC;
  }

  function t(e, t, n, a, s) {
    r = null, g_isPlayerReady = !1;
    var l = e + "_iframe",
        u = location.protocol + "//w.soundcloud.com/player/?url=http://api.soundcloud.com/tracks/" + t;
    u += "&amp;buying=false&amp;liking=false&amp;download=false&amp;sharing=false&amp;show_artwork=true&show_comments=false&amp;show_playcount=true&amp;show_user=false&amp;hide_related=true&amp;visual=true&amp;start_track=0&amp;callback=true", u += s === !0 ? "&amp;auto_play=true" : "&amp;auto_play=false";
    var d = "<iframe id='" + l + "' src=" + u + " width='" + n + "' height='" + a + "' frameborder='0' scrolling='no' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
    jQuery("#" + e).html(d), r = SC.Widget(l), r.bind(SC.Widget.Events.READY, function () {
      r && (g_isPlayerReady = !0, i());
    }), o = e;
  }

  function i() {
    r.bind(SC.Widget.Events.PLAY, function () {
      s.trigger(a.events.START_PLAYING);
    }), r.bind(SC.Widget.Events.PAUSE, function () {
      s.trigger(a.events.STOP_PLAYING);
    }), r.bind(SC.Widget.Events.FINISH, function () {
      s.trigger(a.events.STOP_PLAYING), s.trigger(a.events.VIDEO_ENDED);
    });
  }

  this.isAPILoaded = !1;
  var n,
      r,
      o,
      a = this,
      s = jQuery(this);
  this.events = {
    START_PLAYING: "start_playing",
    STOP_PLAYING: "stop_playing",
    VIDEO_ENDED: "video_ended"
  }, this.loadAPI = function () {
    return 1 == g_ugSoundCloudAPI.isAPILoaded ? !0 : e() ? (g_ugSoundCloudAPI.isAPILoaded = !0, !0) : (g_ugFunctions.loadJs("w.soundcloud.com/player/api.js", !0), void (g_ugSoundCloudAPI.isAPILoaded = !0));
  }, this.putSound = function (i, r, o, a, s) {
    return e() ? (t(i, r, o, a, s), !0) : (this.loadAPI(), void (n = setInterval(function () {
      e() && (t(i, r, o, a, s), clearInterval(n));
    }, 500)));
  }, this.doCommand = function (e) {
    if (null == r) return !1;
    if (0 == g_isPlayerReady) return !1;

    switch (e) {
      case "play":
        r.play();
        break;

      case "pause":
        r.pause();
    }
  }, this.pause = function () {
    a.doCommand("pause");
  }, this.play = function () {
    a.doCommand("play");
  }, this.destroy = function () {
    g_isPlayerReady = !1, r = null, o && (jQuery("#" + o).html(""), o = null);
  };
}

function UGHtml5MediaAPI() {
  function e() {
    return "undefined" != typeof mejs;
  }

  function t(e, t, n, o, a) {
    r = null, g_isPlayerReady = !1;
    var s = location.protocol + "//cdnjs.cloudflare.com/ajax/libs/mediaelement/2.18.1/flashmediaelement-cdn.swf",
        l = location.protocol + "//cdnjs.cloudflare.com/ajax/libs/mediaelement/2.18.1/silverlightmediaelement.xap",
        u = e + "_video",
        d = "";
    a && a === !0 && (d = "autoplay='autoplay'");
    var _ = "";
    t.posterImage && (_ = "poster='" + t.posterImage + "'");
    var g = "<video id='" + u + "' width='" + n + "' height='" + o + "'  controls='controls' preload='none' " + d + " " + _ + ">";
    "" != t.mp4 && (g += "<source type='video/mp4' src='" + t.mp4 + "' />"), "" != t.webm && (g += "<source type='video/webm' src='" + t.webm + "' />"), "" != t.ogv && (g += "<source type='video/ogg' src='" + t.ogv + "' />"), g += "<object width='" + n + "' height='" + o + "' type='application/x-shockwave-flash' data='" + s + "'>", g += "<param name='movie' value='" + s + "' />", g += "<param name='flashvars' value='controls=true&file=" + t.mp4 + "' />", g += "</object>", g += "</video>", jQuery("#" + e).html(g), new MediaElement(u, {
      enablePluginDebug: !1,
      flashName: s,
      silverlightName: l,
      success: function success(e, t) {
        g_isPlayerReady = !0, r = e, 0 == a && r.pause(), i();
      },
      error: function error(e) {
        trace(e);
      }
    });
  }

  function i() {
    g_ugFunctions.addEvent(r, "play", function () {
      a.trigger(o.events.START_PLAYING);
    }), g_ugFunctions.addEvent(r, "pause", function () {
      a.trigger(o.events.STOP_PLAYING);
    }), g_ugFunctions.addEvent(r, "ended", function () {
      a.trigger(o.events.STOP_PLAYING), a.trigger(o.events.VIDEO_ENDED);
    });
  }

  this.isAPILoaded = !1;
  var n,
      r,
      o = this,
      a = jQuery(this);
  this.events = {
    START_PLAYING: "start_playing",
    STOP_PLAYING: "stop_playing",
    VIDEO_ENDED: "video_ended"
  }, this.loadAPI = function () {
    return 1 == g_ugHtml5MediaAPI.isAPILoaded ? !0 : e() ? (g_ugHtml5MediaAPI.isAPILoaded = !0, !0) : (g_ugFunctions.loadJs("cdnjs.cloudflare.com/ajax/libs/mediaelement/2.18.1/mediaelement.min.js", !0), g_ugFunctions.loadCss("cdnjs.cloudflare.com/ajax/libs/mediaelement/2.18.1/mediaelementplayer.min.css", !0), void (g_ugHtml5MediaAPI.isAPILoaded = !0));
  }, this.putVideo = function (i, r, o, a, s) {
    return e() ? (t(i, r, o, a, s), !0) : (this.loadAPI(), void (n = setInterval(function () {
      e() && (t(i, r, o, a, s), clearInterval(n));
    }, 500)));
  }, this.doCommand = function (e) {
    if (null == r) return !1;
    if (0 == g_isPlayerReady) return !1;

    switch (e) {
      case "play":
        r.play();
        break;

      case "pause":
        r.pause();
    }
  }, this.pause = function () {
    o.doCommand("pause");
  }, this.play = function () {
    o.doCommand("play");
  };
}

function UGVimeoAPI() {
  function e() {
    return "undefined" != typeof Froogaloop;
  }

  function t(e, t, n, o, a) {
    s = null, l = !1;
    var u = location.protocol + "//player.vimeo.com/video/" + t + "?api=1";
    a === !0 && (u += "&amp;byline=0&amp;autoplay=1&amp;title=0&amp;portrait=0");
    var d = "<iframe src=" + u + " width='" + n + "' height='" + o + "' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
    jQuery("#" + e).html(d);
    var _ = jQuery("#" + e + " iframe")[0];
    s = Froogaloop(_), s.addEvent("ready", function () {
      s && (l = !0, i());
    }), r = e;
  }

  function i() {
    return s ? (s.addEvent("cuechange", function () {
      1 == u && o.play();
    }), s.addEvent("play", function () {
      a.trigger(o.events.START_PLAYING);
    }), s.addEvent("pause", function () {
      a.trigger(o.events.STOP_PLAYING);
    }), void s.addEvent("finish", function () {
      a.trigger(o.events.STOP_PLAYING), a.trigger(o.events.VIDEO_ENDED);
    })) : !1;
  }

  this.isAPILoaded = !1;
  var n,
      r,
      o = this,
      a = jQuery(this),
      s = null,
      l = !1,
      u = !1;
  this.events = {
    START_PLAYING: "start_playing",
    STOP_PLAYING: "stop_playing",
    VIDEO_ENDED: "video_ended"
  }, this.loadAPI = function () {
    return 1 == g_ugVimeoAPI.isAPILoaded ? !0 : e() ? (g_ugVimeoAPI.isAPILoaded = !0, !0) : (g_ugFunctions.loadJs("f.vimeocdn.com/js/froogaloop2.min.js", !0), void (g_ugVimeoAPI.isAPILoaded = !0));
  }, this.doCommand = function (e) {
    if (null == s) return !1;
    if (0 == l) return !1;

    switch (e) {
      default:
        s.api(e);
    }
  }, this.pause = function () {
    o.doCommand("pause");
  }, this.play = function () {
    o.doCommand("play");
  }, this.destroy = function () {
    s && (s.api("unload"), s = null, l = !1), r && jQuery("#" + r).html("");
  }, this.putVideo = function (i, r, o, a, s) {
    return e() ? (t(i, r, o, a, s), !0) : (this.loadAPI(), void (n = setInterval(function () {
      e() && (t(i, r, o, a, s), clearInterval(n));
    }, 500)));
  }, this.isPlayerReady = function () {
    return l && s ? !0 : !1;
  }, this.changeVideo = function (e, t) {
    return 0 == o.isPlayerReady() ? !1 : (u = t, void s.api("loadVideo", e));
  }, this.getVideoImages = function (e, t, i) {
    var n = location.protocol + "//vimeo.com/api/v2/video/" + e + ".json";
    jQuery.get(n, {}, function (e) {
      var n = {};
      n.preview = e[0].thumbnail_large, n.thumb = e[0].thumbnail_medium, i(t, n);
    });
  };
}

function UGYoutubeAPI() {
  function e(e, t, r, a, u) {
    s && l && s.destroy();
    var d = {
      controls: 2,
      showinfo: _.video_youtube_showinfo,
      rel: 0
    };
    u === !0 && (d.autoplay = 1), l = !1, s = new YT.Player(e, {
      height: a,
      width: r,
      videoId: t,
      playerVars: d,
      events: {
        onReady: i,
        onStateChange: n
      }
    }), o = e;
  }

  function t() {
    return "undefined" != typeof YT && "undefined" != typeof YT.Player ? !0 : !1;
  }

  function i() {
    l = !0;
  }

  function n() {
    if ("function" != typeof s.getPlayerState) return trace("Youtube API error: can't get player state"), !1;
    var e = s.getPlayerState();

    switch (e) {
      case YT.PlayerState.PLAYING:
        u.trigger(a.events.START_PLAYING);
        break;

      case YT.PlayerState.ENDED:
        u.trigger(a.events.STOP_PLAYING), u.trigger(a.events.VIDEO_ENDED);
        break;

      default:
        d == YT.PlayerState.PLAYING && u.trigger(a.events.STOP_PLAYING);
    }

    d = e;
  }

  this.isAPILoaded = !1;
  var r,
      o,
      a = this,
      s = null,
      l = !1,
      u = jQuery(this),
      d = -1,
      _ = {
    video_youtube_showinfo: !0
  };
  this.events = {
    START_PLAYING: "start_playing",
    STOP_PLAYING: "stop_playing",
    VIDEO_ENDED: "video_ended"
  }, this.setOptions = function (e) {
    _ = jQuery.extend(_, e);
  }, this.putVideo = function (i, n, o, a, s) {
    return t() ? (e(i, n, o, a, s), !0) : (this.loadAPI(), void (r = setInterval(function () {
      t() && (e(i, n, o, a, s), clearInterval(r));
    }, 500)));
  }, this.loadAPI = function () {
    return 1 == g_ugYoutubeAPI.isAPILoaded ? !0 : "undefined" != typeof YT ? (g_ugYoutubeAPI.isAPILoaded = !0, !0) : (g_ugFunctions.loadJs("https://www.youtube.com/player_api", !1), void (g_ugYoutubeAPI.isAPILoaded = !0));
  }, this.doCommand = function (e, t) {
    if (!s) return !0;
    if (0 == l) return !1;

    switch (e) {
      case "play":
        if ("function" != typeof s.playVideo) return !1;
        s.playVideo();
        break;

      case "pause":
        if ("function" != typeof s.pauseVideo) return !1;
        s.pauseVideo();
        break;

      case "seek":
        if ("function" != typeof s.seekTo) return !1;
        s.seekTo(t);
        break;

      case "stopToBeginning":
        var i = s.getPlayerState();

        switch (s.pauseVideo(), i) {
          case YT.PlayerState.PLAYING:
          case YT.PlayerState.ENDED:
          case YT.PlayerState.PAUSED:
            s.seekTo(0);
        }

    }
  }, this.play = function () {
    a.doCommand("play");
  }, this.pause = function () {
    a.doCommand("pause");
  }, this.destroy = function () {
    try {
      s && (l = !1, s.clearVideo(), s.destroy());
    } catch (e) {
      jQuery("#" + o).html("");
    }
  }, this.stopToBeginning = function () {
    a.doCommand("stopToBeginning");
  }, this.changeVideo = function (e, t) {
    return 0 == a.isPlayerReady() ? !1 : void (t && 1 == t ? s.loadVideoById(e, 0, "large") : s.cueVideoById(e, 0, "large"));
  }, this.isPlayerReady = function () {
    return l && s ? !0 : !1;
  }, this.getVideoImages = function (e) {
    var t = {};
    return t.preview = "https://i.ytimg.com/vi/" + e + "/sddefault.jpg", t.thumb = "https://i.ytimg.com/vi/" + e + "/default.jpg", t;
  };
}

function UGVideoPlayer() {
  function e() {
    h.hide();
  }

  function t() {
    p.trigger(h.events.PLAY_START), _ && _.hide();
  }

  function i() {
    p.trigger(h.events.PLAY_STOP), _ && _.show();
  }

  function n() {
    p.trigger(h.events.VIDEO_ENDED);
  }

  function r() {
    _ && (f.setButtonMobileReady(_), f.setButtonOnClick(_, e)), jQuery(m).on(m.events.START_PLAYING, t), jQuery(m).on(m.events.STOP_PLAYING, i), jQuery(m).on(m.events.VIDEO_ENDED, n), jQuery(v).on(v.events.START_PLAYING, t), jQuery(v).on(v.events.STOP_PLAYING, i), jQuery(v).on(v.events.VIDEO_ENDED, n), jQuery(b).on(b.events.START_PLAYING, t), jQuery(b).on(b.events.STOP_PLAYING, i), jQuery(b).on(b.events.VIDEO_ENDED, n), jQuery(y).on(y.events.START_PLAYING, t), jQuery(y).on(y.events.STOP_PLAYING, i), jQuery(y).on(y.events.VIDEO_ENDED, n), jQuery(I).on(I.events.START_PLAYING, t), jQuery(I).on(I.events.STOP_PLAYING, i), jQuery(I).on(I.events.VIDEO_ENDED, n);
  }

  function o(e) {
    var t = ["youtube", "vimeo", "html5", "soundcloud", "wistia"];

    for (var i in t) {
      var n = t[i];
      if (n != e) switch (n) {
        case "youtube":
          m.pause(), m.destroy(), l.hide();
          break;

        case "vimeo":
          v.pause(), v.destroy(), u.hide();
          break;

        case "html5":
          b.pause(), d.hide();
          break;

        case "soundcloud":
          y.pause(), y.destroy(), g.hide();
          break;

        case "wistia":
          I.pause(), c.hide();
      }
    }
  }

  var a,
      s,
      l,
      u,
      d,
      _,
      g,
      c,
      h = this,
      p = jQuery(this),
      f = new UGFunctions(),
      m = new UGYoutubeAPI(),
      v = new UGVimeoAPI(),
      b = new UGHtml5MediaAPI(),
      y = new UGSoundCloudAPI(),
      I = new UGWistiaAPI(),
      w = null,
      E = {
    video_enable_closebutton: !0
  };

  this.events = {
    SHOW: "video_show",
    HIDE: "video_hide",
    PLAY_START: "video_play_start",
    PLAY_STOP: "video_play_stop",
    VIDEO_ENDED: "video_ended"
  };
  var T = {
    standAloneMode: !1,
    youtubeInnerID: "",
    vimeoPlayerID: "",
    html5PlayerID: "",
    wistiaPlayerID: "",
    soundCloudPlayerID: ""
  };
  this.init = function (e, t, i) {
    if (a = i, !a) throw new Error("missing gallery ID for video player, it's a must!");
    E = jQuery.extend(E, e), m.setOptions(E), t && 1 == t && (T.standAloneMode = !0);
  }, this.setHtml = function (e) {
    T.youtubeInnerID = a + "_youtube_inner", T.vimeoPlayerID = a + "_videoplayer_vimeo", T.html5PlayerID = a + "_videoplayer_html5", T.wistiaPlayerID = a + "_videoplayer_wistia", T.soundCloudPlayerID = a + "_videoplayer_soundcloud";
    var t = "<div class='ug-videoplayer' style='display:none'>";
    t += "<div class='ug-videoplayer-wrapper ug-videoplayer-youtube' style='display:none'><div id='" + T.youtubeInnerID + "'></div></div>", t += "<div id='" + T.vimeoPlayerID + "' class='ug-videoplayer-wrapper ug-videoplayer-vimeo' style='display:none'></div>", t += "<div id='" + T.html5PlayerID + "' class='ug-videoplayer-wrapper ug-videoplayer-html5'></div>", t += "<div id='" + T.soundCloudPlayerID + "' class='ug-videoplayer-wrapper ug-videoplayer-soundcloud'></div>", t += "<div id='" + T.wistiaPlayerID + "' class='ug-videoplayer-wrapper ug-videoplayer-wistia'></div>", 0 == T.standAloneMode && 1 == E.video_enable_closebutton && (t += "<div class='ug-videoplayer-button-close'></div>"), t += "</div>", e.append(t), s = e.children(".ug-videoplayer"), l = s.children(".ug-videoplayer-youtube"), u = s.children(".ug-videoplayer-vimeo"), d = s.children(".ug-videoplayer-html5"), g = s.children(".ug-videoplayer-soundcloud"), c = s.children(".ug-videoplayer-wistia"), 0 == T.standAloneMode && 1 == E.video_enable_closebutton && (_ = s.children(".ug-videoplayer-button-close"));
  }, this.destroy = function () {
    _ && (_.off("click"), _.off("touchend")), jQuery(m).off(m.events.START_PLAYING), jQuery(m).off(m.events.STOP_PLAYING), jQuery(v).off(v.events.START_PLAYING), jQuery(v).off(v.events.STOP_PLAYING), jQuery(b).off(b.events.START_PLAYING), jQuery(b).off(b.events.STOP_PLAYING), jQuery(y).off(y.events.START_PLAYING, t), jQuery(y).off(y.events.STOP_PLAYING, i), jQuery(I).off(I.events.START_PLAYING, t), jQuery(I).off(I.events.STOP_PLAYING, i), w = null;
  }, this.initEvents = function () {
    r();
  }, this.setSize = function (e, t) {
    f.setElementSize(s, e, t), _ && f.placeElement(_, "right", "top");
  }, this.setPosition = function (e, t) {
    f.placeElement(s, e, t);
  }, this.getObject = function () {
    return s;
  }, this.show = function () {
    return 1 == h.isVisible() ? !0 : (s.show(), s.fadeTo(0, 1), _ && _.show(), void p.trigger(h.events.SHOW));
  }, this.hide = function () {
    return 0 == h.isVisible() ? !0 : (o(), w = null, s.hide(), void p.trigger(h.events.HIDE));
  }, this.getActiveAPI = function () {
    switch (w) {
      case "youtube":
        return m;

      case "vimeo":
        return v;

      case "wistia":
        return I;

      case "soundcloud":
        return y;

      case "html5":
        return b;

      default:
        return null;
    }
  }, this.pause = function () {
    var e = h.getActiveAPI();
    return null == e ? !1 : void ("function" == typeof e.pause && e.pause());
  }, this.isVisible = function () {
    return s.is(":visible");
  }, this.playYoutube = function (e, t) {
    if ("undefined" == typeof t) var t = !0;
    o("youtube"), l.show();
    var i = l.children("#" + T.youtubeInnerID);
    0 == i.length && l.append("<div id='" + T.youtubeInnerID + "'></div>"), 1 == m.isPlayerReady() && 1 == T.standAloneMode ? m.changeVideo(e, t) : m.putVideo(T.youtubeInnerID, e, "100%", "100%", t), w = "youtube";
  }, this.playVimeo = function (e, t) {
    if ("undefined" == typeof t) var t = !0;
    o("vimeo"), u.show(), v.putVideo(T.vimeoPlayerID, e, "100%", "100%", t), w = "vimeo";
  }, this.playHtml5Video = function (e, t, i, n, r) {
    if ("undefined" == typeof r) var r = !0;
    o("html5"), d.show();
    var a = {
      ogv: e,
      webm: t,
      mp4: i,
      posterImage: n
    };
    b.putVideo(T.html5PlayerID, a, "100%", "100%", r), w = "html5";
  }, this.playSoundCloud = function (e, t) {
    if ("undefined" == typeof t) var t = !0;
    o("soundcloud"), g.show(), y.putSound(T.soundCloudPlayerID, e, "100%", "100%", t), w = "soundcloud";
  }, this.playWistia = function (e, t) {
    if ("undefined" == typeof t) var t = !0;
    o("wistia"), c.show(), I.putVideo(T.wistiaPlayerID, e, "100%", "100%", t), w = "wistia";
  };
}

function ugCheckForMinJQueryVersion() {
  var e = g_ugFunctions.checkMinJqueryVersion("1.8.0");
  if (0 == e) throw new Error("The gallery can run from jquery 1.8 You have jQuery " + jQuery.fn.jquery + " Please update your jQuery library.");
}

function ugCheckForErrors(e, t) {
  function i() {
    if ("undefined" == typeof jQuery) throw new Error("jQuery library not included");
  }

  function n() {
    if ("function" == typeof jQuery.fn.unitegallery) return !0;
    var e = "You have some jquery.js library include that comes after the gallery files js include.";
    throw e += "<br> This include eliminates the gallery libraries, and make it not work.", "cms" == t ? (e += "<br><br> To fix it you can:<br>&nbsp;&nbsp;&nbsp; 1. In the Gallery Settings -> Troubleshooting set option:  <strong><b>Put JS Includes To Body</b></strong> option to true.", e += "<br>&nbsp;&nbsp;&nbsp; 2. Find the double jquery.js include and remove it.") : e += "<br><br> Please find and remove this jquery.js include and the gallery will work. <br> * There should be only one jquery.js include before all other js includes in the page.", new Error(e);
  }

  try {
    "jquery" == t ? (i(), ugCheckForMinJQueryVersion()) : (ugCheckForMinJQueryVersion(), n());
  } catch (r) {
    var o = r.message;

    if (o = "Unite Gallery Error: " + o, o = "<div style='font-size:16px;color:#BC0C06;max-width:900px;border:1px solid red;padding:10px;'>" + o + "</div>", "jquery" == t) {
      var a = document.getElementById(e);
      a.innerHTML = o, a.style.display = "block";
    } else jQuery(e).show().html(o);

    return !1;
  }

  return !0;
}

function UniteGalleryMain() {
  function __________INIT_GALLERY_______() {}

  function getThemeFunction(e) {
    var t = e;
    return -1 == t.indexOf("UGTheme_") && (t = "UGTheme_" + t), t;
  }

  function initTheme(objCustomOptions) {
    if (objCustomOptions.hasOwnProperty("gallery_theme")) g_options.gallery_theme = objCustomOptions.gallery_theme;else {
      var defaultTheme = g_options.gallery_theme;
      0 == g_ugFunctions.isThemeRegistered(defaultTheme) && (g_options.gallery_theme = g_ugFunctions.getFirstRegisteredTheme());
    }
    var themeFunction = getThemeFunction(g_options.gallery_theme);

    try {
      g_options.gallery_theme = eval(themeFunction);
    } catch (e) {}

    g_options.gallery_theme = eval(themeFunction), g_objTheme = new g_options.gallery_theme(), g_objTheme.init(t, objCustomOptions);
  }

  function resetOptions() {
    g_options = jQuery.extend({}, g_temp.originalOptions), g_selectedItemIndex = -1, g_selectedItem = null, g_objSlider = void 0, g_objThumbs = void 0, g_objSlider = void 0;
  }

  function checkForStartupErrors() {
    try {
      ugCheckForMinJQueryVersion();
    } catch (e) {
      throwErrorShowMessage(e.message);
    }

    "object" == _typeof(g_objWrapper.outerWidth()) && throwErrorShowMessage("You have some buggy script. most chances jquery-ui.js that destroy jquery outerWidth, outerHeight functions. The gallery can't run. Please update jquery-ui.js to latest version."), setTimeout(function () {
      ugCheckForErrors(g_galleryID, "cms");
    }, 5e3);
  }

  function runGallery(e, i, n, r) {
    var o = "object" == _typeof(i);

    if (o && (g_temp.objCustomOptions = i), 1 == g_temp.isRunFirstTime) {
      if (g_galleryID = e, g_objWrapper = jQuery(g_galleryID), 0 == g_objWrapper.length) return trace("div with id: " + g_galleryID + " not found"), !1;
      g_objParent = g_objWrapper.parent(), checkForStartupErrors(), g_temp.originalOptions = jQuery.extend({}, g_options), o && (g_options = jQuery.extend(g_options, i)), 1 == g_options.gallery_enable_cache && g_options.gallery_initial_catid && cacheItems(g_options.gallery_initial_catid), t.setSizeClass();
      var a = g_objWrapper.children();
      fillItemsArray(a), loadAPIs(), g_objWrapper.find("img").fadeTo(0, 0).hide(), g_objWrapper.show(), clearInitData();
    } else if (t.destroy(), resetOptions(), g_options = jQuery.extend(g_options, g_temp.objCustomOptions), n) {
      if (r && 1 == g_options.gallery_enable_cache && cacheItems(r, n), "noitems" == n) return showErrorMessage("No items in this category", ""), !1;
      g_objWrapper.html(n);
      var a = g_objWrapper.children();
      fillItemsArray(a), loadAPIs(), g_objWrapper.children().fadeTo(0, 0).hide(), g_objWrapper.show(), clearInitData();
    }

    1 == g_temp.isRunFirstTime && 1 == g_options.gallery_enable_tabs && (g_objTabs = new UGTabs(), g_objTabs.init(t, g_options)), 1 == g_temp.isRunFirstTime && 1 == g_options.gallery_enable_loadmore && (g_objLoadMore = new UGLoadMore(), g_objLoadMore.init(t, g_options)), o && modifyInitParams(g_temp.objCustomOptions), validateParams(), 1 == g_options.gallery_shuffle && t.shuffleItems(), initTheme(g_temp.objCustomOptions), setGalleryHtml(), setHtmlObjectsProperties();
    var s = g_objWrapper.width();
    0 == s ? g_functions.waitForWidth(g_objWrapper, runGalleryActually) : runGalleryActually();
  }

  function runGalleryActually() {
    t.setSizeClass(), 0 == g_temp.isFreestyleMode && 1 == g_options.gallery_preserve_ratio && setHeightByOriginalRatio(), g_objTheme.run(), g_objTabs && g_temp.isRunFirstTime && g_objTabs.run(), preloadBigImages(), initEvents(), g_numItems > 0 && t.selectItem(0), 1 == g_options.gallery_autoplay && t.startPlayMode(), g_temp.isRunFirstTime = !1;
  }

  function showErrorMessage(e, t) {
    if ("undefined" == typeof t) var t = "<b>Unite Gallery Error: </b>";else t = "<b>" + t + ": </b>";
    e = t + e;
    var i = "<div class='ug-error-message-wrapper'><div class='ug-error-message'>" + e + "</div></div>";
    g_objWrapper.children().remove(), g_objWrapper.html(i), g_objWrapper.show();
  }

  function throwErrorShowMessage(e) {
    throw showErrorMessage(e), new Error(e);
  }

  function modifyInitParams() {
    g_options.gallery_images_preload_type || (g_options.gallery_images_preload_type = "minimal"), (void 0 == g_options.gallery_min_height || g_options.gallery_height < g_options.gallery_min_height) && (g_options.gallery_min_height = 0), (void 0 == g_options.gallery_min_width || g_options.gallery_width < g_options.gallery_min_width) && (g_options.gallery_min_width = 0);
  }

  function validateParams() {
    if (!g_options.gallery_theme) throw new Error("The gallery can't run without theme");
    if (jQuery.isNumeric(g_options.gallery_height) && g_options.gallery_height < g_options.gallery_min_height) throw new Error("The <b>gallery_height</b> option must be bigger then <b>gallery_min_height option</b>");
    if (g_options.gallery_width < g_options.gallery_min_width) throw new Error("The <b>gallery_width</b> option must be bigger then <b>gallery_min_width option</b>");
  }

  function setGalleryHtml() {
    g_objWrapper.addClass("ug-gallery-wrapper"), g_objWrapper.append("<div class='ug-overlay-disabled' style='display:none'></div>"), t.setSizeClass();
  }

  function clearInitData() {
    g_objWrapper.children().remove();
  }

  function storeLastSize() {
    var e = t.getSize();
    g_temp.lastWidth = e.width, g_temp.lastHeight = e.height;
  }

  function setHeightByOriginalRatio() {
    var e = t.getSize(),
        i = e.width / e.height;

    if (i != e.orig_ratio) {
      var n = e.width / e.orig_ratio;
      n = Math.round(n), n < g_options.gallery_min_height && (n = g_options.gallery_min_height), g_objWrapper.height(n);
    }
  }

  function setHtmlObjectsProperties() {
    var e = g_functions.getCssSizeParam(g_options.gallery_width),
        t = {
      "max-width": e,
      "min-width": g_functions.getCssSizeParam(g_options.gallery_min_width)
    };

    if (0 == g_temp.isFreestyleMode) {
      var i = g_functions.getCssSizeParam(g_options.gallery_height);
      t.height = i;
    } else t.overflow = "visible";

    g_options.gallery_background_color && (t["background-color"] = g_options.gallery_background_color), g_objWrapper.css(t);
  }

  function fillItemByChild(e) {
    var i = t.isMobileMode(),
        n = e.prop("tagName").toLowerCase(),
        r = "";

    if ("a" == n) {
      r = e.attr("href"), e = e.children();
      var n = e.prop("tagName").toLowerCase();
    }

    var o = e.data("type");
    void 0 == o && (o = "image");
    var a = {};

    if (a.type = o, "img" == n) {
      var s = e.data("lazyload-src");
      s && "" != s && (e.attr("src", s), jQuery.removeData(e, "lazyload-src"));
      var l = e.data("image"),
          u = e.data("thumb");
      "undefined" == typeof l && (l = null), "undefined" == typeof u && (u = null);
      var d = e.attr("src");
      l || (l = d), u || (u = d), u || (u = l), l || (l = u), a.urlThumb = u, a.urlImage = l, a.title = e.attr("alt"), a.objThumbImage = e, a.objThumbImage.attr("src", a.urlThumb);
    } else {
      if ("image" == o) throw trace("Problematic gallery item found:"), trace(e), trace("Please look for some third party js script that could add this item to the gallery"), new Error("The item should not be image type");
      a.urlThumb = e.data("thumb"), a.title = e.data("title"), a.objThumbImage = null, a.urlImage = e.data("image");
    }

    if (1 == i) {
      var _ = e.data("thumb-mobile");

      "undefined" != typeof _ && "" != _ && (a.urlThumb = _, "img" == n && e.attr("src", a.urlThumb));
      var g = e.data("image-mobile");
      "undefined" != typeof g && "" != g && (a.urlImage = g);
    }

    a.link = r, a.description = e.attr("title"), a.description || (a.description = e.data("description")), a.description || (a.description = ""), a.isNewAdded = !1, a.isLoaded = !1, a.isThumbImageLoaded = !1, a.objPreloadImage = null, a.isBigImageLoadStarted = !1, a.isBigImageLoaded = !1, a.isBigImageLoadError = !1, a.imageWidth = 0, a.imageHeight = 0, a.thumbWidth = 0, a.thumbHeight = 0, a.thumbRatioByWidth = 0, a.thumbRatioByHeight = 0;
    var c = e.data("width"),
        h = e.data("height");
    c && "number" == typeof c && h && "number" == typeof h && (a.thumbWidth = c, a.thumbHeight = h, a.thumbRatioByWidth = c / h, a.thumbRatioByHeight = h / c), a.addHtml = null;
    var p = void 0 == a.urlImage || "" == a.urlImage,
        f = void 0 == a.urlThumb || "" == a.urlThumb;

    switch (a.type) {
      case "youtube":
        if (a.videoid = e.data("videoid"), p || f) {
          var m = g_ugYoutubeAPI.getVideoImages(a.videoid);
          p && (a.urlImage = m.preview), f && (a.urlThumb = m.thumb, "img" == n && e.attr("src", a.urlThumb));
        }

        g_temp.isYoutubePresent = !0;
        break;

      case "vimeo":
        a.videoid = e.data("videoid"), g_temp.isVimeoPresent = !0;
        break;

      case "html5video":
        a.videoogv = e.data("videoogv"), a.videowebm = e.data("videowebm"), a.videomp4 = e.data("videomp4"), g_temp.isHtml5VideoPresent = !0;
        break;

      case "soundcloud":
        a.trackid = e.data("trackid"), g_temp.isSoundCloudPresent = !0;
        break;

      case "wistia":
        a.videoid = e.data("videoid"), g_temp.isWistiaPresent = !0;
        break;

      case "custom":
        var v = e.children("img");
        v.length && (v = jQuery(v[0]), a.urlThumb = v.attr("src"), a.title = v.attr("alt"), a.objThumbImage = v);
        var b = e.children().not("img:first-child");
        b.length && (a.addHtml = b.clone());
    }

    return a.objThumbImage && (a.objThumbImage.removeAttr("data-description", ""), a.objThumbImage.removeAttr("data-image", ""), a.objThumbImage.removeAttr("data-thumb", ""), a.objThumbImage.removeAttr("title", "")), a;
  }

  function fillItemsArray(e, t) {
    if (t !== !0) g_arrItems = [];else for (var i = 0; g_numItems > i; i++) {
      g_arrItems[i].isNewAdded = !1;
    }

    for (var i = 0; i < e.length; i++) {
      var n = jQuery(e[i]),
          r = fillItemByChild(n);
      numIndex = g_arrItems.length, r.index = numIndex, t === !0 && (r.isNewAdded = !0), g_arrItems.push(r);
    }

    g_numItems = g_arrItems.length;
  }

  function loadAPIs() {
    g_temp.isYoutubePresent && g_ugYoutubeAPI.loadAPI(), g_temp.isVimeoPresent && g_ugVimeoAPI.loadAPI(), g_temp.isHtml5VideoPresent && g_ugHtml5MediaAPI.loadAPI(), g_temp.isSoundCloudPresent && g_ugSoundCloudAPI.loadAPI(), g_temp.isWistiaPresent && g_ugWistiaAPI.loadAPI();
  }

  function preloadBigImages() {
    if ("visible" != g_options.gallery_images_preload_type || g_objThumbs || (g_options.gallery_images_preload_type = "minimal"), 1 == g_temp.isAllItemsPreloaded) return !0;

    switch (g_options.gallery_images_preload_type) {
      default:
      case "minimal":
        break;

      case "all":
        jQuery(g_arrItems).each(function () {
          preloadItemImage(this);
        });
        break;

      case "visible":
        jQuery(g_arrItems).each(function () {
          var e = this,
              t = g_objThumbs.isItemThumbVisible(e);
          1 == t && preloadItemImage(e);
        });
    }
  }

  function checkPreloadItemImage(e) {
    if (1 == e.isBigImageLoadStarted || 1 == e.isBigImageLoaded || 1 == e.isBigImageLoadError) return !1;

    switch (g_options.gallery_images_preload_type) {
      default:
      case "minimal":
        break;

      case "all":
        preloadItemImage(e);
        break;

      case "visible":
        var t = g_objThumbs.isItemThumbVisible(e);
        1 == t && preloadItemImage(e);
    }
  }

  function preloadItemImage(e) {
    if (1 == e.isBigImageLoadStarted || 1 == e.isBigImageLoaded || 1 == e.isBigImageLoadError) return !0;
    var i = e.urlImage;
    return "" == i || void 0 == i ? (e.isBigImageLoadError = !0, !1) : (e.isBigImageLoadStarted = !0, e.objPreloadImage = jQuery("<img/>").attr("src", i), e.objPreloadImage.data("itemIndex", e.index), e.objPreloadImage.on("load", t.onItemBigImageLoaded), e.objPreloadImage.on("error", function () {
      var e = jQuery(this),
          i = e.data("itemIndex"),
          n = g_arrItems[i];
      n.isBigImageLoadError = !0, n.isBigImageLoaded = !1;
      var r = jQuery(this).attr("src");
      console.log("Can't load image: " + r), g_objGallery.trigger(t.events.ITEM_IMAGE_UPDATED, [i, n.urlImage]), n.objThumbImage.attr("src", n.urlThumb);
    }), void checkAllItemsStartedPreloading());
  }

  function preloadNearBigImages(e) {
    if (1 == g_temp.isAllItemsPreloaded) return !1;
    if (!e) var e = g_selectedItem;
    if (!e) return !0;
    var t = e.index,
        i = t - 1,
        n = t + 1;
    i > 0 && preloadItemImage(g_arrItems[i]), g_numItems > n && preloadItemImage(g_arrItems[n]);
  }

  function checkAllItemsStartedPreloading() {
    if (1 == g_temp.isAllItemsPreloaded) return !1;

    for (var e in g_arrItems) {
      if (0 == g_arrItems[e].isBigImageLoadStarted) return !1;
    }

    g_temp.isAllItemsPreloaded = !0;
  }

  function __________END_INIT_GALLERY_______() {}

  function __________EVENTS_____________() {}

  function onSliderMouseEnter(e) {
    1 == g_options.gallery_pause_on_mouseover && 0 == t.isFullScreen() && 1 == g_temp.isPlayMode && g_objSlider && 0 == g_objSlider.isSlideActionActive() && t.pausePlaying();
  }

  function onSliderMouseLeave(e) {
    if (1 == g_options.gallery_pause_on_mouseover && 1 == g_temp.isPlayMode && g_objSlider && 0 == g_objSlider.isSlideActionActive()) {
      var i = g_objSlider.isCurrentSlideLoadingImage();
      0 == i && t.continuePlaying();
    }
  }

  function onKeyPress(e) {
    var i = jQuery(e.target);
    if (i.is("textarea") || i.is("select") || i.is("input")) return !0;
    var n = e.charCode ? e.charCode : e.keyCode ? e.keyCode : e.which ? e.which : 0,
        r = !0;

    switch (n) {
      case 39:
        t.nextItem();
        break;

      case 37:
        t.prevItem();
        break;

      default:
        r = !1;
    }

    1 == r && (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation()), g_objGallery.trigger(t.events.GALLERY_KEYPRESS, [n, e]);
  }

  function onGalleryResized() {
    var e = t.getSize();
    if (0 == e.width) return !0;
    t.setSizeClass();
    var e = t.getSize();

    if (e.width != g_temp.lastWidth || 0 == g_temp.isFreestyleMode && e.height != g_temp.lastHeight) {
      var i = !1;

      if (g_temp.funcCustomHeight) {
        var n = g_temp.funcCustomHeight(e);
        n && (g_objWrapper.height(n), i = !0);
      }

      0 == i && 1 == g_options.gallery_preserve_ratio && 0 == g_temp.isFreestyleMode && setHeightByOriginalRatio(), storeLastSize(), g_objGallery.trigger(t.events.SIZE_CHANGE);
    }
  }

  function onThumbsChange(e) {
    "visible" == g_options.gallery_images_preload_type && 0 == g_temp.isAllItemsPreloaded && preloadBigImages();
  }

  function onFullScreenChange() {
    var e = g_functions.isFullScreen(),
        i = e ? t.events.ENTER_FULLSCREEN : t.events.EXIT_FULLSCREEN,
        n = g_functions.getGlobalData("fullscreenID");
    return g_galleryID !== n ? !0 : (e ? g_objWrapper.addClass("ug-fullscreen") : g_objWrapper.removeClass("ug-fullscreen"), g_objGallery.trigger(i), void onGalleryResized());
  }

  function onItemImageUpdated(e, i) {
    var n = t.getItem(i);
    checkPreloadItemImage(n);
  }

  function onCurrentSlideImageLoadEnd() {
    1 == t.isPlayMode() && t.continuePlaying();
  }

  function initEvents() {
    if (g_objWrapper.on("dragstart", function (e) {
      e.preventDefault();
    }), g_objGallery.on(t.events.ITEM_IMAGE_UPDATED, onItemImageUpdated), g_objThumbs) switch (g_temp.thumbsType) {
      case "strip":
        jQuery(g_objThumbs).on(g_objThumbs.events.STRIP_MOVE, onThumbsChange);
        break;

      case "grid":
        jQuery(g_objThumbs).on(g_objThumbs.events.PANE_CHANGE, onThumbsChange);
    }

    if ("advance" == g_options.gallery_mousewheel_role && 0 == g_temp.isFreestyleMode && g_objWrapper.on("mousewheel", t.onGalleryMouseWheel), storeLastSize(), jQuery(window).resize(function () {
      g_objWrapper.css("width", "auto"), g_functions.whenContiniousEventOver("gallery_resize", onGalleryResized, g_temp.resizeDelay);
    }), setTimeout(function () {
      setInterval(onGalleryResized, 2e3);
    }, 1e4), g_functions.addFullScreenChangeEvent(onFullScreenChange), g_objSlider) {
      if (jQuery(g_objSlider).on(g_objSlider.events.ITEM_CHANGED, function () {
        var e = g_objSlider.getCurrentItemIndex();
        -1 != e && t.selectItem(e);
      }), 1 == g_options.gallery_pause_on_mouseover) {
        var e = g_objSlider.getElement();
        e.hover(onSliderMouseEnter, onSliderMouseLeave), g_objGallery.on(t.events.ENTER_FULLSCREEN, function () {
          onSliderMouseLeave();
        });
      }

      retriggerEvent(g_objSlider, g_objSlider.events.ACTION_START, t.events.SLIDER_ACTION_START), retriggerEvent(g_objSlider, g_objSlider.events.ACTION_END, t.events.SLIDER_ACTION_END), jQuery(g_objSlider).on(g_objSlider.events.CURRENTSLIDE_LOAD_END, onCurrentSlideImageLoadEnd);
    }

    1 == g_options.gallery_control_keyboard && jQuery(document).keydown(onKeyPress);
  }

  function __________GENERAL_______() {}

  function cacheItems(e, t) {
    if (t) {
      var i = t;
      "noitems" != i && (i = jQuery(t).clone());
    } else var i = g_objWrapper.children().clone();

    g_objCache[e] = i;
  }

  function removeAllSizeClasses(e) {
    e || (e = g_objWrapper), e.removeClass("ug-under-480"), e.removeClass("ug-under-780"), e.removeClass("ug-under-960");
  }

  function retriggerEvent(e, t, i) {
    jQuery(e).on(t, function (e) {
      g_objGallery.trigger(i, [this]);
    });
  }

  function advanceNextStep() {
    var e = jQuery.now(),
        i = e - g_temp.playTimeLastStep;
    g_temp.playTimeLastStep = e;
    var n = t.isGalleryVisible();
    if (0 == n) return !1;

    if (g_temp.playTimePassed += i, g_temp.objProgress) {
      var r = g_temp.playTimePassed / g_options.gallery_play_interval;
      g_temp.objProgress.setProgress(r);
    }

    g_temp.playTimePassed >= g_options.gallery_play_interval && (t.nextItem(), g_temp.playTimePassed = 0);
  }

  function unselectSeletedItem() {
    return null == g_selectedItem ? !0 : (g_objThumbs && g_objThumbs.setThumbUnselected(g_selectedItem.objThumbWrapper), g_selectedItem = null, void (g_selectedItemIndex = -1));
  }

  function toFakeFullScreen() {
    jQuery("body").addClass("ug-body-fullscreen"), g_objWrapper.addClass("ug-fake-fullscreen"), g_temp.isFakeFullscreen = !0, g_objGallery.trigger(t.events.ENTER_FULLSCREEN), g_objGallery.trigger(t.events.SIZE_CHANGE);
  }

  function exitFakeFullscreen() {
    jQuery("body").removeClass("ug-body-fullscreen"), g_objWrapper.removeClass("ug-fake-fullscreen"), g_temp.isFakeFullscreen = !1, g_objGallery.trigger(t.events.EXIT_FULLSCREEN), g_objGallery.trigger(t.events.SIZE_CHANGE);
  }

  var t = this,
      g_galleryID,
      g_objGallery = jQuery(t),
      g_objWrapper,
      g_objParent,
      g_objThumbs,
      g_objSlider,
      g_functions = new UGFunctions(),
      g_objTabs,
      g_objLoadMore,
      g_arrItems = [],
      g_numItems,
      g_selectedItem = null,
      g_selectedItemIndex = -1,
      g_objTheme,
      g_objCache = {};
  this.events = {
    ITEM_CHANGE: "item_change",
    SIZE_CHANGE: "size_change",
    ENTER_FULLSCREEN: "enter_fullscreen",
    EXIT_FULLSCREEN: "exit_fullscreen",
    START_PLAY: "start_play",
    STOP_PLAY: "stop_play",
    PAUSE_PLAYING: "pause_playing",
    CONTINUE_PLAYING: "continue_playing",
    SLIDER_ACTION_START: "slider_action_start",
    SLIDER_ACTION_END: "slider_action_end",
    ITEM_IMAGE_UPDATED: "item_image_updated",
    GALLERY_KEYPRESS: "gallery_keypress",
    GALLERY_BEFORE_REQUEST_ITEMS: "gallery_before_request_items",
    OPEN_LIGHTBOX: "open_lightbox",
    CLOSE_LIGHTBOX: "close_lightbox"
  };
  var g_options = {
    gallery_width: 900,
    gallery_height: 500,
    gallery_min_width: 150,
    gallery_min_height: 100,
    gallery_theme: "default",
    gallery_skin: "default",
    gallery_images_preload_type: "minimal",
    gallery_autoplay: !1,
    gallery_play_interval: 3e3,
    gallery_pause_on_mouseover: !0,
    gallery_mousewheel_role: "zoom",
    gallery_control_keyboard: !0,
    gallery_carousel: !0,
    gallery_preserve_ratio: !0,
    gallery_background_color: "",
    gallery_debug_errors: !1,
    gallery_shuffle: !1,
    gallery_urlajax: null,
    gallery_enable_tabs: !1,
    gallery_enable_loadmore: !1,
    gallery_enable_cache: !0,
    gallery_initial_catid: ""
  },
      g_temp = {
    objCustomOptions: {},
    isAllItemsPreloaded: !1,
    isFreestyleMode: !1,
    lastWidth: 0,
    lastHeigh: 0,
    handleResize: null,
    isInited: !1,
    isPlayMode: !1,
    isPlayModePaused: !1,
    playTimePassed: 0,
    playTimeLastStep: 0,
    playHandle: "",
    playStepInterval: 33,
    objProgress: null,
    isFakeFullscreen: !1,
    thumbsType: null,
    isYoutubePresent: !1,
    isVimeoPresent: !1,
    isHtml5VideoPresent: !1,
    isSoundCloudPresent: !1,
    isWistiaPresent: !1,
    resizeDelay: 100,
    isRunFirstTime: !0,
    originalOptions: {},
    funcCustomHeight: null
  };
  this.onItemBigImageLoaded = function (e, t) {
    if (!t) var t = jQuery(this);
    var i = t.data("itemIndex"),
        n = g_arrItems[i];
    n.isBigImageLoaded = !0;
    var r = g_functions.getImageOriginalSize(t);
    n.imageWidth = r.width, n.imageHeight = r.height;
  }, this.checkFillImageSize = function (e, t) {
    if (!t) {
      var i = e.data("itemIndex");
      if (void 0 === i) throw new Error("Wrong image given to gallery.checkFillImageSize");
      var t = g_arrItems[i];
    }

    var n = g_functions.getImageOriginalSize(e);
    t.imageWidth = n.width, t.imageHeight = n.height;
  }, this.setFreestyleMode = function () {
    g_temp.isFreestyleMode = !0;
  }, this.attachThumbsPanel = function (e, t) {
    g_temp.thumbsType = e, g_objThumbs = t;
  }, this.initSlider = function (e, i) {
    if (!e) var e = {};
    e = jQuery.extend(g_temp.objCustomOptions, e), g_objSlider = new UGSlider(), g_objSlider.init(t, e, i);
  }, this.onGalleryMouseWheel = function (e, i, n, r) {
    e.preventDefault(), i > 0 ? t.prevItem() : t.nextItem();
  }, this.destroy = function () {
    if (g_objWrapper.off("dragstart"), g_objGallery.off(t.events.ITEM_IMAGE_UPDATED), g_objThumbs) switch (g_temp.thumbsType) {
      case "strip":
        jQuery(g_objThumbs).off(g_objThumbs.events.STRIP_MOVE);
        break;

      case "grid":
        jQuery(g_objThumbs).off(g_objThumbs.events.PANE_CHANGE);
    }

    if (g_objWrapper.off("mousewheel"), jQuery(window).off("resize"), g_functions.destroyFullScreenChangeEvent(), g_objSlider) {
      jQuery(g_objSlider).off(g_objSlider.events.ITEM_CHANGED);
      var e = g_objSlider.getElement();
      e.off("mouseenter"), e.off("mouseleave"), g_objGallery.off(t.events.ENTER_FULLSCREEN), jQuery(g_objSlider).off(g_objSlider.events.ACTION_START), jQuery(g_objSlider).off(g_objSlider.events.ACTION_END), jQuery(g_objSlider).off(g_objSlider.events.CURRENTSLIDE_LOAD_END);
    }

    1 == g_options.gallery_control_keyboard && jQuery(document).off("keydown"), g_objTheme && "function" == typeof g_objTheme.destroy && g_objTheme.destroy(), g_objWrapper.html("");
  }, this.getArrItems = function () {
    return g_arrItems;
  }, this.getObjects = function () {
    var e = {
      g_galleryID: g_galleryID,
      g_objWrapper: g_objWrapper,
      g_objThumbs: g_objThumbs,
      g_objSlider: g_objSlider,
      g_options: g_options,
      g_arrItems: g_arrItems,
      g_numItems: g_numItems
    };
    return e;
  }, this.getObjSlider = function () {
    return g_objSlider;
  }, this.getItem = function (e) {
    if (0 > e) throw new Error("item with index: " + e + " not found");
    if (e >= g_numItems) throw new Error("item with index: " + e + " not found");
    return g_arrItems[e];
  }, this.getWidth = function () {
    var e = t.getSize();
    return e.width;
  }, this.getHeight = function () {
    var e = t.getSize();
    return e.height;
  }, this.getSize = function () {
    var e = g_functions.getElementSize(g_objWrapper);
    return e.orig_width = g_options.gallery_width, e.orig_height = g_options.gallery_height, e.orig_ratio = e.orig_width / e.orig_height, e;
  }, this.getGalleryID = function () {
    var e = g_galleryID.replace("#", "");
    return e;
  }, this.getNextItem = function (e, t) {
    "object" == _typeof(e) && (e = e.index);
    var i = e + 1;
    if (t !== !0 && 1 == g_numItems) return null;

    if (i >= g_numItems) {
      if (1 != g_options.gallery_carousel && t !== !0) return null;
      i = 0;
    }

    var n = g_arrItems[i];
    return n;
  }, this.getPrevItem = function (e) {
    "object" == _typeof(e) && (e = e.index);
    var t = e - 1;

    if (0 > t) {
      if (1 != g_options.gallery_carousel && forceCarousel !== !0) return null;
      t = g_numItems - 1;
    }

    var i = g_arrItems[t];
    return i;
  }, this.getSelectedItem = function () {
    return g_selectedItem;
  }, this.getSelectedItemIndex = function () {
    return g_selectedItemIndex;
  }, this.getNumItems = function () {
    return g_numItems;
  }, this.isLastItem = function () {
    return g_selectedItemIndex == g_numItems - 1 ? !0 : !1;
  }, this.isFirstItem = function () {
    return 0 == g_selectedItemIndex ? !0 : !1;
  }, this.getOptions = function () {
    return g_options;
  }, this.getElement = function () {
    return g_objWrapper;
  }, this.___________SET_CONTROLS___________ = function () {}, this.setNextButton = function (e) {
    e.data("ug-button", !0), g_functions.setButtonOnClick(e, t.nextItem);
  }, this.setPrevButton = function (e) {
    e.data("ug-button", !0), g_functions.setButtonOnClick(e, t.prevItem);
  }, this.setFullScreenToggleButton = function (e) {
    e.data("ug-button", !0), g_functions.setButtonOnTap(e, t.toggleFullscreen), g_objGallery.on(t.events.ENTER_FULLSCREEN, function () {
      e.addClass("ug-fullscreenmode");
    }), g_objGallery.on(t.events.EXIT_FULLSCREEN, function () {
      e.removeClass("ug-fullscreenmode");
    });
  }, this.destroyFullscreenButton = function (e) {
    g_functions.destroyButton(e), g_objGallery.off(t.events.ENTER_FULLSCREEN), g_objGallery.off(t.events.EXIT_FULLSCREEN);
  }, this.setPlayButton = function (e) {
    e.data("ug-button", !0), g_functions.setButtonOnClick(e, t.togglePlayMode), g_objGallery.on(t.events.START_PLAY, function () {
      e.addClass("ug-stop-mode");
    }), g_objGallery.on(t.events.STOP_PLAY, function () {
      e.removeClass("ug-stop-mode");
    });
  }, this.destroyPlayButton = function (e) {
    g_functions.destroyButton(e), g_objGallery.off(t.events.START_PLAY), g_objGallery.off(t.events.STOP_PLAY);
  }, this.setProgressIndicator = function (e) {
    g_temp.objProgress = e;
  }, this.setTextContainers = function (e, i) {
    g_objGallery.on(t.events.ITEM_CHANGE, function () {
      var n = t.getSelectedItem();
      e.html(n.title), i.html(n.description);
    });
  }, this.showDisabledOverlay = function () {
    g_objWrapper.children(".ug-overlay-disabled").show();
  }, this.hideDisabledOverlay = function () {
    g_objWrapper.children(".ug-overlay-disabled").hide();
  }, this.___________END_SET_CONTROLS___________ = function () {}, this.___________PLAY_MODE___________ = function () {}, this.startPlayMode = function () {
    if (g_temp.isPlayMode = !0, g_temp.isPlayModePaused = !1, g_temp.playTimePassed = 0, g_temp.playTimeLastStep = jQuery.now(), g_temp.playHandle = setInterval(advanceNextStep, g_temp.playStepInterval), g_temp.objProgress) {
      var e = g_temp.objProgress.getElement();
      g_temp.objProgress.setProgress(0), e.show();
    }

    g_objGallery.trigger(t.events.START_PLAY), g_objSlider && 1 == g_objSlider.isCurrentSlideLoadingImage() && t.pausePlaying();
  }, this.resetPlaying = function () {
    return 0 == g_temp.isPlayMode ? !0 : (g_temp.playTimePassed = 0, void (g_temp.playTimeLastStep = jQuery.now()));
  }, this.pausePlaying = function () {
    return 1 == g_temp.isPlayModePaused ? !0 : (g_temp.isPlayModePaused = !0, clearInterval(g_temp.playHandle), void g_objGallery.trigger(t.events.PAUSE_PLAYING));
  }, this.continuePlaying = function () {
    return 0 == g_temp.isPlayModePaused ? !0 : (g_temp.isPlayModePaused = !1, g_temp.playTimeLastStep = jQuery.now(), void (g_temp.playHandle = setInterval(advanceNextStep, g_temp.playStepInterval)));
  }, this.stopPlayMode = function () {
    if (g_temp.isPlayMode = !1, clearInterval(g_temp.playHandle), g_temp.playTimePassed = 0, g_temp.objProgress) {
      var e = g_temp.objProgress.getElement();
      e.hide();
    }

    g_objGallery.trigger(t.events.STOP_PLAY);
  }, this.isPlayMode = function () {
    return g_temp.isPlayMode;
  }, this.togglePlayMode = function () {
    0 == t.isPlayMode() ? t.startPlayMode() : t.stopPlayMode();
  }, this.___________GENERAL_EXTERNAL___________ = function () {}, this.shuffleItems = function () {
    g_arrItems = g_functions.arrayShuffle(g_arrItems);

    for (var e in g_arrItems) {
      g_arrItems[e].index = parseInt(e);
    }
  }, this.setOptions = function (e) {
    g_options = jQuery.extend(g_options, e);
  }, this.selectItem = function (e, i) {
    "number" == typeof e && (e = t.getItem(e));
    var n = e.index;
    if (n == g_selectedItemIndex) return !0;

    if (unselectSeletedItem(), g_selectedItem = e, g_selectedItemIndex = n, g_objGallery.trigger(t.events.ITEM_CHANGE, [e, i]), 1 == g_temp.isPlayMode) {
      t.resetPlaying();
      var r = g_objSlider.isCurrentSlideLoadingImage();
      1 == r && t.pausePlaying();
    }
  }, this.nextItem = function () {
    var e = g_selectedItemIndex + 1;
    return 0 == g_numItems ? !0 : 0 == g_options.gallery_carousel && e >= g_numItems ? !0 : (e >= g_numItems && (e = 0), void t.selectItem(e, "next"));
  }, this.prevItem = function () {
    var e = g_selectedItemIndex - 1;
    return -1 == g_selectedItemIndex && (e = 0), 0 == g_numItems ? !0 : 0 == g_options.gallery_carousel && 0 > e ? !0 : (0 > e && (e = g_numItems - 1), void t.selectItem(e, "prev"));
  }, this.isFullScreen = function () {
    return 1 == g_temp.isFakeFullscreen ? !0 : 1 == g_functions.isFullScreen() ? !0 : !1;
  }, this.isFakeFullscreen = function () {
    return g_temp.isFakeFullscreen;
  }, this.toFullScreen = function () {
    g_functions.setGlobalData("fullscreenID", g_galleryID);
    var e = g_objWrapper.get(0),
        t = g_functions.toFullscreen(e);
    0 == t && toFakeFullScreen();
  }, this.exitFullScreen = function () {
    1 == g_temp.isFakeFullscreen ? exitFakeFullscreen() : g_functions.exitFullscreen();
  }, this.toggleFullscreen = function () {
    0 == t.isFullScreen() ? t.toFullScreen() : t.exitFullScreen();
  }, this.resize = function (e, t, i) {
    g_objWrapper.css("width", "auto"), g_objWrapper.css("max-width", e + "px"), t && g_objWrapper.height(t), i || i === !0 || onGalleryResized();
  }, this.setSizeClass = function (e, i) {
    if (!e) var e = g_objWrapper;
    if (!i) var n = t.getSize(),
        i = n.width;
    if (0 == i) var i = jQuery(window).width();
    var r = "";
    return 480 >= i ? r = "ug-under-480" : 780 >= i ? r = "ug-under-780" : 960 > i && (r = "ug-under-960"), 1 == e.hasClass(r) ? !0 : (removeAllSizeClasses(e), void ("" != r && e.addClass(r)));
  }, this.isMobileMode = function () {
    return g_objWrapper.hasClass("ug-under-480") ? !0 : !1;
  }, this.isSmallWindow = function () {
    var e = jQuery(window).width();
    return e ? 480 >= e ? !0 : !1 : !0;
  }, this.isGalleryVisible = function () {
    var e = g_objWrapper.is(":visible");
    return e;
  }, this.changeItems = function (e, t) {
    if (!e) var e = "noitems";
    runGallery(g_galleryID, "nochange", e, t);
  }, this.addItems = function (e) {
    if (!e || 0 == e.length) return !1;
    var t = g_objWrapper.children(".ug-newitems-wrapper");
    0 == t.length && g_objWrapper.append("<div class='ug-newitems-wrapper' style='display:none'></div>"), t = g_objWrapper.children(".ug-newitems-wrapper"), t.append(e);
    var i = jQuery(t.children());
    if (fillItemsArray(i, !0), loadAPIs(), !g_objTheme || "function" != typeof g_objTheme.addItems) throw new Error("addItems function not found in the theme");
    t.remove(), g_objTheme.addItems();
  }, this.getNewAddedItemsIndexes = function () {
    var e = [];
    return jQuery.each(g_arrItems, function (t, i) {
      1 == i.isNewAdded && e.push(t);
    }), e;
  }, this.showErrorMessageReplaceGallery = function (e) {
    showErrorMessage(e);
  }, this.setFuncCustomHeight = function (e) {
    g_temp.funcCustomHeight = e;
  }, this.__________EXTERNAL_EVENTS_______ = function () {}, this.triggerEvent = function (e, t) {
    t ? ("array" != jQuery.type(t) && (t = [t]), g_objGallery.trigger(e, t)) : g_objGallery.trigger(e);
  }, this.onEvent = function (e, t) {
    g_objGallery.on(e, t);
  }, this.destroyEvent = function (e) {
    g_objGallery.off(e);
  }, this.__________AJAX_REQUEST_______ = function () {}, this.ajaxRequest = function (e, t, i, n) {
    if (!i || "function" != typeof i) throw new Error("ajaxRequest error: success function should be passed");
    var r = g_options.gallery_urlajax;
    if (!r || "" == r) throw new Error("ajaxRequest error: Ajax url don't passed");
    if ("undefined" == typeof t) var t = {};
    var o = {
      action: "unitegallery_ajax_action",
      client_action: e,
      galleryID: g_galleryID,
      data: t
    };
    jQuery.ajax({
      type: "post",
      url: g_options.gallery_urlajax,
      dataType: "json",
      data: o,
      success: function success(e) {
        if (!e) throw new Error("Empty ajax response!");
        if (-1 == e || 0 === e) throw new Error("ajax error!!!");
        if ("undefined" == typeof e.success) throw new Error("ajax error!!!");
        return 0 == e.success ? (showErrorMessage(e.message, "ajax error"), !1) : void i(e);
      },
      error: function error(e, t, i) {
        console.log("Ajax Error!!! " + t), responseText = e.responseText, n && "function" == typeof n ? n(responseText) : trace(responseText);
      }
    });
  }, this.requestNewItems = function (e, i, n) {
    var r = g_options.gallery_enable_cache;

    if (n || (n = e), 1 == i && (r = !1), 1 == r && g_objCache.hasOwnProperty(n)) {
      var o = g_objCache[n];
      t.changeItems(o, n);
    } else g_objGallery.trigger(t.events.GALLERY_BEFORE_REQUEST_ITEMS), t.ajaxRequest("front_get_cat_items", {
      catid: e
    }, function (e) {
      var i = e.html;
      t.changeItems(i, n);
    });
  }, this.run = function (e, t) {
    g_options.gallery_debug_errors;
    if (t && t.hasOwnProperty("gallery_debug_errors") && (g_options.gallery_debug_errors = t.gallery_debug_errors), 1 == g_options.gallery_debug_errors) try {
      runGallery(e, t);
    } catch (i) {
      if ("object" == _typeof(i)) {
        var n = i.message,
            r = i.lineNumber,
            o = i.fileName;
        i.stack;
        n += " <br><br> in file: " + o, n += " <b> line " + r + "</b>", trace(i);
      } else var n = i;

      n = n.replace("Error:", ""), showErrorMessage(n);
    } else runGallery(e, t);
  };
}

function UGLightbox() {
  function e(e, i) {
    ie = e, U = jQuery(e), ae = jQuery.extend(ae, le), ae = jQuery.extend(ae, i), se.originalOptions = jQuery.extend({}, ae), "compact" == ae.lightbox_type && (se.isCompact = !0, ae = jQuery.extend(ae, ue), ae = jQuery.extend(ae, i)), t(), 1 == se.putSlider ? (ie.initSlider(ae, "lightbox"), g_objects = e.getObjects(), ne = g_objects.g_objSlider) : ne = null, 1 == ae.lightbox_show_textpanel ? oe.init(ie, ae, "lightbox") : oe = null;
  }

  function t() {
    1 == se.isCompact && 1 == ae.lightbox_show_textpanel && (ae.lightbox_slider_image_padding_bottom = se.initTextPanelHeight), 1 == se.isCompact && "inside" == ae.lightbox_arrows_position && (se.isArrowsInside = !0), 1 == se.isArrowsInside && 0 == ae.lightbox_arrows_inside_alwayson && (se.isArrowsOnHoverMode = !0), 0 == ae.lightbox_show_textpanel && (se.isTopPanelEnabled = !1, se.topPanelHeight = 0, ae.lightbox_slider_image_padding_top = 0);
  }

  function i() {
    var e = "",
        t = "";
    1 == se.isCompact && (t = " ug-lightbox-compact"), e += "<div class='ug-gallery-wrapper ug-lightbox" + t + "'>", e += "<div class='ug-lightbox-overlay'></div>", 0 == se.isCompact && se.isTopPanelEnabled ? (e += "<div class='ug-lightbox-top-panel'>", e += "<div class='ug-lightbox-top-panel-overlay'></div>", ae.lightbox_show_numbers && (e += "<div class='ug-lightbox-numbers'></div>"), e += "</div>") : ae.lightbox_show_numbers && (e += "<div class='ug-lightbox-numbers'></div>"), e += "<div class='ug-lightbox-button-close'></div>", e += "<div class='ug-lightbox-arrow-left'></div>", e += "<div class='ug-lightbox-arrow-right'></div>", e += "</div>", V = jQuery(e), jQuery("body").append(V), ne && ne.setHtml(V), X = V.children(".ug-lightbox-overlay"), 0 == se.isCompact && 1 == se.isTopPanelEnabled && ($ = V.children(".ug-lightbox-top-panel"), 0 == $.length && ($ = null)), K = V.find(".ug-lightbox-button-close"), ae.lightbox_show_numbers && (J = V.find(".ug-lightbox-numbers")), Z = V.children(".ug-lightbox-arrow-left"), q = V.children(".ug-lightbox-arrow-right"), oe && ($ ? oe.appendHTML($) : oe.appendHTML(V));
  }

  function n() {
    if (null !== ae.lightbox_overlay_color && X.css("background-color", ae.lightbox_overlay_color), null !== ae.lightbox_overlay_opacity && X.fadeTo(0, ae.lightbox_overlay_opacity), $ && null !== ae.lightbox_top_panel_opacity && $.children(".ug-lightbox-top-panel-overlay").fadeTo(0, ae.lightbox_top_panel_opacity), J) {
      var e = {};
      null !== ae.lightbox_numbers_size && (e["font-size"] = ae.lightbox_numbers_size + "px"), ae.lightbox_numbers_color && (e.color = ae.lightbox_numbers_color), null !== ae.lightbox_numbers_padding_right && (e["padding-right"] = ae.lightbox_numbers_padding_right + "px"), null !== ae.lightbox_numbers_padding_top && (e["padding-top"] = ae.lightbox_numbers_padding_top + "px"), J.css(e);
    }
  }

  function r(e) {
    if (!ne) return !0;
    var t = {
      slider_image_padding_top: e
    };
    ne.setOptions(t), ne.refreshSlideItems();
  }

  function o(e) {
    if (!$) return !1;
    if (!oe) return !1;
    var t = $.height();
    if (0 == t) return !1;
    if (0 == $.is(":visible")) return !1;
    var i = t,
        n = oe.getSize(),
        o = n.height;
    t != se.topPanelHeight && (i = se.topPanelHeight), o > i && (i = o), t != i && ($.height(i), ne && 0 == ne.isAnimating() && r(i));
  }

  function a(e) {
    var t = {},
        i = ae.lightbox_textpanel_width,
        n = 47,
        r = 40,
        a = e.width - n - r;
    i > a ? (t.textpanel_padding_left = n, t.textpanel_padding_right = r, t.textpanel_title_text_align = "center", t.textpanel_desc_text_align = "center") : (t.textpanel_padding_left = Math.floor((e.width - i) / 2), t.textpanel_padding_right = t.textpanel_padding_left, t.textpanel_title_text_align = "left", t.textpanel_desc_text_align = "left", ae.lightbox_textpanel_title_text_align && (t.textpanel_title_text_align = ae.lightbox_textpanel_desc_text_align), ae.lightbox_textpanel_desc_text_align && (t.textpanel_desc_text_align = ae.lightbox_textpanel_desc_text_align)), oe.setOptions(t), oe.refresh(!0, !0), o("positionTextPanelWide"), oe.positionPanel();
  }

  function s() {
    return $ ? void $.hide() : !1;
  }

  function l() {
    return $ ? void $.show() : !1;
  }

  function u(e) {
    if (0 == se.isOpened) return !1;
    if (!oe) return !1;
    if (!ne) return !1;
    var t = re.getElementSize(V),
        i = oe.getSize();
    if (0 == i.width || i.height > 120) return !1;
    if (!e) var n = ne.getSlideImage(),
        e = re.getElementSize(n);
    if (0 == e.height || 0 == e.width) return !1;
    var r = e.bottom + i.height;
    if (r < t.height) return !1;
    var o = ne.getOptions(),
        a = i.height;

    if (a != o.slider_image_padding_bottom) {
      var s = {
        slider_image_padding_bottom: a
      };
      if (0 == ne.isAnimating()) return ne.setOptions(s), ne.refreshSlideItems(), !0;
    }

    return !1;
  }

  function d(e, t) {
    if (!e) var i = ne.getSlideImage(),
        e = re.getElementSize(i);
    se.textPanelTop = e.bottom, t === !0 && oe.positionPanel(se.textPanelTop, se.textPanelLeft);
  }

  function _(e) {
    var t = (re.getElementSize(V), ne.getSlideImage()),
        i = re.getElementSize(t);
    if (0 == i.width) return !1;
    se.textPanelLeft = i.left, se.textPanelTop = i.bottom;
    var n = i.width;

    if (J) {
      var r = re.getElementSize(J);
      n -= r.width;
      var o = i.right - r.width;
      re.placeElement(J, o, se.textPanelTop);
    }

    oe && (oe.show(), oe.refresh(!0, !0, n), d(i));
    var a = u(i);
    0 == a && (se.positionFrom = "handleCompactTextpanelSizes", oe && (oe.positionPanel(se.textPanelTop, se.textPanelLeft), e === !0 && (e(), j())));
  }

  function g() {
    if (0 == ne.isCurrentSlideType("image")) return !0;
    var e = 1 == ne.isCurrentImageInPlace();
    return e;
  }

  function c(e, t) {
    if (0 == se.isArrowsInside) return !1;
    if (!Z) return !1;
    var i = g();
    if (Z.show(), q.show(), se.positionFrom = "positionArrowsInside", 1 == se.isArrowsOnHoverMode && 1 == i && 0 == y() && I(!0), 0 == i) var n = re.getElementRelativePos(Z, "left", ae.lightbox_arrows_offset),
        r = re.getElementRelativePos(Z, "middle"),
        o = re.getElementRelativePos(q, "right", ae.lightbox_arrows_offset),
        a = r;else var s = ne.getSlideImage(),
        l = re.getElementSize(s),
        n = (re.getElementSize(ne.getElement()), re.getElementRelativePos(Z, "left", 0, s) + l.left + ae.lightbox_arrows_inside_offset),
        r = re.getElementRelativePos(Z, "middle", 0, s) + l.top,
        o = re.getElementRelativePos(Z, "right", 0, s) + l.left - ae.lightbox_arrows_inside_offset,
        a = r;

    if (t === !0) {
      var u = {
        left: n,
        top: r
      },
          d = {
        left: o,
        top: a
      };
      Z.stop().animate(u, {
        duration: se.fadeDuration
      }), q.stop().animate(d, {
        duration: se.fadeDuration
      });
    } else Z.stop(), q.stop(), re.placeElement(Z, n, r), re.placeElement(q, o, a);

    1 == e && E(t);
  }

  function h(e, t) {
    se.positionFrom = null;
    var i = g(),
        n = 2,
        r = re.getElementRelativePos(K, "right", 2, V);
    if (0 == i) var o = n,
        a = r;else {
      var s = ne.getSlideImage(),
          l = re.getElementSize(s),
          u = re.getElementSize(ne.getElement()),
          d = re.getElementSize(K);
      u.top == u.height && (u.top = 0);
      var a = u.left + l.right - d.width / 2 + ae.lightbox_compact_closebutton_offsetx,
          o = u.top + l.top - d.height / 2 - ae.lightbox_compact_closebutton_offsety;
      n > o && (o = n), a > r && (a = r);
    }

    if (t === !0) {
      var _ = {
        left: a,
        top: o
      };
      K.stop().animate(_, {
        duration: se.fadeDuration
      });
    } else K.stop(), re.placeElement(K, a, o);

    e === !0 && T(t);
  }

  function p() {
    K && K.stop().fadeTo(se.fadeDuration, 0), v(), b(), se.positionFrom = "hideCompactElements", 1 == se.isArrowsInside && I();
  }

  function f() {
    K && K.hide(), Z && 1 == se.isArrowsInside && (Z.hide(), q.hide()), J && J.hide(), oe && oe.hide();
  }

  function m() {
    var e = re.getElementSize(V);
    $ && re.setElementSizeAndPosition($, 0, 0, e.width, se.topPanelHeight), Z && 0 == se.isArrowsInside && (1 == ae.lightbox_hide_arrows_onvideoplay && (Z.show(), q.show()), re.placeElement(Z, "left", "middle", ae.lightbox_arrows_offset), re.placeElement(q, "right", "middle", ae.lightbox_arrows_offset)), 0 == se.isCompact && re.placeElement(K, "right", "top", 2, 2), oe && (se.positionFrom = "positionElements", 0 == se.isCompact ? a(e) : (x(), j()));
    var t = e.width,
        i = e.height,
        n = 0,
        r = 0;

    if (ne) {
      if ($) {
        var o = $.height(),
            s = {
          slider_image_padding_top: o
        };
        ne.setOptions(s);
      }

      ne.setSize(t, i), ne.setPosition(r, n);
    }
  }

  function v() {
    oe && oe.getElement().stop().fadeTo(se.fadeDuration, 0);
  }

  function b() {
    J && J.stop().fadeTo(se.fadeDuration, 0);
  }

  function y() {
    if (!se.lastMouseX) return !0;
    var e = {
      pageX: se.lastMouseX,
      pageY: se.lastMouseY
    },
        t = ne.isMouseInsideSlideImage(e);
    return t;
  }

  function I(e, t) {
    return Z ? 1 == se.isArrowsOnHoverMode && t === !1 ? (1 == y(), !0) : void (e === !0 ? (Z.stop().fadeTo(0, 0), q.stop().fadeTo(0, 0)) : (Z.stop().fadeTo(se.fadeDuration, 0), q.stop().fadeTo(se.fadeDuration, 0))) : !1;
  }

  function w() {
    if (!Z) return !0;
    if (0 == Z.is(":visible")) return !0;
    var e = Z.css("opacity");
    return 1 != e ? !0 : !1;
  }

  function E(e, t) {
    return Z ? 1 == se.isArrowsOnHoverMode && t !== !0 && 1 == g() ? !0 : 1 == ne.isSwiping() ? !0 : (e !== !0 && (Z.stop(), q.stop()), Z.fadeTo(se.fadeDuration, 1), void q.fadeTo(se.fadeDuration, 1)) : !1;
  }

  function T(e) {
    e !== !0 && K.stop(), K.fadeTo(se.fadeDuration, 1);
  }

  function S(e) {
    if (!oe) return !1;
    if (!e) var e = ne.getCurrentItem();
    oe.setTextPlain(e.title, e.description);
  }

  function P(e) {
    if (!J) return !1;
    if (!e) var e = ne.getCurrentItem();
    var t = ie.getNumItems(),
        i = e.index + 1;
    J.html(i + " / " + t);
  }

  function x() {
    return oe ? void oe.getElement().show().stop().fadeTo(se.fadeDuration, 1) : !1;
  }

  function j() {
    J && J.stop().fadeTo(se.fadeDuration, 1);
  }

  function C() {
    return 0 == se.isCompact ? !0 : void p();
  }

  function A() {
    if (0 == se.isCompact) return !0;

    if (se.positionFrom = "onZoomChange", h(!1, !0), c(!1, !0), 1 == se.isCompact) {
      var e = ne.isCurrentSlideType("image") && 1 == ne.isCurrentImageInPlace();
      0 == e ? (v(), b()) : (se.positionFrom = "onZoomChange", x(), j());
    }
  }

  function M() {
    if (0 == se.isCompact) return !0;
    se.positionFrom = "onSliderAfterReturn", h(!0), c(!0);
    var e = u();
    0 == e && _(), x(), j();
  }

  function O(e, t) {
    return t = jQuery(t), 0 == se.isCompact ? !0 : 0 == ne.isSlideCurrent(t) ? !0 : (se.positionFrom = "onSliderAfterPutImage", h(!0), c(!0), void _());
  }

  function z() {
    var e = ne.getOptions(),
        t = e.slider_image_padding_top;

    if ($) {
      var i = $.height();
      i != t && r(i);
    }

    if (1 == se.isCompact) {
      if (S(), P(), se.positionFrom = "onSliderTransitionEnd", h(!0), c(!0), 0 == ne.isSlideActionActive()) {
        var n = u();
        0 == n && _();
      }

      x(), j();
    }
  }

  function L(e, t) {
    0 == se.isCompact ? (J && P(t), oe && (S(t), 0 == se.isRightNowOpened && (oe.positionElements(!1), o("onchange"), oe.positionPanel()))) : 0 == ne.isAnimating() && (oe && S(t), J && P(t)), 0 == se.isSliderChangedOnce && (se.isSliderChangedOnce = !0, te.trigger(ee.events.LIGHTBOX_INIT));
  }

  function H(e, t) {
    var i = ne.getSlideType();
    if ("image" != i && 0 == se.isCompact && ne.isSlideActionActive()) return !0;
    var n = ne.isPreloading();
    if (1 == n) return ee.close("slider"), !0;

    if (1 == ae.lightbox_close_on_emptyspace) {
      var r = ne.isMouseInsideSlideImage(t);
      0 == r && ee.close("slider_inside");
    }
  }

  function N() {
    m();
  }

  function k() {
    $ ? s() : J && J.hide(), Z && 1 == ae.lightbox_hide_arrows_onvideoplay && (Z.hide(), q.hide());
  }

  function R() {
    $ ? (l(), o("onStopVideo")) : J && J.show(), Z && 1 == ae.lightbox_hide_arrows_onvideoplay && (Z.show(), q.show());
  }

  function G(e, t, i) {
    var n = !1;

    switch (t) {
      case 27:
        1 == se.isOpened && ee.close("keypress");
        break;

      case 38:
      case 40:
      case 33:
      case 34:
        n = !0;
    }

    1 == se.isOpened && 1 == n && i.preventDefault();
  }

  function D() {
    1 == se.isArrowsOnHoverMode && E(!1, !0);
  }

  function Q(e) {
    se.positionFrom = "hideCompactElements", 1 == se.isArrowsOnHoverMode && 1 == g() && I(!1, !0);
  }

  function W(e) {
    se.lastMouseX = e.pageX, se.lastMouseY = e.pageY;
    var t = w();
    1 == t && y() && 0 == ne.isAnimating() && (se.positionFrom = "onMouseMove", Z && 0 == Z.is(":animated") && E(!1, !0));
  }

  function B(e, t, i, n) {
    if (0 == se.isOpened) return !0;

    switch (ae.gallery_mousewheel_role) {
      default:
      case "zoom":
        var r = ne.getSlideType();
        "image" != r && e.preventDefault();
        break;

      case "none":
        e.preventDefault();
        break;

      case "advance":
        ie.onGalleryMouseWheel(e, t, i, n);
    }
  }

  function F() {
    if (X.on("touchstart", function (e) {
      e.preventDefault();
    }), X.on("touchend", function (e) {
      ee.close("overlay");
    }), re.addClassOnHover(q, "ug-arrow-hover"), re.addClassOnHover(Z, "ug-arrow-hover"), re.addClassOnHover(K), ie.setNextButton(q), ie.setPrevButton(Z), K.click(function () {
      ee.close("button");
    }), U.on(ie.events.ITEM_CHANGE, L), ne) {
      jQuery(ne).on(ne.events.TRANSITION_END, z), jQuery(ne).on(ne.events.CLICK, H);
      var e = ne.getVideoObject();
      jQuery(e).on(e.events.PLAY_START, k), jQuery(e).on(e.events.PLAY_STOP, R), jQuery(ne).on(ne.events.START_DRAG, C), jQuery(ne).on(ne.events.TRANSITION_START, C), jQuery(ne).on(ne.events.AFTER_DRAG_CHANGE, M), jQuery(ne).on(ne.events.AFTER_RETURN, M), jQuery(ne).on(ne.events.AFTER_PUT_IMAGE, O), jQuery(ne).on(ne.events.ZOOM_CHANGE, A), jQuery(ne).on(ne.events.IMAGE_MOUSEENTER, D), jQuery(ne).on(ne.events.IMAGE_MOUSELEAVE, Q);
    }

    jQuery(window).resize(function () {
      return 0 == se.isOpened ? !0 : void re.whenContiniousEventOver("lightbox_resize", N, 100);
    }), U.on(ie.events.GALLERY_KEYPRESS, G), 1 == se.isArrowsOnHoverMode && jQuery(document).bind("mousemove", W), V.on("mousewheel", B);
  }

  function Y() {
    se.isCompact = !1, t(), se.isArrowsInside = !1, se.isArrowsOnHoverMode = !1, ae = jQuery.extend({}, se.originalOptions), ae.lightbox_arrows_position = "sides", ne.setOptions(ae);
  }

  var U,
      V,
      X,
      Z,
      q,
      K,
      J,
      $,
      ee = this,
      te = jQuery(this),
      ie = new UniteGalleryMain(),
      ne = new UGSlider(),
      re = new UGFunctions(),
      oe = new UGTextPanel(),
      ae = {
    lightbox_type: "wide",
    lightbox_show_textpanel: !0,
    lightbox_textpanel_width: 550,
    lightbox_hide_arrows_onvideoplay: !0,
    lightbox_arrows_position: "sides",
    lightbox_arrows_offset: 10,
    lightbox_arrows_inside_offset: 10,
    lightbox_arrows_inside_alwayson: !1,
    lightbox_overlay_color: null,
    lightbox_overlay_opacity: 1,
    lightbox_top_panel_opacity: null,
    lightbox_show_numbers: !0,
    lightbox_numbers_size: null,
    lightbox_numbers_color: null,
    lightbox_numbers_padding_top: null,
    lightbox_numbers_padding_right: null,
    lightbox_compact_closebutton_offsetx: 1,
    lightbox_compact_closebutton_offsety: 1,
    lightbox_close_on_emptyspace: !0
  };
  this.events = {
    LIGHTBOX_INIT: "lightbox_init"
  };
  var se = {
    topPanelHeight: 44,
    initTextPanelHeight: 26,
    isOpened: !1,
    isRightNowOpened: !1,
    putSlider: !0,
    isCompact: !1,
    fadeDuration: 300,
    positionFrom: null,
    textPanelTop: null,
    textPanelLeft: null,
    isArrowsInside: !1,
    isArrowsOnHoverMode: !1,
    lastMouseX: null,
    lastMouseY: null,
    originalOptions: null,
    isSliderChangedOnce: !1,
    isTopPanelEnabled: !0
  },
      le = {
    lightbox_slider_controls_always_on: !0,
    lightbox_slider_enable_bullets: !1,
    lightbox_slider_enable_arrows: !1,
    lightbox_slider_enable_progress_indicator: !1,
    lightbox_slider_enable_play_button: !1,
    lightbox_slider_enable_fullscreen_button: !1,
    lightbox_slider_enable_zoom_panel: !1,
    lightbox_slider_enable_text_panel: !1,
    lightbox_slider_scale_mode_media: "down",
    lightbox_slider_scale_mode: "down",
    lightbox_slider_loader_type: 3,
    lightbox_slider_loader_color: "black",
    lightbox_slider_transition: "fade",
    lightbox_slider_image_padding_top: se.topPanelHeight,
    lightbox_slider_image_padding_bottom: 0,
    lightbox_slider_video_padding_top: 0,
    lightbox_slider_video_padding_bottom: 0,
    lightbox_textpanel_align: "middle",
    lightbox_textpanel_padding_top: 5,
    lightbox_textpanel_padding_bottom: 5,
    slider_video_constantsize: !1,
    lightbox_slider_image_border: !1,
    lightbox_textpanel_enable_title: !0,
    lightbox_textpanel_enable_description: !1,
    lightbox_textpanel_desc_style_as_title: !0,
    lightbox_textpanel_enable_bg: !1,
    video_enable_closebutton: !1,
    lightbox_slider_video_enable_closebutton: !1,
    video_youtube_showinfo: !1,
    lightbox_slider_enable_links: !1
  },
      ue = {
    lightbox_overlay_opacity: .6,
    lightbox_slider_image_border: !0,
    lightbox_slider_image_shadow: !0,
    lightbox_slider_image_padding_top: 30,
    lightbox_slider_image_padding_bottom: 30,
    slider_video_constantsize: !0,
    lightbox_textpanel_align: "bottom",
    lightbox_textpanel_title_text_align: "left",
    lightbox_textpanel_desc_text_align: "left",
    lightbox_textpanel_padding_left: 10,
    lightbox_textpanel_padding_right: 10
  };
  this.destroy = function () {
    if (jQuery(document).unbind("mousemove"), X.off("touchstart"), X.off("touchend"), K.off("click"), U.off(ie.events.ITEM_CHANGE), ne) {
      jQuery(ne).off(ne.events.TRANSITION_END), jQuery(ne).off(ne.events.CLICK), jQuery(ne).off(ne.events.START_DRAG), jQuery(ne).off(ne.events.TRANSITION_START), jQuery(ne).off(ne.events.AFTER_DRAG_CHANGE), jQuery(ne).off(ne.events.AFTER_RETURN);
      var e = ne.getVideoObject();
      jQuery(e).off(e.events.PLAY_START), jQuery(e).off(e.events.PLAY_STOP), jQuery(ne).on(ne.events.IMAGE_MOUSEENTER, D), jQuery(ne).on(ne.events.IMAGE_MOUSELEAVE, Q), ne.destroy();
    }

    jQuery(window).unbind("resize"), U.off(ie.events.GALLERY_KEYPRESS, G), V.off("mousewheel"), V.remove();
  }, this.open = function (e) {
    var t = ie.getItem(e);

    if (se.isOpened = !0, se.isRightNowOpened = !0, setTimeout(function () {
      se.isRightNowOpened = !1;
    }, 100), ne && ne.setItem(t, "lightbox_open"), oe && oe.setTextPlain(t.title, t.description), X.stop().fadeTo(0, 0), V.show(), V.fadeTo(0, 1), X.stop().fadeTo(se.fadeDuration, ae.lightbox_overlay_opacity), m(), 1 == se.isCompact) {
      var i = ne.isPreloading();
      1 == i ? f() : 1 == se.isArrowsInside && (Z.hide(), q.hide());
    }

    ne && ne.startSlideAction(), U.trigger(ie.events.OPEN_LIGHTBOX, t);
  }, this.close = function (e) {
    se.isOpened = !1, 1 == se.isCompact && p(), ne && ne.stopSlideAction();
    var t = ne.getSlideType();
    "image" != t ? V.hide() : V.fadeTo(se.fadeDuration, 0, function () {
      V.hide();
    }), U.trigger(ie.events.CLOSE_LIGHTBOX);
  }, this.init = function (t, i) {
    e(t, i);
  }, this.putHtml = function () {
    var e = ie.isSmallWindow();
    e && 1 == se.isCompact && Y(), i();
  }, this.run = function () {
    n(), ne && ne.run(), F();
  };
}

function UGCarousel() {
  function e(e, t) {
    g_objects = e.getObjects(), W = e, H = jQuery(e), N = g_objects.g_objWrapper, k = g_objects.g_arrItems, U = jQuery.extend(U, t), F.setFixedMode(), F.setApproveClickFunction(L), F.init(e, U), Y = F.getObjThumbs(), U = F.getOptions(), V.initTileWidth = U.tile_width, V.initTileHeight = U.tile_height, V.tileWidth = U.tile_width;
  }

  function t(e) {
    if (!e) var e = N;
    var t = "<div class='ug-carousel-wrapper'><div class='ug-carousel-inner'></div></div>";
    N.append(t), R = N.children(".ug-carousel-wrapper"), G = R.children(".ug-carousel-inner"), F.setHtml(G), Y.getThumbs().fadeTo(0, 1);
  }

  function i(e, t) {
    if (!t) var t = V.initTileHeight / V.initTileWidth * e;
    V.tileWidth = e;
    var i = {
      tile_width: e,
      tile_height: t
    };
    F.setOptions(i), U.tile_width = e, U.tile_height = t, F.resizeAllTiles(e), m(!0);
  }

  function n() {
    if (null === V.carouselMaxWidth) throw new Error("The carousel width not set");

    if (V.tileWidth < V.initTileWidth) {
      var e = V.carouselMaxWidth - 2 * U.carousel_padding;
      e > V.initTileWidth && (e = V.initTileWidth), i(e);
      var t = B.getNumItemsInSpace(V.carouselMaxWidth, e, U.carousel_space_between_tiles);
    } else {
      var t = B.getNumItemsInSpace(V.carouselMaxWidth, V.tileWidth, U.carousel_space_between_tiles);

      if (0 >= t) {
        t = 1;
        var e = V.carouselMaxWidth - 2 * U.carousel_padding;
        i(e);
      }
    }

    var n = B.getSpaceByNumItems(t, V.tileWidth, U.carousel_space_between_tiles);
    n += 2 * U.carousel_padding, R.width(n), 1 == V.isFirstTimeRun ? (z(), F.run(), jQuery.each(k, function (e, t) {
      t.objThumbWrapper.data("index", e), N.trigger(V.eventSizeChange, [t.objThumbWrapper, !0]), t.objTileOriginal = t.objThumbWrapper.clone(!0, !0);
    }), m(!0), 1 == U.carousel_autoplay && D.startAutoplay()) : (1 == U.carousel_autoplay && D.pauseAutoplay(), w(0, !1), 1 == U.carousel_autoplay && D.startAutoplay()), P(), V.isFirstTimeRun = !1;
  }

  function r() {
    return B.getElementSize(G).left;
  }

  function o(e) {
    return B.getMousePosition(e).pageX;
  }

  function a() {
    var e = G.children(".ug-thumb-wrapper");
    return e;
  }

  function s(e) {
    var t = B.getNumItemsInSpace(e, V.tileWidth, U.carousel_space_between_tiles);
    return t;
  }

  function l() {
    return a().length;
  }

  function u(e) {
    v(e);
    var t = a(),
        i = jQuery(t[e]);
    return i;
  }

  function d() {
    return G.children(".ug-thumb-wrapper").first();
  }

  function _() {
    return G.children(".ug-thumb-wrapper").last();
  }

  function g(e, t, i) {
    var n = e.data("index");
    if (void 0 == n) throw new Error("every tile should have index!");

    for (var r = [], o = 0; t > o; o++) {
      if ("prev" == i) var a = W.getPrevItem(n, !0);else var a = W.getNextItem(n, !0);
      if (!a) throw new Error("the item to add is empty");
      var s = a.objTileOriginal.clone(!0, !0);
      n = a.index, s.addClass("cloned"), r.push(s);
    }

    return r;
  }

  function c() {
    var e = B.getElementSize(R),
        t = B.getElementSize(G),
        i = t.width - e.width + t.left,
        n = V.sideSpace - i;
    return n;
  }

  function h() {
    var e = -r(),
        t = V.sideSpace - e;
    return t;
  }

  function p() {
    var e = B.getElementSize(R);
    return e.width;
  }

  function f() {
    var e = p(),
        t = s(e);
    return t;
  }

  function m(e) {
    if (!e) var e = !1;
    var t,
        i = a(),
        n = 0,
        r = 0;
    return jQuery.each(i, function (e, o) {
      o = jQuery(o), B.placeElement(o, n, 0);
      var a = B.getElementSize(o);
      n += a.width + U.carousel_space_between_tiles, r = Math.max(r, a.height), e == i.length - 1 && (t = a.right);
    }), G.width(t), r += 2 * U.carousel_padding, e === !0 && (G.height(r), R.height(r)), w(V.numCurrent, !1), t;
  }

  function v(e) {
    if (e > a().length - 1) throw new Error("Wrogn tile number: " + e);
  }

  function b(e, t) {
    if ("left" == t) var i = d();else var i = _();
    var n = "left" == t ? "prev" : "next",
        r = g(i, e, n);
    jQuery.each(r, function (e, i) {
      "left" == t ? G.prepend(i) : G.append(i), N.trigger(V.eventSizeChange, i), F.loadTileImage(i);
    });
  }

  function y(e, t) {
    v(n);

    for (var i = a(), n = i.length, r = 0; e > r; r++) {
      "left" == t ? jQuery(i[r]).remove() : jQuery(i[n - 1 - r]).remove();
    }
  }

  function I(e) {
    var t = {
      left: e + "px"
    };
    G.css(t);
  }

  function w(e, t, i) {
    if (void 0 === t) {
      var t = !0;
      if (G.is(":animated")) return !0;
    }

    var n = u(e),
        r = B.getElementSize(n),
        o = -r.left + U.carousel_padding,
        a = {
      left: o + "px"
    };

    if (t === !0) {
      var s = U.carousel_scroll_duration,
          l = U.carousel_scroll_easing;
      i === !0 && (s = V.scrollShortDuration, l = V.scrollShortEasing), G.stop(!0).animate(a, {
        duration: s,
        easing: l,
        queue: !1,
        complete: function complete() {
          V.numCurrent = e, S(!0);
        }
      });
    } else V.numCurrent = e, G.css(a);
  }

  function E() {
    var e = -r(),
        t = s(e),
        i = B.getElementSize(u(t)).left,
        n = B.getElementSize(u(t + 1)).left;
    return Math.abs(i - e) < Math.abs(n - e) ? t : t + 1;
  }

  function T() {
    var e = E();
    w(e, !0, !0);
  }

  function S() {
    var e = h(),
        t = c(),
        i = 0,
        n = 0,
        r = 0,
        o = 0,
        a = l();
    if (e > V.spaceActionSize) i = s(e), b(i, "left"), V.numCurrent += i;else if (e < -V.spaceActionSize) {
      var r = s(Math.abs(e));
      y(r, "left"), V.numCurrent -= r;
    }
    if (t > V.spaceActionSize ? (n = s(t), b(n, "right")) : t < -V.spaceActionSize && (o = s(Math.abs(t)), y(o, "right")), o > a) throw new Error("Can't remove more then num tiles");
    var u = !1;
    return (i || n || r || o) && (m(), u = !0), u;
  }

  function P(e) {
    B.placeElement(G, 0, U.carousel_padding), S();
  }

  function x() {
    "left" == U.carousel_autoplay_direction ? D.scrollRight(1) : D.scrollLeft(1);
  }

  function j(e) {
    return 1 == V.touchActive ? !0 : (V.touchActive = !0, D.pauseAutoplay(), V.startTime = jQuery.now(), V.startMousePos = o(e), V.startInnerPos = r(), V.lastTime = V.startTime, V.lastMousePos = V.startMousePos, void B.storeEventData(e, V.storedEventID));
  }

  function C(e) {
    if (0 == V.touchActive) return !0;
    B.updateStoredEventData(e, V.storedEventID), e.preventDefault();
    var t = null;
    if (1 == U.carousel_vertical_scroll_ondrag && (t = B.handleScrollTop(V.storedEventID)), "vert" === t) return !0;
    V.lastMousePos = o(e);
    var i = V.lastMousePos - V.startMousePos,
        n = V.startInnerPos + i,
        r = i > 0 ? "prev" : "next",
        a = B.getElementSize(G).width;
    n > 0 && "prev" == r && (n /= 3), -a > n && "next" == r && (n = V.startInnerPos + i / 3), I(n);
  }

  function A(e) {
    return 0 == V.touchActive ? !0 : (V.touchActive = !1, T(), void D.unpauseAutoplay());
  }

  function M(e) {
    return 0 == U.carousel_autoplay_pause_onhover ? !0 : void (1 == V.isPlayMode && 0 == V.isPaused && D.pauseAutoplay());
  }

  function O(e) {
    return 0 == U.carousel_autoplay_pause_onhover ? !0 : void D.unpauseAutoplay();
  }

  function z() {
    F.initEvents(), R.bind("mousedown touchstart", j), jQuery("body").bind("mousemove touchmove", C), jQuery(window).add("body").bind("mouseup touchend", A), R.hover(M, O);
  }

  function L() {
    var e = V.lastTime - V.startTime,
        t = Math.abs(V.lastMousePos - V.startMousePos);
    return e > 300 ? !1 : t > 30 ? !1 : !0;
  }

  var H,
      N,
      k,
      R,
      G,
      D = this,
      Q = jQuery(this),
      W = new UniteGalleryMain(),
      B = new UGFunctions(),
      F = new UGTileDesign(),
      Y = new UGThumbsGeneral(),
      U = {
    carousel_padding: 8,
    carousel_space_between_tiles: 20,
    carousel_navigation_numtiles: 3,
    carousel_scroll_duration: 500,
    carousel_scroll_easing: "easeOutCubic",
    carousel_autoplay: !0,
    carousel_autoplay_timeout: 3e3,
    carousel_autoplay_direction: "right",
    carousel_autoplay_pause_onhover: !0,
    carousel_vertical_scroll_ondrag: !1
  };
  this.events = {
    START_PLAY: "carousel_start_play",
    PAUSE_PLAY: "carousel_pause_play",
    STOP_PLAY: "carousel_stop_play"
  };
  var V = {
    eventSizeChange: "thumb_size_change",
    isFirstTimeRun: !0,
    carouselMaxWidth: null,
    tileWidth: 0,
    initTileWidth: 0,
    initTileHeight: 0,
    sideSpace: 1500,
    spaceActionSize: 500,
    numCurrent: 0,
    touchActive: !1,
    startInnerPos: 0,
    lastTime: 0,
    startTime: 0,
    startMousePos: 0,
    lastMousePos: 0,
    scrollShortDuration: 200,
    scrollShortEasing: "easeOutQuad",
    handle: null,
    isPlayMode: !1,
    isPaused: !1,
    storedEventID: "carousel"
  };
  this.startAutoplay = function () {
    V.isPlayMode = !0, V.isPaused = !1, Q.trigger(D.events.START_PLAY), V.handle && clearInterval(V.handle), V.handle = setInterval(x, U.carousel_autoplay_timeout);
  }, this.unpauseAutoplay = function () {
    return 0 == V.isPlayMode ? !0 : 0 == V.isPaused ? !0 : void D.startAutoplay();
  }, this.pauseAutoplay = function () {
    return 0 == V.isPlayMode ? !0 : (V.isPaused = !0, V.handle && clearInterval(V.handle), void Q.trigger(D.events.PAUSE_PLAY));
  }, this.stopAutoplay = function () {
    return 0 == V.isPlayMode ? !0 : (V.isPaused = !1, V.isPlayMode = !1, V.handle && clearInterval(V.handle), void Q.trigger(D.events.STOP_PLAY));
  }, this.destroy = function () {
    V.handle && clearInterval(V.handle), Q.off(D.events.START_PLAY), Q.off(D.events.STOP_PLAY), R.unbind("mousedown"), R.unbind("touchstart"), jQuery("body").unbind("mousemove"), jQuery("body").unbind("touchmove"), jQuery(window).add("body").unbind("mouseup").unbind("touchend"), R.off("mouseenter").off("mouseleave"), F.destroy();
  }, this.init = function (t, i, n) {
    n && this.setMaxWidth(n), e(t, i);
  }, this.setMaxWidth = function (e) {
    V.carouselMaxWidth = e;
  }, this.setHtml = function (e) {
    t(e);
  }, this.getElement = function () {
    return R;
  }, this.getObjTileDesign = function () {
    return F;
  }, this.getEstimatedHeight = function () {
    var e = U.tile_height + 2 * U.carousel_padding;
    return e;
  }, this.run = function () {
    n();
  }, this.scrollRight = function (e) {
    if (!e || "object" == _typeof(e)) var e = U.carousel_navigation_numtiles;
    var t = f();
    e > t && (e = t);
    var i = V.numCurrent - e;
    0 >= i && (i = 0), w(i);
  }, this.scrollLeft = function (e) {
    if (!e || "object" == _typeof(e)) var e = U.carousel_navigation_numtiles;
    var t = f();
    e > t && (e = t);
    var i = l(),
        n = V.numCurrent + e;
    n >= i && (n = i - 1), w(n);
  }, this.setScrollLeftButton = function (e) {
    B.setButtonMobileReady(e), B.setButtonOnClick(e, D.scrollLeft);
  }, this.setScrollRightButton = function (e) {
    B.setButtonMobileReady(e), B.setButtonOnClick(e, D.scrollRight);
  }, this.setPlayPauseButton = function (e) {
    B.setButtonMobileReady(e), 1 == V.isPlayMode && 0 == V.isPaused && e.addClass("ug-pause-icon"), Q.on(D.events.START_PLAY, function () {
      e.addClass("ug-pause-icon");
    }), Q.on(D.events.STOP_PLAY, function () {
      e.removeClass("ug-pause-icon");
    }), B.setButtonOnClick(e, function () {
      0 == V.isPlayMode || 1 == V.isPaused ? D.startAutoplay() : D.stopAutoplay();
    });
  };
}

function UGTabs() {
  function e(e, t) {
    u = e, a = jQuery(u), d = jQuery.extend(d, t), "select" == d.tabs_type ? l = jQuery(d.tabs_container) : s = jQuery(d.tabs_container + " .ug-tab");
  }

  function t() {
    o();
  }

  function i(e) {
    u.requestNewItems(e);
  }

  function n() {
    var e = d.tabs_class_selected,
        t = jQuery(this);
    if (t.hasClass(e)) return !0;
    s.not(t).removeClass(e), t.addClass(e);
    var n = t.data("catid");
    return n ? void i(n) : !0;
  }

  function r() {
    var e = jQuery(this),
        t = e.val();
    return t ? void i(t) : !0;
  }

  function o() {
    "select" == d.tabs_type ? l.change(r) : s.click(n);
  }

  var a,
      s,
      l,
      u = (jQuery(this), new UniteGalleryMain()),
      d = (new UGFunctions(), {
    tabs_type: "tabs",
    tabs_container: "#ug_tabs",
    tabs_class_selected: "ug-tab-selected"
  });
  this.events = {}, this.destroy = function () {
    l && l.off("change"), s && s.off("click");
  }, this.init = function (t, i) {
    e(t, i);
  }, this.run = function () {
    t();
  };
}

function UG_API(e) {
  function t(e) {
    var t = {
      index: e.index,
      title: e.title,
      description: e.description,
      urlImage: e.urlImage,
      urlThumb: e.urlThumb
    },
        i = e.objThumbImage.data();

    for (var n in i) {
      switch (n) {
        case "image":
        case "description":
          continue;
      }

      t[n] = i[n];
    }

    return t;
  }

  var i,
      n = this,
      r = (jQuery(n), new UniteGalleryMain()),
      o = [];
  r = e, i = jQuery(e), this.events = {
    API_INIT_FUNCTIONS: "api_init",
    API_ON_EVENT: "api_on_event"
  }, this.on = function (e, a, s) {
    switch (s !== !0 && o.push({
      event: e,
      func: a
    }), e) {
      case "item_change":
        i.on(r.events.ITEM_CHANGE, function () {
          var e = r.getSelectedItem(),
              i = t(e);
          a(i.index, i);
        });
        break;

      case "resize":
        i.on(r.events.SIZE_CHANGE, a);
        break;

      case "enter_fullscreen":
        i.on(r.events.ENTER_FULLSCREEN, a);
        break;

      case "exit_fullscreen":
        i.on(r.events.EXIT_FULLSCREEN, a);
        break;

      case "play":
        i.on(r.events.START_PLAY, a);
        break;

      case "stop":
        i.on(r.events.STOP_PLAY, a);
        break;

      case "pause":
        i.on(r.events.PAUSE_PLAYING, a);
        break;

      case "continue":
        i.on(r.events.CONTINUE_PLAYING, a);
        break;

      case "open_lightbox":
        i.on(r.events.OPEN_LIGHTBOX, a);
        break;

      case "close_lightbox":
        i.on(r.events.CLOSE_LIGHTBOX, a);
        break;

      default:
        console && console.log("wrong api event: " + e);
    }

    i.trigger(n.events.API_ON_EVENT, [e, a]);
  }, this.play = function () {
    r.startPlayMode();
  }, this.stop = function () {
    r.stopPlayMode();
  }, this.togglePlay = function () {
    r.togglePlayMode();
  }, this.enterFullscreen = function () {
    r.toFullScreen();
  }, this.exitFullscreen = function () {
    r.exitFullScreen();
  }, this.toggleFullscreen = function () {
    r.toggleFullscreen();
  }, this.resetZoom = function () {
    var e = r.getObjSlider();
    return e ? void e.zoomBack() : !1;
  }, this.zoomIn = function () {
    var e = r.getObjSlider();
    return e ? void e.zoomIn() : !1;
  }, this.zoomOut = function () {
    var e = r.getObjSlider();
    return e ? void e.zoomOut() : !1;
  }, this.nextItem = function () {
    r.nextItem();
  }, this.prevItem = function () {
    r.prevItem();
  }, this.selectItem = function (e) {
    r.selectItem(e);
  }, this.resize = function (e, t) {
    t ? r.resize(e, t) : r.resize(e);
  }, this.getItem = function (e) {
    var i = r.getItem(e),
        n = t(i);
    return n;
  }, this.getNumItems = function () {
    var e = r.getNumItems();
    return e;
  }, this.reloadGallery = function (e) {
    if (!e) var e = {};
    r.run(null, e), o.map(function (e) {
      n.on(e.event, e.func, !0);
    });
  }, this.destroy = function () {
    r.destroy();
  }, i.trigger(n.events.API_INIT_FUNCTIONS, n);
}

function UGLoadMore() {
  function e() {
    return o = jQuery("#" + _.loadmore_container), 0 == o.length ? !1 : (a = o.find(".ug-loadmore-button"), 0 == a.length ? !1 : (s = o.find(".ug-loadmore-loader"), 0 == s.length ? !1 : (l = o.find(".ug-loadmore-error"), 0 == l.length ? !1 : void (d.isInited = !0))));
  }

  function t() {
    o.show();
  }

  function i() {
    a.hide(), s.show();
    var e = {
      numitems: u.getNumItems()
    };
    u.ajaxRequest("front_loadmore", e, function (e) {
      s.hide();
      var t = e.html_items,
          i = e.show_loadmore;
      1 == i ? (a.blur().show(), s.hide()) : o.hide(), u.addItems(t);
    }, function (e) {
      e = "Ajax Error!" + e, s.hide(), l.show(), l.html(e);
    });
  }

  function n() {
    u.onEvent("tiles_first_placed", t), a.click(i);
  }

  var r,
      o,
      a,
      s,
      l,
      u = (jQuery(this), new UniteGalleryMain()),
      d = (new UGFunctions(), {
    isInited: !1
  }),
      _ = {
    loadmore_container: "ug_loadmore_wrapper"
  };
  this.events = {}, this.destroy = function () {
    return 0 == d.isInited ? !1 : void 0;
  }, this.init = function (t, i) {
    return u = t, r = jQuery(u), _ = jQuery.extend(_, i), e(), 0 == d.isInited ? (trace("load more not inited, something is wrong"), !1) : void n();
  };
}

var g_ugFunctions = new UGFunctions();
!function (e) {
  "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? module.exports = e : e(jQuery);
}(function (e) {
  function t(t) {
    var a = t || window.event,
        s = l.call(arguments, 1),
        u = 0,
        d = 0,
        _ = 0,
        g = 0;

    if (t = e.event.fix(a), t.type = "mousewheel", "detail" in a && (_ = -1 * a.detail), "wheelDelta" in a && (_ = a.wheelDelta), "wheelDeltaY" in a && (_ = a.wheelDeltaY), "wheelDeltaX" in a && (d = -1 * a.wheelDeltaX), "axis" in a && a.axis === a.HORIZONTAL_AXIS && (d = -1 * _, _ = 0), u = 0 === _ ? d : _, "deltaY" in a && (_ = -1 * a.deltaY, u = _), "deltaX" in a && (d = a.deltaX, 0 === _ && (u = -1 * d)), 0 !== _ || 0 !== d) {
      if (1 === a.deltaMode) {
        var c = e.data(this, "mousewheel-line-height");
        u *= c, _ *= c, d *= c;
      } else if (2 === a.deltaMode) {
        var h = e.data(this, "mousewheel-page-height");
        u *= h, _ *= h, d *= h;
      }

      return g = Math.max(Math.abs(_), Math.abs(d)), (!o || o > g) && (o = g, n(a, g) && (o /= 40)), n(a, g) && (u /= 40, d /= 40, _ /= 40), u = Math[u >= 1 ? "floor" : "ceil"](u / o), d = Math[d >= 1 ? "floor" : "ceil"](d / o), _ = Math[_ >= 1 ? "floor" : "ceil"](_ / o), t.deltaX = d, t.deltaY = _, t.deltaFactor = o, t.deltaMode = 0, s.unshift(t, u, d, _), r && clearTimeout(r), r = setTimeout(i, 200), (e.event.dispatch || e.event.handle).apply(this, s);
    }
  }

  function i() {
    o = null;
  }

  function n(e, t) {
    return d.settings.adjustOldDeltas && "mousewheel" === e.type && t % 120 === 0;
  }

  var r,
      o,
      a = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
      s = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
      l = Array.prototype.slice;
  if (e.event.fixHooks) for (var u = a.length; u;) {
    e.event.fixHooks[a[--u]] = e.event.mouseHooks;
  }
  var d = e.event.special.mousewheel = {
    version: "3.1.9",
    setup: function setup() {
      if (this.addEventListener) for (var i = s.length; i;) {
        this.addEventListener(s[--i], t, !1);
      } else this.onmousewheel = t;
      e.data(this, "mousewheel-line-height", d.getLineHeight(this)), e.data(this, "mousewheel-page-height", d.getPageHeight(this));
    },
    teardown: function teardown() {
      if (this.removeEventListener) for (var e = s.length; e;) {
        this.removeEventListener(s[--e], t, !1);
      } else this.onmousewheel = null;
    },
    getLineHeight: function getLineHeight(t) {
      return parseInt(e(t)["offsetParent" in e.fn ? "offsetParent" : "parent"]().css("fontSize"), 10);
    },
    getPageHeight: function getPageHeight(t) {
      return e(t).height();
    },
    settings: {
      adjustOldDeltas: !0
    }
  };
  e.fn.extend({
    mousewheel: function mousewheel(e) {
      return e ? this.bind("mousewheel", e) : this.trigger("mousewheel");
    },
    unmousewheel: function unmousewheel(e) {
      return this.unbind("mousewheel", e);
    }
  });
}), function (e) {
  "function" == typeof define && define.amd ? define(["jquery"], function (t) {
    return e(t);
  }) : "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && "object" == _typeof(module.exports) ? exports = e(require("jquery")) : e(jQuery);
}(function (e) {
  function t(e) {
    var t = 7.5625,
        i = 2.75;
    return 1 / i > e ? t * e * e : 2 / i > e ? t * (e -= 1.5 / i) * e + .75 : 2.5 / i > e ? t * (e -= 2.25 / i) * e + .9375 : t * (e -= 2.625 / i) * e + .984375;
  }

  e.easing.jswing = e.easing.swing;

  var i = Math.pow,
      n = Math.sqrt,
      r = Math.sin,
      o = Math.cos,
      a = Math.PI,
      s = 1.70158,
      l = 1.525 * s,
      u = s + 1,
      d = 2 * a / 3,
      _ = 2 * a / 4.5;

  e.extend(e.easing, {
    def: "easeOutQuad",
    swing: function swing(t) {
      return e.easing[e.easing.def](t);
    },
    easeInQuad: function easeInQuad(e) {
      return e * e;
    },
    easeOutQuad: function easeOutQuad(e) {
      return 1 - (1 - e) * (1 - e);
    },
    easeInOutQuad: function easeInOutQuad(e) {
      return .5 > e ? 2 * e * e : 1 - i(-2 * e + 2, 2) / 2;
    },
    easeInCubic: function easeInCubic(e) {
      return e * e * e;
    },
    easeOutCubic: function easeOutCubic(e) {
      return 1 - i(1 - e, 3);
    },
    easeInOutCubic: function easeInOutCubic(e) {
      return .5 > e ? 4 * e * e * e : 1 - i(-2 * e + 2, 3) / 2;
    },
    easeInQuart: function easeInQuart(e) {
      return e * e * e * e;
    },
    easeOutQuart: function easeOutQuart(e) {
      return 1 - i(1 - e, 4);
    },
    easeInOutQuart: function easeInOutQuart(e) {
      return .5 > e ? 8 * e * e * e * e : 1 - i(-2 * e + 2, 4) / 2;
    },
    easeInQuint: function easeInQuint(e) {
      return e * e * e * e * e;
    },
    easeOutQuint: function easeOutQuint(e) {
      return 1 - i(1 - e, 5);
    },
    easeInOutQuint: function easeInOutQuint(e) {
      return .5 > e ? 16 * e * e * e * e * e : 1 - i(-2 * e + 2, 5) / 2;
    },
    easeInSine: function easeInSine(e) {
      return 1 - o(e * a / 2);
    },
    easeOutSine: function easeOutSine(e) {
      return r(e * a / 2);
    },
    easeInOutSine: function easeInOutSine(e) {
      return -(o(a * e) - 1) / 2;
    },
    easeInExpo: function easeInExpo(e) {
      return 0 === e ? 0 : i(2, 10 * e - 10);
    },
    easeOutExpo: function easeOutExpo(e) {
      return 1 === e ? 1 : 1 - i(2, -10 * e);
    },
    easeInOutExpo: function easeInOutExpo(e) {
      return 0 === e ? 0 : 1 === e ? 1 : .5 > e ? i(2, 20 * e - 10) / 2 : (2 - i(2, -20 * e + 10)) / 2;
    },
    easeInCirc: function easeInCirc(e) {
      return 1 - n(1 - i(e, 2));
    },
    easeOutCirc: function easeOutCirc(e) {
      return n(1 - i(e - 1, 2));
    },
    easeInOutCirc: function easeInOutCirc(e) {
      return .5 > e ? (1 - n(1 - i(2 * e, 2))) / 2 : (n(1 - i(-2 * e + 2, 2)) + 1) / 2;
    },
    easeInElastic: function easeInElastic(e) {
      return 0 === e ? 0 : 1 === e ? 1 : -i(2, 10 * e - 10) * r((10 * e - 10.75) * d);
    },
    easeOutElastic: function easeOutElastic(e) {
      return 0 === e ? 0 : 1 === e ? 1 : i(2, -10 * e) * r((10 * e - .75) * d) + 1;
    },
    easeInOutElastic: function easeInOutElastic(e) {
      return 0 === e ? 0 : 1 === e ? 1 : .5 > e ? -(i(2, 20 * e - 10) * r((20 * e - 11.125) * _)) / 2 : i(2, -20 * e + 10) * r((20 * e - 11.125) * _) / 2 + 1;
    },
    easeInBack: function easeInBack(e) {
      return u * e * e * e - s * e * e;
    },
    easeOutBack: function easeOutBack(e) {
      return 1 + u * i(e - 1, 3) + s * i(e - 1, 2);
    },
    easeInOutBack: function easeInOutBack(e) {
      return .5 > e ? i(2 * e, 2) * (2 * (l + 1) * e - l) / 2 : (i(2 * e - 2, 2) * ((l + 1) * (2 * e - 2) + l) + 2) / 2;
    },
    easeInBounce: function easeInBounce(e) {
      return 1 - t(1 - e);
    },
    easeOutBounce: t,
    easeInOutBounce: function easeInOutBounce(e) {
      return .5 > e ? (1 - t(1 - 2 * e)) / 2 : (1 + t(2 * e - 1)) / 2;
    }
  });
}), !function (e, t) {
  function i(e, t, i) {
    var n = _[t.type] || {};
    return null == e ? i || !t.def ? null : t.def : (e = n.floor ? ~~e : parseFloat(e), isNaN(e) ? t.def : n.mod ? (e + n.mod) % n.mod : 0 > e ? 0 : n.max < e ? n.max : e);
  }

  function n(t) {
    var i = u(),
        n = i._rgba = [];
    return t = t.toLowerCase(), h(l, function (e, r) {
      var o,
          a = r.re.exec(t),
          s = a && r.parse(a),
          l = r.space || "rgba";
      return s ? (o = i[l](s), i[d[l].cache] = o[d[l].cache], n = i._rgba = o._rgba, !1) : void 0;
    }), n.length ? ("0,0,0,0" === n.join() && e.extend(n, o.transparent), i) : o[t];
  }

  function r(e, t, i) {
    return i = (i + 1) % 1, 1 > 6 * i ? e + (t - e) * i * 6 : 1 > 2 * i ? t : 2 > 3 * i ? e + (t - e) * (2 / 3 - i) * 6 : e;
  }

  if ("undefined" == typeof e.cssHooks) return !1;

  var o,
      a = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
      s = /^([\-+])=\s*(\d+\.?\d*)/,
      l = [{
    re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
    parse: function parse(e) {
      return [e[1], e[2], e[3], e[4]];
    }
  }, {
    re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
    parse: function parse(e) {
      return [2.55 * e[1], 2.55 * e[2], 2.55 * e[3], e[4]];
    }
  }, {
    re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
    parse: function parse(e) {
      return [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)];
    }
  }, {
    re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
    parse: function parse(e) {
      return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16)];
    }
  }, {
    re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
    space: "hsla",
    parse: function parse(e) {
      return [e[1], e[2] / 100, e[3] / 100, e[4]];
    }
  }],
      u = e.Color = function (t, i, n, r) {
    return new e.Color.fn.parse(t, i, n, r);
  },
      d = {
    rgba: {
      props: {
        red: {
          idx: 0,
          type: "byte"
        },
        green: {
          idx: 1,
          type: "byte"
        },
        blue: {
          idx: 2,
          type: "byte"
        }
      }
    },
    hsla: {
      props: {
        hue: {
          idx: 0,
          type: "degrees"
        },
        saturation: {
          idx: 1,
          type: "percent"
        },
        lightness: {
          idx: 2,
          type: "percent"
        }
      }
    }
  },
      _ = {
    "byte": {
      floor: !0,
      max: 255
    },
    percent: {
      max: 1
    },
    degrees: {
      mod: 360,
      floor: !0
    }
  },
      g = u.support = {},
      c = e("<p>")[0],
      h = e.each;

  c.style.cssText = "background-color:rgba(1,1,1,.5)", g.rgba = c.style.backgroundColor.indexOf("rgba") > -1, h(d, function (e, t) {
    t.cache = "_" + e, t.props.alpha = {
      idx: 3,
      type: "percent",
      def: 1
    };
  }), u.fn = e.extend(u.prototype, {
    parse: function parse(r, a, s, l) {
      if (r === t) return this._rgba = [null, null, null, null], this;
      (r.jquery || r.nodeType) && (r = e(r).css(a), a = t);

      var _ = this,
          g = e.type(r),
          c = this._rgba = [];

      return a !== t && (r = [r, a, s, l], g = "array"), "string" === g ? this.parse(n(r) || o._default) : "array" === g ? (h(d.rgba.props, function (e, t) {
        c[t.idx] = i(r[t.idx], t);
      }), this) : "object" === g ? (r instanceof u ? h(d, function (e, t) {
        r[t.cache] && (_[t.cache] = r[t.cache].slice());
      }) : h(d, function (t, n) {
        var o = n.cache;
        h(n.props, function (e, t) {
          if (!_[o] && n.to) {
            if ("alpha" === e || null == r[e]) return;
            _[o] = n.to(_._rgba);
          }

          _[o][t.idx] = i(r[e], t, !0);
        }), _[o] && e.inArray(null, _[o].slice(0, 3)) < 0 && (_[o][3] = 1, n.from && (_._rgba = n.from(_[o])));
      }), this) : void 0;
    },
    is: function is(e) {
      var t = u(e),
          i = !0,
          n = this;
      return h(d, function (e, r) {
        var o,
            a = t[r.cache];
        return a && (o = n[r.cache] || r.to && r.to(n._rgba) || [], h(r.props, function (e, t) {
          return null != a[t.idx] ? i = a[t.idx] === o[t.idx] : void 0;
        })), i;
      }), i;
    },
    _space: function _space() {
      var e = [],
          t = this;
      return h(d, function (i, n) {
        t[n.cache] && e.push(i);
      }), e.pop();
    },
    transition: function transition(e, t) {
      var n = u(e),
          r = n._space(),
          o = d[r],
          a = 0 === this.alpha() ? u("transparent") : this,
          s = a[o.cache] || o.to(a._rgba),
          l = s.slice();

      return n = n[o.cache], h(o.props, function (e, r) {
        var o = r.idx,
            a = s[o],
            u = n[o],
            d = _[r.type] || {};
        null !== u && (null === a ? l[o] = u : (d.mod && (u - a > d.mod / 2 ? a += d.mod : a - u > d.mod / 2 && (a -= d.mod)), l[o] = i((u - a) * t + a, r)));
      }), this[r](l);
    },
    blend: function blend(t) {
      if (1 === this._rgba[3]) return this;

      var i = this._rgba.slice(),
          n = i.pop(),
          r = u(t)._rgba;

      return u(e.map(i, function (e, t) {
        return (1 - n) * r[t] + n * e;
      }));
    },
    toRgbaString: function toRgbaString() {
      var t = "rgba(",
          i = e.map(this._rgba, function (e, t) {
        return null == e ? t > 2 ? 1 : 0 : e;
      });
      return 1 === i[3] && (i.pop(), t = "rgb("), t + i.join() + ")";
    },
    toHslaString: function toHslaString() {
      var t = "hsla(",
          i = e.map(this.hsla(), function (e, t) {
        return null == e && (e = t > 2 ? 1 : 0), t && 3 > t && (e = Math.round(100 * e) + "%"), e;
      });
      return 1 === i[3] && (i.pop(), t = "hsl("), t + i.join() + ")";
    },
    toHexString: function toHexString(t) {
      var i = this._rgba.slice(),
          n = i.pop();

      return t && i.push(~~(255 * n)), "#" + e.map(i, function (e) {
        return e = (e || 0).toString(16), 1 === e.length ? "0" + e : e;
      }).join("");
    },
    toString: function toString() {
      return 0 === this._rgba[3] ? "transparent" : this.toRgbaString();
    }
  }), u.fn.parse.prototype = u.fn, d.hsla.to = function (e) {
    if (null == e[0] || null == e[1] || null == e[2]) return [null, null, null, e[3]];

    var t,
        i,
        n = e[0] / 255,
        r = e[1] / 255,
        o = e[2] / 255,
        a = e[3],
        s = Math.max(n, r, o),
        l = Math.min(n, r, o),
        u = s - l,
        d = s + l,
        _ = .5 * d;

    return t = l === s ? 0 : n === s ? 60 * (r - o) / u + 360 : r === s ? 60 * (o - n) / u + 120 : 60 * (n - r) / u + 240, i = 0 === u ? 0 : .5 >= _ ? u / d : u / (2 - d), [Math.round(t) % 360, i, _, null == a ? 1 : a];
  }, d.hsla.from = function (e) {
    if (null == e[0] || null == e[1] || null == e[2]) return [null, null, null, e[3]];
    var t = e[0] / 360,
        i = e[1],
        n = e[2],
        o = e[3],
        a = .5 >= n ? n * (1 + i) : n + i - n * i,
        s = 2 * n - a;
    return [Math.round(255 * r(s, a, t + 1 / 3)), Math.round(255 * r(s, a, t)), Math.round(255 * r(s, a, t - 1 / 3)), o];
  }, h(d, function (n, r) {
    var o = r.props,
        a = r.cache,
        l = r.to,
        d = r.from;
    u.fn[n] = function (n) {
      if (l && !this[a] && (this[a] = l(this._rgba)), n === t) return this[a].slice();

      var r,
          s = e.type(n),
          _ = "array" === s || "object" === s ? n : arguments,
          g = this[a].slice();

      return h(o, function (e, t) {
        var n = _["object" === s ? e : t.idx];
        null == n && (n = g[t.idx]), g[t.idx] = i(n, t);
      }), d ? (r = u(d(g)), r[a] = g, r) : u(g);
    }, h(o, function (t, i) {
      u.fn[t] || (u.fn[t] = function (r) {
        var o,
            a = e.type(r),
            l = "alpha" === t ? this._hsla ? "hsla" : "rgba" : n,
            u = this[l](),
            d = u[i.idx];
        return "undefined" === a ? d : ("function" === a && (r = r.call(this, d), a = e.type(r)), null == r && i.empty ? this : ("string" === a && (o = s.exec(r), o && (r = d + parseFloat(o[2]) * ("+" === o[1] ? 1 : -1))), u[i.idx] = r, this[l](u)));
      });
    });
  }), u.hook = function (t) {
    var i = t.split(" ");
    h(i, function (t, i) {
      e.cssHooks[i] = {
        set: function set(t, r) {
          var o,
              a,
              s = "";

          if ("transparent" !== r && ("string" !== e.type(r) || (o = n(r)))) {
            if (r = u(o || r), !g.rgba && 1 !== r._rgba[3]) {
              for (a = "backgroundColor" === i ? t.parentNode : t; ("" === s || "transparent" === s) && a && a.style;) {
                try {
                  s = e.css(a, "backgroundColor"), a = a.parentNode;
                } catch (l) {}
              }

              r = r.blend(s && "transparent" !== s ? s : "_default");
            }

            r = r.toRgbaString();
          }

          try {
            t.style[i] = r;
          } catch (l) {}
        }
      }, e.fx.step[i] = function (t) {
        t.colorInit || (t.start = u(t.elem, i), t.end = u(t.end), t.colorInit = !0), e.cssHooks[i].set(t.elem, t.start.transition(t.end, t.pos));
      };
    });
  }, u.hook(a), e.cssHooks.borderColor = {
    expand: function expand(e) {
      var t = {};
      return h(["Top", "Right", "Bottom", "Left"], function (i, n) {
        t["border" + n + "Color"] = e;
      }), t;
    }
  }, o = e.Color.names = {
    aqua: "#00ffff",
    black: "#000000",
    blue: "#0000ff",
    fuchsia: "#ff00ff",
    gray: "#808080",
    green: "#008000",
    lime: "#00ff00",
    maroon: "#800000",
    navy: "#000080",
    olive: "#808000",
    purple: "#800080",
    red: "#ff0000",
    silver: "#c0c0c0",
    teal: "#008080",
    white: "#ffffff",
    yellow: "#ffff00",
    transparent: [null, null, null, 0],
    _default: "#ffffff"
  };
}(jQuery), !function (e) {
  function t() {
    try {
      var i = this === document ? e(this) : e(this).contents();
    } catch (n) {
      return !1;
    }

    i.mousemove(function (t) {
      e.mlp = {
        x: t.pageX,
        y: t.pageY
      };
    }), i.find("iframe").on("load", t);
  }

  e.mlp = {
    x: 0,
    y: 0
  }, e(t), e.fn.ismouseover = function () {
    var t = !1;
    return this.eq(0).each(function () {
      var i = e(this).is("iframe") ? e(this).contents().find("body") : e(this),
          n = i.offset();
      t = n.left <= e.mlp.x && n.left + i.outerWidth() > e.mlp.x && n.top <= e.mlp.y && n.top + i.outerHeight() > e.mlp.y;
    }), t;
  };
}(jQuery);
var g_ugYoutubeAPI = new UGYoutubeAPI(),
    g_ugVimeoAPI = new UGVimeoAPI(),
    g_ugHtml5MediaAPI = new UGHtml5MediaAPI(),
    g_ugSoundCloudAPI = new UGSoundCloudAPI(),
    g_ugWistiaAPI = new UGWistiaAPI();

jQuery.fn.unitegallery = function (e) {
  var t = jQuery(this),
      i = "#" + t.attr("id");
  if (!e) var e = {};
  var n = new UniteGalleryMain();
  n.run(i, e);
  var r = new UG_API(n);
  return r;
};
},{"jquery":"../node_modules/jquery/dist/jquery.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/unitegallery.min.js"], null)
//# sourceMappingURL=/unitegallery.min.d3181154.js.map