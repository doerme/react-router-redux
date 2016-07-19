/**
 * @file 工具
 * @update 2016-03-24 21:40:22
 */

export default {

    isiOS() {
        return (/iPhone|iPad|iPod/i).test(navigator.userAgent || navigator.vendor || window.opera);
    },

    isWechatBrowser() {
        return (/micromessenger/i).test(navigator.userAgent);
    },

    // /**
    //  * 获取Android版本号
    //  *
    //  * @param {string} userAgent
    //  * @return {string} 返回
    //  */
    // getAndroidVersion(ua) {
    //     ua = (ua || navigator.userAgent).toLowerCase();
    //     var match = ua.match(/android\s([0-9\.]*)/);
    //     return match ? match[1] : false;
    // },

    /**
     * 函数去抖
     *
     * @param {Function} callback 回调函数
     * @param {number} wait 等待 wait 毫秒之后才执行
     * @param {boolean} immediate 是否立即执行
     * @return {Function} 返回
     */
    debounce(callback, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) {
                    callback.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                callback.apply(context, args);
            }
        };
    },

    /**
     * 检测某对象是否支持某事件
     *
     * @param {string} eventName 事件名称
     * @param {object} element 检测对象
     * @return {boolean} true|false
     * @example isEventSupport('click', document); // 检测document是否支持click事件
     */
    isEventSupport(eventName, element) {
        var TAGNAMES = {
            'select': 'input',
            'change': 'input',
            'submit': 'form',
            'reset': 'form',
            'error': 'img',
            'load': 'img',
            'abort': 'img'
        };

        function is(obj, type) {
            return typeof obj === type;
        }

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

        var isSupported = eventName in element;

        if (!isSupported) {
            if (!element.setAttribute) {
                element = document.createElement('div');
            }
            if (element.setAttribute && element.removeAttribute) {
                element.setAttribute(eventName, '');
                isSupported = is(element[eventName], 'function');

                if (!is(element[eventName], 'undefined')) {
                    element[eventName] = undefined;
                }
                element.removeAttribute(eventName);
            }
        }

        element = null;
        return isSupported;
    }

};