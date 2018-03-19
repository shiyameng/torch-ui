(function(){
    angular.module('app',['common'])
        .controller('cpCapitalProportionController', cpCapitalProportionController);

    cpCapitalProportionController.$inject=['dataService'];

    function cpCapitalProportionController(dataService){
        var gid = Torch.getParam('gid');
        var vm = this;
        //��ʼ��
        vm.init = init;
        //���ݼ���
        vm.query = query;
        //��ҳ����
        vm.changeNum = changeNum;
        //ȷ��
        vm.determine = determine;

        function determine(){
            Torch.closewin();
        }

        //��ҳ
        function changeNum(){
            query();
        }


        //���ݼ���
        function query(){
            var params={
                url:"/torch/service.do?fid=investCpRatioQuery",
                param:{
                    investCpRatioList : {
                        _condition: {
                            gid:gid

                        },
                        _paging:vm._paging
                    }
                }
            }
            Torch.dataSubmit(params).then(function(data){
                console.log(data);
                vm.investRatioQueryList = data.investCpRatioList._data;
                vm._paging = data.investCpRatioList._paging;
            });
        }

        //��ʼ��
        function init(){
            //ҳ������
            vm.investRatioQueryList = [
                { inv: '',
                    ratio: '',
                    subconam: ''}
            ]
            //��ҳ����
            vm._paging = {
                pageNo: 1,
                pageSize: 10,
                total: 0
            };
            query();
        }
        init()
    }
})();