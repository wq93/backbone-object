import $ from 'jquery';
import Backbone from 'backbone';
import {Collection} from 'backbone';
import store from 'store';

import App from '../application/application';
import ErrorService from '../services/error/service';
import AlertModel from '../services/alert/service.js';

export default Collection.extend({
    sync() {
        arguments[2].headers                   = arguments[2].headers || {};
        arguments[2].headers['yanphone-token'] = App.config.token;
        let errorHandler                       = arguments[2].error;
        arguments[2].error                     = (data) => {
            if (!navigator.onLine || data.responseText == "" && data.status == 0 && data.statusText == "error") ErrorService.show();
            if (data.responseJSON) {
                switch (data.responseJSON.code) {
                    case App.config.code.invalidToken:
                    case App.config.code.noToken:
                    case App.config.code.expiredToken:
                        $("header .navbar-collapse").css("visibility", "hidden");
                        App.config.username = '';
                        App.config.token    = '';
                        store.remove('username');
                        store.remove('token');
                        AlertModel.openAlert({
                            message: "登录已过期，请重新登录"
                        });
                        Backbone.history.navigate('#login', {trigger: true});
                        break;
                    case App.config.code.unknownError:
                        AlertModel.openAlert({
                            message: data.responseJSON.message
                        });
                        break;
                    case App.config.code.noHostForDeploy:
                        AlertModel.openAlert({
                            message: App.config.message.systemError
                        });
                        break;
                    default:
                        if (App.config.codeMessage[data.responseJSON.code]) {
                            AlertModel.openAlert({
                                message: App.config.codeMessage[data.responseJSON.code]
                            });
                        } else {
                            AlertModel.openAlert({
                                message: data.responseJSON.message
                            });
                        }
                }
            }
            if (errorHandler) errorHandler(data);
        }
        return Backbone.sync.apply(this, arguments);
    }
})
