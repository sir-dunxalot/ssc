import Ember from 'ember';

export default Ember.View.extend({
  ariaRole: 'banner',
  classNames: ['header'],
  tagName: 'header',
  templateName: 'header',

  renderResponsiveNav: function() {
    const nav = responsiveNav('.nav-collapse', {
      label: '<button class="nav_toggle_button"><span class="hidden">Nav</span></button>',
      closeOnNavClick: true,
      navClass: 'nav-collapse',
    });
  }.on('didInsertElement'),
});
