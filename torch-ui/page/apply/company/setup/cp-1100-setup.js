angular.module('app', ['common','ngRoute'])
.config(config)
	function config($routeProvider) {
		$routeProvider.when('/manage', {
			templateUrl : 'cp-1100-manage-tpl.html'
		}).when('/apply', {
			templateUrl : 'cp-1100-apply-tpl.html'
		}).when('/supply', {
			templateUrl : 'cp-1100-supply-tpl.html'
		}).otherwise({
			redirectTo : '/manage'
		});
	}

(function(){
	angular.module('app').controller('SetupController',SetupController);
	
	SetupController.$inject = ['$scope','dataService','$location','$routeParams'];
	
	function SetupController($scope,dataService,$location,$routeParams){
		var vm = this;
		var gid = Torch.getParam('gid');
		var nameid = Torch.getParam('nameid');
		$scope.tab = {
				selectTab : 0
		}
	}
	
})();

// 业务办理
(function(){
	angular.module('app')
	.controller('manageController',manageController)
	manageController.$inject = ['dataService','modalService','$scope','$location','$routeParams'];
	function manageController(dataService,modalService,$scope,$location,$routeParams){
    	var vm = this;
		var nameid = Torch.getParam('nameid');
		var gid = Torch.getParam('gid');
    	//给表格添加一行
    	vm.addInfo = addInfo;
    	//删除指定行
    	vm.delInfo = delInfo;
    	//保存
    	vm.saveInfo = saveInfo;
		//业务办理页面获取数据
		vm.query = query;
		//查询企业类型
		vm.enterprise = enterprise;
		//下一步
		vm.nextStep = nextStep;
		//证件类型改变校验
		vm.certype = certype;

		function certype(){
			if( vm.applyForm.certype == 10){
				$('#cerno').attr('rule', 'must;idcard');
			}else{
				$('#cerno').attr('rule', 'must');
			}
		}

		//下一步
		function nextStep(){
			if(gid !== null){
				//修改
				vm.obj = {
					url:'/torch/service.do?fid=applysUpdate',
					param:{
						"applyUpdateForm":vm.applyForm
					},
					validate: 'manage'
				};
				vm.obj.param.applyUpdateForm.docList = vm.applydocList.applydocs;
				vm.obj.param.applyUpdateForm.enttype = vm.entTypeComForm.value;
				vm.obj.param.applyUpdateForm.gid = gid;
				//用来区分公司设立还是公司变更  30 ：为公司变更 20 :公司设立
				vm.obj.param.applyUpdateForm.opertype = 20;

				Torch.dataSubmit(vm.obj)
					.then(function(data){
						$location.path('/apply')
					});
			}else{
				//新增
				vm.obj = {
					url:'/torch/service.do?fid=applyInserts_20040070288',
					param:{
						"applyInsertForm":vm.applyForm
					},
					validate: 'manage'
				};
				vm.obj.param.applyInsertForm.docList = vm.applydocList.applydocs;
				vm.obj.param.applyInsertForm.enttype = vm.entTypeComForm.value;
				vm.obj.param.applyInsertForm.nameid = nameid;
				Torch.dataSubmit(vm.obj)
					.then(function(data){
						Torch.redirect('./cp-1100-setup.html?nameid='+nameid+'&gid='+data.applyInsertForm.gid+"#/apply");
					});
			}
		}
		
		//查询企业类型
		function enterprise(){
			var obj = {
				url:'/torch/service.do?fid=entTypeQuery',
				param:{
					"entTypeDetail":{
						"nameid": nameid
					}
				}
			};
			Torch.dataSubmit(obj).then(function(data){
				vm.entTypeDetail = data.entTypeDetail;
				//获取企业类型下拉框内容
				var param = {
					url:'http://localhost:8080/dmj/queryEntTypeDetail.do?enttype='+vm.entTypeDetail.enttype
				};

				Torch.dataSubmit(param).then(function(data){
					vm.entTypeComForm.data = data;
				})
			})
		}

    	//新增
    	function addInfo(){		
    		var newObj = {};
    		vm.applydocList.applydocs.push(newObj);
    	}
    	//删除
    	function delInfo(index){
			vm.applydocList.applydocs.splice(index,1);
    	}

		//保存按钮
		function saveInfo(){
			//没有gid时 保存按钮进新增入口
			if(gid == undefined ){
				//新增
				vm.obj = {
					url:'/torch/service.do?fid=applyInserts_20040070288',
					param:{
						"applyInsertForm":vm.applyForm
					},
					validate: 'manage'
				};
				vm.obj.param.applyInsertForm.docList = vm.applydocList.applydocs;
				vm.obj.param.applyInsertForm.enttype = vm.entTypeComForm.value;
				vm.obj.param.applyInsertForm.nameid = nameid;
			}else{
				//修改
				vm.obj = {
					url:'/torch/service.do?fid=applysUpdate',
					param:{
						"applyUpdateForm":vm.applyForm
					},
					validate: 'manage'
				};
				vm.obj.param.applyUpdateForm.docList = vm.applydocList.applydocs;
				vm.obj.param.applyUpdateForm.enttype = vm.entTypeComForm.value;
				vm.obj.param.applyUpdateForm.gid = gid;
				//用来区分公司设立还是公司变更  30为公司变更  20:公司设立
				vm.obj.param.applyUpdateForm.operType = 20;
			}
			Torch.dataSubmit(vm.obj)
			.then(function(data){
					Torch.info('保存成功');
					//复制后台的gid进行跳转
					if( gid == undefined ){
						Torch.redirect('./cp-1100-setup.html?nameid='+nameid+'&gid='+data.applyInsertForm.gid+"#/manage");
					}else{
						//刷新页面
						query()
						//获取企业类型
						enterprise();
					}
			});
		}



		//业务办理页面获取数据
		function query(){
			//如果没有gid不进行查询
			if(gid == undefined){
				return
			}
			var obj = {
				url:'/torch/service.do?fid=applysQuery',
				param:{
					"applyForm": {
						"gid": gid
					},
					"applyDocList":{
						"gid": gid
					},
					"entTypeComForm":{
						"gid": gid
					}
				}
			};

			Torch.dataSubmit(obj).then(function(data){
				vm.applyForm = data.applyForm;
				vm.applydocList.applydocs = data.applyDocList._data;
				vm.entTypeComForm.value = data.entTypeComForm.enttype;
				//判断证件类型对应的校验
				certype();
			})
		}

    	//页面初始化
    	function init(){
    		$scope.tab.selectTab = 0;
			if(gid == undefined ){
				//做判断是否办理过
				vm.obj = {
					url:'/approve/cp/setup/checkState.do?nameid='+nameid,
					param:{}
				};
				Torch.dataSubmit(vm.obj).then(function(data){

				},function(){
					Torch.redirect('./cp-1100-entry.html');
				});
			}

    		//基本信息
			vm.applyForm = {
				"appform":"1",
				"cerno":"",
				"certype":"10",
				"linkman":"",
				"mobtel":"",
				"tel":""
    		}
    		//表格信息
			vm.applydocList = {
				applydocs:[
					{"docname":"","doctype":'',"doccnt":''}
				]
			}
    		//企业类型
    		vm.entTypeDetail = {
				"enttype":""
			}
			//企业类型下拉框
			vm.entTypeComForm = {
				value:'',
				data:[]
			}

			//页面获取数据
			query();
			//获取企业类型
			enterprise();
    	}
    	//页面数据初始化
    	init();	
	}
 })();

//申请信息
(function(){
	angular.module('app')
	.controller('applyController',applyController);

	applyController.$inject = ['dataService','modalService','$scope','$routeParams','$location','$timeout'];

	function applyController(dataService,modalService,$scope,$routeParams,$location,$timeout){
		var vm = this;
		var nameid = Torch.getParam('nameid');
		var gid = Torch.getParam('gid');
		//申请页面获取数据
		vm.query = query;
		//保存
		vm.saveSetup = saveSetup;
		//分页
		vm.changeNum = changeNum;
		//更多
		vm.auxiliary = auxiliary;
		//添加主要人员
		vm.memberAdd = memberAdd;
		//前置许可
		vm.befores = befores;
		//后置许可
		vm.afters = afters;
		//非自然人
		vm.entinvEdit = entinvEdit;
		//自然人
		vm.invEdit = invEdit;
		//详情
		vm.detail = detail;
		//企业联系人 和 财务负责人 弹出框
		vm.cpFinance = cpFinance;
		//前置后置许可删除
		vm.entLicListDel = entLicListDel;
		//主要人员 - 设为法人代表按钮
		vm.setLegal = setLegal;
		//主要人员 - 设为法人代表弹框按钮
		vm.setLegals = setLegals;
		//主要人员 - 新增编辑主要人员
		vm.memberEdit = memberEdit;
		//主要人员 - 删除按钮
		vm.mainDel = mainDel;
		//显示股东占比弹出框
		vm.proportion = proportion;
		//下一步
		vm.nextStep = nextStep;
		//上一步
		vm.previous = previous;

		//审批意见弹出框
		vm.opinion = opinion;

		//审批意见弹出框
		function opinion(){
			var config = {
				url:'../setup/cp-1100-opinion.html?gid='+gid+'&opertype=20',
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

		//上一步
		function previous(){
			var fid = "basicUpdate_90010002201";
			vm.entBasicForm.gid = gid;
			vm.entBasicForm.opscope=$scope.value;
			vm.entBasicForm.dom =Torch.dict.getText('CA01', vm.entBasicForm.domprov) + Torch.dict.getText('CA01',vm.entBasicForm.domcity) + Torch.dict.getText('CA01',vm.entBasicForm.domcounty) +vm.entBasicForm.domother;
			vm.entBasicForm.regcap=vm.invConSumForm.consum;
			var obj = {
				url:'/torch/service.do?fid='+fid,
				param:{
					basicUpdateForm:vm.entBasicForm
				},
				validate: 'apply'
			};
			Torch.dataSubmit(obj).then(function(data){
				if(gid !== undefined){
					$location.path('/manage/'+nameid+'/'+gid)
				}else{
					Torch.info('请完成经办人的填写，并保存','danger');
				}
			})

		}

		//下一步
		function nextStep(){
			var fid = "basicUpdate_90010002201";
			vm.entBasicForm.gid = gid;
			vm.entBasicForm.opscope=$scope.value;
			vm.entBasicForm.dom =Torch.dict.getText('CA01', vm.entBasicForm.domprov) + Torch.dict.getText('CA01',vm.entBasicForm.domcity) + Torch.dict.getText('CA01',vm.entBasicForm.domcounty) +vm.entBasicForm.domother;
			vm.entBasicForm.regcap=vm.invConSumForm.consum;
			var obj = {
				url:'/torch/service.do?fid='+fid,
				param:{
					basicUpdateForm:vm.entBasicForm
				},
				validate: 'apply'
			};
			Torch.dataSubmit(obj).then(function(data){
				if(gid !== undefined){
					$location.path('/supply')
				}else{
					Torch.info('请完成经办人的填写，并保存','danger');
				}
			})
		}

		//显示股东占比弹出框
		function proportion(){
			var config = {
				url:'./cp-capital-proportion.html?gid='+gid,
				title:'股东占比'
			}
			Torch.openwin(config)
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
				query(1);
			});
		}

		//主要人员 - 删除按钮
		function mainDel(data){
			Torch.confirm('删除后数据不可更改，是否确认删除？',
				function(){
					var params={
						url:"/approve/cp/setup/delMem.do",
						param:{
							personid : data.personid,
							gid : gid
						}
					}
					Torch.dataSubmit(params).then(function(data){
						Torch.info('删除成功');
						query(1);
					});
				},
				function(){

				});
		}

		//主要人员 - 设为法人代表按钮
		function setLegals(data,position){
			Torch.confirm('是否设为法人代表？',function(){
				var params={
					url:"/torch/service.do?fid=memSignUpdate",
					param:{
						memSignUpdateForm : {
							lerepsign: '1',
							personid : data.personid,
							gid : gid,
							operType:'20',
							position:position
						}
					}
				}
				Torch.dataSubmit(params).then(function(data){
					Torch.info('设为法人代表');
					query(1);
				});
			})
		}

		//主要人员 - 设为法人代表按钮
		function setLegal(data){
			vm.legalDuties = data.positions;
		}

		//前置后置许可删除
		function entLicListDel(licid){
			Torch.confirm('删除后数据不可更改，是否确认删除？',
				function(){
					var params={
						url:"/torch/service.do?fid=basicScopePreDel",
						param:{
							"scopePreDel":{
								"licid":[licid]
							}
						}
					}
					Torch.dataSubmit(params).then(function(data){
						Torch.info('删除成功');
						query(1);
					});
			})
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

		//修改自然人股东信息弹出框
		function invEdit(data){
			var config = {
				url:'../inv/inv-1100-edit.html?gid='+gid+'&invid='+data,
				title:'修改自然人股东信息',
				size:'lg'
			}
			Torch.openwin(config).then(function(){
				Torch.info('保存成功');
				query(1);
			});
		}

		//修改非自然人股东信息弹出框
		function entinvEdit(data){
			var config = {
				url:'../inv/entinv-1100-edit.html?gid='+gid+'&invid='+data,
				title:'修改非自然人股东信息',
				size:'lg'
			}
			Torch.openwin(config).then(function(){
				Torch.info('保存成功');
				query(1);
			});
		}

		//编辑主要人员弹出框
		function memberEdit(personid){
			var config = {
				url:'../member/member-1100-edit.html?gid='+gid+'&editAdd=1&personid='+personid+'&opertype=20',
				title:'编辑主要人员',
				size:'lg'
			}
			Torch.openwin(config).then(function(){
				Torch.info('保存成功');
				query(1);
			});
		}

		//添加主要人员弹出框
		function memberAdd(){
			var config = {
				url:'../member/member-1100-edit.html?gid='+gid+'&editAdd=0&pripid='+vm.pripid+'&opertype=20',
				title:'添加主要人员',
				size:'lg'
			}
			Torch.openwin(config).then(function(){
				Torch.info('保存成功');
				query(1);
			});
		}

		//前置许可信息弹出框
		function befores(){
			var config = {
				url:'../scope/scope-pre-license.html?gid='+gid+'&pripid='+vm.pripid,
				title:'许可信息'
				//size:'lg'
			}
			Torch.openwin(config).then(function(data){
				Torch.info('保存成功');
				query(1);
			});
		}

		//后置许可经营用语弹出框
		function afters(){
			var config = {
				url:'../scope/scope-post-license.html?gid='+gid+'&pripid='+vm.pripid,
				title:'后置许可经营用语',
				size:'lg'
			}
			Torch.openwin(config).then(function(){
				Torch.info('保存成功');
				query(1);
			});
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
		
		vm.toInvEdit = toInvEdit;

		function changeNum(page){
			var fid = "basicQuery_10060049279"

			var obj = {
				url:'/torch/service.do?fid='+fid,
				param:{
					"directorList":{
						_data:[],
						_paging:page
					}
				}
			};

			Torch.dataSubmit(obj).then(function(data){
				vm.directorList = data.directorList;
			})
		}
		//保存页面所有信息按钮
		function saveSetup(){
			var fid = "basicUpdate_90010002201";
			vm.entBasicForm.gid = gid;
			vm.entBasicForm.opscope=$scope.value;
			vm.entBasicForm.dom =Torch.dict.getText('CA01', vm.entBasicForm.domprov) + Torch.dict.getText('CA01',vm.entBasicForm.domcity) + Torch.dict.getText('CA01',vm.entBasicForm.domcounty) +vm.entBasicForm.domother;
			vm.entBasicForm.regcap=vm.invConSumForm.consum;
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
		
		//申请页面获取数据
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
				if(!data._error){
					vm.pripid = data.entBasicForm.pripid
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
		
		function toInvEdit(){
			Torch.openwin({
				url: '../inv/inv-1100-edit.html',
				title: '股东编辑页面',
				size: 'lg',
				param: {name: '史亚萌'}
			});
		}
		
		function init(){
			$scope.tab.selectTab = 1;
			//设为法定代表人填出框
			vm.selectManTpl = 'selectManTpl.html';
			//选择设为法人的职位
			vm.legalDuties = [];

			//名称信息
			vm.entNameForm = '';

			//基本信息
			vm.entBasicForm = '';

			//可选可输入的经营期限
			vm.orgForm=["5","10","20","30","长期"];

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
//补充信息
(function(){
	angular.module('app')
	.controller('supplyController',supplyController)

	supplyController.$inject = ['dataService','modalService','$scope','$routeParams','$timeout','$location'];
	
	//补充信息
    function supplyController(dataService,modalService,$scope,$routeParams,$timeout,$location){

        var vm = this;
		var nameid = Torch.getParam('nameid');
		var gid = Torch.getParam('gid');
        //补充信息页面获取数据
        vm.query = query;
        //保存
        vm.saveSetup = saveSetup;
		//审批意见
		vm.opinion = opinion;
		//上一步
		vm.previous = previous;

		//上一步
		function previous(){
			var params={
				url:"/torch/service.do?fid=supUpdate_90050037277",
				param:{
					supUpdateForm  : vm.supQueryForm
				},
				validate: 'supply'
			}
			params.param.supUpdateForm.gid = gid;
			params.param.supUpdateForm.proloc = vm.supQueryForm.domother;
			params.param.supUpdateForm.dom = Torch.dict.getText('CA01', vm.supQueryForm.domprov) + Torch.dict.getText('CA01',vm.supQueryForm.domcity) + Torch.dict.getText('CA01',vm.supQueryForm.domcounty) +vm.supQueryForm.domother;
			Torch.dataSubmit(params).then(function(data){
				if(gid !== undefined){
					$location.path('/apply')
				}else{
					Torch.info('请完成经办人的填写，并保存','danger');
				}
			});

		}

		//审批意见弹出框
		function opinion(){
			var config = {
				url:'../setup/cp-1100-opinion.html?gid='+gid+'&opertype=20',
				title:'审批意见',
				size:'lg'
			}
			Torch.openwin(config).then(function(){
				$timeout(function() {
					Torch.redirect('../../task/task.html');
				}, 1000);

			});
		}

		//保存
        function saveSetup(){
			var params={
				url:"/torch/service.do?fid=supUpdate_90050037277",
				param:{
					supUpdateForm  : vm.supQueryForm
				},
				validate: 'supply'
			}
			params.param.supUpdateForm.gid = gid;
			params.param.supUpdateForm.proloc = vm.supQueryForm.domother;
			params.param.supUpdateForm.dom = Torch.dict.getText('CA01', vm.supQueryForm.domprov) + Torch.dict.getText('CA01',vm.supQueryForm.domcity) + Torch.dict.getText('CA01',vm.supQueryForm.domcounty) +vm.supQueryForm.domother;
			Torch.dataSubmit(params).then(function(data){
				Torch.info('保存成功');
				query();
			});
        }

		//补充信息页面获取数据
        function query(){
			var params={
				url:"/torch/service.do?fid=supQuery_00050081268",
				param:{
					supQueryDetail : {
						gid : gid
					}
				}
			}

			Torch.dataSubmit(params).then(function(data){
				vm.supQueryForm	= data.supQueryDetail;
			});
        }

		function init(){
			$scope.tab.selectTab = 2;
			//页面数据
			vm.supQueryForm = {
				//电话
				tel: "",
				//邮政编码
				postalcode: "",
				//邮箱
				email:"",
				//生产经营地
				proloc:'',
				//住所产权
				domproright:'',
				//省
				domprov:"",
				//市
				domcity:"",
				//地区
				domcounty:"",
				//详细地址
				domother:"",
				//执行副本数
				copyNo:"",
				gid:''
			}
			query();
		}

        init();
    }
})();
