var app=angular.module('app',['common', 'common.form', 'common.grid'])


app.controller('resourceInsertForm_Controller',function($scope, dataService) {
    //4、编辑类型  插入  form
    $scope.doSave = function() {
        if(!$scope.resourceInsertForm){
            $scope.resourceInsertForm = {};
        }
	//执行页面校验，通过后则提交
	if(!Torch.vRender.validateForm('resourceInsertForm_Form')){
	    return;
    	}else{
    	   var postObj = {
              url : "/torch/service.do?fid=resourceInsert_20070034216",
              param : {
                    //key为组件名 value为数据值
                    "resourceInsertForm": $scope.resourceInsertForm || {}
              }
          };
          dataService.submit(postObj)
			.then(function(data){
				Torch.closewin();
			},function(data){
				Torch.info("新增失败");
			});
    	}
    };
    //关闭当前页面
    $scope.closeWin = function(){
    	window.location.href="/app/page/auth/resourceQuery.html";
    }
});
