(function(){
    angular.module('app',['common'])
        .controller('taskController',taskController)

    taskController.$inject = ['dataService'];

    function taskController(dataService){
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
        function accepted(nameid, gid, opertype){
        	if(opertype == '13'){
        		Torch.redirect('../name/adjust/nm-adjust.html?gid='+gid+"&nameid="+nameid);
        	}
        	if(opertype ==  '10'){
        		Torch.redirect('../name/setup/nm-setup.html?gid='+gid+"&nameid="+nameid);
        	}
        	if(opertype ==  '11'){
        		Torch.redirect('../name/change/nm-change.html?gid='+gid+"&nameid="+nameid);
        	}
        }

        //分页
        function changeNum(_paging){
            inquire();
        }

        //重置
        function entryReset(){
            vm._condition = {
                //企业名称
                entname :''
            };
        }

        //查询
        function inquire(){
        	
        	vm.obj = {
                    url:'/torch/service.do?fid=nmTaskQuery',
                    param:{
                    	nmTaskList : {
                            _condition:vm._condition,
                            _paging:vm._paging
                        }
                    }
                };
                Torch.dataSubmit(vm.obj).then(function(data){
                    if(!data._error){
                        vm.entryList = data.nmTaskList._data;
                        vm._paging = data.nmTaskList._paging;
                    }else{
                        vm.entryList = [];
                        vm._paging = {
                            pageNo: '1',
                            pageSize: '10',
                            total: ''
                        };
                    }
                })
        }

        //刷新
        function init(){
            vm.entryList = [];
            vm._condition = {
                //企业名称
                entname :''
            };

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

