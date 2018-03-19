(function() {
	angular.module('app', [ 'common' ]).controller('adjustInfoController',
			adjustInfoController);

	adjustInfoController.$inject = [ '$scope', 'dataService' ];

	function adjustInfoController($scope, dataService) {
		var vm = this;
		// 查询
		vm.search = search;
		// 清空查询条件
		vm.reset = reset;
		// 名称调整
		vm.check = check;
		// 分页
		vm.changeNum = changeNum;
		// 清空查询条件
		function reset() {
			vm._condition = {
				entname : '',// 企业名称
				apprno : '',// 核准文号
				apprdate : ''// 核准日期
			};
		}
		// 分页
		function changeNum(_paging) {
			vm._paging = _paging;
			vm.obj = {
				url : '/torch/service.do?fid=nameAdjustQuery',
				param : {
					nameAdjustQueryList : {
						_paging : vm._paging,
						_condition : vm._condition
					}
				}
			};
			Torch.dataSubmit(vm.obj).then(function(data) {
				if (!data._error) {
					vm.entryList = data.nameAdjustQueryList._data;
					vm._paging = data.nameAdjustQueryList._paging;
				} else {
					vm.entryList = [];
					vm._paging = {
						pageNo : '',
						pageSize : '',
						total : ''
					};
				}

			})
		}
		// 查询
		function search() {
			var params = {
				url : "/torch/service.do?fid=nameAdjustQuery",
				param : {
					nameAdjustQueryList : {
						_condition : vm._condition
					}
				}
			};
			Torch.dataSubmit(params).then(function(data) {
				if (!data._error) {
					vm.entryList = data.nameAdjustQueryList._data;
					vm._paging = data.nameAdjustQueryList._paging;
				} else {
					vm.entryList = [];
					vm._paging = {
						pageNo : '',
						pageSize : '',
						total : ''
					};
				}
			});

		}

		// 名称调整
		function check(initialid, nameid, gid) {
			var params = {
				url : "/approve/nm/adjust/checkstate.do?initialid=" + initialid
						+ "&gid=" + gid
			};
			Torch.dataSubmit(params).then(
					function(data) {
						if (data != null) {
							var _gid = data.gid;
							var _nameid = data.nameid;
							Torch.redirect("./nm-adjust.html?gid=" + _gid + "&nameid=" + _nameid);
						}

					});

		}
		// 刷新
		function init() {
			vm.entryList = [];
			vm._condition = {
				entname : '',
				apprno : '',
				apprdate : ''
			};

			vm._paging = {
				pageNo : '',
				pageSize : '',
				total : ''
			};
			search();
		}
		init();
	}
})();