import sdkMock from './mock';
import sdk from './sdk-fun';

window.env   = {};
let ua = navigator.userAgent;

Object.defineProperty(window.env, 'init', {
	get: ()=>{
		return (param) => {
			let domain = 'http://me.yy.com';
			let auth   = '';
			// 默认判断 ua 自动判断环境
			if(typeof param.inApp == 'undefined' || param.inApp === 'auto'){
				if(ua.indexOf('Ourtimes') >= 0){
					param.inApp = true;
				}else{
					param.inApp 	  = false;
					param.performance = true;
				}
			}

			let uaEnv = ua.split('Environment/');
			if(uaEnv.length > 1){
				if(uaEnv[1].slice(0, 4) === 'Test'){
					param.online      = false;
					param.performance = true;
				}else{
					param.online      = true;
					param.performance = false;
				}
			}

			if(!param.online){
				domain   = 'http://test.me.yy.com';
			}

			if(!param.inApp){
				auth = 'auth=no2';
				sdkMock();
			}else{
				auth = 'blank=yes';
				if(!param.sdk){
					param.sdk = 'auto';
				}
				sdk();
			}



			window.env.url = {};

			if(param.url){
				for(let k in param.url){
					let url = param.url[k];
					if(url.indexOf('http://') < 0 && url.indexOf('https://') < 0){
						url = domain + url;
					}
					if (auth) {
						if(url.indexOf('?') >= 0){
							url += '&' + auth;
						}else{
							url += '?' + auth;
						}
					}
					window.env.url[k] = url;
				}
			}
		}
	}
})