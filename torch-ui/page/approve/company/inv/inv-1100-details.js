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
	vm.determine=determine;
	//确定
	function determine(){
		Torch.closewin();
	}
	//页面初始化
	function init(){

		var params={
			url:"/torch/service.do?fid=invQuery",
			param:{
				"invQuery_Form_1":{"invid":invid},
				"invQuery_Grid_2":{"invid":invid}
			}

		}
		Torch.dataSubmit(params).then(
			function(data){
				//自然人基本信息
				vm.personForm = data.invQuery_Form_1;
				if(data.invQuery_Grid_2._data.length > 0){
					vm.capitalList = data.invQuery_Grid_2._data;
				}
				if(vm.personForm.certype == ''){
					vm.personForm.certype = '20';
				}
				if(vm.personForm.nation == ''){
					vm.personForm.nation = '01';
				}
				if(vm.personForm.country == ''){
					vm.personForm.country = '156';
				}
			});


		// 自然人基本信息
		vm.personForm = {
			//姓名
			"inv":"",
			//证件类型
			"certype":"10",
			//证件号码
			"cerno":"",
			//性别
			"sex" :"1",
			//民族
			"nation" :"01",
			//国籍
			"country" :"156",
			//户籍登记地址
			"domprov" :"",
			"domcity" :"",
			"domcounty" :"",
			"domother" :"",
			"invtype":"",
			"currency":'156'
		};

		//表格信息
		vm.capitalList=[
			{cursubconam:'',conform:'1',condate:''}
		];
	}
	init();	
}

})();

