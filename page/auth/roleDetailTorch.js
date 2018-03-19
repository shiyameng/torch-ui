var app=angular.module('app',['common', 'common.form', 'common.grid'])

//查询组件
app.controller('roleDetail_Form_1_Controller',function($scope, dataService) {
	$scope.init = function(){
		$scope.fid='roleDetail_10040005258';
		$scope.roleDetail_Form_1={};
		$scope.doQuery();
	};
    //查询form表单(表单内容不可编辑)
    $scope.doQuery = function(){
       var primary=Torch.getParam('id');
        if(!primary){
           alert("地址栏URL中没有传参 Id !");
           return;
        }
		$scope.roleDetail_Form_1.roleid = primary;
		
		var postObj = {
		    url: "/torch/service.do?fid=" + $scope.fid,
		    param : {
		      "roleDetail_Form_1": $scope.roleDetail_Form_1
		    }
		};
		dataService.submit(postObj)
			.then(function(data){
				$scope.roleDetail_Form_1 = data.roleDetail_Form_1;
			},function(data){
				alert("查询失败:"+data);
			});
    };
// 执行初始化
$scope.init();
});

