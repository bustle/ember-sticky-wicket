import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';
import config from '../../config/environment';

let { elementHeights: {
  aboveWrapper: aboveWrapperHeight,
  wrapper: wrapperHeight,
  aboveStickyItem: aboveStickyItemHeight,
  stickyItem: stickyItemHeight
} } = config;

module('Acceptance | sticky item', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

function scrollTo(element, scrollTop) {
  $(element).scrollTop(scrollTop);
  $(element).trigger('scroll');
}

test('visiting /sticky-item', function(assert) {
  visit('/sticky-item');

  andThen(function() {
    let viewport = $('#viewport');
    let item = $('.__ember-sticky-wrapper--sticky-item');

    let itemTop = item.offset().top - viewport.offset().top;
    assert.equal(itemTop, aboveWrapperHeight + aboveStickyItemHeight,
                 'initial offset of item is normal');

    scrollTo(viewport, aboveWrapperHeight - 10);

    itemTop = item.offset().top - viewport.offset().top;
    assert.equal(itemTop, aboveStickyItemHeight + 10,
                 'adjusted offset of item is normal');

    scrollTo(viewport, aboveWrapperHeight);

    itemTop = item.offset().top - viewport.offset().top;
    assert.equal(itemTop, aboveStickyItemHeight,
                 'adjusted offset of item is normal');

    scrollTo(viewport, aboveWrapperHeight + aboveStickyItemHeight - 10);

    itemTop = item.offset().top - viewport.offset().top;
    assert.equal(itemTop, 10,
                 'adjusted offset of item is normal');

    scrollTo(viewport,
             aboveWrapperHeight + aboveStickyItemHeight + 0.5 * stickyItemHeight);

    itemTop = item.offset().top - viewport.offset().top;
    assert.equal(itemTop, 0, 'adjusted offset is at top of viewport');

    scrollTo(viewport,
             aboveWrapperHeight + wrapperHeight - stickyItemHeight - 10);

    itemTop = item.offset().top - viewport.offset().top;
    assert.equal(itemTop, 0, 'adjusted offset stays at top of viewport');

    scrollTo(viewport,
             aboveWrapperHeight + wrapperHeight - stickyItemHeight);

    itemTop = item.offset().top - viewport.offset().top;
    assert.equal(itemTop, 0, 'adjusted offset at top of viewport');

    scrollTo(viewport,
             aboveWrapperHeight + wrapperHeight - stickyItemHeight + 10);

    itemTop = item.offset().top - viewport.offset().top;
    assert.equal(itemTop, -10, 'adjusted offset moves partially out of sight');

    scrollTo(viewport, aboveWrapperHeight + wrapperHeight);

    itemTop = item.offset().top - viewport.offset().top;
    assert.ok(itemTop < -stickyItemHeight, 'adjusted offset fully out of sight');

    scrollTo(viewport,
             aboveWrapperHeight + wrapperHeight + 100);

    itemTop = item.offset().top - viewport.offset().top;
    assert.ok(itemTop < -stickyItemHeight, 'adjusted offset stays out of sight');
  });
});
