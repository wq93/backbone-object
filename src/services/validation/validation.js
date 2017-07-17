(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    $.fn.validation = function (callback, options) {

        if (!this.length) {
            if (options && options.debug && window.console) {
                console.warn("Nothing selected, can't validate, returning nothing.");
            }
            return;
        }

        if (typeof callback === 'object') {
            options = callback;
            callback = null;
        };

        return this.each(function () {
            globalOptions = $.extend({}, $.fn.validation.defaults, options);  //这个全局的？
            globalOptions.callback = callback;
            // Add novalidate tag if HTML5.
            $(this).attr("novalidate", "novalidate");
            fform_style = isformstyle(this);
            validationForm(this)
        });
    };
    $.fn.valid = function (object, options, cb) {
        if (formState) { // 重复提交则返回
            return false;
        }
        ;
        $("#validerrmsg").remove();

        var myobject;
        var myoptions;
        var mycb;
        if (typeof object === 'object') {
            myobject = $(object);
            if (typeof options === 'string') {
                myoptions = options;
                mycb = cb;
            }
            else {
                mycb = options;
            }
        }
        else {
            if (typeof object === 'string') {
                myoptions = object;
                mycb = cb;
            }
            else {
                mycb = object;
            }
            ;
        }
        ;

        formState = true;
        var validationError = false;
        //取出验证的
        $('input, textarea', this).each(function () {
            var el = $(this),
                controlGroup = el.parents('.form-group'),
            //check-type="required chinese"  //支持多个，以空格隔开。
                valid = (el.attr('check-type') == undefined) ? null : el.attr('check-type').split(' ');
            if (!controlGroup.hasClass('has-success') && valid != null && valid.length > 0) {
                if (!validateField(this, valid)) {
                    if (wFocus == false) {
                        scrollTo(0, el[0].offsetTop - 50);
                        wFocus = true;
                    }
                    validationError = true;
                }
            }
        });

        wFocus = false;
        formState = false;

        //显示信息内容 2014-6-15
        //在最后的提交按钮增加提示内容
        if (myoptions != null && validationError) {
            if (myobject == null) {
                myobject = $('button:last[type=submit]');
            };

            //由于ie8不支持array .indexOf(), 改下如下代码。
            var classArray = myobject.parent().attr('class').split(' ');
            var hadgroup = false;
            for (var i = 0; i < classArray.length; i++) {
                if (classArray[i] == 'btn-group') {
                    hadgroup = true;
                    break;
                }
            }
            ;
            if (hadgroup) {
                myobject.parent().before('<span id="validerrmsg" class="help-block" style="color: #FF0000;"><div class="alert alert-warning" role="alert" style="padding:10px;"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + myoptions + '</div></span>');
            }
            else {
                myobject.before('<span id="validerrmsg" class="help-block" style="color: #FF0000;"><div class="alert alert-warning" role="alert" style="padding:10px;"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + myoptions + '</div></span>');
            }
            ;
        }
        ;
        //end

        if (mycb) {
            mycb(validationError);
        }

        return !validationError;
    }

    $.fn.validation.defaults = {
        validRules: [
            {
                name: 'required', validate: function (value) {
                return ($.trim(value) == '');
            }, defaultMsg: '请输入内容。'
            },
            {
                name: 'labelName', validate: function (value) {
                return (!/^([a-z\_\-A-Z\(\)]|\d|[\u4e00-\u9fff]|[、]){1,40}$/.test(value));
            }, defaultMsg: '1-20个字符，只能输入数字、中文、英文、连字符(_和-)、英文小括号'
            },
            {
                name: 'nodename', validate: function (value) {
                return (!/^([a-z\_A-Z]|\d){2,20}$/.test(value));
            }, defaultMsg: '长度为2~20个字符,可使用英文、数字、下划线'
            },

            {
                name: 'labelCode', validate: function (value) {
                return (!/^[A-Za-z0-9]{1,6}$/.test(value));
            }, defaultMsg: '只能输入大写字母、小写字母、数字'
            }

        ],
        reqmark: true,
        callback: null,  //function(obj,params){};
        icon: false      //=icon=true 表示显示图标，默认不显示
    };
    var formState = false,
        fieldState = false,
        wFocus = false,
        fform_style = 0,    //0=表示基本表单 1=表示内联表单 2=水平排列的表单
        globalOptions = {};

    function isformstyle(form) {
        if ($(form).hasClass('form-inline')) {
            return 1;
        }
        else if ($(form).hasClass('form-horizontal')) {
            return 2;
        }
        else {
            return 0;
        }
        ;
    };

    //验证字段
    var validateField = function (field, valid) {
        var el = $(field), error = false, errorMsg = '';
        var minlength = (el.attr('minlength') ? el.attr('minlength') : null);
        var range = (el.attr('range') ? el.attr('range') : null); //
        var equal = (el.attr('equal') ? el.attr('equal') : null);
        var msg;
        for (i = 0; i < valid.length; i++) {
            var x = true,
                flag = valid[i];
            msg = (el.attr(flag + '-message') == undefined) ? null : el.attr(flag + '-message');

            if (flag.substr(0, 1) == '!') {
                x = false;
                flag = flag.substr(1, flag.length - 1);
            }

            var rules = globalOptions.validRules;
            for (j = 0; j < rules.length; j++) {
                var rule = rules[j];
                if (flag == rule.name) {
                    var value;
                    if (el.attr('type') != null && el.attr('type') == 'checkbox') {
                        value = el.is(":checked") ? 'true' : '';
                    }
                    else {
                        value = el.val();
                    }
                    ;
                    if (rule.validate.call(field, value) == x) {
                        error = true;
                        if (el.attr('type') != null && el.attr('type').toLowerCase() == 'file') {
                            errorMsg = (msg == null) ? '请选择文件。' : msg;
                        }
                        else {
                            errorMsg = (msg == null) ? rule.defaultMsg : msg;
                        }
                        break;
                    }
                }
            }
            if (error) {
                break;
            }
        }

        //验证长度
        if (minlength && !error) {
            error = el.val().length < minlength;
            if (error && (msg == null || errorMsg == '')) {
                //errorMsg = '输入长度大于等于' + minlength;
                errorMsg = '密码长度应为8~20个字符';
            }
        }
        ;

        //验证密码是否相等
        if (equal && !error) {
            error = $(equal).val() != el.val();
            if (error && (msg == null || errorMsg == '')) {
                errorMsg = '密码不一致';
            }
        }
        ;

        //值区间
        if ($.inArray('number', valid) >= 0 && range && !error) {
            var values = range.split("~");

            if (values.length == 2) {
                error = parseFloat(el.val()) < parseFloat(values[0]) || parseFloat(el.val()) > parseFloat(values[1]);
                if (error && (msg == null || errorMsg == '')) {
                    errorMsg = '输入值在［' + values[0] + '~' + values[1] + ']之间。';
                }
            }
            else {
                var values = range.split(",");
                if (values.length > 0) {
                    //error =  values.indexOf(el.val())<0;
                    error = $.inArray(el.val(), values) < 0;
                    if (error && (msg == null || errorMsg == '')) {
                        errorMsg = '输入值为' + range + '的其中一个。';
                    }
                }
            }
        }
        ;

        //外部验证回调方法
        if (!error && globalOptions.callback) {
            var params = {
                msg: '',
                err: error
            };
            var b = $.ajaxSettings.async;
            $.ajaxSetup({async: false});
            globalOptions.callback(field, params);
            error = params.err;
            if (error && (msg == null || errorMsg == '')) {
                errorMsg = params.msg;
            }
            else if (params.msg != '') {
                errorMsg = params.msg;
            }
            $.ajaxSetup({async: b});
        }
        ;


        var controlGroup = el.parents('.form-group');
        controlGroup.removeClass('has-error has-success');

        controlGroup.addClass(error == false ? 'has-success' : 'has-error');
        //在后面增加图标
        if (globalOptions.icon === true) {
            controlGroup.find('.form-control-feedback').remove();
            controlGroup.addClass('has-feedback'); //增加后面图示
        }
        ;

        var form = el.parents("form");
        if (form) {
            var fstyle = isformstyle(form); //0=表示基本表单 1=表示内联表单 2=水平排列的表单
            var iconname = error == false ? 'glyphicon-ok' : 'glyphicon-remove';
            if (fstyle == 0) {
                controlGroup.find("#valierr").remove();
                if (errorMsg != "") {
                    el.after('<span class="help-block" id="valierr">' + errorMsg + '</span>');
                }
                if (globalOptions.icon === true) {
                    if (el.find('option').length == 0) {
                        el.after('<span class="glyphicon ' + iconname + ' form-control-feedback" aria-hidden="true"></span>');
                    }
                    else {
                        el.after('<span class="glyphicon ' + iconname + ' form-control-feedback" aria-hidden="true" style="right: 25px;"></span>');
                    }

                }
            }
            else if (fstyle == 1) {
                if (globalOptions.icon === true) {
                    if (el.find('option').length == 0) {
                        el.after('<span class="glyphicon ' + iconname + ' form-control-feedback" aria-hidden="true"></span>');
                    }
                    else {
                        el.after('<span class="glyphicon ' + iconname + ' form-control-feedback" aria-hidden="true" style="right: 25px;"></span>');
                    }
                }
            }
            else if (fstyle == 2) {
                controlGroup.find("#valierr").remove();
                if (errorMsg != "") {
                    el.parent().after('<span class="help-block" id="valierr">' + errorMsg + '</span>');
                }
                if (globalOptions.icon === true) {
                    if (el.find('option').length == 0) {
                        el.after('<span class="glyphicon ' + iconname + ' form-control-feedback" aria-hidden="true"></span>');
                    }
                    else {
                        el.after('<span class="glyphicon ' + iconname + ' form-control-feedback" aria-hidden="true" style="right: 25px;"></span>');
                    }
                }
            }
        }
        ;//end !form
        return !error;
    };

    //表单验证方法
    var validationForm = function (obj) {
        //1.丢失焦点事件
        $(obj).find('input, textarea,select').each(function () {
            var el = $(this);
            el.on('blur', function () { // 失去焦点时
                valid = (el.attr('check-type') == undefined) ? null : el.attr('check-type').split(' ');
                if (valid) {
                    validateField(this, valid);
                }
            });
        });

        //2.如是文件选择则要处理onchange事件
        $(obj).find("input[type='file']").each(function () {
            var el = $(this);
            el.on('change', function () { //
                valid = (el.attr('check-type') == undefined) ? null : el.attr('check-type').split(' ');
                if (valid) {
                    validateField(this, valid);
                }
            });
        });

        //3.设置必填的标志*号
        if (globalOptions.reqmark == true) {
            if (fform_style == 0) {
                $(obj).find(".form-group>label").each(function () {
                    var el = $(this);
                    var controlGroup = el.parents('.form-group');
                    controlGroup.removeClass('has-error has-success');
                    controlGroup.find("#autoreqmark").remove();
                    //el.after('<span id="autoreqmark" style="color:#FF9966"> *</span>')
                });
            }
            else if (fform_style == 1) {

            }
            else if (fform_style == 2) {

                $(obj).find('input, textarea,select').each(function () {
                    var el = $(this);
                    var controlGroup = el.parents('.form-group');
                    controlGroup.removeClass('has-error has-success');
                    controlGroup.find("#valierr").remove();
                    valid = (el.attr('check-type') == undefined) ? null : el.attr('check-type').split(' ');
                    if (valid) {
                        if ($.inArray('required', valid) >= 0) {
                            el.parent().after('<span class="help-block" id="valierr" style="color:#FF9966">*</span>');
                        }
                    }
                    ;
                });
            }
            ;
        }
        ;//end showrequired

        //4.重置按钮 type="reset" 2015-6-09
        $(obj).find("input[type='reset'],button[type='reset']").each(function () {
            var el = $(this);
            el.on('click', function () { //
                $(obj).validation();
                $("#validerrmsg").remove();
            });
        });
        //end 4

    };
}));