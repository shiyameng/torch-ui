(function(){
    angular.module('app',['common'])
        .controller('reviewTaskController',reviewTaskController)

    reviewTaskController.$inject = ['dataService'];

    function reviewTaskController(dataService){
        var vm = this;
        var userid = "4a643e0ecf4e48e8975ac11a2ffc3f3c";
        //查询
        vm.inquire = inquire;
        //重置
        vm.entryReset = entryReset;
        //分页
        vm.changeNum = changeNum;
        //受理
        vm.accepted = accepted

        //受理
        function accepted(nameid,gid){
            Torch.redirect('../company/setup/cp-1100-setup.html?nameid='+nameid+'&gid='+gid);
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
                    url:'/torch/service.do?fid=myAssignmentQuery',
                    param:{
                        myAssignmentQueryList : {
                            _condition:vm._condition,
                            _paging:vm._paging
                        }
                    }
                };
                vm.obj.param.myAssignmentQueryList._condition.userid = userid;
                Torch.dataSubmit(vm.obj).then(function(data){
                    if(!data._error){
                        vm.entryList = data.myAssignmentQueryList._data;
                        vm._paging = data.myAssignmentQueryList._paging;
                    }else{
                        vm.entryList = [];
                        vm._paging = {
                            pageNo: '1',
                            pageSize: '10',
                            total: ''
                        };
                    }
                })
            }else{
                //模糊查询
                vm.obj = {
                    url:'/torch/service.do?fid=myAssignmentTwoQuery',
                    param:{
                        myAssignmentTwoQueryList : {
                            _condition:vm._condition,
                            _paging:vm._paging
                        }
                    }
                };
                vm.obj.param.myAssignmentTwoQueryList._condition.userid = userid;
                Torch.dataSubmit(vm.obj).then(function(data){
                    if(!data._error){
                        vm.entryList = data.myAssignmentTwoQueryList._data;
                        vm._paging = data.myAssignmentTwoQueryList._paging;
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
        }

        //刷新
        function init(){
            vm.entryList = [];
            vm._condition = {
                //名称预先核准文号
                apprno :'',
                //企业名称
                entname :'',
                //登陆id
                userid:''
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

