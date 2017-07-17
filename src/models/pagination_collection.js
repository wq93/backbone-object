/**
 * Created by Yanphone on 15/11/24.
 */
import {Collection} from 'backbone';
import {Model}  from 'backbone';

import ServicePagination from './pagination_model.js';

export default Collection.extend({
    model: ServicePagination,

    initialize(options) {
    },
});
