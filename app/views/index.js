import Ember from 'ember';

const { escapeExpression } = Ember.Handlebars.Utils;
const { SafeString } = Ember.Handlebars;
const $ = Ember.$;

const navigationKeys = [37, 38, 39, 40];

const escapeAsNumber = function(property) {
  return parseFloat(escapeExpression(property));
};

let scrolled = false;

export default Ember.View.extend({
  isPastCinema: false,
  offset: 0,
  unescapedPositionPercentage: 0,
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
    const inversePercentage = 1 - this.get('percentage');
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
    const position = 120 * inversePercentage;

    return new SafeString(`left:-${position}px;`);
  }.property('percentage'),

  fullscreenStyle: function() {
    if (this.get('isPastCinema')) {
      const windowHeight = escapeAsNumber(this.get('windowHeight'));

      return new SafeString(`top:${windowHeight}px;position:absolute;`);
    } else {
      const percentage = 1 - this.get('percentage');
      const offset = percentage * 100;

      return `top:${offset}px;`;
    }
  }.property('isPastCinema', 'percentage'),

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
    const body = Ember.$('body');
    const duration = 1500;
    const offset = window.pageYOffset;
    const windowHeight = this.get('windowHeight');

    if (offset > windowHeight) {
      scrolled = true;
      this.set('isPastCinema', true);
      body.removeClass('fade_nav');
    }

    if (offset > windowHeight * 2) {
      return;
    } else if (offset > windowHeight) {
      return;
    }

    if (!scrolled) {
      scrolled = true;

      this.disableScroll();

      body.animate({
        scrollTop: windowHeight
      }, duration, 'easeInOutQuint');

      Ember.run.later(this, this.enableScroll, duration);

      Ember.run.later(this, function() {
        body.removeClass('fade_nav');
      }, duration + 500);
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

    window.onmousewheel = document.onmousewheel =
                          document.onkeydown =
                          null;
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
    for (let i = navigationKeys.length; i--;) {
      if (e.keyCode === navigationKeys[i]) {
        this.preventDefault(e);

        return;
      }
    }
  },

});
