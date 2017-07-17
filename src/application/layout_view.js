import {LayoutView} from 'marionette';
import template from './layout-template.hbs';

export default LayoutView.extend({
    el: '#app-layout',
    template: template,

    regions: {
        header: 'header',
        footer: 'footer',
        content: '#app-main',
        modal: '.global-modal',
        alert: '.global-alert'
    }
});
