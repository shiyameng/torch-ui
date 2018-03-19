(function(){
    angular.module('app',['common'])
        .controller('invCapitalProportionController', invCapitalProportionController);

    invCapitalProportionController.$inject=['dataService'];

    function invCapitalProportionController(dataService){
        var gid = Torch.getParam('gid');
        var vm = this;
        //初始化
        vm.init = init;
        //数据加载
        vm.query = query;
        //分页方法
        vm.changeNum = changeNum;
        function changeNum(){
            query();
        }


        //数据加载
        function query(){
            var params={
                url:"/torch/service.do?fid=investRatioQuery",
                param:{
                    investRatioQueryList : {
                        _condition: {
                            gid:gid

                        },
                        _paging:vm._paging
                    }
                }
            }
            Torch.dataSubmit(params).then(function(data){
                console.log(data);
                vm.investRatioQueryList = data.investRatioQueryList._data;
                vm._paging = data.investRatioQueryList._paging;
            });
        }

        //初始化
        function init(){
            //页面数据
            vm.investRatioQueryList = [
                { inv: '',
                ratio: '',
                subconam: ''}
            ]
            //分页数据
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