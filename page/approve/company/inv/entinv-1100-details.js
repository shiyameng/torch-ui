(function(){
angular.module('app',['common'])
	.controller('SetupController', SetupController);

SetupController.$inject=['dataService','$filter'];

function SetupController(dataService,$filter){
	var gid = Torch.getParam('gid');
	//股东id
	var invid = Torch.getParam('invid');
	var vm = this;
	//确定
	vm.determine = determine;
	//确定
	function determine(){
		Torch.closewin();
	}

	//页面初始化
	function init(){

		var params={
			url:"/torch/service.do?fid=inventQuery",
			param:{
				"inventQuery_Form_1":{
					invid:invid
				},
				"inventQuery_Grid_2":{
					invid:invid
				}
			}
		}

		Torch.dataSubmit(params).then(
			function(data){
				// 自然人基本信息
				vm.personForm = data.inventQuery_Form_1;
				// 表格信息
				vm.capitalList = data.inventQuery_Grid_2._data;
			});
		//表格信息
		var userList ={
			"_data":[
				{cursubconam:'',conform:'1',condate:''}
			]
		}
		// 自然人基本信息
		//vm.personForm = basicInfo;
		//表格信息
		vm.capitalList=userList._data;
	}
		//页面数据初始化
		init();	
	}
})();

