export default () => {
	window.sdk = {
		initCb: () => {
		},
		init: function(cb){
			this.initCb = cb;
		},
	};

	// 统一回调构造器
	let cbConstructor = (result, error, cb) => {
		if(error){
			console.error('SDK 返回失败');
			cb('', error);
		}else{
			if(typeof result.raw === 'string' && result.raw.substr(0 ,1) === '{'){
				cb(JSON.parse(result.raw));
			}else{
				cb(result.raw);
			}
		}
	}

	// 初始化
	let sdkInit = () => {

		let u = navigator.userAgent;
		let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

		// 开启日志
		window.sdk.console = (key) => {
			nativeApp.useNativeConsole = key;
		}

		// 客户端自动获取直播列表
		window.sdk.requestLiveList = (allLivesData) => {
			if(isiOS){
				window.requestLiveList = () => {
					if(allLivesData){
						console.log('获取直播列表: ', allLivesData);
				    	return allLivesData;
					}
				}
			}else{
				window.requestLiveList = () => {
					if(allLivesData){
						console.log('获取直播列表: ', allLivesData);
						nativeApp.onLiveList(JSON.stringify(allLivesData));
					}
				}
			}
		}

		// 注册事件----------------------------------------------------------------------------------

		// 下拉刷新
		window.sdk.refresh = {
			state: false,
			cb   : ()   => {},
			init : (cb) => {
				window.sdk.refresh.cb = cb;
				nativeApp.bindEvent('PullToRefresh', (result, error) => {
					window.sdk.refresh.state = true;
					cb();
				});
			},
			complete: () => {
				window.sdk.refresh.state = false;
				nativeApp.exec('endPullToRefresh', [], null);
			},
			auto: (time = 5000) => {
				setInterval(() => {
					console.log('模拟测试下拉刷新');
					window.sdk.refresh.cb();
				}, time);
			}
		}


		// 视图显示 / 隐藏
		window.sdk.view = {
			show: (cb) => {
				nativeApp.bindEvent('ViewDidAppear', (result, error) => {
					cb();
				});
			},
			hide: (cb) => {
				nativeApp.bindEvent('ViewDidDisappear', (result, error) => {
					cb();
				});
			},
		}

		// 直播关闭回调
		window.sdk.livesClosed = (cb) => {
			nativeApp.bindEvent('LivesClosed', (result, error) => {
				cbConstructor(result, error, cb);
			});
		}

		// 荣耀直播 开启 / 关闭
		window.sdk.activityRank = {
			start: (cb) =>{
				nativeApp.bindEvent('RushActivityRank', (result, error) => {
					cbConstructor(result, error, cb);
				});
			},
			stop: (cb) => {
				nativeApp.bindEvent('StopActivityRank', (result, error) => {
					cbConstructor(result, error, cb);
				});
			}
		}

		/*
			更新分享信息接口
			@param shareData
			{
			    shareTitle: '分享标题', 
			    shareIcon: '分享图片URL', 
			    shareLink: '分享的链接URL', 
			    shareText: '分享的内容'
			}
		*/
		window.sdk.updateShareInfo = (shareData, cb) => {
			nativeApp.exec('updateShareInfo', [JSON.stringify(shareData)], (result, error) => {
				cbConstructor(result, error, cb);
			});
		}

		// -------------------------------------------------------------------------------------

		// ios 获取黑名单
		window.sdk.getBlackUsers = (cb) => {
			nativeApp.exec('getBlackUsers', [], (result, error) => {
				cbConstructor(result, error, cb);
			})
		}

		// 获取用户信息
		window.sdk.getUser = (cb) => {
			nativeApp.exec('requestLoginInfo', [], (result, error) => {
				cbConstructor(result, error, cb);
			})
		}

		// 跳转到个人页面
		window.sdk.jumpProfile = (uid) => {
			nativeApp.exec('jumpProfile', [uid], null);
		}


		// 网络请求
		window.sdk.request = ({
			url      = '',
			data     = {},
			callback = () => {},
		} = {}) => {
			if(url === ''){
				return;
			}
			// 判断是否记录性能
			window.env && window.env.performance && window.env.performance.auto.start(url);
			nativeApp.exec('networkRequest', [url, JSON.stringify(data)], (result, error) => {
				window.env && window.env.performance && window.env.performance.auto.end(url);
				cbConstructor(result, error, callback);
			});
		}

		// 数据上报
		window.sdk.dataReport = (...webData) => {
			webData.forEach((item, index) => {
				if(typeof item === 'object'){
					webData[index] = JSON.stringify(item);
				}
			})
			console.log('dataReport', webData);
			nativeApp.exec('dataReport', webData, null);
		}

		// Toast提示
		window.sdk.toast = {
			error: (title = '', detail = '') => {
				nativeApp.exec('nativeShowErrorToast', [title, detail], null);
			},
			success: (title = '', detail = '') => {
				nativeApp.exec('nativeShowSuccessToast', [title, detail], null);
			},
		}

		// 进入话题
		window.sdk.jumpTopic = (args) => {
			if(args.indexOf('#') >= 0){
				args = args.replace(/#/g, '');
			}
			nativeApp.exec('jumpTopic', [args], null);
		}

		// 进入 H5 链接
		window.sdk.jumpLink = (title, link) => {
			nativeApp.exec('jumpLink', [JSON.stringify({
				link : link,
				title: title,
			})], null);
		}

		// 焦点图跳转
		window.sdk.jumpBanner = (banner) => {
			nativeApp.exec('jumpBanner', [JSON.stringify(banner)], null);
		}

		// 进入直播
		window.sdk.jumpLive = (uid, lid) => {
			let args = {
				'command'  : 'live', 	   					 // iOS无用，需确定Android
				'uid'      : uid || 0,
				'lid'      : lid || '',	  					 // iOS无用，需确定Android
				'sid'      : 0, 		   					 // iOS无用，需确定Android
				'title'    : '', 		   					 // iOS无用，需确定Android
				'startTime': new Date().getTime(),		     // iOS无用，需确定Android
			};
			nativeApp.exec('jumpLive', [JSON.stringify(args)], null);
		}

		// 跳转到搜索
		window.sdk.jumpSearch = () =>{
			nativeApp.exec('jumpSearch', [], null);
		}

		// 从发现页面进入直播页
		window.sdk.discoveryToLive = (currentLive, liveList) => {
			nativeApp.exec('discoveryToLive', [JSON.stringify(currentLive), JSON.stringify(liveList)], null);
		}

		// 从关注列表进入直播页
		window.sdk.followToLive = (currentLive, liveList) => {
			nativeApp.exec('followToLive', [JSON.stringify(currentLive), JSON.stringify(liveList)], null);
		}

		// 从h5进入直播页
		window.sdk.h5ToLive = (currentLive, liveList) => {
		    let args = {
		        'command'  : 'live', 	   					 // iOS无用，需确定Android
		        'uid'      : 0,
		        'lid'      : '',	  					     // iOS无用，需确定Android
		        'sid'      : 0, 		   					 // iOS无用，需确定Android
		        'title'    : '', 		   					 // iOS无用，需确定Android
		        'startTime': new Date().getTime(),		     // iOS无用，需确定Android
		    };
		    Object.keys(currentLive).forEach((key) => {
		        args[key] = currentLive[key];
		    });
		    nativeApp.exec('h5ToLive', [JSON.stringify(args), JSON.stringify(liveList)], null);
		};

		// 获取渠道接口
		window.sdk.getChannel = (cb) => {
			nativeApp.exec('requestChannel', [], (result, error) => {
				cbConstructor(result, error, cb);
			});
		};

		// 加载动画消隐
		window.sdk.hideLoading = () => {
			nativeApp.exec('nativeDismissLoading', [], null);
		}

		// 获取浏览记录
		window.sdk.requestBrowseHistory = (cb) => {
			nativeApp.exec('requestBrowseHistory', [], (result, error) => {
				cbConstructor(result, error, cb);
			});
		}

		// 获取Token
		window.sdk.getToken = (cb) => {
			nativeApp.exec('refreshToken', [], (result, error) => {
				cbConstructor(result, error, cb);
			});
		}

		// 打开个人资料卡
		window.sdk.showUserCard = (uid) => {
			nativeApp.exec('showUserCard', [JSON.stringify({
				uid,
			})], null);
		}

		// 开启直播
		window.sdk.startLive = (topic) => {
			if(topic){
				nativeApp.exec('startLive', [topic], null);
			}else{
				nativeApp.exec('startLive', [], null);
			}
		}

		// 判断是否为游客
		window.sdk.isGuest = (cb) => {
			if(!isiOS){
				nativeApp.exec('isGuest', [], (result, error) => {
					cbConstructor(result, error, cb);
				});
			}
		}

		// 已浏览更新
		window.sdk.updateBrowsed = (lid) => {
			let args = [
			    {
			        lid,
			        time: (new Date()).getTime(),
			    },
			];
			nativeApp.exec('updateBrowsed', [JSON.stringify(args)], null);
		}

		// 调出UIActionSheet
		window.sdk.showActionSheet = ({
			title    = '',
			options  = [],
			callback = () => {},
		}) => {
			nativeApp.exec('showActionSheet', [title, JSON.stringify(options)], (result, error) => {
				cbConstructor(result, error, callback);
			});
		}

		// 调起登录的ui
		window.sdk.signIn = () => {
		    nativeApp.exec('signIn', [], null);
		};

		console.log('SDK init complete');

		window.sdk.initCb();

	}

	// sdk 注入成功回调
	document.addEventListener('deviceready', () => {
		// 设置使用原生me_loading
    	nativeApp.useNativeLoading = true;

		sdkInit();
	})

}
