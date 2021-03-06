'use strict';
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
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var react_1 = __importDefault(require('react'));
var addons_1 = __importDefault(require('@storybook/addons'));
var constants_1 = require('./constants');
var Tool_1 = require('./Tool');
/**
 * Returns the current state of storybook's dark-mode
 */
function useDarkMode() {
  var _a = __read(
      react_1['default'].useState(Tool_1.store().current === 'dark'),
      2
    ),
    isDark = _a[0],
    setDark = _a[1];
  react_1['default'].useEffect(function() {
    var chan = addons_1['default'].getChannel();
    chan.on(constants_1.DARK_MODE_EVENT_NAME, setDark);
    return function() {
      return chan.off(constants_1.DARK_MODE_EVENT_NAME, setDark);
    };
  }, []);
  return isDark;
}
exports.useDarkMode = useDarkMode;
__export(require('./constants'));
//# sourceMappingURL=index.js.map
