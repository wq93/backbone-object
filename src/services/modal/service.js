import {Model, Collection} from 'backbone';
import Marionette from 'marionette';
// import Radio from 'backbone.radio';
import View from './modal_view';
import ModalModel from '../../models/modal.js';
import $ from 'jquery';

const ModalService = Marionette.Object.extend({
    setup(options = {}) {
        this.modalcontainer = options.modalcontainer;
    },

    /*
     options format of start():
     {
     // message is required, others are optional
     title: '提示',    // header text
     message: '',    // body text
     btnPrimary: '确定',   // primary button text
     btnDefault: '取消'    // default button text
     primaryClick: function(),   // primary button callback
     defaultClick: function()    // default button callback
     }
     */
    start(options) {
        console.log('ModalService.start');
        this.view = new View();
        if (!options) {
            this.view.model = new ModalModel();
            return;
        }
        this.view.model = new ModalModel({
            title: options.title || '提示',
            message: options.message || '',
            btnPrimary: options.btnPrimary || '确定',
            btnDefault: options.btnDefault || '取消'
        });
        this.modalcontainer.show(this.view);
        this.view.on({
            'primaryClick': options.primaryClick || function () {
                $('#global-modal').modal('hide');
            },
            'defaultClick': options.defaultClick
        })
    },

    openModal: function (options) {
        this.start(options);
        $('#global-modal').modal({backdrop: 'static'});
    },
    closeModal: function () {
        $(".modal-backdrop").remove();
        $('#global-modal').modal('hide');
    }
});

export default new ModalService();
