/**
 * Created by Yanphone on 15/11/4.
 */
import {ItemView} from 'marionette';
import modal from './modal.hbs';

require('./modal.scss');

export default ItemView.extend({
    tagName: 'div',
    template: modal,

    triggers: {
        'click #modal-btn-primary': 'primaryClick',
        'click #modal-btn-default': 'defaultClick',
        'click .close': 'defaultClick'
    }
});
