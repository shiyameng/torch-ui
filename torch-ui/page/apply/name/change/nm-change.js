angular.module('app', ['common','ngRoute'])
.config(config)
	function config($routeProvider) {
		$routeProvider.when('/info', {
			templateUrl : 'nm-change-info-tpl.html',
			controller:'nmController'
		}).when('/otherinfo', {
			templateUrl : 'nm-change-otherinfo-tpl.html'
		}).otherwise({
			redirectTo : '/info'
		});
	}

//accredit.html页面的控制器
(function(){
	angular.module('app').controller('SetupController',SetupController);
	
	SetupController.$inject = ['$scope', '$routeParams'];
	
	function SetupController($scope, $routeParams){
		$scope.tab = {
				selectTab : 0
		}
	}
})();

//名称信息
(function(){
	angular.module('app')
	.controller("nmController",nmController);
	//注入依赖
	nmController.$inject = ['$scope', 'dataService','$routeParams','$filter'];
	
	function nmController($scope, dataService,$routeParams,$filter){
		var vm = this;
		
		//名称设立表单
		vm.nmInfoForm = {};
		//加载行业表述
		vm.queryBusiness = queryBusiness;
		//选中行业表述的回调
		vm.selectBusiness = selectBusiness;
		//得到企业名称的值
		vm.getEntName = getEntName;
		//选择主营业务
		vm.addBusiness =addBusiness;
		//设置企业名称
		vm.setEntName = setEntName;
		//添加授权信息
		vm.authorityInfo = authorityInfo;
		//删除授权
		vm.delAuthority = delAuthority;
		vm.checkPinyin = checkPinyin;
		//保存企业名称信息
		vm.save = save;
		
		
		
		$scope.$watch('vm.nmInfoForm.namedistrict', function(newVal, oldVal, $scope){
			if(newVal && newVal != oldVal){
				//企业名称的值
				$scope.vm.nmInfoForm.entname = $scope.vm.getEntName();
			}
		});
		$scope.$watch('vm.nmInfoForm.namecity', function(newVal, oldVal, $scope){
			if(newVal && newVal != oldVal){
				//企业名称的值
				$scope.vm.nmInfoForm.entname = $scope.vm.getEntName();
			}
		});
		$scope.$watch('vm.nmInfoForm.namecountry', function(newVal, oldVal, $scope){
			if(newVal && newVal != oldVal){
				//企业名称的值
				$scope.vm.nmInfoForm.entname = $scope.vm.getEntName();
			}
		});
		$scope.$watch('vm.nmInfoForm.enttra', function(newVal, oldVal, $scope){
			if(newVal && newVal != oldVal){
				//企业名称的值
				$scope.vm.nmInfoForm.entname = $scope.vm.getEntName();
			}
		});
		$scope.$watch('vm.nmInfoForm.nameind', function(newVal, oldVal, $scope){
			if(newVal && newVal != oldVal){
				//企业名称的值
				$scope.vm.nmInfoForm.entname = $scope.vm.getEntName();
			}
		});
		$scope.$watch('vm.nmInfoForm.orgform', function(newVal, oldVal, $scope){
			if(newVal && newVal != oldVal){
				//企业名称的值
				$scope.vm.nmInfoForm.entname = $scope.vm.getEntName();
			}
		});
		
		
		
		//根据行业表述的输入字段查询
		function queryBusiness(val){
			var params={
					url:"/dmj/queryNameIndCo.do",
					param:{
						text:val,
						industryCo:""
					}
			};
			return Torch.dataSubmit(params).then(function(data){
				var dd = data.map(function(item) {
			        return item.text;
			      });
				return dd;
			})
		}
		
		function selectBusiness(item, ui){
			var nameind = vm.nmInfoForm.nameind;
			var array = nameind.split(/[\(\)]/);
			if(array && array.length > 0){
				vm.nmInfoForm.nameind = array[0];
				vm.nmInfoForm.industry = array[1] || '';
				var codeArray = (array[1] || '').split('-');
				if(codeArray && codeArray.length > 0){
					vm.nmInfoForm.industryco = codeArray[1] || '';
				}
			}
		}
		
		//得到企业名称的值
		function getEntName(){
			var nameAddress = $filter("dict")(vm.nmInfoForm.namedistrict || '','CA01') + $filter("dict")(vm.nmInfoForm.namecity || '','CA01')+ $filter("dict")(vm.nmInfoForm.namecountry || '','CA01');
			var nameAddressNoFirst = '';
			if(nameAddress && nameAddress != ''){
				nameAddressNoFirst = '（' + nameAddress + '）';
			}
			var enttra = vm.nmInfoForm.enttra || '';
			var nameind = vm.nmInfoForm.nameind || '';
			var orgform = vm.nmInfoForm.orgform || '';
			if(vm.position == 'middle'){
				return enttra + nameAddressNoFirst + nameind + orgform;
			}
			if(vm.position == 'after'){
				return enttra + nameind + orgform + nameAddressNoFirst;
			}
			return nameAddress + enttra + nameind + orgform; 
		}
		
		function setEntName(){
			vm.nmInfoForm.entname = vm.getEntName();
		}
		
		
		//查询页面所有信息
		function query(){
			var gid = Torch.getParam('gid');
			var pripid = Torch.getParam('pripid');
			if(gid){
				var params={
						url:"/torch/service.do?fid=nameDetail",
						param:{
							nameDetailForm: {
							    gid:gid
							},
						    accreditQueryList:{
							     _condition:{
							    	 gid:gid
							     }
							}
						}
				};
				Torch.dataSubmit(params).then(function(data){
					vm.nmInfoForm = data.nameDetailForm || {};
					vm.nmInfoForm.industry = setIndustry(vm.nmInfoForm.industryco ||  '');
					vm.nmInfoForm.namedistrict = '150000';
					vm.position = setPositionByName(vm.nmInfoForm.entname);
					vm.accreditList = data.accreditQueryList ?  data.accreditQueryList._data || [] : [];
				});
				var entparams={
						url:"/torch/service.do?fid=entDetail",
						param:{
							entDetailForm: {
								pripid: pripid
							}
						}
				};
				Torch.dataSubmit(entparams).then(function(data){
					vm.nmDetail = data.entDetailForm || {};
				});
			}
		}
		
		//根据名称设置行政区划位置
		function setPositionByName(name){
			if(!name){
				return 'before';
			}
			var index = name.indexOf('）');
			if(index < 0){
				return 'before';
			}else if(index == (name.length -1)){
				return 'after';
			}else{
				return 'middle';
			}
			
		}
		
		//选择主营业务
		function addBusiness(){
			var config = {
				url:'../scope/scope-main.html',
				title:'手动选择主营业务',
				size:'lg'
			}
			Torch.openwin(config).then(function(data){
				vm.nmInfoForm.industryco = data;
				vm.nmInfoForm.industry = setIndustry(data);
			});		
		
		}
		
		//填写授权信息，弹出新窗口
		function authorityInfo(){
			var config = {
				url:'../accredit/accredit.html',
				title:'填写授权信息',
				size:'lg'
			}
			Torch.openwin(config).then(function(data){
				vm.accreditList.push(data);		
			});		
		}
		
		//删除授权信息
		function delAuthority(index){
			accreditList = vm.accreditList;
			accreditList.splice(index,1);
			vm.accreditList = accreditList;
		}
		
		//设置主营业务
		function setIndustry(industryco){
			var industry = '主营业务:'
			industry += $filter("dict")(industryco,'CA06');
			industry += '-' + industryco;
			return industry;
		}
		//校验规则
		function checkRule(){
			var gid = Torch.getParam('gid');
			vm.nmInfoForm.appCode = 'companyNameMatching';
			var params = {
				url:'/ruletest/runNm.do',
				param:{
					'nameData': vm.nmInfoForm
				}
			};
			Torch.dataSubmit(params).then(function(data){
				if(data.length > 0){
					var config = {
	                        url:'../check/nm-auxiliary.html?gid='+gid,
	                        title:'辅助审查',
	                        size:'lg',
	                        param: data
	                    }
	                Torch.openwin(config);
					for(var i = 0, len = data.length; i < len; i++){
						var item = data[i];
						if(item.type == '1'){
							vm.checkResult = false;
							return;
						}
					}
					vm.checkResult = true;
				}else{
					Torch.info('辅助审查通过', 'success');
					vm.checkResult = true;
				}
			});
		}
		
		//校验是否有多音字
		function checkPinyin(){
			Torch.validateForm('nmInfo').then(function(){
				var pinParams = {
					url: '/enttra/queryTraPinyin.do',
					validate: 'nmInfo',
					param: {
						enttra: vm.nmInfoForm.enttra
					}
				}
				//校验是否有多音字
				Torch.dataSubmit(pinParams).then(function(data){
					if(isShowPinyin(data)){
						var pinyin = renderPinyin(data);
						
						var config = {
							url:'../check/nm-check-pinyin.html' ,
							title:'选择字号拼音',
							param: pinyin
						}
						Torch.openwin(config).then(function(data){
							if(data && data!='cancel'){
								vm.nmInfoForm.tradpiny = data;
								checkRule();
							}
						});
					}else{
						pinyin = getPinyin(data);
						vm.nmInfoForm.tradpiny = pinyin;
						checkRule();
					}
				});
			});
			
		}
		
		function getPinyin(data){
			if(!data){
				return '';
			}
			var pinyin = [];
			for(var i = 0, len = data.length; i < len; i++){
				var item = data[i];
				var value = item.value[0] || '';
				pinyin.push(value);
			}
			return pinyin.join('_');
		}
		
		function isShowPinyin(data){
			if(!data){
				return false;
			}
			if(!Array.isArray(data)){
				return false;
			}
			for(var i = 0, len = data.length; i < len; i++){
				var item = data[i];
				if(item.value && item.value.length > 1){
					return true;
				}
			}
			return false;
		}
		
		//构建显示多音字的结构
		//[{text:"张",value:"zhang",pinyin:[{text:"zhang",value:"zhang"},{text:"chang",value:"chang"}]}]
		function renderPinyin(data){
			if(!data){
				return [];
			}
			var word = [];
			for(var i = 0, len = data.length; i < len; i++){
				var item = data[i];
				word[i] = {};
				word[i].text = item.text;
				word[i].value = '';
				word[i].pinyin = [];
				var pinyin = item.value;
				if(pinyin){
					for(var j = 0, jlen = pinyin.length; j < jlen; j++){
						var jitem = pinyin[j];
						if(jitem){
							var pinyinItem = {
								text:jitem,
								value:jitem
							}
							word[i].pinyin.push(pinyinItem);
						}
					}
					if(pinyin.length == 1){
						word[i].value = pinyin[0];
					}
				}
			}
			return word;
		}
		
		
		function save(tradpiny){
			var gid = Torch.getParam('gid');
			var nameid = Torch.getParam('nameid');
			vm.nmInfoForm.accreditList = vm.accreditList;
			
			if(!gid || !nameid){
				var params = {
						url: '/torch/service.do?fid=nameInsert',
						param: {
							nameInsertForm: vm.nmInfoForm
						},
						validate: 'nmInfo'
				}
			}
			
			if(gid && nameid){
				vm.nmInfoForm.gid = gid;
				vm.nmInfoForm.nameid = nameid;
				var params = {
						url: '/torch/service.do?fid=nameUpdate',
						param: {
							nameUpdateForm: vm.nmInfoForm
						},
						validate: 'nmInfo'
				}
			}
			Torch.dataSubmit(params).then(function(data){
				//跳转到其他信息页面
				var gid = (data.nameInsertForm || data.nameUpdateForm).gid;
				var nameid = (data.nameInsertForm || data.nameUpdateForm).nameid;
				Torch.redirect("./nm-change.html?gid="+gid+"&nameid="+nameid+'#/otherinfo');
			});
		}
		
		//初始化方法
		function init(){
			$scope.tab.selectTab = 0;
			//组织形式常用项
			vm.orgForm=["有限公司","有限责任公司","股份公司","股份有限公司"];
			vm.city = Torch.city.getOne('150000');
			vm.nmInfoForm = {};
			vm.nmInfoForm.namedistrict = '150000';
			vm.position = 'before';
			vm.accreditList = [];
			query();
		}
		init();
	}
})();

//其他信息
(function(){
    angular.module('app')
    .controller('nmOtherinfoController', nmOtherinfoController);

    nmOtherinfoController.$inject=['$scope', 'dataService','$routeParams'];

    function nmOtherinfoController($scope, dataService,$routeParams){
        //var gid = Torch.getParam('gid');
        var gid = Torch.getParam('gid');
        var nameid = Torch.getParam('nameid');
        var vm = this;
        //初始化
        vm.init = init;
        //数据加载
        vm.query = query;
        //确定
        vm.determine = determine;
        //材料 - 删除
        vm.materialDel = materialDel;
        //材料 - 增加
        vm.materialAdd = materialAdd;
        //投资人- 添加
        vm.investmentAdd = investmentAdd;
        //投资人- 编辑
        vm.investmentEdit = investmentEdit;
        //投资人- 删除
        vm.investmentDel = investmentDel;
        //显示股东占比
        vm.proportion = proportion;
        //审批
        vm.approval = approval;
        //投资人分页
        vm.investmentPage = investmentPage;
        //返回上一页
        vm.back=back
        //根据身份证查找联系人
        vm.findLinkMan = findLinkMan;
        //投资人刷新页面
        vm.investmentData = investmentData;
        //选择证件类型的方法
        vm.selectCerType = selectCerType;

        
        
        //选择证件类型的方法
        function selectCerType(){
        	var certype = vm.applyQueryForm.certype;
        	if(certype == '10'){
        		$('#cerno').attr('rule', 'must;idcard');
        	}else{
        		$('#cerno').attr('rule', 'must');
        	}
        }
        
		function investmentData(){
			var obj = {
				url:'/torch/service.do?fid=nameOtherInfoQuery',
				param:{
					//查询投资人
					"investorQueryList":{
						_condition: {
							gid :gid
						}
					},
					//查询投资人总额
					"investSumForm":{
						"gid":gid
					}
				}
			};
			Torch.dataSubmit(obj).then(function(data){
				//投资人
				vm.InvList = data.investorQueryList._data
				//投资总和
				vm.investSumForm = data.investSumForm;
				//投资人分页
				vm._paging = data.investorQueryList._paging;
			});
		}

        function findLinkMan(){
        	
        }
        
        //返回上一步
        function back(){
        	Torch.redirect("./nm-change.html?gid="+Torch.getParam('gid')+"&nameid="+Torch.getParam('nameid')+'#/info');
        }
        //投资人分页
        function investmentPage(){
            vm.obj = {
                url:'/torch/service.do?fid=nameOtherInfoQuery',
                param:{
                    "investorQueryList":{
                        _condition: {
                            gid :gid
                        },
                        _paging:vm._paging
                    }
                }
            }
            Torch.dataSubmit(vm.obj).then(function(data){
                vm.InvList = data.investorQueryList._data
            })
        }

        //审批
        function approval(){
        	Torch.validateForm('nameOtherInfo').then(function(){
        		var config = {
                        url:'./nm-opinion.html?gid='+gid+"&processid="+vm.processid+ '&business=1',
                        title:'审批',
                        size:'lg'
                    }
                    Torch.openwin(config).then(function(data){
                    	if(data === true){
                    		Torch.redirect('./nm-change.html');
                    	}
                    });
        	});
        }

        //显示股东占比
        function proportion(){
            var config = {
                url:'../../inv/inv-capital-proportion.html?gid='+gid,
                title:'股东占比'
            }
            Torch.openwin(config).then(function(){
                Torch.info('保存成功');
            });
        }

        //投资人- 添加
        function investmentAdd(){
            var config = {
                url:'../inv/inv-info.html?gid='+gid+'&editAdd=1&nameid='+nameid,
                title:'添加投资人'
            }
            Torch.openwin(config).then(function(){
                Torch.info('保存成功');
		investmentData();
            });
        }
        //投资人- 编辑
        function investmentEdit(data){
        	if(typeof data == 'undefined'){
        		return;
        	}
            var config = {
                url:'../inv/inv-detail.html?gid='+gid+'&editAdd=0&nameid='+nameid+"&invid="+data,
                title:'编辑投资人'
            }
            Torch.openwin(config).then(function(){
                Torch.info('保存成功');
		investmentData();
            });
        }
        //投资人- 删除
        function investmentDel(data, $event){
        	$event.stopPropagation();
        	if(typeof data == 'undefined'){
        		return;
        	}
            Torch.confirm('删除后数据不可更改，是否确认删除？',
            	function(){
            		vm.obj = {
            			url:'/torch/service.do?fid=investorDel',
            			param:{
            				"investorDel":{
            					"invid":[data]
            				}
            			}
            		};
            		Torch.dataSubmit(vm.obj).then(function(data){
            			Torch.info('删除成功');
				investmentData();
            		});
            	})
        }

        //材料 - 增加
        function materialAdd(){
            vm.applydocQueryList.push({docname:'',doctype:'',doccnt:''})
        }

        //材料 - 删除
        function materialDel(index){
        	if(typeof index != 'undefined'){
        		vm.applydocQueryList.splice(index,1);
        	}
        }
        

        //确定
        function determine(flag){
            vm.obj = {
                url:'/torch/service.do?fid=nameOtherInfoUpdate',
                param:{
                    applyUpdateForm:vm.applyQueryForm,
                    entUpdateForm:vm.entQueryForm
                },
                validate: 'nameOtherInfo'
            };
            vm.obj.param.applyUpdateForm._data = vm.applydocQueryList;
            vm.obj.param.entUpdateForm.regcap = vm.investSumForm.subsum;
            Torch.dataSubmit(vm.obj).then(function(data){
            	//如果flag为true走审批
            	if(flag){
            		approval();
            	}else{
            		Torch.info('保存成功');
                    query();
            	}
            });
        }

        //数据加载
        function query(){
            var obj = {
                url:'/torch/service.do?fid=nameOtherInfoQuery',
                param:{
                    //查询市场主体名称
                    "nameQueryForm":{
                        "gid":gid
                    },
                    //查询申请人信息
                    "applyQueryForm":{
                        "gid":gid
                    },
                    //查询提交材料
                    "applydocQueryList":{
                        _condition: {
                            gid :gid
                        }
                    },
                    //查询公司基本信息
                    "entQueryForm":{
                        "gid":gid
                    },
                    //查询投资人
                    "investorQueryList":{
                        _condition: {
                            gid :gid
                        }
                    },
                    //查询投资人总额
                    "investSumForm":{
                        "gid":gid
                    }
                }
            };
            Torch.dataSubmit(obj).then(function(data){
                //主体名称
                vm.nameQueryForm = data.nameQueryForm;
                //查询申请人信息
                vm.applyQueryForm = data.applyQueryForm;
                if(!vm.applyQueryForm.appform){
                	vm.applyQueryForm.appform = '1';
                }
                
                //提交材料
                vm.applydocQueryList = data.applydocQueryList._data || [];
                if(vm.applydocQueryList.length == 0){
                	materialAdd();
                }
                //查询公司基本信息
                vm.entQueryForm = data.entQueryForm;
                vm.entQueryForm.congrousd = vm.entQueryForm.congrousd ? vm.entQueryForm.congrousd : '156';
                //投资人
                vm.InvList = data.investorQueryList._data;
                //投资总和
                vm.investSumForm = data.investSumForm;
                //投资人分页
                vm._paging = data.investorQueryList._paging;
                vm.processid = data.investSumForm.processid;
            });
        }

        //初始化
        function init(){
        	$scope.tab.selectTab = 1;
            //主体名称
            vm.nameQueryForm = {
                entname:''
            }
            //查询申请人信息
            vm.applyQueryForm = {};
            //提交材料
            vm.applydocQueryList = [];
            vm.applydocPaging = {
            		pageNo :'1',
                    pageSize:'10',
                    total :''
            };
            //查询公司基本信息
            vm.entQueryForm = {
                //货币类型
                "congrousd":"156"
            }
            //投资人分页
            vm._paging = {
                pageNo: '1',
                pageSize: '10',
                total: ''
            }
            
            vm.selectManTpl = 'selectManTpl.html';
            query();
        }
        init()
    }
})();