var app=angular.module('app',['common', 'common.form', 'common.grid'])


app.controller('resUrlInsertForm_Controller',function($scope, dataService) {
    //编辑类型  插入  form
    $scope.doSave = function() {
        if(!$scope.resUrlInsertForm){
            $scope.resUrlInsertForm = {};
        }
	//执行页面校验，通过后则提交
	if(!Torch.vRender.validateForm('resUrlInsertForm_Form')){
	    return;
    	}else{
    		//获取资源id,默认插入获取的资源id
    		$scope.resUrlInsertForm.resid = Torch.getParam("resid");
//    		alert("resid"+$scope.resUrlInsertForm.resid);
    	   var postObj = {
              url : "/torch/service.do?fid=resUrlInsert_50080020221",
              param : {
                    //key为组件名 value为数据值
                    "resUrlInsertForm": $scope.resUrlInsertForm || {}
              }
          };
          dataService.submit(postObj)
			.then(function(data){
				Torch.closewin();
			},function(data){
				alert("保存失败:"+data);
			});
    	}
    };
    //关闭当前页面
    $scope.closeWin = function(){
//    	alert(Torch.getParam("resid"));
    	window.location.href="/app/page/auth/resUrlQuery.html?resid="+Torch.getParam("resid");
    }
});
