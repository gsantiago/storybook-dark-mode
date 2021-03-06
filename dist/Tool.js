'use strict';
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __rest =
  (this && this.__rest) ||
  function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __read =
  (this && this.__read) ||
  function(o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var React = __importStar(require('react'));
var theming_1 = require('@storybook/theming');
var components_1 = require('@storybook/components');
var core_events_1 = require('@storybook/core-events');
var api_1 = require('@storybook/api');
var fast_deep_equal_1 = __importDefault(require('fast-deep-equal'));
var constants_1 = require('./constants');
var Sun_1 = __importDefault(require('./icons/Sun'));
var Moon_1 = __importDefault(require('./icons/Moon'));
var modes = ['light', 'dark'];
var STORAGE_KEY = 'sb-addon-themes-3';
exports.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
var defaultParams = {
  dark: theming_1.themes.dark,
  darkClass: 'dark',
  light: theming_1.themes.light,
  lightClass: 'light',
  stylePreview: false
};
/** Persist the dark mode settings in localStorage */
exports.updateStore = function(newStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
};
/** Add the light/dark class to an element */
var toggleDarkClass = function(el, _a) {
  var current = _a.current,
    _b = _a.darkClass,
    darkClass = _b === void 0 ? defaultParams.darkClass : _b,
    _c = _a.lightClass,
    lightClass = _c === void 0 ? defaultParams.lightClass : _c;
  if (current === 'dark') {
    el.classList.add(darkClass);
    el.classList.remove(lightClass);
  } else {
    el.classList.add(lightClass);
    el.classList.remove(darkClass);
  }
};
/** Update the preview iframe class */
var updatePreview = function(store) {
  var _a, _b;
  var iframe = document.getElementById('storybook-preview-iframe');
  if (!iframe) {
    return;
  }
  var iframeDocument =
    iframe.contentDocument ||
    ((_a = iframe.contentWindow) === null || _a === void 0
      ? void 0
      : _a.document);
  var body = (_b = iframeDocument) === null || _b === void 0 ? void 0 : _b.body;
  toggleDarkClass(body, store);
};
/** Update the manager iframe class */
var updateManager = function(store) {
  var manager = document.querySelector('body');
  if (!manager) {
    return;
  }
  toggleDarkClass(manager, store);
};
/** Update changed dark mode settings and persist to localStorage  */
exports.store = function(userTheme) {
  if (userTheme === void 0) {
    userTheme = {};
  }
  var storedItem = window.localStorage.getItem(STORAGE_KEY);
  if (typeof storedItem === 'string') {
    var stored = JSON.parse(storedItem);
    if (userTheme) {
      if (
        userTheme.dark &&
        !fast_deep_equal_1['default'](stored.dark, userTheme.dark)
      ) {
        stored.dark = userTheme.dark;
        exports.updateStore(stored);
      }
      if (
        userTheme.light &&
        !fast_deep_equal_1['default'](stored.light, userTheme.light)
      ) {
        stored.light = userTheme.light;
        exports.updateStore(stored);
      }
    }
    return stored;
  }
  return __assign(__assign({}, defaultParams), userTheme);
};
/** A toolbar icon to toggle between dark and light themes in storybook */
var DarkMode = function(_a) {
  var api = _a.api;
  var _b = __read(React.useState(exports.prefersDark.matches), 2),
    isDark = _b[0],
    setDark = _b[1];
  var darkModeParams = api_1.useParameter('darkMode', defaultParams);
  var defaultMode = darkModeParams.current,
    stylePreview = darkModeParams.stylePreview,
    params = __rest(
      darkModeParams,
      // Save custom themes on init
      ['current', 'stylePreview']
    );
  // Save custom themes on init
  var initialMode = React.useRef(exports.store(params).current);
  /** Set the theme in storybook, update the local state, and emit an event */
  var setMode = React.useCallback(
    function(mode) {
      var currentStore = exports.store();
      api.setOptions({ theme: currentStore[mode] });
      setDark(mode === 'dark');
      api.getChannel().emit(constants_1.DARK_MODE_EVENT_NAME, mode === 'dark');
      updateManager(currentStore);
      if (stylePreview) {
        updatePreview(currentStore);
      }
    },
    [api, stylePreview]
  );
  /** Update the theme settings in localStorage, react, and storybook */
  var updateMode = React.useCallback(
    function(mode) {
      var currentStore = exports.store();
      var current =
        mode || (currentStore.current === 'dark' ? 'light' : 'dark');
      exports.updateStore(
        __assign(__assign({}, currentStore), { current: current })
      );
      setMode(current);
    },
    [setMode]
  );
  /** Update the theme based on the color preference */
  function prefersDarkUpdate(event) {
    updateMode(event.matches ? 'dark' : 'light');
  }
  /** Render the current theme */
  var renderTheme = React.useCallback(
    function() {
      var _a = exports.store().current,
        current = _a === void 0 ? 'light' : _a;
      setMode(current);
    },
    [setMode]
  );
  /** When storybook params change update the stored themes */
  React.useEffect(
    function() {
      var currentStore = exports.store();
      exports.updateStore(__assign(__assign({}, currentStore), darkModeParams));
      renderTheme();
    },
    [darkModeParams, renderTheme]
  );
  React.useEffect(function() {
    var channel = api.getChannel();
    channel.on(core_events_1.STORY_CHANGED, renderTheme);
    channel.on(core_events_1.SET_STORIES, renderTheme);
    channel.on(core_events_1.DOCS_RENDERED, renderTheme);
    channel.on('DARK_MODE_UPDATE', updateMode);
    exports.prefersDark.addListener(prefersDarkUpdate);
    return function() {
      channel.removeListener(core_events_1.STORY_CHANGED, renderTheme);
      channel.removeListener(core_events_1.SET_STORIES, renderTheme);
      channel.removeListener(core_events_1.DOCS_RENDERED, renderTheme);
      channel.removeListener('DARK_MODE_UPDATE', updateMode);
      exports.prefersDark.removeListener(prefersDarkUpdate);
    };
  });
  // Storybook's first render doesn't have the global user params loaded so we
  // need the effect to run whenever defaultMode is updated
  React.useEffect(
    function() {
      // If a users has set the mode this is respected
      if (initialMode.current) {
        return;
      }
      if (defaultMode) {
        updateMode(defaultMode);
      } else if (exports.prefersDark.matches) {
        updateMode('dark');
      }
    },
    [defaultMode, updateMode]
  );
  return React.createElement(
    components_1.IconButton,
    {
      key: 'dark-mode',
      active: isDark,
      title: isDark
        ? 'Change theme to light mode'
        : 'Change theme to dark mode',
      onClick: function() {
        return updateMode();
      }
    },
    isDark
      ? React.createElement(Sun_1['default'], null)
      : React.createElement(Moon_1['default'], null)
  );
};
exports['default'] = DarkMode;
//# sourceMappingURL=Tool.js.map
