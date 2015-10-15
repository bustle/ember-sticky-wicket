import Ember from 'ember';
import layout from '../templates/components/sticky-item';

let { computed, $, inject } = Ember;

export default Ember.Component.extend({
  layout,

  scrollWatcher: inject.service(),

  classNameBindings: ['isFixed:__ember-sticky-wrapper--sticky-item'],

  // when true, will insert a placeholder div before this component to
  // ensure that the flow does not change when the sticky item is absolutely
  // position.
  addPlaceholder: false,

  wrapperElement: computed('wrapper', function() {
    return $(this.get('wrapper'));
  }),

  // when there is no 'viewport' property, the window is used as the viewport
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
    let viewportTop = this.get('viewportTop');
    let initialTop = element.offset().top - viewportTop;
    this.set('initialTop', initialTop);
  },

  willDestroyElement() {
    this._super(...arguments);
    this._stopViewportWatcher();
    this.removePlaceholder();
  },

  isFixed: Ember.observer('viewportWatcher.scrollTop', function() {
    if (!this.$()) {
      return false;
    }

    let wrapperElement = this.get('wrapperElement');
    let viewportTop = this.get('viewportTop');
    let initialTop = this.get('initialTop');
    let initialBottom = initialTop + wrapperElement[0].offsetHeight;

    let scrollTop = this.get('viewportWatcher.scrollTop');

    if (scrollTop >= initialTop && scrollTop < initialBottom) {
      let element = this.$();
      scrollTop = Math.min(scrollTop, initialBottom - element.height()); 
      this.$().css({
        width: '100%',
        position: 'absolute',
        top: scrollTop
      });
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
    if (!this.get('addPlaceholder')) {
      return;
    }
    if (this._placeholder) {
      return;
    }
    this._placeholder = `__ember-sticky-wicket__placeholder-${Ember.uuid()}`;
    let height = this.$().height();
    let placeholderDiv = `<div id="${this._placeholder}" style="height:${height}px;"></div>`;
    this.$().before(placeholderDiv);
  },

  removePlaceholder() {
    if (!this._placeholder) {
      return;
    }

    Ember.$(`#${this._placeholder}`).remove();
    this._placeholder = false;
  }
});
