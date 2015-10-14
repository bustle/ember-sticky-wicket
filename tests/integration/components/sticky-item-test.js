import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sticky-item', 'Integration | Component | sticky item', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  this.render(hbs`
    <div id='wrapper'>
      {{#sticky-item wrapper='#wrapper'}}
        template block text
      {{/sticky-item}}
    </div>
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
