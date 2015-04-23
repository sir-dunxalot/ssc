import Ember from 'ember';

var scrolled = false;

export default Ember.View.extend({
  classNames: ['index_view'],
  positionPercentage: 0,
  isPastCinema: false,
  offset: 0,
  windowHeight: 0,

  cityscapeStyle: function() {
    var easeOutQuint = Ember.$.easing.easeOutQuint;
    var offset = this.get('offset');
    var positionPercentage = this.get('positionPercentage');
    var opacity = 'opacity:' + positionPercentage + ';';

    var t = offset;
    var b = 0;
    var c = offset * 2;
    var d = this.get('windowHeight');

    var top = 'top:' + easeOutQuint(1, t, b, c, d) + 'px;';

    return top + opacity;
  }.property('offset', 'positionPercentage'),

  heightsStyle: function() {
    var positionPercentage = this.get('positionPercentage');
    var opacity = 'opacity:' + (1 - positionPercentage) + ';';
    var offset = this.get('offset');
    var top = 'top:' + offset / 1.5 + 'px;';

    return top + opacity;
  }.property('positionPercentage', 'offset'),

  toHeightsStyle: function() {
    return 'opacity:' + this.get('positionPercentage') + ';';
  }.property('positionPercentage'),

  ellipsisStyle: function() {
    var inversePercentage = 1 - this.get('positionPercentage');
    var opacity = 'opacity:' + inversePercentage + ';';
    var widthPixels = inversePercentage * 50;
    var width = 'width:' + widthPixels + 'px;';

    return opacity + width;
  }.property('positionPercentage'),

  fromHeightsStyle: function() {
    var positionPercentage = this.get('positionPercentage');

    return 'left:-' + 120 * (1 - positionPercentage) + 'px;';
  }.property('positionPercentage'),

  fullscreenStyle: function() {
    var top, windowHeight;

    if (this.get('isPastCinema')){
      windowHeight = this.get('windowHeight');

      return 'top:' + windowHeight + 'px;position:absolute;';
    } else {
      return null;
    }
  }.property('isPastCinema'),

  /* Methods */

  createCinema: function() {
    var windoh = $(window);

    windoh.on('scroll', Ember.run.bind(this, this.scroll));
    windoh.on('resize', Ember.run.bind(this, this.setWindowheight));
  }.on('didInsertElement'),

  setWindowheight: function() {
    this.set('windowHeight', window.innerHeight);
  }.on('didInsertElement'),

  scroll: function() {
    var duration = 1500;
    var offset = window.pageYOffset;
    var windowHeight = this.get('windowHeight');

    if (offset > windowHeight) {
      this.set('isPastCinema', true);
      return;
    }

    if (!scrolled) {
      this.disableScroll();

      $('body').animate({
        scrollTop: windowHeight
      }, duration, 'easeInOutQuint');

      Ember.run.later(this, this.enableScroll, duration);

      scrolled = true;
    }

    this.setProperties({
      positionPercentage: offset / windowHeight,
      isPastCinema: false,
      offset: offset
    });
  },

  /* Scroll handling */

  disableScroll: function() {
    var wheel = Ember.run.bind(this, this.wheel);

    if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', wheel, false);
    }

    window.onmousewheel = document.onmousewheel = wheel;
    document.onkeydown = this.keydown;
  },

  enableScroll: function() {
    if (window.removeEventListener) {
      window.removeEventListener('DOMMouseScroll',
        Ember.run.bind(this, this.wheel)
      , false);
    }

    window.onmousewheel = document.onmousewheel
                        = document.onkeydown
                        = null;
  },

  wheel: function(event) {
    this.preventDefault(event);
  },

  preventDefault: function(event) {
    event = event || window.event;

    if (event.preventDefault) {
      event.preventDefault();
    }

    event.returnValue = false;
  },

  keydown: function(e) {
    for (var i = keys.length; i--;) {
      if (e.keyCode === keys[i]) {
        this.preventDefault(e);

        return;
      }
    }
  },

});
