'use strict'
let localStorageData={}

/** 设置本地存储
 *  @param {string} key 本地存储key值
	@param {object} due 存储的对象
 */
localStorageData.set=function(key,data){
	console.log('localStorageData》》set', key);
    let storageData={
        timestamp:new Date().getTime(),
        data:data,
    }
    console.log(storageData.timestamp)
    localStorage.setItem(key,JSON.stringify(storageData))
}

/** 获取本地存储
 *  @param {string} key 本地存储key值
	@param {number} due 过去秒数
 */
localStorageData.get=function(key,due){
    let storageData = JSON.parse(localStorage.getItem(key));
    let d = new Date().getTime();
    console.log( 'get', key, storageData);
    if(!storageData ){
    	return { timeout: true, data: null}
    }else{
    	if(d-storageData.timestamp > due *1000){
    		return { timeout: true, data: storageData.data}
    	}else{
    		console.log(d-storageData.timestamp )
    		return { timeout: false, data: storageData.data}
    	}
    }
}

export default localStorageData;

