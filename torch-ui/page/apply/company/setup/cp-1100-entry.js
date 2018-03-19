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
        function accepted(nameid){
        	vm.obj = {
                    url:'/approve/cp/setup/checkState.do?nameid='+nameid,
                    param:{}
                };
        	Torch.dataSubmit(vm.obj).then(function(data){
        		if("success"==data.checkForm.result){
        			Torch.redirect('./cp-1100-setup.html?nameid='+nameid);
        		}
        	});
        }

        //分页
        function changeNum(_paging){
            vm._paging = _paging;
            var fid = vm.checkbox == 1?'setupEntryQuery_00090087199':'setupEntryQuery2_30040085200';

            vm.obj = {
                url:'/torch/service.do?fid='+fid,
                param:{
                    setupEntryQueryList: {
                        _paging: vm._paging,
                        _condition:vm._condition
                    }
                }
            };
            Torch.dataSubmit(vm.obj).then(function(data){
                if(!data._error){
                    vm.entryList = data.setupEntryQueryList._data;
                    vm._paging = data.setupEntryQueryList._paging;
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
            var fid = vm.checkbox == 1?'setupEntryQuery_00090087199':'setupEntryQuery2_30040085200';

            vm.obj = {
                url:'/torch/service.do?fid='+fid,
                param:{
                    setupEntryQueryList: {
                        //_paging: vm._paging,
                        _condition:vm._condition
                    }
                }
            };
            Torch.dataSubmit(vm.obj).then(function(data){
                if(!data._error){
                    vm.entryList = data.setupEntryQueryList._data;
                    vm._paging = data.setupEntryQueryList._paging;
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

