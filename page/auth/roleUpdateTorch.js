var app=angular.module('app',['common', 'common.form', 'common.grid'])


app.controller('roleUpdate_update_1_Controller',function($scope, dataService) {
	//初始化方法
	$scope.init = function(){
		$scope.fid ='roleUpdate_10060008234';
		if(!$scope.roleUpdate_update_1){
		    $scope.roleUpdate_update_1 = {};
		}
		$scope.doQuery();
	}
	$scope.doQuery = function(){
		//获取url中的id，如果传参不是id，请自行修改
		var primary=Torch.getParam('id');
		if(!primary){
		   alert("地址栏URL中没有传参 Id !");
		   return;
		}
		$scope.roleUpdate_update_1.roleid = primary;
		var postObj = {
		    url: "/torch/service.do?fid=" + $scope.fid,
		    param : {
		      "roleUpdate_update_1": $scope.roleUpdate_update_1
		    }
		};
		dataService.submit(postObj)
			.then(function(data){
				$scope.roleUpdate_update_1 = data.roleUpdate_update_1;
			},function(data){
				alert("加载数据失败:"+data);
			});
	};
	$scope.doSave = function(){
		//执行页面校验，通过后则提交
		if(!Torch.vRender.validateForm('roleUpdate_update_1_Form')){
			return;
		}else{
		//更新form表单
			var postObj = {
			    url : "/torch/service.do?fid=" + $scope.fid,
			    param : {
				    //key为组件名 value为数据值
				    "roleUpdate_update_1": $scope.roleUpdate_update_1 || {}
			    }
			};
			dataService.submit(postObj)
			.then(function(data){
				Torch.closewin();
			},function(data){
				Torch.closewin();
			});
		};
	}
    // 执行初始化
    $scope.init();
});
