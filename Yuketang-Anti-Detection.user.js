// ==UserScript==
// @name         Yuketang-Anti-Detection
// @namespace    https://github.com/DeepChirp/Yuketang-Anti-Detection
// @version      1.0
// @description  阻止雨课堂检测控制台、切屏、暂停等
// @match        *://*.yuketang.cn/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // source:
    // if (!_util_util_js__WEBPACK_IMPORTED_MODULE_15__/* ["default"] */ .A.isMobile) {
    //     this.interval = _babel_runtime_corejs3_core_js_stable_set_interval__WEBPACK_IMPORTED_MODULE_13___default()(function () {
    //         if (_this10.player) {
    //             var focus = document.hasFocus();
    //             if (!focus && _this10.is_open_anti_brushing) {
    //                 _this10.player.video.pause();
    //             }
    //         }
    //     }, 2000);
    // }
    // 劫持 document.hasFocus，使其永远返回 true
    Object.defineProperty(document, 'hasFocus', {
        value: function () { return true; },
        configurable: true
    });

    // 劫持 sessionStorage.setItem，拦截 hasBlocked 字段
    const oldSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function (key, value) {
        if (key === 'hasBlocked') {
            console.warn('[拦截] 阻止写入 hasBlocked 标志');
            return;
        }
        return oldSetItem.apply(this, arguments);
    };

    // 劫持 window.dispatchEvent 防止伪造 setItemEvent
    const oldDispatchEvent = window.dispatchEvent;
    window.dispatchEvent = function (event) {
        if (event && event.type === 'setItemEvent') {
            console.warn('[拦截] 阻止伪造 setItemEvent 事件');
            return true;
        }
        return oldDispatchEvent.apply(this, arguments);
    };

    // 劫持 window.addEventListener，阻止监听 setItemEvent
    const oldAddEventListener = window.addEventListener;
    window.addEventListener = function (type, listener, options) {
        if (type === 'setItemEvent') {
            console.warn('[拦截] 阻止添加 setItemEvent 监听器');
            return;
        }
        return oldAddEventListener.call(this, type, listener, options);
    };
})();
