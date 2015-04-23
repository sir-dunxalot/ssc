import Ember from 'ember';

const { escapeExpression } = Ember.Handlebars.Utils;
const { SafeString } = Ember.Handlebars;

const escapeAsNumber = function(property) {
  return parseFloat(escapeExpression(property));
};

let scrolled = false;

export default Ember.View.extend({
  classNames: ['index_view'],
  unescapedPositionPercentage: 0,
  isPastCinema: false,
  offset: 0,
  windowHeight: 0,

  cityscapeStyle: function() {
    const easeOutQuint = Ember.$.easing.easeOutQuint;
    const offset = escapeAsNumber(this.get('offset'));
    const percentage = this.get('percentage');
    const opacity = `opacity:${percentage};`;

    const t = offset;
    const b = 0;
    const c = offset * 2;
    const d = escapeAsNumber(this.get('windowHeight'));

    const top = 'top:' + easeOutQuint({}, t, b, c, d) + 'px;';

    return new SafeString(top + opacity);
  }.property('offset', 'percentage'),

  heightsStyle: function() {
    const inversePercentage = this.get('percentage');
    const opacity = `opacity:${inversePercentage};`;
    const offset = escapeAsNumber(this.get('offset')) / 1.5;
    const top = `top:${offset}px;`;

    return new SafeString(top + opacity);
  }.property('percentage', 'offset'),

  percentage: function() {
    var unescapedPositionPercentage = this.get('unescapedPositionPercentage');

    return escapeAsNumber(unescapedPositionPercentage);
  }.property('unescapedPositionPercentage'),

  toHeightsStyle: function() {
    const percentage = this.get('percentage');

    return new SafeString(`opacity:${percentage};`);
  }.property('percentage'),

  ellipsisStyle: function() {
    const inversePercentage = 1 - this.get('percentage');
    const opacity = `opacity:${inversePercentage};`;
    const widthPixels = inversePercentage * 50;
    const width = `width:${widthPixels}px;`;

    return new SafeString(opacity + width);
  }.property('percentage'),

  fromHeightsStyle: function() {
    const inversePercentage = 1 - this.get('percentage');
    const position = 120 * (1 - inversePercentage);

    return new SafeString(`left:-${position}px;`);
  }.property('percentage'),

  fullscreenStyle: function() {
    if (this.get('isPastCinema')) {
      const windowHeight = escapeAsNumber(this.get('windowHeight'));

      return new SafeString(`top:${windowHeight}px;position:absolute;`);
    } else {
      return null;
    }
  }.property('isPastCinema'),

  /* Methods */

  createCinema: function() {
    const windoh = $(window);

    windoh.on('scroll', Ember.run.bind(this, this.scroll));
    windoh.on('resize', Ember.run.bind(this, this.setWindowHeight));
  }.on('didInsertElement'),

  setWindowHeight: function() {
    this.set('windowHeight', window.innerHeight);
  }.on('didInsertElement'),

  scroll: function() {
    const duration = 1500;
    const offset = window.pageYOffset;
    const windowHeight = this.get('windowHeight');

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
      unescapedPositionPercentage: offset / windowHeight,
      isPastCinema: false,
      offset: offset
    });
  },

  /* Scroll handling */

  disableScroll: function() {
    const wheel = Ember.run.bind(this, this.wheel);

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
    for (let i = keys.length; i--;) {
      if (e.keyCode === keys[i]) {
        this.preventDefault(e);

        return;
      }
    }
  },

});
