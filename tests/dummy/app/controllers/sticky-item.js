import Ember from 'ember';
import config from '../config/environment';

let { elementHeights: {
  viewport: viewportHeight,
  aboveWrapper: aboveWrapperHeight,
  wrapper: wrapperHeight,
  aboveStickyItem: aboveStickyItemHeight,
  stickyItem: stickyItemHeight,
  belowStickyItem: belowStickyItemHeight
} } = config;

export default Ember.Controller.extend({
  viewportHeight,
  aboveWrapperHeight,
  wrapperHeight,
  aboveStickyItemHeight,
  stickyItemHeight,
  belowStickyItemHeight
});
