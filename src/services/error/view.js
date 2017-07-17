import {CompositeView, ItemView} from 'marionette';
import $ from 'jquery';

import App from '../../application/application'
import errorTpl from './error.hbs';


export default ItemView.extend({
    template: errorTpl,
    events: {
        'click .retry-btn': function () {
            location.reload();
        }
    },
    onShow(){
        if ($('body').hasClass('modal-open')) {
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        }
    }
});
