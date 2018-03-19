var app=angular.module('app',['common', 'common.form', 'common.grid'])


app.controller('resourceUpdateForm_Controller',function($scope, dataService) {
	//初始化方法
	$scope.init = function(){
		$scope.fid ='resourceUpdate_00090078220';
		if(!$scope.resourceUpdateForm){
		    $scope.resourceUpdateForm = {};
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
		$scope.resourceUpdateForm.resid = primary;
		var postObj = {
		    url: "/torch/service.do?fid=" + $scope.fid,
		    param : {
		      "resourceUpdateForm": $scope.resourceUpdateForm
		    }
		};
		dataService.submit(postObj)
			.then(function(data){
				$scope.resourceUpdateForm = data.resourceUpdateForm;
			},function(data){
				alert("加载数据失败:"+data);
			});
	};
	$scope.doSave = function(){
		//执行页面校验，通过后则提交
		if(!Torch.vRender.validateForm('resourceUpdateForm_Form')){
			return;
		}else{
		//更新form表单
			var postObj = {
			    url : "/torch/service.do?fid=" + $scope.fid,
			    param : {
				    //key为组件名 value为数据值
				    "resourceUpdateForm": $scope.resourceUpdateForm || {}
			    }
			};
			dataService.submit(postObj)
			.then(function(data){
				Torch.closewin();
			},function(data){
				
			});
		};
	}
    //关闭当前页面
    $scope.closeWin = function(){
    	window.location.href="/app/page/auth/resourceQuery.html";
    }
    // 执行初始化
    $scope.init();
});
