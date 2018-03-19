var app=angular.module('app',['common', 'common.form', 'common.grid'])

//查询组件
app.controller('resUrlQueryList_Controller',function($scope, dataService) {
	$scope.init = function(){
		$scope.fid='resUrlQuery_40020013259';
		$scope.resUrlQueryList={};
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
    	//资源id
    	$scope.resUrlQueryList.resid = Torch.getParam("resid");
        var postObj = {
            url : "/torch/service.do?fid=" + $scope.fid,
            
            param: {
                "resUrlQueryList":$scope.resUrlQueryList || {} //如果userList不存在或未null 时设置未{}
            }
        };
        dataService.submit(postObj)
			.then(function(data){
				$scope.resUrlQueryList = data.resUrlQueryList;
				$scope.pageNo = $scope.resourceQueryList._paging.pageNo;
				$scope.pageSize = $scope.resourceQueryList._paging.pageSize;
			},function(data){
				alert("查询失败:"+data);
			});;
    };
    //删除事件
    $scope.doDel = function(urlId){
//    	debugger;
    	$.ajax({
    		url:"/approve/sys/resUrl/delResUrl.do?urlid=" + urlId,
    		type:"GET",
    		async:false,
    		success:function(data){
    			 if (data =="SUCCESS") {
						alert("删除成功！");
						window.location.reload();
					}else{
						alert("删除失败！");
					}	
    		}
    	});
  };
    //编辑事件
    $scope.toEdit = function(urlId){
    	  var config = {
      	        url:"/app/page/auth/resUrlUpdate.html?urlId="+urlId+"&resid="+Torch.getParam("resid"),
      	        title:"Url修改 ",
      	        size:"lg"
      	      }
      	      Torch.openwin(config).then(function(){
      	        Torch.info("修改成功");
      	        $scope.doQuery();
      	      });
    };
    //新增事件
    $scope.toAdd = function(){
    	//新增传入当前资源
    	 var config = {
       	        url:"/app/page/auth/resUrlInsert.html?resid="+Torch.getParam("resid"),
       	        title:"Url新增 ",
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

