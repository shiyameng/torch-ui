var app=angular.module('app',['common', 'common.form', 'common.grid'])


app.controller('userInsertForm_Controller',function($scope, dataService) {
    //4、编辑类型  插入  form
    $scope.doSave = function() {
        if(!$scope.userInsertForm){
            $scope.userInsertForm = {};
        }
	//执行页面校验，通过后则提交
	if(!Torch.vRender.validateForm('userInsertForm_Form')){
	    return;
    	}else{
    	   var postObj = {
              url : "/torch/service.do?fid=userInsert_20000047225",
              param : {
                    //key为组件名 value为数据值
                    "userInsertForm": $scope.userInsertForm || {}
              }
          };
          dataService.submit(postObj)
			.then(function(data){
				Torch.closewin();
			},function(data){
				Torch.closewin();
			});
    	}
    };
});
