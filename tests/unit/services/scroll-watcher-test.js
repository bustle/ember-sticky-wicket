import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

let { run, $ } = Ember;

let watcher, service;

const SCROLL_CLASS = 'scroll-this';
const SCROLL_SELECTOR = `.${SCROLL_CLASS}`;

moduleFor('service:scroll-watcher', 'Unit | Service | scroll watcher', {
  beforeEach() {
    $('#qunit-fixture').append(`<div class="${SCROLL_CLASS}"></div>`);
  },
  afterEach() {
    run(service, 'stopWatcher', SCROLL_SELECTOR);
    $(SCROLL_SELECTOR).remove();
  }
});

test('it exists', function(assert) {
  service = this.subject();
  assert.ok(service);
});

test('it can create scroll watcher with selector', function(assert) {
  service = this.subject();
  let watcher = service.startWatcher(SCROLL_SELECTOR);
  assert.ok(watcher, 'creates a watcher');
});

test('it can create scroll watcher with element', function(assert) {
  service = this.subject();
  let watcher = service.startWatcher($(SCROLL_SELECTOR)[0]);
  assert.ok(watcher, 'creates a watcher');
});

test('it can creates a singleton scroll watcher for an element', function(assert) {
  service = this.subject();
  watcher = service.startWatcher(SCROLL_SELECTOR);
  let anotherWatcher = service.startWatcher(`div${SCROLL_SELECTOR}`);
  assert.equal(watcher, anotherWatcher,
               'watcher for an element is a singleton');
  run(anotherWatcher, 'destroy');
});

test('it can update properties on scroll event', function(assert) {
  service = this.subject();
  watcher = service.startWatcher(SCROLL_SELECTOR);
  assert.equal(watcher.get('scrollTop'), null, 'scrollTop is null at the start');
  let event = $.Event('scroll', {});
  $(SCROLL_SELECTOR).trigger('scroll', event);
  assert.equal(watcher.get('scrollTop'), 0, 'scrollTop is set to scrollTop on init');
});
