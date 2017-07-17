import {Model} from 'backbone';

export default Model.extend({
    defaults: {
        title: '提示',
        message: '',
        btnPrimary: '确定',
        btnDefault: '取消'
    }
});
