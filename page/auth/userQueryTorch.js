var app=angular.module('app',['common', 'common.form', 'common.grid'])

//查询组件
app.controller('userQueryList_Controller',function($scope, dataService) {
	$scope.init = function(){
		$scope.fid='userList_20040038283';
		$scope.userQueryList={};
		$scope.checkList = [];
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
            param: {
                "userQueryList":$scope.userQueryList || {} //如果userList不存在或未null 时设置未{}
            }
        };
        dataService.submit(postObj)
			.then(function(data){
				$scope.userQueryList = data.userQueryList;
				$scope.pageNo = $scope.userQueryList._paging.pageNo;
				$scope.pageSize = $scope.userQueryList._paging.pageSize;
			},function(data){
				alert("查询失败:"+data);
			});;
    };
    //删除事件
    $scope.doDel = function(id){
    	if(!id){
            Torch.info('将要删除的记录编号不能为空。');
            return ;
        }
		Torch.confirm('删除后数据不可更改，是否确认删除？', function(){
			var obj = {
					url:'/user/delete.do',
					param:{
						"id":[id]
					}
				};
			Torch.dataSubmit(obj).then(function(data) {
				$scope.doQuery();
			}); 
		});
    };
    //编辑事件
    $scope.toEdit = function(id){
    	var config = {
				url:'/app/page/auth/userUpdate.html?id='+id,
				title:'用户修改',
				size:'lg'
			}
			Torch.openwin(config).then(function(){
				Torch.info('更新成功');
				$scope.doQuery();
			});
    };
	//编辑角色
	$scope.doDetail = function(id){
		var config = {
				url:'/app/page/auth/roleQuery.html?id='+id,
				title:'编辑角色',
				size:'lg'
			}
			Torch.openwin(config).then(function(){
				
			});
	};
    //新增事件
    $scope.toAdd = function(){
    	var config = {
				url:'/app/page/auth/userInsert.html',
				title:'用户新增',
				size:'lg'
			}
			Torch.openwin(config).then(function(){
				Torch.info('新增成功');
				$scope.doQuery();
			
			});
    };
// 执行初始化
$scope.init();
});

