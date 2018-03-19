(function(){
    angular.module('app',['common'])
        .controller('entryController',entryController)

    entryController.$inject = ['dataService'];

    function entryController(dataService){
        var vm = this;
        //查询
        vm.inquire = inquire;
        //重置
        vm.entryReset = entryReset;
        //分页
        vm.changeNum = changeNum;
        //受理
        vm.accepted = accepted

        //受理
        function accepted(gid){
            vm.obj = {
                url:'/net/approve/cp/checkState.do?gid='+gid,
                param:{}
            };
            Torch.dataSubmit(vm.obj).then(function(data){
                if("success"==data.checkForm.result){
                    Torch.redirect('./cp-1100-setup.html?gid='+gid);
                }
            });
        }

        //分页
        function changeNum(_paging){
            vm._paging = _paging;
            if(vm.checkbox == 1){
                vm.obj = {
                    url:'/torch/service.do?fid=netSetupEntryQuery',
                    param:{

                        netSetupEntryQueryList : {
                            _paging :vm._paging,
                            _condition: vm._condition
                        }
                    }
                };
                Torch.dataSubmit(vm.obj).then(function(data){
                    vm.entryList = data.netSetupEntryQueryList._data;
                    vm._paging = data.netSetupEntryQueryList._paging;
                })
            }else{
                vm.obj = {
                    url:'/torch/service.do?fid=netSetupEntry',
                    param:{

                        netSetupEntryList : {
                            _paging :vm._paging,
                            _condition: vm._condition
                        }
                    }
                };
                Torch.dataSubmit(vm.obj).then(function(data){
                    vm.entryList = data.netSetupEntryList._data;
                    vm._paging = data.netSetupEntryList._paging;
                })
            }
        }

        //重置
        function entryReset(){
            vm._condition = {
                //名称预先核准文号
                apprno :'',
                //企业名称
                entname :''
            };
            //模糊查询或以xxx开头
            vm.checkbox = '1'
        }

        //查询
        function inquire(){

            if(vm.checkbox == 1){
                vm.obj = {
                    url:'/torch/service.do?fid=netSetupEntryQuery',
                    param:{

                        netSetupEntryQueryList : {
                            _paging :{
                                pageNo :'1',
                                pageSize:'10',
                                total :''
                            },
                            _condition: vm._condition
                        }
                    }
                };
                Torch.dataSubmit(vm.obj).then(function(data){
                    vm.entryList = data.netSetupEntryQueryList._data;
                    vm._paging = data.netSetupEntryQueryList._paging;
                })
            }else{
                vm.obj = {
                    url:'/torch/service.do?fid=netSetupEntry',
                    param:{

                        netSetupEntryList : {
                            _paging :{
                                pageNo :'1',
                                pageSize:'10',
                                total :''
                            },
                            _condition: vm._condition
                        }
                    }
                };
                Torch.dataSubmit(vm.obj).then(function(data){
                    vm.entryList = data.netSetupEntryList._data;
                    vm._paging = data.netSetupEntryList._paging;
                })
            }
        }

        //刷新
        function init(){
            vm.entryList = [];
            vm._condition = {
                //名称预先核准文号
                apprno :'',
                //企业名称
                entname :''
            };

            //模糊查询或以xxx开头
            vm.checkbox = '1'

            vm._paging = {
                pageNo: '',
                pageSize: '',
                total: ''
            };
            inquire();
        }
        
        init();

    }
})();

