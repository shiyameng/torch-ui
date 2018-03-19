(function(){
angular.module('app',['common'])
	.controller('SetupController', SetupController);
SetupController.$inject=['dataService','$filter'];
function SetupController(dataService,$filter){
	var gid = Torch.getParam('gid');
	//股东id
	var invid = Torch.getParam('invid');
	var vm = this; 
	//给表格添加一行
	vm.addInfo=addInfo;
	//删除指定行
	vm.delInfo=delInfo;
	//保存
	vm.saveInfo=saveInfo;
	//当前时间
	vm.timeData = timeData;
	//证件类型改变校验
	vm.certype = certype;

	function certype(){
		if( vm.personForm.certype == 10){
			$('#cerno').attr('rule', 'must;idcard');
		}else{
			$('#cerno').attr('rule', 'must');
		}
	}

	function timeData() {
		var date = new Date();
		var seperator1 = "-";
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
		var newObj={cursubconam:'',conform:'1',condate:vm.timeData()};
		vm.capitalList.push(newObj);
	}
	//删除
	function delInfo(index){
		vm.capitalList.splice(index,1);
	}	
	//保存
	function saveInfo(){
		if( $filter('sumOfItems')(vm.capitalList,'cursubconam') == 0 ){
			Torch.info('出资额不能为空','danger');
			return
		}

		var params={
			url:"/torch/service.do?fid=invUpdate_00080072194",
			param:{
				invUpdate_update_1:vm.personForm
			},
			validate:'invEdit'
		}
		params.param.invUpdate_update_1.stagesPay = vm.capitalList
		params.param.invUpdate_update_1.operType = 20
		params.param.invUpdate_update_1.dom = Torch.dict.getText('CA01', vm.personForm.domprov) + Torch.dict.getText('CA01',vm.personForm.domcity) + Torch.dict.getText('CA01',vm.personForm.domcounty) +vm.personForm.domother;

		Torch.dataSubmit(params).then(
			function(data){
				// 自然人基本信息
				vm.personForm = data.invUpdate_update_1;
				Torch.closewin();
			});
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
				//判断证件类型对应的校验
				certype();
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
			"sex" :"",
			//民族
			"nation" :"01",
			//国籍
			"country" :"156",
			//户籍登记地址
			"domprov" :"",
			"domcity" :"",
			"domcounty" :"",
			"domother" :""
		};

		//表格信息
		vm.capitalList=[
			{cursubconam:'',conform:'1',condate:vm.timeData()}
		];
		console.log(vm.timeData());
	}
	init();	
}

})();

