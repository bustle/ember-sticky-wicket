import Ember from 'ember';
import layout from '../templates/components/sticky-item';

let { computed, $, inject } = Ember;

export default Ember.Component.extend({
  layout,
  scrollWatcher: inject.service(),
  classNameBindings: ['isFixed:__ember-sticky-wrapper--sticky-item'],
  wrapperElement: computed('wrapper', function() {
    return $(this.get('wrapper'));
  }),
  viewportElement: computed('viewport', function() {
    return $(this.get('viewport'));
  }),

  didInsertElement() {
    let viewportElement = this.get('viewportElement');
    let scrollWatcher = this.get('scrollWatcher');
    let watcher = scrollWatcher.startWatcher(viewportElement);

    let element = this.$();
    let wrapperElement = this.get('wrapperElement');
    let viewportTop = viewportElement.offset().top;
    let initialTop = element.offset().top - viewportTop;
    let initialBottom = wrapperElement.offset().top + wrapperElement[0].offsetHeight - viewportTop;
    this.set('initialTop', initialTop);
    this.set('initialBottom', initialBottom);

    this.set('viewportWatcher', watcher);
  },
  willDestroyElement() {
    let viewportElement = this.get('viewportElement');
    let scrollWatcher = this.get('scrollWatcher');
    scrollWatcher.stopWatcher(viewportElement);
    this.set('viewportWatcher', null);
  },

  isFixed: Ember.observer('viewportWatcher.scrollTop', function() {
    if (!this.$()) {
      return false;
    }

    let initialTop = this.get('initialTop');
    let initialBottom = this.get('initialBottom');

    let scrollTop = this.get('viewportWatcher.scrollTop');

    if (scrollTop >= initialTop && scrollTop < initialBottom) {
      let element = this.$();
      let height = element[0].offsetHeight;
      scrollTop = Math.min(scrollTop, initialBottom - height);
      this.$().css({
        width: '100%',
        position: 'absolute',
        top: scrollTop
      });
    } else {
      this.$().css({
        width: 'auto',
        position: 'initial',
        top: 'auto'
      });
    }


    /*

    if (top  <= viewportTop) {

      let scrollTop = this.get('viewportWatcher.scrollTop');

      let lastViableTop = wrapperBottom + scrollTop - elementHeight;
      if (lastViableTop < scrollTop) {
        scrollTop = lastViableTop;
      }
      console.log('scrollTop', scrollTop);

      this.$().css({
        width: '100%',
        position: 'absolute',
        top: scrollTop
      });
    } else {
      this.$().css({
        width: 'auto',
        position: 'initial',
        top: 'auto'
      });
    }
   */
  })
});
