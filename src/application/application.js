import Backbone from 'backbone';
import {Application, RegionManager} from 'marionette';
import $ from 'jquery';
import _ from 'lodash';
import store from 'store';
import LayoutView from './layout_view.js';
import Alert from '../services/alert/service.js';

let App = new (Application.extend({
    config: {
        username: '',
        token: '',
        code: {
            success: 0,
            invalidToken: 1,
            noToken: 2,
            expiredToken: 3,
            serverIOError: 90,
            unknownError: 99,
            shortParam: 603,
            invalidParam: 605,
            requestNotAllowed: 700,
            authFailed: 1000,
            userExisted: 1001,
            userNotExisted: 1002,
            emailExisted: 1003,
            emailNotExisted: 1004,
            userLocked: 1006,
            userDenyReset: 1100,
            userNotFound: 1500,
            apiTokenError: 1600,

        },
        message: {
            signInSuccess: '登录成功！',
            signupSuccess: '注册成功！',
            invalidUser: '用户名或密码错误',
            networkError: '网络不给力',
            userExisted: "用户名已存在",
            emailSuccess: '邮件已发送到您的注册邮箱。若未收到邮件，请再次尝试',
            emailExisted: "邮箱已被注册",
            emailNotExisted: '邮箱不存在，请重新输入',
            emailTooShort: '距离上次重置密码时间不足24小时，不允许重置密码',
            emailFail: '发送失败，请检查网络',
            passwordEditSuccess: '密码修改成功，请使用新密码重新登录！',
            passwordEditFail: '密码修改失败，请确认网络连接并重试！',
            passwordOldError: '旧密码错误，请重新填写！',
            systemError: '系统出错，请稍后重试！',
            notificationEmailSuccess: '通知邮箱保存成功！',
            notificationEmailFailed: '通知邮箱保存失败，请重试！',
            sessionTimeOut: '空闲会话超时，请重新登录！',
            tooLarge: '文件大小超出上传限制',
            // songchun add
            apiTokenError: '用户过期,请重新登录后操作!',
            updateUserInfoSuccess: '修改用户信息成功',
            updateUserInfoFail: '修改用户信息失败',
            makeCommentsSuccess: '反馈意见成功',
            makeCommentsFail: '反馈信息失败!',
            sendrequirementFail: '需求分发失败',
            saveCategoryTreeSuccess: '保存分类成功',
            updateCategoryTreeFail: '总目录不可以修改与删除!',
            cancelRecommendSuccess: '取消推荐成功',
            addRecommendSuccess: '添加推荐成功',
            freezeUserSuccess: '冻结此用户成功',
            activateUserSuccess: '激活用户成功',
            publishRequirementSuccess: '需求发布成功',
            orderSubmitSuccess: '订单已提交，我们将尽快审核',
            orderCancelSuccess: '订单已取消',
            orderAuditSuccess: '订单审核成功',
            authorizeRoleSuccess: '角色授权成功',
            authorizeRoleFail: '角色授权失败',
            removeSuccess: '删除成功！',
            // wukd added
            verifySuccess: {
                '重审': '撤销成功',
                '审核': '审核成功'
            },
            //removeSuccess: {
            //    '删除': '操作成功',
            //    '恢复': '恢复成功'
            //},
            apiCodeMessage: {
                1600: "登录已过期！请重新登录！",
                1601: "您无权更改别人的API信息！",
                1602: "请为您的API命名！",
                1603: "请提供API的请求地址！",
                1604: "API名已占用！请重新输入！",
                1605: "请使用固定规格的JPG、PNG或GIF图像作为API的图片！"
            },
            requirementMessage: {
                1300: "添加API需求失败,请检查填写的数据是否正确",
                1301: "系统名称已占用！请重新输入！",
                1302: "API需求正在审核,不可修改！",
                1303: "请提供系统名称！",
                1304: "获取API需求列表失败,请检查",
                1305: "获取跟踪信息失败,请联系管理员!",
                1306: "操作API需求失败!",
                1307: "修改API需求失败!",
                1308: "获取API需求详情失败!",
                1309: "填写跟踪信息失败!"
            },

            userType: {
                0:'全局管理员',
                1:'系统管理员',
                2:'单位管理员',
                3:'普通用户'
            },

            requirementSatus: {
                online: "线上初评成功通过",
                offline: "线下复评成功通过",
                requirementCloseByOperator: "此需求被管理员成功关闭",
                requirementCloseByOwner: "您成功的关闭了自己发布的需求"
            }
        },
        codeMessage: {
            1: '登录已过期，请重新登录！',
            2: '请先登录您的账号！',
            3: '登录已过期，请重新登录！',
            90: '服务器IO错误',
            91: '文件损坏',
            99: '未知错误',
            600: '节点不能为空!',
            601: '生成license设置的有效期小于当前日期！',
            603: '缺少参数',
            605: '参数不合法',
            700: '禁止访问！',
            701: '当前用户没有权限删除此节点,请联系创建人！',
            702: '此节点部署了API service，所以无法删除此节点！',
            703: '此节点部署在集群上，所以无法删除此节点！',
            704: '路由节点包含APIService，不能删除',
            705: '没有权限访问',
            999: 'failed to get http status with proxy',
            1000: '登录认证失败，用户名或密码不正确',
            1001: '用户名已存在',
            1002: '用户名不存在',
            1003: '邮箱已注册',
            1004: '邮箱未注册',
            1005: '此用户已被冻结',
            1006: '用户别名已存在',
            1008: '该用户待审核',
            1009:'旧密码错误保存失败',
            1100: '距离上次重置密码时间不足24小时，不允许重置密码',
            1500: '获取数据失败！',
            1601: '用户拥有APIService(s)，无法删除此用户！',
            2000: 'iw项目已存在！',
            2012: '部署页面的项目名称冲突',
            2002: '未查询到服务器无法上传API！',
            2003: 'iw文件不合法',
            2004: '未知API服务状态',
            2005: 'iw部署成功，但启动API服务失败，请尝试手动启动',
            2006: '部署iw包失败',
            2010: '不同的api服务，不能使用更新',
            2022: '上传项目失败!',
            2023: '解压项目失败!',
            2024: '传输文件失败!',
            2025: '项目配置文件解析异常!',
            2026: '项目配置文件不存在!',
            2027: 'iw项目已存在!',
            2028: '项目名不能为空!',
            2030: '接口地址已存在!',
            2031: '校验项目名失败!',
            2032: '校验接口地址失败!',
            2033: '获取JVM参数失败!',
            2034: '保存项目配置文件失败!',
            2035: '获取服务器可用端口失败!',
            2036: '服务器可用端口数量不足!',
            2037: '保存项目占用端口失败!',
            2038: '保存项目失败!',
            2039: '项目存放失败!',
            2040: '代理服务配置修改失败!',
            2041: '项目名已被其他服务的接口地址占用!',
            2042: '项目接口地址与项目名重复!',
            2043: '修改运行参数失败!',
            2044: '修改代理失败!',
            3001: '该节点已存在',
            3002: '没有路由节点，不能添加集群',
            3009: 'API服务节点已经存在！',
            3011: 'SSH连接失败！',
            3024: '该主机已被设定为路由节点，不能添加',
            3026: '节点名已存在！',
            3028: '运行节点已被其他管理平台添加，不能重复添加！',
            3029: '运行节点已被其他管理平台添加，不能重复添加！',
            3030: '校验运行服务节点配置失败！',
            3031: '移除运行服务节点配置失败！',
            3032: '运行服务节点已被添加，如需添加，请手动移除配置！',
            5902: '路由节点已被其他管理平台添加，不能重复添加！',
            5903: '路由节点已被其他管理平台添加，不能重复添加！',
            5904: '校验路由节点配置失败！',
            5905: '移除路由节点配置失败！',
            5906: '路由节点已被添加，如需添加，请手动移除配置！',
            3501: '集群已存在！',
            3504: '没有选择主机节点',
            3505: '集群至少添加两个主机节点',
            3506: '此集群中含有API项目,不能删除！',
            3507: '有集群时不能删除路由节点！',
            3508: '创建失败，已存在包含节点完全一致的集群！',
            5000: '授权文件已失效，请重新上传!',
            5001: '授权文件不合法，请重新上传!',
            5005: '此iw包中的项目没有通过license授权！',
            5006: '授权文件已过期，请重新上传!',
            5301: '上传license文件的用户名不匹配',
            5302: '新上传license文件mac地址未包含原始mac地址',
            5303: 'license文件解析异常',
            5304: 'license文件解析异常',
            5305: 'license文件中项目名称为空',
            5306: 'license文件为空',
            5307: 'license文件已过期',
            5308: '老版本license文件不存在mac地址授权字段',
            5309: '老版本license文件不存在项目授权字段',
            5310: 'license未针对此项目授权',
            5601: 'apikey无效，请重新生成！',
            5602: 'apikey已存在，请重新生成！',
            5603: '该开发者已存在！',
            5604: '该开发者未设置apikey，请先设置！',
            5605: '您没有权限，请登录有权限的管理员账号！',
            5606: 'APIKey查询失败，请稍后重试！',
            5652: 'apikey保存失败!',
            5701: '服务器异常，请稍后重试！',
            5702: ' 项目列表不能为空！',
            5801: 'DNS服务器上未安装nginx!',
            5802: '未能重启DNS服务器上的nginx!',
            5803: 'nginx重新加载配置文件失败!',
            5804: 'DNS服务器上找不到nginx的配置文件!',
            5901: '未配置DNS服务器，API只能通过ip地址访问!',
            6002: '部署服务器正在同步API运行时模板，请稍后再试',
            6003: '运行节点未安装jdk',
            6004: '运行节点未安装jsvc',
            6005: '运行节点未安装apache',
            6007: '路由节点未安装NGINX',
            9003: '该参数名已被使用',
            10002: '暂无数据返回',
            11001: '该邮箱已存在',
            13001: '访问系统失败',
            13002: '访问系统失败',
            13003: '请求超时',
            12005: '目录已经被使用，无法删除',
            14001: '申请查看失败',
            14002: '操作失败',
            14004: '获取申请列失败',
            14007: '配置失败',
            14008: '贵单位系统数据权限未提供，暂不支持审批功能！',
            14005: '权限已申请过',
            15001: '私有接口无法访问',
            15002: '共享接口未对该用户授权',
            15003: '共享接口对该用户的授权超时',
            15004: '接口授权状态不存在',
            15005: '接口状态授权验证失败',
            17006: '目录正在被使用，无法删除！',
            1604: "api需求发布失败",
            default: '请求失败，请重试！'

        },
        apiserviceMessage: {
            16: 'API服务停止',
            8: 'API服务无法连接',
            4: 'API服务出现错误',
            2: '源网站改版',
            1: '源网站无法连接',
            0: 'API服务正常',
            OFF: '服务停止',
            SERVICE_OFF: 'reactor无法连接',
            SERVICE_ERROR: 'reactor可以连接但不能正常工作',
            TARGET_UPDATED: '源网站改版',
            TARGET_OFF: '源网站无法连接',
            ON: '服务正常'
        },
        shareStatusMessage: {
            /*0: '不公开',
             1: '半公开',
             2: '公开'*/
            0: '涉敏',
            1: '内部',
            2: '公开'
        },
        htmlCodeMessage: {
            401: '空闲会话超时，请重新登录！',
            404: '未找到请求资源！',
            408: '请求超时，请稍后重试！',
            409: '提交的内容已存在！',
            413: '文件大小超出上传限制',
            500: '服务器异常，请稍后重试！',
            502: '网关错误(502 Bad Gateway),请稍后重试！'
        },
        tags: {
            hottest: 20,
            hotter: 10,
            hot: 5
        },
        userRole: {
            0: '系统管理员',
            1: '全局管理员',
            2: '单位管理员',
            3: '单位用户',
        }
    },

    analytics: {
        period: {
            onehour: {
                key: 'onehour',
                value: '过去1小时'
            },
            today: {
                key: 'today',
                value: '今天'
            },
            sevenDay: {
                key: 'sevenDay',
                value: '最近7天'
            },
            thirtyDay: {
                key: 'thirtyDay',
                value: '最近30天'
            },
            custom: {
                key: 'custom',
                value: ''
            }
        },
        table: {
            pagination: {
                pageSize: 10,
                maxPage: 12,
            }
        }
    },

    onBeforeStart: function () {
        // console.log('App before:start');
    },

    onStart: function () {
        function currentRoute() {
            return (_.isEmpty(Backbone.history.fragment)) ? null : Backbone.history.fragment;
        }

        if (Backbone.history) {
            Backbone.history.start();
            Backbone.history.navigate(currentRoute(), {trigger: true});
        }
    },

    // 转换时间戳
    tools: {
        parseTime: function (ts, type) {
            let date = new Date(ts),newData;
            //return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

            var hours = date.getHours();
            if (hours < 10) {
                hours = '0' + hours;
            }
            var minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            var seconds = date.getSeconds();
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            var month = date.getMonth() + 1;
            if (month < 10) {
                month = '0' + month;
            }
            var day = date.getDate();
            if (day < 10) {
                day = '0' + day;
            }
            if (type == 1) {
                newData = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +
                    (date.getDate()) + " " +
                    (hours) + ":" +
                    (minutes) + ":" +
                    (seconds);
            } else {
                newData = date.getFullYear() + "-" + ( month ) + '-' + (day);
            }


            return newData;
        }
    }
}))();

App.initialize = function () {
    this.config.domain = location.protocol + '//' + location.host + '/';
    this.config.apiBase = this.config.domain + 'yanphone-rest/';
    if (store.get('token')) {
        this.config.username = store.get('username');
        this.config.userType = store.get('userType');
        this.config.displayName = store.get('displayName');
        this.config.token = store.get('token');
        this.config.email = store.get('email');
        this.config.notificationEmail = store.get('notificationEmail');
    }
    this.layout = new LayoutView();
    this.layout.render();
    this.checkToken();
};

App.getEventTarget = function (_event) {
    return $(_event.target || _event.srcElement);
};

App.errorAlert = function (data) {

    if (data.status == "413") {
        Alert.openAlert({message: App.config.message.tooLarge});
        return;
    } else if (data.responseText && (data.responseText.indexOf("code") == -1 || data.responseText.indexOf("message") == -1 || data.responseText.indexOf("data") == -1)) {
        if (data.status && App.config.htmlCodeMessage[data.status]) {
            Alert.openAlert({message: App.config.htmlCodeMessage[data.status]});
        } else {
            Alert.openAlert({message: App.config.codeMessage.default});
        }
        return;
    } else if (data.responseText && data.responseText != '') {

        data = JSON.parse(data.responseText);
    }

    if (data.code == 1 || data.code == 2 || data.code == 3) {
        Backbone.history.navigate('login', {trigger: true});
    }
    let message = App.config.codeMessage.default;
    try {

        if (data.code && App.config.codeMessage[data.code]) {
            message = App.config.codeMessage[data.code];
        } else if (App.config.htmlCodeMessage[data.status]) {
            data = JSON.parse(data.responseText);
            if (data.code && App.config.codeMessage[data.code]) {
                message = App.config.codeMessage[data.code];
            } else {
                message = App.config.htmlCodeMessage[data.status];
            }
        }
    } finally {
        Alert.openAlert({message: message});
    }
};

App.pushState = function (path) {
    if (window.history.pushState == null) {
        let pathSplit = path.split("#");
        if (pathSplit == 1) {
            Backbone.history.navigate('', {trigger: true});
        } else {
            Backbone.history.navigate(path.replace(new RegExp(pathSplit[0] + "#"), ""));
        }
    } else {
        window.history.pushState(null, "", path);
    }
};

App.checkToken = function () {
    $.ajax({
        url: `${this.config.apiBase}v3/auth/checkToken`,
        type: "GET",
        async: false,
        headers: {'yanphone-token': this.config.token},
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data.code != App.config.code.success) {
                Backbone.history.navigate('login', {trigger: true});
            }
            //else {
            //    App.ifAdmin();
            //}
        },
        error: function (data) {
            Backbone.history.navigate('login', {trigger: true});
            window.location.replace("#login");
        }
    });
};
App.checkAuth = function () {
    if (this.config.token && this.config.token != '') return true;
    Backbone.history.navigate('login', {trigger: true});
    return false;
};

export default App;