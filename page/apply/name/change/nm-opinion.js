(function(){
    angular.module('app',['common'])
        .controller('nmOpinionController',nmOpinionController)

    nmOpinionController.$inject = ['dataService'];

    function nmOpinionController(dataService){
        var gid = Torch.getParam('gid');
        var processid = Torch.getParam("processid");
        var business = Torch.getParam("business");
        
        //判断是否为提交的标志
        var submit = false;
        var vm = this;
        //初始化
        vm.init = init;
        //获取数据
        vm.query = query;
        //保存
        vm.saveOpinion = saveOpinion;
        vm.submitOpinion = submitOpinion;
        
        //辅助审查
        vm.check = check;

        //辅助审查
        function check(s){
        	submit = s;
        	var params = {
        		url: '/ruletest/runAppCode.do?gid='+gid+"&appCode=companyNameSetup",
        		param: {}
        	};
        	Torch.dataSubmit(params).then(function(data){
                if(!data || data.length < 1){
                	if(!submit){
                		Torch.info('审查通过');
                		return;
                	}
                	saveOpinion(true);
                }
                if(submit){
                	var type = 1;
                }else{
                	type = 0;
                }
                var config = {
                        url:'../check/nm-auxiliary.html?gid='+ gid + '&type=' + type,
                        title:'辅助审查',
                        size:'lg',
                        param: data
                    }
                Torch.openwin(config).then(function(data){
                	if(data === true){
                		saveOpinion(true);
                	}
                });
            });
        	
            
        }
        
        function saveOpinion(s){
        	submit = s;
        	vm.ApplyOpinionDetail.business = business;
        	vm.ApplyOpinionDetail.nextStep = vm.nextStep.value;
        	if(submit){
        		vm.ApplyOpinionDetail.isApprove = '1';
        	}else{
        		vm.ApplyOpinionDetail.isApprove = '0';
        	}
        	var params = {
        		url: '/torch/service.do?fid=applyprocessUpdate',
        		param: {
        			applyprocessUpdateForm: vm.ApplyOpinionDetail
        		}
        	};
        	Torch.dataSubmit(params).then(function(data){
        		if(!submit){
            		Torch.info('保存成功');
            		return;
            	}
            	Torch.closewin(true);
            });
        }
        
        function submitOpinion(){
        	var processresult = vm.ApplyOpinionDetail.processresult;
        	if(!processresult){
        		Torch.info('请选择审批结果', 'error');
        		return;
        	}
        	if(processresult == '14'){
        		var next = vm.nextStep.value;
        		if(!next){
        			Torch.info('请选择下一环节', 'error');
            		return;
        		}
        		if(next == '1'){
        			check(true);
        		}
        		saveOpinion(true);
        	}
        }


        //查询页面数据
        function query(){
            var params = {
                url:"/torch/service.do?fid=applyprocessQuery",
                param:{
                	applyprocessQueryList : {
                        _paging :{
                              "pageNo" :"1",  
                              "pageSize":"10", 
                              "total" :"2"   
                          },
                          _condition: {
                            gid: gid
                          }
                      },
                      applyprocessQueryForm: {
			             processid: processid 
			          }
                }
            }
            Torch.dataSubmit(params).then(function(data){
            	vm.ApplyOpinionDetail = data.applyprocessQueryForm;
            	vm.ApplyOpinionList = data.applyprocessQueryList._data;
            })
        }

        function init(){

            //历史审批意见
            vm.ApplyOpinionList = [];

            //审批结果
            vm.ApplyOpinionDetail = {
                //审批结果
                processresult:'',
                //审批意见
                processmsg:'',
                //下一环节
                nextStep:'',
                processid: processid,
                gid: gid
            }
            //下一环节
            vm.nextStep = {
                value:''
            };

            query()
        }
        vm.init();
    }
})();

