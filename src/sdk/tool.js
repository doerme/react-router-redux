import WECHAT from './wechatshare.js'

let tool = {}

tool.lauchApp = function(uid) {
	let u = navigator.userAgent;
	let isiOS = !! u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
	let command = uid || isAndroid ? 'command=profile' : '';
	let self = this,
		links = "http://res2.yy.com/me_lauch/index.html?",
		url = links + command + "&uid=" + uid;
	window.location.href = url;
}

tool.isInWechat = function(){
	return /micromessenger/.test(navigator.userAgent.toLowerCase());
}

tool.injectWechatShare = function(shareData){
	console.log('injectWechatShare', shareData);
	var wecharsdk = document.getElementById('wecharsdk');
	if(!wecharsdk){
		var script = document.createElement('script');
		script.id = 'wecharsdk'
	    script.src = 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js';
	    document.body.appendChild(script);
    }
	WECHAT({
	    title: shareData.title,
	    desc: shareData.desc,
	    link: shareData.link, /*默认值是当前页面连接*/
	    img: shareData.img,
	    success_callback: function(){},  /*分享成功回调*/
	    cancel_callback: function(){},   /*分享失败回调*/
	    debug: false /*是否启用调试*/
	})
	
}

tool.numberFormat = function(num){
	let tmpnum = num / 10000;
	if(num >= 1000000){
		return Math.round(tmpnum) + 'w';
	}else if(num >= 10000){
		return Math.round(tmpnum*Math.pow(10,1))/Math.pow(10,1) + 'w'; 
	}else{	
		return num;
	}
}

export default tool;