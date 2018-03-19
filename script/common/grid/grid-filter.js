/**
 * @desc 列表序号的过滤器
 * @param input String or Number 当页列表中的序号
 * @param pageNum String or Number 列表的当前页数
 * @param pageSize String or Number 列表的每页条数
 * @return String 所有数据中的的序号
 */
angular.module('common.grid').filter('pageIndex', function(){
	return function(input, pageNum, pageSize){
		var inputNum = Number(input);
		if(isNaN(inputNum)){
			return '';
		}
		if(!pageNum){
			pageNum = 1;
		}
		pageNum = Number(pageNum);
		if(isNaN(pageNum)){
			pageNum = 1;
		}
		if(!pageSize){
			pageSize = 10;
		}
		pageSize = Number(pageSize);
		if(isNaN(pageSize)){
			pageSize = 10;
		}
		return inputNum + (pageNum - 1) * pageSize + 1 +'';
	}
});
/**
 * @desc 列表某一列总和的过滤器
 * @data 包含一组数据的数组变量名
 * @key  要计算的数据的属性名
 * @return 计算的总和
 */
angular.module('common.grid').filter('sumOfItems', function(){
	return function(data,key){
		if(data == null || key == null){
			return 0;
		}
		var sum=0,len=data.length;
		for(var i=0;i<len;i++){
			if(!data[i][key]){
				return sum;
			}
			sum += parseInt(data[i][key]);
		}
		return sum;
	}
});