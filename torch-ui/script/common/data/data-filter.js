/**
 * @desc 代码集转换的过滤器
 * @param key String 代码
 * @param val String 代码值不存在时返回的值
 * @return String 代码对应的代码值
 */
angular.module('common.data').filter('dict', function(){
	return function(val, key){
		if(!key){
			return '';
		}
		if(typeof key == 'object'){
			var ret = key[val] || '';
		}else if(typeof key == 'string'){
			ret = Torch.dict.getText(key, val);
		}else{
			ret = '';
		}
		return ret;
	}
});

/**
 * @desc 代码集转换的过滤器
 * @param key String 代码
 * @param val String 代码值不存在时返回的值
 * @return String 代码对应的代码值
 */
angular.module('common.data').filter('value', function(){
	return function(val, key){
		console.log(key);
		if(!key){
			for(var i in val){
				if(val[i]=='('){
					var ret=val.substring(0,i);
					console.log(val.substring(0,i));
				}
			}
			return ret;
		}
		
		
	}
});
/**
 * @desc 时间截取
 * @param 去除时分秒，只留下日期
 * @example vm.appdatte | timeDate
 */
angular.module('common.data').filter('timeDate', function(){
	return function(val){
		if(val){
			var timeDate = val.substring(0,10);
		}
		return timeDate;
	}
});

/**
 * @显示中文
 */
angular.module('common.data').filter('codePreview', function(){
	return function(val){
		if(isNaN(val)){
			return Torch.tableCols.getName(val);
		}
		//如果是序号  不进行编译
		return val
	}
});

/**
 * @显示代码和中文
 */
angular.module('common.data').filter('codePreviews', function(){
	return function(val){
		//如果是序号  不进行编译
		if(isNaN(val)){
			var ret = Torch.tableCols.getName(val);
			if(ret == val){
				return val
			}
			return ret + '--' + val;
		}
		
		return val
	}
});

/**
 * @毫秒数转正常格式
 */
angular.module('common.data').filter('milliseconds', function(){
	return function(val){
		if(!val){
			return ''
		}
		var unixTimestamp = new Date( val ) ;
		var commonTime = unixTimestamp.toLocaleString();
		return commonTime;
	}
});


/**
 * @毫秒数转正常格式
 */
angular.module('common.data').filter('oprFilter', function(){
	return function(val){
		//等于： 1，  大于 2， 小于3， 大于等于 4，  小于等于5，包含 6， 前like7, 后like8.
		if(val == 1){
			return '等于'
		}else if(val == 2){
			return '大于'
		}else if(val == 3){
			return '小于'
		}else if(val == 4){
			return '大于等于'
		}else if(val == 5){
			return '小于等于'
		}else if(val == 6){
			return '包含'
		}else if(val == 7){
			return '匹配开头'
		}else if(val == 8){
			return '匹配结尾'
		}else if(val == 9){
			return '模糊匹配'
		}else{
			return val
		}
	}
});

/**
 * @日期转换
 */
angular.module('common.data').filter('weekFile', function(){
	return function(val){
		//等于： 1，  大于 2， 小于3， 大于等于 4，  小于等于5，包含 6， 前like7, 后like8.
		if(val == 1){
			return '星期一'
		}else if(val == 2){
			return '星期二'
		}else if(val == 3){
			return '星期三'
		}else if(val == 4){
			return '星期四'
		}else if(val == 5){
			return '星期五'
		}else if(val == 6){
			return '星期六'
		}else if(val == 7){
			return '星期七'
		}else{
			return val
		}
	}
});