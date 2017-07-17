/**
 * Created by Yanphone on 15/11/4.
 */
import {ItemView} from 'marionette';
import alert from './alert.hbs';

require('./alert.scss');

export default ItemView.extend({
    tagName: 'div',
    template: alert,
    triggers: {
        'click :button': 'close:alert'
    }
});
