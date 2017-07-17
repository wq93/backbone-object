import * as Marionette from 'marionette';
import View from './view';

export default new (Marionette.Object.extend({
    setup: function (options) {
        this.container = options.container
    },

    show: function (container) {
        this.view = new View();
        (container ? container : this.container).show(this.view);
    }
}))();
