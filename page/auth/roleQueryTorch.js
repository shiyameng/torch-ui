var app=angular.module('app',['common', 'common.form', 'common.grid'])

//查询组件
app.controller('roleQueryList_Controller',function($scope, dataService) {
	var  usrid =Torch.getParam('id');
	$scope.init = function(){
		$scope.fid='roleQuery';
		$scope.roleQueryList={};
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
                "roleQueryList":$scope.roleQueryList || {} //如果userList不存在或未null 时设置未{}
            }
        };
        dataService.submit(postObj)
			.then(function(data){
					$scope.roleQueryList = data.roleQueryList;
					$scope.pageNo = $scope.roleQueryList._paging.pageNo;
					$scope.pageSize = $scope.roleQueryList._paging.pageSize;
					//$scope.checkList = [{"roleid":"ff8080815a180714015a181899d2skkk"}];
					$scope.queryMyRole();
				},function(data){
					alert("查询失败:"+data);
				});
    };
   $scope.queryMyRole = function(){
    	postObj = {
				//url : "/torch/service.do?fid=" + $scope.fid+"&usrid="+usrid,
				url : "/user/queryMyRole.do?usrid="+usrid,
	            param: {
	               // "roleQueryList":$scope.roleQueryList || {} //如果userList不存在或未null 时设置未{}
	            }
		};
		dataService.submit(postObj)
		.then(function(data){
			//$scope.checkList = [{"roleid":"ff8080815a180714015a181899d2skkk"}];
			$scope.checkList=data;
			//alert(data);
			
		})
    };  
    //删除事件
    $scope.doDel = function(id){
        if(!id){
            Torch.info('将要删除的记录编号不能为空。');
            return ;
        }
		Torch.confirm('删除后数据不可更改，是否确认删除？', function(){
			var obj = {
					url:'/role/delete.do',
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
				url:'/app/page/auth/roleUpdate.html?id='+id,
				title:'角色修改',
				size:'lg'
			}
			Torch.openwin(config).then(function(){
				Torch.info('更新成功');
				$scope.doQuery();
			});
    };
	//  -- 编辑资源
	$scope.doDetail = function(id){
		var config = {
				url:'/app/page/auth/resourceQuery.html?id='+id,
				title:'编辑资源',
				size:'lg'
			}
			Torch.openwin(config).then(function(){
				
			});
	};
    //新增事件
    $scope.toAdd = function(){
    	var config = {
				url:'/app/page/auth/roleInsert.html',
				title:'角色新增',
				size:'lg'
			}
			Torch.openwin(config).then(function(){
				Torch.info('新增成功');
				$scope.doQuery();
			});
    };
    
  //保存用户与角色对应关系
	$scope.doSaveUserRole = function() {
		Torch.confirm('是否确定为用户分配角色？', function(){
			var obj = { 
					url:'/user/saveUserRole.do?usrid='+usrid,
					param:{
						"roles":$scope.checkList
					}
				};
			Torch.dataSubmit(obj).then(function(data) {
				Torch.info('保存成功');
				$scope.doQuery();
			}); 
		});
	};
	
// 执行初始化
$scope.init();
});

