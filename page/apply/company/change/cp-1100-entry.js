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
        //进入办理
        vm.accepted = accepted

        //进入办理
        function accepted(nameid,pripid){
            vm.obj = {
                url:'/approve/cp/change/checkState.do?rspripid='+pripid,
                param:{}
            };
            Torch.dataSubmit(vm.obj).then(function(data){
                if("success"==data.checkForm.result){
                    Torch.redirect('./cp-1100-change.html?nameid='+nameid+'&pripid='+pripid);
                }
            });
        }

        //分页
        function changeNum(){
            inquire()
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
            var fid = vm.checkbox == 1?'changeEntryLikeQuery':'changeEntryMQuery';

            if(vm.checkbox == 1){
                vm.obj = {
                    url:'/torch/service.do?fid='+fid,
                    param:{
                        changeEntryLikeList: {
                            _paging: vm._paging,
                            _condition:vm._condition
                        }
                    }
                };
            }else{
                vm.obj = {
                    url:'/torch/service.do?fid='+fid,
                    param:{
                        changeEntryMList: {
                            _paging: vm._paging,
                            _condition:vm._condition
                        }
                    }
                };
            }


            Torch.dataSubmit(vm.obj).then(function(data){
                if(!data._error){
                    if(vm.checkbox == 1){
                        vm.entryList = data.changeEntryLikeList._data;
                        vm._paging = data.changeEntryLikeList._paging;
                    }else{
                        vm.entryList = data.changeEntryMList._data;
                        vm._paging = data.changeEntryMList._paging;
                    }

                }else{
                    vm.entryList = [];
                    vm._paging = {
                        pageNo: '',
                        pageSize: '',
                        total: ''
                    };
                }

            })
        }

        //刷新
        function init(){
            vm.entryList = [];
            vm._condition = {
                //公司注册号
                regno :'',
                //企业名称
                entname :''
            };

            //模糊查询或以xxx开头
            vm.checkbox = '1'

            vm._paging = {
                pageNo: '1',
                pageSize: '10',
                total: ''
            };
            inquire();
        }
        
        init();

    }
})();

