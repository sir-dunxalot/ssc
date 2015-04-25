import defaultFor from 'ssc/utils/default-for';
import Ember from 'ember';

export default Ember.View.extend({
  ariaRole: 'application',
  classNameBindings: ['currentRoute'],
  classNames: ['app'],

  currentRoute: function() {
    const controller = this.get('controller');
    const routeName = defaultFor(controller.get('currentRouteName'),'');

    return routeName.replace('.', '-');
  }.property('controller.currentRouteName'),
});
