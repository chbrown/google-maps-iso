var googleVersion = '3.18';
var script = null;
var google = null;
var loading = false;
var callbacks = [];
var onLoadEvents = [];
var originalCreateLoaderMethod = null;
exports.URL = 'https://maps.googleapis.com/maps/api/js';
exports.KEY = null;
exports.LIBRARIES = [];
exports.CLIENT = null;
exports.CHANNEL = null;
exports.LANGUAGE = null;
exports.REGION = null;
exports.VERSION = googleVersion;
exports.WINDOW_CALLBACK_NAME = '__google_maps_api_provider_initializator__';
exports._googleMockApiObject = {};

function load(fn) {
  if (google === null) {
    if (loading === true) {
      if (fn) {
        callbacks.push(fn);
      }
    } else {
      loading = true;

      window[exports.WINDOW_CALLBACK_NAME] = function() {
        ready(fn);
      };

      createLoader();
    }
  } else if (fn) {
    fn(google);
  }
}
exports.load = load;

function createLoader() {
  script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = createUrl();

  document.body.appendChild(script);
}
exports.createLoader = createLoader;


function isLoaded() {
  return google !== null;
}
exports.isLoaded = isLoaded;


function createUrl() {
  var url = exports.URL;

  url += '?callback=' + exports.WINDOW_CALLBACK_NAME;

  if (exports.KEY) {
    url += '&key=' + exports.KEY;
  }
  if (exports.LIBRARIES.length > 0) {
    url += '&libraries=' + exports.LIBRARIES.join(',');
  }
  if (exports.CLIENT) {
    url += '&client=' + exports.CLIENT + '&v=' + exports.VERSION;
  }
  if (exports.CHANNEL) {
    url += '&channel=' + exports.CHANNEL;
  }
  if (exports.LANGUAGE) {
    url += '&language=' + exports.LANGUAGE;
  }
  if (exports.REGION) {
    url += '&region=' + exports.REGION;
  }

  return url;
}
exports.createUrl = createUrl;


function release(fn) {
  var release = function() {
    exports.KEY = null;
    exports.LIBRARIES = [];
    exports.CLIENT = null;
    exports.CHANNEL = null;
    exports.LANGUAGE = null;
    exports.REGION = null;
    exports.VERSION = googleVersion;

    google = null;
    loading = false;
    callbacks = [];
    onLoadEvents = [];

    if (typeof window.google !== 'undefined') {
      delete window.google;
    }

    if (typeof window[exports.WINDOW_CALLBACK_NAME] !== 'undefined') {
      delete window[exports.WINDOW_CALLBACK_NAME];
    }

    if (originalCreateLoaderMethod !== null) {
      exports.createLoader = originalCreateLoaderMethod;
      originalCreateLoaderMethod = null;
    }

    if (script !== null) {
      script.parentElement.removeChild(script);
      script = null;
    }

    if (fn) {
      fn();
    }
  };

  if (loading) {
    load(function() {
      release();
    });
  } else {
    release();
  }
}
exports.release = release;


function onLoad(fn) {
  onLoadEvents.push(fn);
}
exports.onLoad = onLoad;


function makeMock() {
  originalCreateLoaderMethod = createLoader;

  exports.createLoader = function() {
    window.google = exports._googleMockApiObject;
    window[exports.WINDOW_CALLBACK_NAME]();
  };
}
exports.makeMock = makeMock;

function ready(fn) {
  var i;

  loading = false;

  if (google === null) {
    google = window.google;
  }

  for (i = 0; i < onLoadEvents.length; i++) {
    onLoadEvents[i](google);
  }

  if (fn) {
    fn(google);
  }

  for (i = 0; i < callbacks.length; i++) {
    callbacks[i](google);
  }

  callbacks = [];
}
