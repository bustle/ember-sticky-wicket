import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

module('Acceptance | sticky item', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /sticky-item', function(assert) {
  visit('/sticky-item');

  andThen(function() {
    let viewport = $('#viewport');
    let item = $('.__ember-sticky-wrapper--sticky-item');

    let itemTop = item.offset().top - viewport.offset().top;
    assert.equal(itemTop, 500, 'initial offset of item is normal');

    viewport.scrollTop(100);

    itemTop = item.offset().top - viewport.offset().top;
    assert.equal(itemTop, 400, 'adjusted offset of item is normal');

    viewport.scrollTop(200);

    itemTop = item.offset().top - viewport.offset().top;
    assert.equal(itemTop, 300, 'adjusted offset of item is normal');

    viewport.scrollTop(500);

    itemTop = item.offset().top - viewport.offset().top;
    assert.equal(itemTop, 0, 'adjusted offset is at top of viewport');

    viewport.scrollTop(600);

    itemTop = item.offset().top - viewport.offset().top;
    assert.ok(itemTop < 1000, 'adjusted offset is above scrollTop');

    viewport.scrollTop(1000);

    itemTop = item.offset().top - viewport.offset().top;
    assert.ok(itemTop < 1000, 'adjusted offset is above scrollTop');
  });
});
