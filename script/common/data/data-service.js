/**
 * @desc 数据提交的服务
 * @property submit Function 数据提交的方法
 * 		submit(obj) obj是一个数据提交参数
 * 		obj Object {url: '数据提交的路径', param: '数据提交的参数', validate: '提交是校验的表单', loading: true/flase(是否显示loading)}
 * 
 * @return obj Promise 
 * 		obj.then(请求成功的回调方法,请求失败的回调方法);
 * 
 * @example 
 * Torch.dataSubmit({
 * 		url: url,
 * 		param: param,
 * 		validate: formname,
 * 		loading: true(默认)
 * }).then(function(){
 * 		console.log('success');
 * },function(){
 * 		console.log('error');
 * })
 * 
 */
angular.module('common.data').factory('dataService', dataService);

dataService.$inject = ['$q', '$http', 'modalService'];
		
function dataService($q, $http, modalService) {
	
	var dataservice = {
		submit:submit
	};
	Torch.lib('dataSubmit', function(){
		return submit;
	});
	return dataservice;
	
	function submit(obj) {
		var deferred = $q.defer();
		if(!obj || obj == 'undefined'){ 
			deferred.reject('请传入要提交的数据');
			return deferred.promise;
		}
		var url = obj.url;
		if(!url){ 
			deferred.reject('请传入要提交的路径');
			return deferred.promise;
		}
		var data = obj.param || {};
		var validate =  obj.validate;
		
		if(validate){
			Torch.validateForm(validate)
			.then(function(){
				submitForm(url, data);
			}, function(data){
				Torch.info('您输入的数据未通过校验，请检查后重新输入', 'danger');
				deferred.reject('部分输入的数据不符合要求，请重新输入');
			});
		}else{
			submitForm(url, data);
		}
		
		//定义提交表单的方法
		function submitForm(url, data){
			var loading = obj.loading;
			if(loading !== false){
				//显示loading
				var loading = Torch.loading();
			}
			//设置请求的头信息
			$http.defaults.headers.common['X-Auth'] = 'torch';
			$http({
				method: 'POST',
				url: Torch.baseParth + url, //项目路径 + 请求路径
				data: data,
				responseType: 'json'
			}).then(function(data){
				if(loading !== false){
					//移除loading
					loading.close();
				}
				
				data = data.data;
				if(data == null){
					Torch.info('返回数据有误', 'danger');
					deferred.reject('返回数据有误');
				}else{
					var error = data._error;
					if(error){
						Torch.info(error.replace('#', '</br>'), 'danger');
						deferred.reject(error);
					}else{
						deferred.resolve(data);
					}
				}
			},function(data){
				//移除loading
				loading.close();
				var reason = (data && data._error) ? data._error : '与服务器断开连接';
				Torch.info(reason, 'danger');
				deferred.reject(reason);
			});
		}
		
		return deferred.promise;
	}
}

/**
 * @desc 编辑请求的头部信息，get请求取消缓存
 */
angular.module('common.data').config(function($httpProvider) {
	if (!$httpProvider.defaults.headers.get) {
	      $httpProvider.defaults.headers.get = {};
	}
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
});


