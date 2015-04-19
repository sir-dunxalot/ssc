import Ember from 'ember';

export default Ember.View.extend({
  classNames: ['index_view'],
  cityscapeOpacity: 0,
  isPastCinema: false,
  scrollTop: 0,
  windowHeight: 0,

  cityscapeStyle: function() {
    var scrollTop = this.get('scrollTop');
    var opacity = 'opacity:' + this.get('cityscapeOpacity') + ';';

    var t = scrollTop;
    var b = 0;
    var c = scrollTop * 2;
    var d = this.get('windowHeight');

    // var newTop = ;
    var top = 'top:' + this.easeOutQuint(t, b, c, d) + 'px;';

    console.log(top);

    return top + opacity;
  }.property('scrollTop'),

  heightsStyle: function() {
    var cityscapeOpacity = this.get('cityscapeOpacity');
    var opacity = 'opacity:' + (1 - cityscapeOpacity) + ';';
    var scrollTop = this.get('scrollTop');
    var top = 'top:' + scrollTop / 1.5 + 'px;';

    return top + opacity;
  }.property('cityscapeOpacity', 'scrollTop'),

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
      cityscapeOpacity: (offset / windowHeight),
      isPastCinema: false,
      scrollTop: offset
    });
  },

  setWindowheight: function() {
    this.set('windowHeight', window.innerHeight);
  }.on('didInsertElement'),

  // easeOutQuint: function (t, b, c, d) {
  //   t /= d;
  //   t--;

  //   return c*(t*t*t*t*t + 1) + b;
  // },

  easeOutQuint: function (t, b, c, d) {
    return c * ((t=t/d-1) * t * t * t * t + 1) + b;
  },

});
