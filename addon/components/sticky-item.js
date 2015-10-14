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
      let elementTop = initialBottom-height;
      let newTop = Math.min(scrollTop, elementTop);
      this.$().css({
        width: '100%',
        position: 'absolute',
        top: newTop
      });
      if (elementTop < scrollTop) {
        let percentage = (scrollTop - elementTop) / height;
        let deg = percentage * 90;
        this.$().css({
          transform: `rotateX(${deg}deg)`,
          'transform-origin': 'bottom'
        });
      }
      this.updatePlaceholder();
    } else {
      this.$().css({
        width: 'auto',
        position: 'initial',
        top: 'auto'
      });
      this.removePlaceholder();
    }
  }),

  updatePlaceholder() {
    if (this._placeholder) {
      return;
    }
    this._placeholder = Ember.guidFor(this);
    let height = this.$().height();
    this.$().before(`<div id="${this._placeholder}" style="height:${height}px;"></div>`);
  },

  removePlaceholder() {
    if (this._placeholder) {
      Ember.$(`#${this._placeholder}`).remove();
      this._placeholder = false;
    }
  }
});
