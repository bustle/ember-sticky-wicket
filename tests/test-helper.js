import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import QUnit from 'qunit';

setResolver(resolver);

QUnit.testStart(function() {
  $('#ember-testing').css('zoom', '100%');
});

