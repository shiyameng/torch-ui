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
        function accepted(nameid,gid,opertype){
            //opertype = 20 为设立  = 30 为变更
            if(opertype == 20){
                Torch.redirect('../company/setup/cp-1100-setup.html?nameid='+nameid+'&gid='+gid);
            }else if(opertype == 30){
                Torch.redirect('../company/change/cp-1100-change.html?nameid='+nameid+'&gid='+gid);
            }

        }

        //分页
        function changeNum(_paging){
            inquire();
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
                    url:'/torch/service.do?fid=myTeskBeLikeQuery',
                    param:{
                        myTeskBeLikeQueryList : {
                            _condition:vm._condition,
                            _paging:vm._paging
                        }
                    }
                };
                Torch.dataSubmit(vm.obj).then(function(data){
                    vm.entryList = data.myTeskBeLikeQueryList._data;
                    vm._paging = data.myTeskBeLikeQueryList._paging;
                })
            }else{
                //模糊查询
                vm.obj = {
                    url:'/torch/service.do?fid=myTeskMQuery',
                    param:{
                        myTeskMQueryList : {
                            _condition:vm._condition,
                            _paging:vm._paging
                        }
                    }
                };
                Torch.dataSubmit(vm.obj).then(function(data){
                    vm.entryList = data.myTeskMQueryList._data;
                    vm._paging = data.myTeskMQueryList._paging;
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
                pageNo: '1',
                pageSize: '10',
                total: ''
            };
            inquire();
        }

        init();

    }
})();

