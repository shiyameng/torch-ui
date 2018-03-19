(function(){
angular.module('app', ['common'])
.controller('NavbarController', NavbarController);

NavbarController.$inject = ['dataService','$window','$scope','$timeout'];

function NavbarController(dataService,$window,$scope,$timeout){
	var vm = this;
	//右侧tab标签的数据
	vm.tabs = [];
	
	//用来加载树的数据
	vm.treeNodes = [];
	
	//得到用户数据的方法
	vm.getUser = getUser;
	
	//uib-tab标签上的点击事件，实现样式的变换
	vm.choice=choice;

	//得到左边树形结构的数据
	vm.getTree=getTree;
	
	//刷新页面
	vm.refresh=refresh;
	
	//删除当前点击的tab页
	vm.del=del;
	
	
	
	//点击最终树节点的触发方法
	vm.selectTree = selectTree;

	//删除当前tab
	function del(index, $event){
		vm.tabs.splice(index,1);
		vm.navActive = vm.navActive - 1;
		//$event.stopPropagation();
	}
	
	//得到用户数据
	function getUser(){
		var currentParams={
				url:"/approve/sys/login/getCurrentUser.do"
		}
		Torch.dataSubmit(currentParams).then(function(data){
			var userid=data.userinfo.userid;
			getTree(userid);
		});
	}
	
	//得到树形结构的数据
	function getTree(id){
		var params={
				url:"/torch/service.do?fid=resourceUserQuery",
				param:{
					"resourceUsrQueryList" : {
						 "userid" :id
				}
			}
		}
		Torch.dataSubmit(params).then(function(data){
			nodes = data.resourceUsrQueryList._data;
			vm.treeNodes = nodes;
		});
	}

	//点击tab页签实现样式的改变
	function choice(index){
		 //如果点击的是首页，默认传入参数为s
		 if(index=='s'){
			 vm.selected=index?true:false;
		 }else{
			 vm.selected=index;
		 }
	}
	
	//刷新tab页面
	function refresh(index){
		var id = '#tab' + index;
		$(id).attr('src', $(id).attr('src'));
	}
	
	//点击最终树节点的调用方法
	function selectTree(item){
		//判断重复的tabs
		for(var i = 0 ; i < vm.tabs.length ; i++){
			if(vm.tabs[i].id == item.id){
				vm.navActive = i+1;
				console.log(vm.navActive);
				return;
			}
		}
		if(item.url){
			vm.tabs.push(item);
		}

		//运用定时器显示效果避免快过angular页面渲染的速度  点击导航显示
		$timeout(function(){
			vm.navActive = vm.tabs.length;
		},500)

	}
	//显示点击导航当前页
	vm.navActive = 0
	
	//初始化方法
	function init(){
		getUser();
	}
	
	//执行初始化方法
	init();
}
})();
