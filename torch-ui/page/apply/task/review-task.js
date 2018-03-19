(function(){
    angular.module('app',['common'])
        .controller('reviewTaskController',reviewTaskController)

    reviewTaskController.$inject = ['dataService'];

    function reviewTaskController(dataService){
        var vm = this;
        var userid = "4a643e0ecf4e48e8975ac11a2ffc3f3c";
        //��ѯ
        vm.inquire = inquire;
        //����
        vm.entryReset = entryReset;
        //��ҳ
        vm.changeNum = changeNum;
        //����
        vm.accepted = accepted

        //����
        function accepted(nameid,gid){
            Torch.redirect('../company/setup/cp-1100-setup.html?nameid='+nameid+'&gid='+gid);
        }

        //��ҳ
        function changeNum(_paging){
            inquire();
        }

        //����
        function entryReset(){
            vm._condition = {
                //����Ԥ�Ⱥ�׼�ĺ�
                apprno :'',
                //��ҵ����
                entname :''
            };
            //ģ����ѯ����xxx��ͷ
            vm.checkbox = '1'
        }

        //��ѯ
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
                //ģ����ѯ
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

        //ˢ��
        function init(){
            vm.entryList = [];
            vm._condition = {
                //����Ԥ�Ⱥ�׼�ĺ�
                apprno :'',
                //��ҵ����
                entname :'',
                //��½id
                userid:''
            };

            //ģ����ѯ����xxx��ͷ
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

