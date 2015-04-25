import Ember from 'ember';

export default Ember.Component.extend({
  alt: null,
  attributeBindings: ['alt', 'src'],
  classNameBindings: ['loaded:fade-in:fade-out'],
  classNames: ['image'],
  loaded: false,
  src: null,
  tagName: 'img',

  checkForAlt: function() {
    Ember.assert('You must pass an alt option to the {{lazy-image}} component', this.get('alt'));
  }.on('init'),

  lazyLoad: function() {
    this.$().on('load', Ember.run.bind(this, this.set, 'loaded', true));
  }.on('didInsertElement')
});
