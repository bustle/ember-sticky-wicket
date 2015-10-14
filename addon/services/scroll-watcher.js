import Ember from 'ember';

let { $, run, Object: EObject } = Ember;

function elementFromSelector(selector) {
  let selected = $(selector);
  if (selected.length === 0) {
    throw new Error(`Selector ${selector} not matched`);
  } else if (selected.length > 1) {
    throw new Error(`Selector ${selector} matched more than one element, must match one`);
  }
  return selected[0];
}

const SCROLL_EVENT = 'scroll.scroll-watcher';

const Watcher = EObject.extend({
  scrollTop: null,
  count: 0
});

export default Ember.Service.extend({
  init() {
    this._super(...arguments);
    this._watchers = new Map();
  },
  startWatcher(selector) {
    let element = elementFromSelector(selector);
    let watcher = this._watchers.get(element);
    if (!watcher) {
      watcher = this._buildWatcher(element);
      this._watchers.set(element, watcher);
    } else {
      watcher.incrementProperty('count');
    }
    return watcher;
  },
  stopWatcher(selector) {
    let element = elementFromSelector(selector);
    let watcher = this._watchers.get(element);
    if (watcher) {
      let count = watcher.decrementProperty('count');
      if (count === 0) {
        this._teardownWatcher(element, watcher);
      }
    }
  },
  _buildWatcher(element) {
    let watcher = Watcher.create({
      count: 1
    });
    $(element).on(SCROLL_EVENT, (event) => {
      run(() => {
        let element = event.target;
        if (element === window.document) {
          element = window;
        }
        let scrollTop = $(element).scrollTop();
        watcher.set('scrollTop', scrollTop);
      });
    });
    return watcher;
  },
  _teardownWatcher(element, watcher) {
    $(element).off(SCROLL_EVENT);
    watcher.destroy();
  }
});
