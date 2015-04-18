import Ember from 'ember';

export default Ember.View.extend({
  classNames: ['index_view'],
  isPastCinema: false,
  scrollTop: 0,
  windowHeight: 0,

  slideInStyle: function() {
    return 'top:' + this.get('scrollTop') * 2 + 'px';
  }.property('scrollTop'),

  createCinema: function() {
    var windoh = $(window);

    windoh.on('scroll', Ember.run.bind(this, this.scroll));
    windoh.on('resize', Ember.run.bind(this, this.setWindowheight));
  }.on('didInsertElement'),

  scroll: function() {
    var offset = window.pageYOffset;
    var windowHeight = this.get('windowHeight');

    if (offset > windowHeight) {
      this.set('isPastCinema', true);
      return;
    }

    this.setProperties({
      isPastCinema: false,
      scrollTop: offset
    });
  },

  setWindowheight: function() {
    this.set('windowHeight', window.innerHeight);
  }.on('didInsertElement'),

  easeOutQuint: function (t, b, c, d) {
    t /= d;
    t--;

    return c*(t*t*t*t*t + 1) + b;
  },

});
