import {Model, Collection} from 'backbone';
import Marionette from 'marionette';
// import Radio from 'backbone.radio';
import View from './alert_view';
import AlertModel from '../../models/alert.js';
import $ from 'jquery';

const AlertService = Marionette.Object.extend({
    setup(options = {}) {
        this.alertcontainer = options.alertcontainer;
    },

    /*
     options format of start():
     {
     message: '',    // body text
     }
     */
    start(options) {
        console.log('alertService.start');
        this.view = new View();
        this.view.on('close:alert', this.closeAlert);
        if (!options) {
            this.view.model = new AlertModel();
            return;
        }
        this.view.model = new AlertModel({
            message: options.message || ''
        });
        this.alertcontainer.show(this.view);
    },

    openAlert: function (options) {
        this.start(options);
        $('#global-alert').show();
        $('#global-alert').addClass("in");
        $('*').click(function () {
            if ($(this).find('#global-alert').length > 0) {
                $('#global-alert').removeClass("in");
                $('#global-alert').hide();
            }
        });
    },

    closeAlert: function () {
        $('#global-alert').removeClass("in");
        $('#global-alert').hide();
    }
});

export default new AlertService();
