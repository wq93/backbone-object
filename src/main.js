import Backbone from 'backbone';
import $ from 'jquery';
import ModalService from 'services/modal/service';
import AlertService from 'services/alert/service';
import ErrorService from 'services/error/service';

//import Validation from 'apps/back_manage/directory_layout/validation.js';
import App from './application/application.js';
App.initialize();

// Services
ModalService.setup({
    modalcontainer: App.layout.getRegion('modal')
});
ModalService.start();

// Services
AlertService.setup({
    alertcontainer: App.layout.getRegion('alert')
});
AlertService.start();

ErrorService.setup({
    container: App.layout.getRegion('content')
});

// Application initialization
$(document).on('ready', function () {
    App.start();
});
