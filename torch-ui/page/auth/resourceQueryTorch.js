var app=angular.module('app',['common', 'common.form', 'common.grid'])

//查询组件
app.controller('resourceQueryList_Controller',function($scope, dataService) {
     var  roleid =Torch.getParam('id');
     var vm = this;
	$scope.init = function(){
		$scope.fid='resourceQuery_10000047256';
		$scope.resourceQueryList={};
		$scope.checkList = [];
		$scope.doQuery();
		$scope.dataList = [];
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
                "resourceQueryList":$scope.resourceQueryList || {} //如果userList不存在或未null 时设置未{}
            }
        };
        dataService.submit(postObj)
			.then(function(data){
				$scope.resourceQueryList = data.resourceQueryList;
				$scope.pageNo = $scope.resourceQueryList._paging.pageNo;
				$scope.pageSize = $scope.resourceQueryList._paging.pageSize;
				$scope.dataList = data.resourceQueryList._data;
			},function(data){
				alert("查询失败:"+data);
			});;
    };
	
  //保存角色与资源对应关系
	$scope.doSaveRoleResource = function() {
		
		Torch.confirm('是否确定为角色分配资源？', function(){
			var obj = {
					url:'/role/saveRoleResource.do?roleid='+roleid,
					param:{
						"resources":$scope.checkList
					}
				};
			Torch.dataSubmit(obj).then(function(data) {
				$scope.doQuery();
			}); 
		});
	};
	
    
    // 执行初始化
$scope.init();

    //删除事件
    $scope.doDel = function(id){
    	Torch.confirm('提交后数据不可更改，是否确认提交？', function(){
			    $.ajax({
  			        url: "/approve/sys/resource/delRes.do?resid=" + id,
  			        type: "GET",
  			        async: false,
  			        success: function(data) {
  			        	window.location.reload();}
  			        });
    		
    	}, function(){});
    };
   
    //编辑事件
    $scope.toEdit = function(resid){
    	      var config = {
    	        url:"/app/page/auth/resourceUpdate.html?id="+resid,
    	        title:"资源修改 ",
    	        size:"lg"
    	      }
    	      Torch.openwin(config).then(function(){
    	        Torch.info("修改成功");
    	        $scope.doQuery();
    	      });
    	   
    };
	//配置当前资源的url
	$scope.toUrl = function(resid){
		window.location.href="/app/page/auth/resUrlQuery.html?resid="+resid;
	};
    //新增事件
    $scope.toAdd = function(){
    	 var config = {
     	        url:"/app/page/auth/resourceInsert.html",
     	        title:"资源新增 ",
     	        size:"lg"
     	      }
     	      Torch.openwin(config).then(function(){
     	        Torch.info("新增成功");
     	        $scope.doQuery();
     	      });
    };

// 执行初始化
    $scope.init();
});

