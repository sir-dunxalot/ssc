import Ember from 'ember';

export default Ember.View.extend({
  ariaRole: 'banner',
  classNames: ['header'],
  tagName: 'header',
  templateName: 'header',

  renderResponsiveNav: function() {
    const nav = responsiveNav('.nav-collapse', {
      label: '<button class="button-unstyled"><span class="">Nav</span></button>',
      closeOnNavClick: true,
      navClass: 'nav-collapse',
      openPos: 'absolute'
    });
  }.on('didInsertElement'),
});
