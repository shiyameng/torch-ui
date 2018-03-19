(function(){
    angular.module('app',['common'])
        .controller('opinionController',opinionController)

    opinionController.$inject = ['dataService','$scope'];

    function opinionController(dataService,$scope){
        var gid = Torch.getParam('gid');
        var opertype = Torch.getParam('opertype');
        var vm = this;
        //初始化
        vm.init = init;
        //获取数据
        vm.query = query;
        //保存
        vm.saveSetup = saveSetup;
        //收起
        vm.putAway = putAway;
        //辅助审查
        vm.check = check;

        //辅助审查
        function check(data){
            //data == 1时  代表点的是辅助审查按钮
            var config = {
                url:'./cp-1100-auxiliary.html?gid='+gid+'&opertype='+opertype+'&type='+data,
                title:'辅助审查',
                size:'lg'
            }
            Torch.openwin(config).then(
                function(data){
                    vm.obj = {
                        url:'/torch/service.do?fid=ApplyOpinionUpdate',
                        param:{
                            "entTypeForm":vm.entTypeQuery,
                            "ApplyOpinionForm":vm.ApplyOpinionDetail
                        }
                    };
                    //type=0:保存  type=1:提交
                    vm.obj.param.ApplyOpinionForm.isApprove = 1;
                    //下一环节
                    vm.obj.param.ApplyOpinionForm.nextStep = $scope.nextStep.value;
                    //类型
                    vm.obj.param.ApplyOpinionForm.operType = opertype;
                    //审批结果
                    if(!vm.obj.param.ApplyOpinionForm.processresult){
                        vm.obj.param.ApplyOpinionForm.processresult = '';
                    }
                    //提交
                    Torch.dataSubmit(vm.obj).then(function(data){
                        Torch.closewin();
                    })
                }
            );
        }
        //保存和提交 type=0:保存  type=1:提交
        function saveSetup(type){

            vm.obj = {
                url:'/torch/service.do?fid=ApplyOpinionUpdate',
                param:{
                    "entTypeForm":vm.entTypeQuery,
                    "ApplyOpinionForm":vm.ApplyOpinionDetail
                }
            };
            //type=0:保存  type=1:提交
            vm.obj.param.ApplyOpinionForm.isApprove = type;
            //下一环节
            vm.obj.param.ApplyOpinionForm.nextStep = $scope.nextStep.value;
            //类型
            vm.obj.param.ApplyOpinionForm.operType = opertype;
            //审批结果
            if(!vm.obj.param.ApplyOpinionForm.processresult){
                vm.obj.param.ApplyOpinionForm.processresult = '';
            }


            //当选中核准和直接准核进行提交核准
            if(vm.ApplyOpinionDetail.processresult == 14 && $scope.nextStep.value == 1 && type == 1){
                //判断公司设立和变更 辅助审查的不同
                if(opertype == 20){
                    var appCode = 'companySetup';
                }else if(opertype == 30){
                    appCode = 'companyChange';
                }
                var param = {
                    url:'/ruletest/runAppCode.do?gid='+gid+"&appCode="+appCode,
                    param:{}
                };
                Torch.dataSubmit(param).then(function(data){
                    if(data.length > 0){
                        //弹出辅助审查
                        check(0);
                    }else{
                        //提交
                        Torch.dataSubmit(vm.obj).then(function(data){
                            Torch.closewin();
                        })
                    }
                })
            }else if(type == 0){
                Torch.dataSubmit(vm.obj).then(function(data){
                    Torch.info('保存成功');
                })
            }else if(vm.ApplyOpinionDetail.processresult == 12 || vm.ApplyOpinionDetail.processresult == 13 || $scope.nextStep.value == 2 || $scope.nextStep.value == 1){
                Torch.dataSubmit(vm.obj).then(function(data){
                    //提交时关闭弹框
                    if( type == 1){
                        Torch.closewin();
                    }else{
                        Torch.info('保存成功');
                    }
                })
            }else{
                Torch.info('请选择下一环节','danger');
            }
        }

        //收起方法
        function putAway(){
            vm.opinionTable = vm.opinionTable == false ? true : false;
            vm.putAways = vm.putAways == '收起'?'展开':'收起';
        }

        //查询页面数据
        function query(){
            vm.obj = {
                url:'/torch/service.do?fid=ApplyOpinionQuery&id='+gid,
                param:{}
            };
            Torch.dataSubmit(vm.obj).then(function(data){
                //历史审批意见
                vm.ApplyOpinionList = data.ApplyOpinionList._data;
                //企业细类
                vm.entTypeQuery = data.entTypeQuery;
                //审批结果 审批意见
                vm.ApplyOpinionDetail = data.ApplyOpinionDetail._data[0]
            })
        }

        function init(){

            //通过ng-if 控制展开收起 -- begin
            vm.opinionTable = true;
            vm.putAways = '收起';
            //通过ng-if 控制展开收起 --end

            //历史审批意见
            vm.ApplyOpinionList = [
                //{opername: "", processenddate: "", processmsg: ""}
            ];

            //企业细类
            vm.entTypeQuery = {
                enttype : ''
            };

            //审批结果
            vm.ApplyOpinionDetail = {
                //审批结果
                processresult:'',
                //审批意见
                processmsg:'',
                //下一环节
                nextStep:''
            }
            //下一环节
            $scope.nextStep = {
                value:''
            };

            query()
        }
        vm.init();
    }
})();

