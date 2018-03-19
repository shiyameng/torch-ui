var app=angular.module('app',['common', 'common.form', 'common.grid'])


app.controller('resUrlUpdateForm_Controller',function($scope, dataService) {
	//初始化方法
	$scope.init = function(){
		$scope.fid ='resUrlUpdate_30020089223';
		if(!$scope.resUrlUpdateForm){
		    $scope.resUrlUpdateForm = {};
		}
		$scope.doQuery();
	}
	$scope.doQuery = function(){
		//获取url中的id，如果传参不是id，请自行修改
		var primary=Torch.getParam('urlId');
		if(!primary){
		   alert("地址栏URL中没有传参 Id !");
		   return;
		}
		$scope.resUrlUpdateForm.urlid = primary;
		var postObj = {
		    url: "/torch/service.do?fid=" + $scope.fid,
		    param : {
		      "resUrlUpdateForm": $scope.resUrlUpdateForm
		    }
		};
		dataService.submit(postObj)
			.then(function(data){
				$scope.resUrlUpdateForm = data.resUrlUpdateForm;
			},function(data){
				alert("加载数据失败:"+data);
			});
	};
	$scope.doSave = function(){
		//执行页面校验，通过后则提交
		if(!Torch.vRender.validateForm('resUrlUpdateForm_Form')){
			return;
		}else{
		//更新form表单
			$scope.resUrlUpdateForm.resid = Torch.getParam("resid");
//			alert($scope.resUrlUpdateForm.resid);
//			alert(Torch.getParam('urlId'));
			var postObj = {
			    url : "/torch/service.do?fid=" + $scope.fid,
			    param : {
				    //key为组件名 value为数据值
				    "resUrlUpdateForm": $scope.resUrlUpdateForm || {}
			    }
			};
			dataService.submit(postObj)
			.then(function(data){
				Torch.closewin();
			},function(data){
				alert("保存失败:"+data);
			});
		};
	}
    //关闭当前页面
    $scope.closeWin = function(){
//    	alert(Torch.getParam("resid"));
    	window.location.href="/app/page/auth/resUrlQuery.html?resid="+Torch.getParam("resid");
    }
    // 执行初始化
    $scope.init();
});
