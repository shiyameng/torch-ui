(function(){
	angular.module('app',['common'])
		.controller('SetupController',SetupController)

	SetupController.$inject = ['dataService','modalService','$scope','$routeParams','$location','$timeout'];

	function SetupController(dataService,modalService,$scope,$routeParams,$location,$timeout){
		var vm = this;
		var gid = Torch.getParam('gid');
		var nameid = Torch.getParam('nameid');
		//获取数据
		vm.query = query;
		//初始化
		vm.init = init;
		//详情
		vm.detail = detail;
		//自然人的详情
		vm.invDetails = invDetails;
		//非自然人的详情
		vm.entInvDetails = entInvDetails;
		//主要人员的详情
		vm.memberDetails = memberDetails;
		//显示股东占比弹出框
		vm.proportion = proportion;
		//企业联系人 和 财务负责人 弹出框
		vm.cpFinance = cpFinance;
		//更多弹出框
		vm.auxiliary = auxiliary;
		//保存页面所有信息按钮
		vm.saveSetup = saveSetup;
		//审批意见弹出框
		vm.opinion = opinion;

		//审批意见弹出框
		function opinion(){
			var config = {
				url:'../approval/cp-1100-opinion.html?gid='+gid+'&opertype=20',
				title:'审批意见',
				size:'lg'
			}
			Torch.openwin(config).then(function(){
				Torch.info('保存成功,自动跳转我的任务页面');
				$timeout(function() {
					Torch.redirect('../../task/task.html');
				}, 1000);

			});
		}

		//保存页面所有信息按钮
		function saveSetup(){
			var fid = "basicUpdate_90010002201";
			vm.entBasicForm.gid = gid;
			vm.entBasicForm.opscope=$scope.value;
			//vm.entBasicForm.dom =Torch.dict.getText('CA01', vm.entBasicForm.domprov) + Torch.dict.getText('CA01',vm.entBasicForm.domcity) + Torch.dict.getText('CA01',vm.entBasicForm.domcounty) +vm.entBasicForm.domother;
			//vm.entBasicForm.regcap=vm.invConSumForm.consum;
			var obj = {
				url:'/torch/service.do?fid='+fid,
				param:{
					basicUpdateForm:vm.entBasicForm
				},
				validate: 'apply'
			};
			Torch.dataSubmit(obj).then(function(data){
				Torch.info('保存成功')
				query();
			})
		}

		//更多弹出框
		function auxiliary(){
			var config = {
				url:'../scope/scope-query.html?gid='+gid,
				title:'更多',
				size:'lg'
			}
			Torch.openwin(config).then(function(data){
				var arr=[];
				if($scope.value==""){
					for(var i=0;i<data.length;i++){
						arr.push(data[i].dmName);
						$scope.value=arr.join("，");
					}
				}else {//去重
					//如果$scope.$broadcast执行该flag变为true
					var flag=false;
					//console.log(flag);
					for(var i=0;i<data.length;i++){
						if($scope.value.indexOf(data[i].dmName) < 0 ){
							$scope.$broadcast("child",data[i].dmName);
							$scope.$on("parent",function(event,data){
								flag=data;
								//console.log(flag);
							})
							//console.log(flag);
							if(!flag){
								$scope.value=$scope.value + '，' + data[i].dmName;
							}
						}
					}
				}
				/*for(var i = 0 ; i < data.length ; i++){
				 //判断当没有值得时候 添加不需要逗号 逗号为中文都逗号
				 if($scope.value == ''){
				 $scope.value = data[i].dmName;
				 console.log($scope.value);
				 $scope.$broadcast("child",data[i].dmName);
				 }else if($scope.value.indexOf(data[i].dmName) < 0 ){  //用与去重
				 //$scope.value = $scope.value + '，' + data[i].dmName;
				 $scope.$broadcast("child",data[i].dmName);
				 }
				 }*/
			});
		}


		//企业联系人 和 财务负责人 弹出框
		function cpFinance(data){

			//data.linktype = 0 为企业联系人 data.linktype = 1 为财务负责人
			if(data.linktype == 0){
				var config = {
					url:'../contacts/cp-contacts.html?gid='+gid+'&lmid='+data.lmid,
					title:'企业联系人'
					//size:'lg'
				}
			}else if(data.linktype == 1){
				config = {
					url:'../contacts/finance-contacts.html?gid='+gid+'&lmid='+data.lmid,
					title:'财务负责人'
					//size:'lg'
				}
			}
			Torch.openwin(config).then(function(){
				Torch.info('保存成功');
			});
		}

		//显示股东占比弹出框
		function proportion(){
			var config = {
				url:'../inv-capital-proportion/inv-capital-proportion.html?gid='+gid,
				title:'股东占比'
			}
			Torch.openwin(config)
		}

		//详情弹出框
		function detail(){
			var config = {
				url:'../detail/name-detail.html?nameid='+nameid+'&gid='+gid,
				title:'详情'
				//size:'lg'
			};
			Torch.openwin(config)
		}

		//主要人员的详情
		function memberDetails(personid){
			var config = {
				url:'../member/member-1100-details.html?gid='+gid+'&pripid='+vm.pripid+'&personid='+personid,
				title:'主要人员详情'
			}
			Torch.openwin(config);
		}

		//自然人详情
		function invDetails(invid){
			var config = {
				url:'../inv/inv-1100-details.html?gid='+gid+'&invid='+invid,
				title:'股东 - 自然人详情',
				size:'lg'
			}
			Torch.openwin(config);
		}

		//非自然人详情
		function entInvDetails(invid){
			var config = {
				url:'../inv/entinv-1100-details.html?gid='+gid+'&invid='+invid,
				title:'股东 - 非自然人详情',
				size:'lg'
			}
			Torch.openwin(config);
		}

		//获取数据
		function query(datas){
			var fid = "basicQuery_10060049279"
			//获取经验范围常用行业用语
			var params={
				url:"/torch/service.do?fid=basicScopeQuery"
			}
			Torch.dataSubmit(params).then(function(data){
				vm.rangeData=data.basicScopeQueryList;
			});
			//申请页面整个页面数据的获取
			var obj = {
				url:'/torch/service.do?fid=basicQuery_10060049279',
				param:{
					"entNameForm":{
						"gid":gid
					},
					"entBasicForm":{
						"gid":gid
					},
					"entLicList":{
						_paging :{
							pageNo :'1',
							pageSize:'10',
							total :''
						},
						_condition: {
							gid :gid
						}
					},
					"entInvList":{
						_paging :{
							pageNo :'1',
							pageSize:'10',
							total :''
						},
						_condition: {
							gid :gid
						}
					},
					"invConSumForm":{
						"gid":gid
					},
					"entMemList":{
						_paging :{
							pageNo :'1',
							pageSize:'10',
							total :''
						},
						_condition: {
							gid :gid
						}
					},
					"entContactList":{
						_paging :{
							pageNo :'1',
							pageSize:'10',
							total :''
						},
						_condition: {
							gid :gid
						}
					}
				}
			};

			Torch.dataSubmit(obj).then(function(data){
				//vm.pripid = data.entBasicForm.pripid
				//名称信息
				vm.entNameForm = data.entNameForm;
				//禁止刷新基本信息中的内容
				if(!datas){
					//基本信息
					vm.entBasicForm = data.entBasicForm;
					//基本信息中的经营范围
					$scope.value=data.entBasicForm.opscope;
				}
				//许可信息
				vm.entLicList = data.entLicList._data;
				//股东 - 注册资本之和
				vm.invConSumForm = data.invConSumForm;
				//主要人员 处理数据结构  positions为职位
				//vm.entMemList = data.entMemList._data;
				vm.entMemList = [];
				for(var t = 0 ; t < data.entMemList._data.length  ; t++){
					if(vm.entMemList.length == 0){
						vm.entMemList.push(data.entMemList._data[t]);
						vm.entMemList[0].positions = [];
						vm.entMemList[0].positions.push({position:vm.entMemList[0].position,posbrform:vm.entMemList[0].posbrform,offyear:vm.entMemList[0].offyear});
					}else{
						vm.mark = true;
						for(var j = 0 ; j < vm.entMemList.length ; j++){
							if(!vm.entMemList[j].positions){
								vm.entMemList[j].positions = [];
							}
							if(vm.entMemList[j].personid == data.entMemList._data[t].personid){
								vm.entMemList[j].positions.push({position:data.entMemList._data[t].position,posbrform:data.entMemList._data[t].posbrform,offyear:data.entMemList._data[t].offyear})
								vm.mark = false;
								break;
							}
						}
						if(vm.mark){
							vm.entMemList.push(data.entMemList._data[t]);
							vm.entMemList[vm.entMemList.length-1].positions = [];
							vm.entMemList[vm.entMemList.length-1].positions.push({position:vm.entMemList[vm.entMemList.length-1].position,posbrform:vm.entMemList[vm.entMemList.length-1].posbrform,offyear:vm.entMemList[vm.entMemList.length-1].offyear});
						}
					}
					//其他人员
					vm.entContactList = data.entContactList;
					//判断非自然人和自然人
					vm.InvList = [];
					vm.entInvList = [];
					for(var i = 0 ; i < data.entInvList._data.length ; i++){
						if(
							data.entInvList._data[i].invtype == 20 ||
							data.entInvList._data[i].invtype == 22 ||
							data.entInvList._data[i].invtype == 30 ||
							data.entInvList._data[i].invtype == 35 ||
							data.entInvList._data[i].invtype == 36 ||
							data.entInvList._data[i].invtype == 90 ||
							data.entInvList._data[i].invtype == 21
						){
							vm.InvList.push(data.entInvList._data[i])
						}else{
							vm.entInvList.push(data.entInvList._data[i])
						}
					}
				}
			})
		}

		function init(){
			//选择设为法人的职位
			vm.legalDuties = [];

			//名称信息
			vm.entNameForm = '';

			//基本信息
			vm.entBasicForm = '';

			//许可信息
			vm.entLicList = '';

			//股东 - 注册资本之和
			vm.invConSumForm = '';
			//股东 - 股东名字
			vm.InvList = [];
			//股东 - 股东公司
			vm.entInvList = [];
			//主要人员
			vm.entMemList = [];
			//其他人员
			vm.entContactList = '';
			//经营范围 - 增加常用行业语
			vm.rangeData='';

			query();
			//doAdd();
		}
		init();
	}
})();
