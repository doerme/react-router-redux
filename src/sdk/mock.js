// 测试
// 模拟sdk接口测试
// window.sdk.test();

export default () => {

	window.sdk = {};

	window.sdk.init = (callback) => {
		// 测试
		// --------------------------------------------------------------------------------

		// 获取用户信息
		window.sdk.getUser = (cb) => {
			cb({
				uid: 1000008,
			})
		}

		// 获取渠道测试
		window.sdk.getChannel = (cb) => {
			cb('tx');
		};

		window.sdk.refresh = {
			cb  : ()   => {},
			init: (cb) => {
				// console.log('sdk refresh init');
				window.sdk.refresh.cb = cb;
			},
			complete: () => {
				// console.log('sdk refresh complete');
			},
			auto: (time = 5000) => {
				setInterval(() => {
					console.log('模拟测试下拉刷新');
					window.sdk.refresh.cb();
				}, time);
			}
		}

		window.sdk.hideLoading = () => {
			console.log('模拟隐藏原生loading');
		}

		// 模拟请求
		window.sdk.request = ({
			url  = '',
			data = {},
			cb   = '',
			callback = () => {},
		} = {}) => {
			if(url === ''){
				return false;
			}
			try {
				Vue.http.jsonp(url, {
					data: JSON.stringify(data),
				}).then((response) => {
					if(cb){
						eval(cb + '(' + response.data.data + ')');
						return
					}
					if (callback) {
						callback(response.data.data);
						return
					}
				}, (response) => {
					if(cb){
						eval(cb + '(' + response + ')');
						return
					}
					if (callback) {
						callback(response);
						return
					}
				});
			} catch (e) {
				if(cb){
					eval(cb + '()');
					return
				}
				if (callback) {
					callback();
					return
				}
			}
		}

		// 模拟广播
		window.sdk.activityRank = {
			start () {}
		};

		// 模拟关闭直播
		window.sdk.livesClosed = () => {

		};

		window.sdk.view = {
			show: () => {},
			hide: () => {},
		}

		window.sdk.dataReport = () => {

		}

		// --------------------------------------------------------------------------------
		callback();
	}

}
