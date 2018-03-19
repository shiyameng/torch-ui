(function(){
angular.module('app',['common'])
	.controller('SetupController', SetupController);

SetupController.$inject=['dataService','$filter'];

function SetupController(dataService,$filter){
	var gid = Torch.getParam('gid');
	//股东id
	var invid = Torch.getParam('invid');
	//
	var pripid = Torch.getParam('pripid');
	var vm = this; 
	//给表格添加一行
	vm.addInfo = addInfo;
	//删除指定行
	vm.delInfo = delInfo;
	//保存
	vm.saveInfo = saveInfo;
	//当前时间
	vm.timeData = timeData;

	function timeData() {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
		return currentdate;
	}
	//新增
	function addInfo(){		
		var newObj = {cursubconam:'',conform:'1',condate:vm.timeData()};
		vm.capitalList.push(newObj);
	}
	//删除
	function delInfo(index){
		vm.capitalList.splice(index,1);
	}	
	//保存
	function saveInfo(){
		if($filter('sumOfItems')(vm.capitalList,'cursubconam') == 0){
			Torch.info('出资额不能为空','danger');
			return
		}
		if(invid){
			var params={
				url:"/torch/service.do?fid=inventUpdate_80040057261",
				param:{
					"inventUpdate_update_1":vm.personForm
				},
				validate:'entinvEdit'
			}

			params.param.inventUpdate_update_1.stagesPay = vm.capitalList;
			params.param.inventUpdate_update_1.operType = 30;
			params.param.inventUpdate_update_1.dom = Torch.dict.getText('CA01', vm.personForm.domprov) + Torch.dict.getText('CA01',vm.personForm.domcity) + Torch.dict.getText('CA01',vm.personForm.domcounty) +vm.personForm.domother;

			Torch.dataSubmit(params).then(
				function(data){
					// 非自然人基本信息
					vm.personForm = data.inventUpdate_update_1;
					Torch.closewin();
				});
		}else{
			var obj={
				url:"/torch/service.do?fid=basicEntUpdate",
				param:{
					"entInvInsertForm" : vm.personForm
				},
				validate:'invEdit'
			}
			obj.param.entInvInsertForm.stagesPay = vm.capitalList
			obj.param.entInvInsertForm.operType = 30;
			obj.param.entInvInsertForm.gid = gid;
			obj.param.entInvInsertForm.pripid = pripid;
			obj.param.entInvInsertForm.currency = 156;
			obj.param.entInvInsertForm.dom = Torch.dict.getText('CA01', vm.personForm.domprov) + Torch.dict.getText('CA01',vm.personForm.domcity) + Torch.dict.getText('CA01',vm.personForm.domcounty) +vm.personForm.domother;

			Torch.dataSubmit(obj).then(
				function(data){
					Torch.closewin();
				});
		}

	}

	//页面初始化
	function init(){

		if(invid){
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
		}
		//表格信息
		var userList ={
			"_data":[
				{cursubconam:'',conform:'1',condate:vm.timeData()}
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

