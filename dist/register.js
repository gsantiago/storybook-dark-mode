'use strict';
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
exports.__esModule = true;
var addons_1 = __importStar(require('@storybook/addons'));
var React = __importStar(require('react'));
var Tool_1 = __importStar(require('./Tool'));
var currentStore = Tool_1.store();
addons_1['default'].setConfig({
  theme:
    currentStore[
      currentStore.current || (Tool_1.prefersDark.matches && 'dark') || 'light'
    ]
});
addons_1['default'].register('storybook/dark-mode', function(api) {
  addons_1['default'].add('storybook/dark-mode', {
    title: 'dark mode',
    type: addons_1.types.TOOL,
    match: function(_a) {
      var viewMode = _a.viewMode;
      return viewMode === 'story' || viewMode === 'docs';
    },
    render: function() {
      return React.createElement(Tool_1['default'], { api: api });
    }
  });
});
//# sourceMappingURL=register.js.map
