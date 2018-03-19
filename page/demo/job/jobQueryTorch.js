var app=angular.module('app',['common', 'common.form', 'common.grid'])
//查询组件
app.controller('jobQuery_Grid_1_Controller',function($scope, dataService) {
	$scope.init = function(){
		$scope.fid='jobQuery_10080092033';
		$scope.jobQuery_Grid_1={};
		$scope.doQuery();
	};
    /**
    * 设置序号方法
    */
    $scope.getIndex=function(list,i){
        //1.一共多少数据（page.total），每页显示多少条（page.pageSize），显示多少页(i),显示的是第几页（page.pageNo）
        if(!list){
            return;
        }
        var page=list._paging;
        var index=page.pageSize*(page.pageNo-1)+(i+1);
        return index;
    }
    //1、查询类型  列表  form+grid
    $scope.doQuery = function(){
        var postObj = {
            url : "/torch/service.do?fid=" + $scope.fid,
            params: {
                "jobQuery_Grid_1":$scope.jobQuery_Grid_1 || {} //如果userList不存在或未null 时设置未{}
            }
        };
        dataService.submit(postObj)
        .then(function(data){
        	$scope.jobQuery_Grid_1 = data.jobQuery_Grid_1;
        })
    };
    //删除事件
    $scope.doDel = function(id){
        if(!id){
            Torch.info('将要删除的记录的编号不能为空。');
            return ;
        }
		Torch.alert("请添加对应的删除组件,然后重新生成页面与JS！");
    };
    //编辑事件
    $scope.toEdit = function(id){
        Torch.openWindow('','./?id='+id,'编辑表单');
    };
	//详情事件
	$scope.doDetail = function(id){
		Torch.openWindow('','./?id='+id,'详情表单');
	};
    //新增事件
    $scope.toAdd = function(){
        Torch.openWindow('','./','新增表单');
    };
// 执行初始化
$scope.init();
});

