/**
 * @file   : 移动端原生视频播放组件
 * @author : David
 * @update : 2016-06-17 13:11:35
 */

import util from './util.js';
const isiOS = util.isiOS();
const isWechatBrowser = util.isWechatBrowser();
// const androidVersion  = parseInt(util.getAndroidVersion());
let body = $('body');

let androidTpl = `
<div class="mvPlayer" id="mvPlayer">
    <div class="mvPlayer__close" data-role="mv-close"></div>
    <div class="mvPlayer__wrapper">
        <div class="mvPlayer__body" data-role="mv-content">
            <img class="mvPlayer__poster" src="http://assets.dwstatic.com/common/img/blank.png" data-role="mv-poster" alt="poster"/>
            <div class="mvPlayer__loading" data-role="mv-loading">视频加载中...</div>
            <div class="mvPlayer__play" data-role="mv-paly"></div>
        </div>
    </div>
</div>
`;

let iOSTpl = `
<div class="mvPlayerPreloader" data-role="mv-preloader">
    <div class="mvPlayerPreloader__loading" data-role="mv-loading">视频加载中...</div>
</div>
`;

// 创建视频组件
const createPlyercomponent = (() => {
    const template = isiOS ? iOSTpl : androidTpl;
    const style = require('./index.scss');

    body.append('<style>' + style + '</style>' + template);
})();

const mvPlayer = $('#mvPlayer');
const mvPlayerContent = mvPlayer.find('[data-role="mv-content"]');
const mvPlayerPoster = mvPlayer.find('[data-role="mv-poster"]');
const mvPlayerPlay = mvPlayer.find('[data-role="mv-paly"]');
const mvPlayerExitBtn = mvPlayer.find('[data-role="mv-close"]');
const mvPlayerPreloader = $('[data-role="mv-preloader"]');

let videoObject = null; // 存放播放器
let isiOSPlaying = false;
const pixelRatio = window.devicePixelRatio;
const screenHeight = window.screen.height;

let main = {

    // 创建视频
    createVideo(option) {
        const video = document.createElement('video');
        // video.id = option.mvid;
        video.controls = 'controls';

        // iOS与Android4.1(包括)以上优先读取m3u8
        // if (isiOS || androidVersion >= 4.1) {
        //     if (option.m3u8) {
        //         video.src = option.m3u8;
        //     } else {
        //         video.src = option.mp4;
        //     }
        // } else {
        //     // Android4.0(包括)以下使用mp4
        //     video.src = option.mp4;
        // }

        if (option.m3u8) {
            video.src = option.m3u8;
        } else {
            video.src = option.mp4;
        }

        // 安卓微信设置循环播放（为了去广告 ==!）
        if (isWechatBrowser && !isiOS) {
            video.loop = true;
        }

        return video;
    },

    // 插入视频
    insertVideo(tpl) {
        let video = mvPlayerContent.find('video');
        if (video.length) {
            video.remove();
        }
        mvPlayerContent.append(tpl);
    },

    // 获取视频信息
    getVideoInfo(trigger, options) {
        let videoOption = {
            mp4: trigger.data('mp4'),
            m3u8: trigger.data('m3u8'),
        };

        // 设置封面图
        if (!isiOS) {
            mvPlayerPoster.attr('src', trigger.data('poster'));
        }

        return videoOption;
    },

    // iOS播放
    playForiOS(again) {
        let isPlayed = false;
        // 防止快速点击
        if (isiOSPlaying) {
            mvPlayerPreloader.removeClass('is-show');
        } else {
            isiOSPlaying = true;
            mvPlayerPreloader.addClass('is-show');
        }

        videoObject.play();
        if (!again) {
            // 通过timeupdate获取currentTime判断是否已经开始播放
            videoObject.addEventListener('timeupdate', () => {
                if (videoObject.currentTime > 0 && !isPlayed) {
                    mvPlayerPreloader.removeClass('is-show');
                    isiOSPlaying = false;
                    isPlayed = true;
                }
            }, false);
        }


        videoObject.addEventListener('webkitbeginfullscreen', () => {
            mvPlayerPreloader.removeClass('is-show');
        }, false);
    },

    // Android播放
    playForAndroid(again) {
        let isPlayed = false;
        const isSupportCurrentTime = 'currentTime' in videoObject ? true : false;
        mvPlayer.addClass('is-full');
        this.preventScroll();

        // 部分安卓机的部分环境，执行时机有差异
        if (again) {
            this.setPlayingStatus();
            setTimeout( () => {
                videoObject.play();
            }, 500)
        } else {
            setTimeout(() => {
                if (isSupportCurrentTime && videoObject.currentTime === 0) {
                    videoObject.play();

                    // 通过timeupdate获取currentTime判断是否已经开始播放
                    videoObject.addEventListener('timeupdate', () => {
                        if (videoObject.currentTime > 0 && !isPlayed) {

                            // 设置横/竖屏样式，注①loadedmetadata事件目前在移动端可靠性不高（2016-06-09）
                            if (videoObject.videoWidth > videoObject.videoHeight) {
                                mvPlayer.addClass('is-landscape');
                            } else {
                                let videoHeight = $(window).height() - 100;
                                $(videoObject).css('height', videoHeight + 'px');
                            }

                            this.handleStartPlay();
                            isPlayed = true;
                        }
                    }, false);
                } else {
                    this.handleStartPlay();
                }
                this.handleAndroidBrower();
            }, 100);
        }
    },

    // 点击播放之后
    handleStartPlay() {
        let fixTimer = null;
        this.setPlayingStatus();

        clearTimeout(fixTimer);

        // 处理自动全屏播放的机子
        fixTimer = setTimeout(() => {
            this.fixAutoFullscreen();
        }, 100);
    },

    // 设置模拟全屏的状态
    setPlayingStatus() {
        mvPlayer.addClass('is-playing').removeClass('is-palyed');
    },

    // 防止全屏时页面滚动
    preventScroll() {
        if (mvPlayer.hasClass('is-full')) {
            body.on('touchmove', (e) => {
                e.preventDefault();
            });
        } else {
            body.off('touchmove');
        }
    },

    // 退出全屏
    exitFullscreen(isOrigin = true) {
        mvPlayer.removeClass('is-full');
        this.preventScroll();
        videoObject.pause();
        if (isOrigin) {
            let exitTimer = null;
            mvPlayer.attr('class', 'mvPlayer');

            // 回收原来的视频
            clearTimeout(exitTimer);

            exitTimer = setTimeout(() => {
                $(videoObject).remove();
                videoObject = null;
            }, 100);
        }
    },

    // 处理部分自动全屏播放的机子
    fixAutoFullscreen() {
        if (document.webkitFullscreenElement) {
            this.exitFullscreen(false);
        } else {
            const videoWidth = $(videoObject).width();
            if (videoWidth === screenHeight || videoWidth === screenHeight / pixelRatio) {
                this.exitFullscreen(false);
            }
        }
    },

    // 播放结束后对安卓浏览器的处理
    handleAndroidBrower() {
        videoObject.addEventListener("ended", () => {
            const videoWidth = $(videoObject).width();
            if (!document.webkitFullscreenElement && videoWidth !== screenHeight && videoWidth !== screenHeight / pixelRatio) {
                mvPlayer.removeClass('is-playing').addClass('is-palyed');
            }
        });
    },

    // 处理点击事件
    handleEvent(options) {
        const tiggerSelector = options.trigger; // 每个视频item的选择器
        const waitTime = isiOS ? 1500 : 100;
        $(document).on('click', tiggerSelector, util.debounce((event) => {
            // let isPlayed  = false;
            const target = $(event.target);
            const trigger = target.is(tiggerSelector) ? target : target.parents(tiggerSelector);
            let videoOpts = this.getVideoInfo(trigger, options);
            let again=false;

            //换视频或者第一次才插入视频
            if (videoObject == null || videoObject.src != videoOpts.m3u8 || target.attr('data-live')) {
                videoObject = this.createVideo(videoOpts);
                this.insertVideo(videoObject);

            } else {
                again = true;
            }

            if (isiOS) {
                this.playForiOS(again);
            } else {
                this.playForAndroid(again);

            }

        }, waitTime, true));

        if (!isiOS) {
            // 点击关闭按钮退出全屏【这里touchend可能会导致点透】
            mvPlayerExitBtn.on('click', () => {
                this.exitFullscreen();
            });

            // 防止网络堵塞进入全屏后无法立即播放，退出全屏后可以手动触发再次播放
            mvPlayerPlay[0].addEventListener('touchend', () => {
                if (videoObject) {
                    videoObject.play();
                    this.setPlayingStatus();
                }
            }, false);
        }
    },

    setStyleType(options) {
        if (options.type === 'me') {
            mvPlayer.data('type', 'me');
            mvPlayerPreloader.data('type', 'me');
        }
    },

    init(options) {
        this.handleEvent(options);
        this.setStyleType(options)
    }

};

let defaults = {
    type: 'normal',
    trigger: '[data-role="mv-item"]',

    //  播放列表
    playList: [{
        id: '',
        poster: '',
        mp4: '',
        m3u8: ''
    }]
};

exports.init = (options) => {
    let opts = $.extend({}, defaults, options);
    main.init(opts);
};