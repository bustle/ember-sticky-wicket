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
  scrollTop: null
});

export default Ember.Service.extend({
  init() {
    this._super(...arguments);
    this._watchers = new Map();
  },
  startWatcher(selector) {
    let element = elementFromSelector(selector);
    let tuple = this._watchers.get(element) || [];
    let [watcher, count] = tuple;
    if (!watcher) {
      watcher = this._buildWatcher(element);
      count = 1;
      this._watchers.set(element, [watcher, count]);
    } else {
      count++;
      tuple[1] = count;
    }
    return watcher;
  },
  stopWatcher(selector) {
    let element = elementFromSelector(selector);
    let tuple = this._watchers.get(element);
    if (tuple) {
      let [watcher, count] = tuple;
      count--;
      if (count === 0) {
        this._teardownWatcher(element, watcher);
      } else {
        tuple[1] = count;
      }
    }
  },
  _buildWatcher(element) {
    let watcher = Watcher.create({});
    $(element).on(SCROLL_EVENT, (event) => {
      run(() => {
        watcher.set('scrollTop', event.target.scrollTop);
      });
    });
    return watcher;
  },
  _teardownWatcher(element, watcher) {
    $(element).off(SCROLL_EVENT);
    watcher.destroy();
  }
});
