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
    let viewport = this.get('viewport');
    return viewport && $(viewport);
  }),
  viewportTop: computed('viewportElement', function() {
    let element = this.get('viewportElement');
    let top = 0;
    if (element) {
      top = element.offset().top;
    }
    return top;
  }),

  _startViewportWatcher() {
    let scrollWatcher = this.get('scrollWatcher');
    let element = this.get('viewportElement');
    let watcher;
    if (element) {
      watcher = scrollWatcher.startWatcher(element);
    } else {
      watcher = scrollWatcher.startWatcher(window);
    }
    this.set('viewportWatcher', watcher);
  },
  _stopViewportWatcher() {
    let viewportWatcher  = this.get('viewportWatcher');
    let scrollWatcher = this.get('scrollWatcher');
    scrollWatcher.stopWatcher(viewportWatcher);
    this.set('viewportWatcher', null);
  },

  didInsertElement() {
    this._super(...arguments);
    this._startViewportWatcher();
    let element = this.$();
    let wrapperElement = this.get('wrapperElement');
    let viewportTop = this.get('viewportTop');
    let initialTop = element.offset().top - viewportTop;
    let initialBottom = wrapperElement.offset().top + wrapperElement[0].offsetHeight - viewportTop;
    this.set('initialTop', initialTop);
    this.set('initialBottom', initialBottom);
  },
  willDestroyElement() {
    this._super(...arguments);
    this._stopViewportWatcher();
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
