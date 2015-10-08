import Ember from 'ember';
import layout from '../templates/components/sticky-wrapper';

let { computed, inject } = Ember;

export default Ember.Component.extend({
  layout,
  scrollTop: computed.alias('watcher.scrollTop'),
  scrollWatcher: inject.service(),
  willInsertElement() {
    let scrollWatcher = this.get('scrollWatcher');
    let watcher = scrollWatcher.startWatcher(this.$()[0]);
    this.set('watcher', watcher);
    this.set('element', this.$()[0]);
  },
  willDestroyElement() {
    this.set('element', null);
    let scrollWatcher = this.get('scrollWatcher');
    scrollWatcher.stopWatcher(this.$()[0]);
    this.set('watcher', null);
  }
});
