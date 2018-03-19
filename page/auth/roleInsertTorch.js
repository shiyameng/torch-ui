var app=angular.module('app',['common', 'common.form', 'common.grid'])


app.controller('roleInsert_insert_1_Controller',function($scope, dataService) {
    //4、编辑类型  插入  form
    $scope.doSave = function() {
        if(!$scope.roleInsert_insert_1){
            $scope.roleInsert_insert_1 = {};
        }
	//执行页面校验，通过后则提交
	if(!Torch.vRender.validateForm('roleInsert_insert_1_Form')){
	    return;
    	}else{
    	   var postObj = {
              url : "/torch/service.do?fid=roleInsert_10020059257",
              param : {
                    //key为组件名 value为数据值
                    "roleInsert_insert_1": $scope.roleInsert_insert_1 || {}
              }
          };
          dataService.submit(postObj)
			.then(function(data){
				alert("保存成功");
			},function(data){
				alert("保存失败:"+data);
			});
    	}
    };
});
