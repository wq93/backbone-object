/**
 * Created by Yanphone on 15/11/24.
 */
import {CompositeView, ItemView} from 'marionette';
import $ from 'jquery';
import paginationLiTpl from './pagination_li.hbs';
import paginationUlTpl from './pagination_ul.hbs';
import ServicePaginationModel from '../../models/pagination_model.js';
import ServicePaginationCollection from '../../models/pagination_collection.js';

require('./pagination.scss');

var paginationLiView = ItemView.extend({
    tagName: 'li',
    template: paginationLiTpl,
    className: 'data-directory',
    ui: {
        item: 'a'
    },
    triggers: {
        'click @ui.item': 'clicked:item'
    },

    onActive: function () {
        this.$el.addClass('active');
    },

    onInactive: function () {
        if (this.$el.hasClass('active')) {
            this.$el.removeClass('active');
        }
    },

    setDisabled: function () {
        this.$el.addClass('disabled');
    },

    setEnabled: function () {
        if (this.$el.hasClass('disabled')) {
            this.$el.removeClass('disabled');
        }
    }
});

export default CompositeView.extend({
    options: {
        type: 0,
        page: 1,
        clickedItem: '1',
        itemPerPage: 10
    },
    template: paginationUlTpl,
    childView: paginationLiView,
    childViewContainer: '.pagination',
    childEvents: {
        'clicked:item': 'onClickedItem'
    },

    onShow: function () {
        this.onReload();
    },

    onReload: function () {
        this.options.page = 1;
        this.setPageActive(1);
    },

    onClickedItem: function (clickedView) {
        if (clickedView.$el.hasClass('disabled') || clickedView.$el.hasClass('active')) {
            return;
        }
        this.clearActives(clickedView);
        this.options.clickedItem = clickedView.model.get('pageNumber');
        switch (this.options.clickedItem) {
            case '<<':
                this.trigger('previous');
                clickedView.$('a').blur();
                break;
            case '>>':
                this.trigger('next');
                clickedView.$('a').blur();
                break;
            default:
                this.trigger('clickedPage');
                clickedView.onActive();
                this.setDisabled(clickedView);
                break;
        }
    },

    clearActives: function () {
        this.children.each(function (view) {
            view.onInactive();
        })
    },

    setPageActive: function (pageNumber) {
        this.clearActives();
        let _this = this;
        this.children.each(function (view) {
            if (view.model.get('pageNumber') == pageNumber) {
                view.onActive();
                _this.setDisabled(view);
            }
        })
    },

    setDisabled: function (view) {
        let previousView = this.children.first();
        let nextView = this.children.last();
        previousView.setEnabled();
        nextView.setEnabled();
        if (view._index == 1) {
            previousView.setDisabled();
        }
        if (view._index == (this.children.length - 2)) {
            nextView.setDisabled();
        }
    },

    update(totalNum){
        if (!totalNum) {
            let totalNum = this.options.totalPage;
        }
        // hide pagination if totalNum == 0 or only one page

        if (!totalNum || Math.ceil(totalNum / this.options.itemPerPage) == 1) {
            this.$el.hide();
            return;
        } else {
            this.$el.show();
        }
        this.options.totalPage = Math.ceil(totalNum / this.options.itemPerPage);
        this.setModels();
    },

    setModels(){
        this.collection.reset();
        this.collection.add(new ServicePaginationModel({pageNumber: '<<'}));
        if (this.options.totalPage < 7) {
            for (var i = 1; i <= this.options.totalPage; i++) {
                this.collection.add(new ServicePaginationModel({pageNumber: i}));
            }
        } else {
            if (this.options.page <= 3) {
                for (var i = 1; i <= 4; i++) {
                    this.collection.add(new ServicePaginationModel({pageNumber: i}));
                }
                this.collection.add(new ServicePaginationModel({pageNumber: this.options.totalPage}));
            } else if (this.options.page < this.options.totalPage - 2) {
                this.collection.add(new ServicePaginationModel({pageNumber: 1}));
                for (var i = this.options.page - 1; i <= this.options.page + 1; i++) {
                    this.collection.add(new ServicePaginationModel({pageNumber: i}));
                }
                this.collection.add(new ServicePaginationModel({pageNumber: this.options.totalPage}));
            } else {
                this.collection.add(new ServicePaginationModel({pageNumber: 1}));
                for (var i = this.options.totalPage - 3; i <= this.options.totalPage; i++) {
                    this.collection.add(new ServicePaginationModel({pageNumber: i}));
                }
            }
        }
        this.collection.add(new ServicePaginationModel({pageNumber: '>>'}));
        this.adjustStyle();
        this.setPageActive(this.options.page);
    },

    adjustStyle(){
        if (this.$('li span').length > 0) {
            this.$('li span').parent().remove();
        }
        if (this.options.totalPage < 7) {
            this.options.type = 0;
        } else {
            if (this.options.page <= 3) {
                this.$('li:eq(5)').before('<li><span class="pagination-more">...</span></li>');
            } else if (this.options.page < this.options.totalPage - 2) {
                this.$('li:eq(5)').before('<li><span class="pagination-more">...</span></li>');
                this.$('li:eq(1)').after('<li><span class="pagination-more">...</span></li>');
            } else {
                this.$('li:eq(1)').after('<li><span class="pagination-more">...</span></li>');
            }
        }
    }
});