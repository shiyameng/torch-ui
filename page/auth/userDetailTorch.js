var app=angular.module('app',['common', 'common.form', 'common.grid'])

//查询组件
app.controller('userDetailForm_Controller',function($scope, dataService) {
	$scope.init = function(){
		$scope.fid='userDetail_20060087286';
		$scope.userDetailForm={};
		$scope.doQuery();
	};
    //查询form表单(表单内容不可编辑)
    $scope.doQuery = function(){
       var primary=Torch.getParam('id');
        if(!primary){
           alert("地址栏URL中没有传参 Id !");
           return;
        }
		$scope.userDetailForm.id = primary;
		
		var postObj = {
		    url: "/torch/service.do?fid=" + $scope.fid,
		    param : {
		      "userDetailForm": $scope.userDetailForm
		    }
		};
		dataService.submit(postObj)
			.then(function(data){
				$scope.userDetailForm = data.userDetailForm;
			},function(data){
				alert("查询失败:"+data);
			});
    };
// 执行初始化
$scope.init();
});

